import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

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



// Function to save progress data to Firebase
function saveProgressData(userId, data) {
    set(ref(database, 'progress/' + userId), data).catch((error) => {
        console.error('Error saving progress data:', error);
    });
}

// Function to fetch and display progress data
function fetchAndDisplayProgressData(userId) {
    const progressRef = ref(database, `progress/${userId}`);
    get(progressRef).then((snapshot) => {
        if (snapshot.exists()) {
            const progressData = snapshot.val();
            console.log('User Progress Data:', progressData);
            displayGoalData(progressData.goal);
            displayMoodData(progressData.mood);
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

    if (goalData) {
        goalText.textContent = goalData.text;
        progressFill.style.width = `${goalData.progress}%`;

        if (goalData.progress == 100) {
            alert('Congratulations! You have achieved your goal!');
        }
    }
}

// Display mood data
function displayMoodData(moodData) {
    const moodText = document.getElementById('mood-text');
    const moodEmoji = document.getElementById('mood-emoji');

    if (moodData) {
        moodText.textContent = moodData.text;
        switch (moodData.text.toLowerCase()) {
            case 'happy':
                moodEmoji.textContent = '😊';
                break;
            case 'sad':
                moodEmoji.textContent = '😢';
                break;
            case 'angry':
                moodEmoji.textContent = '😠';
                break;
            default:
                moodEmoji.textContent = '😐';
                break;
        }
    }
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
            const goalData = { text: goal, progress: progress };
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