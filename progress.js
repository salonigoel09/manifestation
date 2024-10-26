import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyA2sFPqPlegCzKATP6gaDH2o83kn5y1P98",
    authDomain: "manifestation-61973.firebaseapp.com",
    databaseURL: "https://manifestation-61973-default-rtdb.firebaseio.com",
    projectId: "manifestation-61973",
    storageBucket: "manifestation-61973.appspot.com",
    messagingSenderId: "909917920319",
    appId: "1:909917920319:web:3b0354c4139bd6983bec8a",
    measurementId: "G-TF2X2DYG4G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Function to update progress data without overwriting existing data
function saveProgressData(userId, data) {
    update(ref(database, 'progress/' + userId), data).catch((error) => {
        console.error('Error saving progress data:', error);
    });
}

// Fetch and display progress data
function fetchAndDisplayProgressData(userId) {
    const progressRef = ref(database, `progress/${userId}`);
    get(progressRef).then((snapshot) => {
        if (snapshot.exists()) {
            const progressData = snapshot.val();
            console.log('User Progress Data:', progressData);
            if (progressData.goal) displayGoalData(progressData.goal);
            if (progressData.mood) displayMoodData(progressData.mood);
        } else {
            console.log('No user progress data found.');
        }
    }).catch((error) => {
        console.error('Error fetching user progress data:', error);
    });
}

// Display goal data
function displayGoalData(goalData) {
    const goalText = document.getElementById('goal-text');
    const progressFill = document.getElementById('progress-fill');
    const overlay = document.getElementById('overlay');

    if (goalData) {
        goalText.textContent = goalData.text;
        progressFill.style.width = `${goalData.progress}%`;

        if (goalData.progress == 100) {
            overlay.style.display = 'block';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 3000);  // Show overlay for 3 seconds
        }
    }
}

// Display mood data and show mood image
function displayMoodData(moodData) {
    const moodText = document.getElementById('mood-text');
    const overlay = document.getElementById('overlay');
    const moodImage = document.getElementById('mood-image');

    if (moodData) {
        moodText.textContent = moodData.text;
        
        // Display the mood-related image
        const moodImageUrl = getMoodImageUrl(moodData.text.toLowerCase());
        if (moodImageUrl) {
            moodImage.src = moodImageUrl;
            overlay.style.display = 'block';  // Show the overlay
            setTimeout(() => {
                overlay.style.display = 'none';  // Hide after a few seconds
            }, 3000);  // Display the image for 3 seconds
        } else {
            console.log('No image found for the mood:', moodData.text);
        }
        const confirmationMessage = document.createElement('p');
        confirmationMessage.textContent = 'Your mood has been recorded!';
        confirmationMessage.style.color = 'green';
        moodText.appendChild(confirmationMessage);
    }
}

// Get image URL based on mood
function getMoodImageUrl(mood) {
    const moodImages = {
        'happy': 'images/joy.png',
        'excited': 'images/joy.png',
        'sad': 'images/fear.png',
        'angry': 'images/anger.png',
        'disgust': 'images/disgust.png',
        // Add more mood-image pairs as needed
    };
    return moodImages[mood] || ''; // Return empty string if mood not found
}

// Event listeners for form submissions
document.addEventListener('DOMContentLoaded', () => {
    const goalForm = document.getElementById('goal-form');
    const goalInput = document.getElementById('goal-input');
    const progressInput = document.getElementById('progress-input');

    const moodForm = document.getElementById('mood-form');
    const moodInput = document.getElementById('mood-input');

    goalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const goal = goalInput.value;
        const progress = progressInput.value;

        const user = auth.currentUser;
        if (user) {
            const userId = user.uid;
            const goalData = { text: goal, progress: parseInt(progress, 10) };
            saveProgressData(userId, { goal: goalData });
            displayGoalData(goalData);
        }

        goalInput.value = '';
        progressInput.value = '';
    });

    moodForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const mood = moodInput.value;

        const user = auth.currentUser;
        if (user) {
            const userId = user.uid;
            const moodData = { text: mood };
            saveProgressData(userId, { mood: moodData });
            displayMoodData(moodData);
        }

        moodInput.value = '';
    });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('User ID:', user.uid);
            fetchAndDisplayProgressData(user.uid);
        } else {
            console.log('No user is signed in.');
        }
    });
});
