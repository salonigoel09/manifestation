import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";


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

  const app= initializeApp(firebaseConfig);
  const auth= getAuth(app);
  const database= getDatabase(app);

  const affirmations = {
    "1": ["I am confident and capable.", "I attract positive energy into my life."],
    "2": ["I believe in myself and my abilities.", "I am surrounded by love and support."],
    "3": ["I am grateful for all the good things in my life.", "I am becoming the best version of myself."],
    "209":["I believe in myself and my abilities.", "I am surrounded by love and support."]
    // Add more days here
  };
  
  const affirmationsRef = ref(database, 'affirmations');
  set(affirmationsRef, affirmations)
      .then(() => {
          console.log("Affirmations added successfully.");
      })
      .catch((error) => {
          console.error("Error adding affirmations:", error);
      });


 // Function to calculate the day of the year
function getDayOfYear() {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    console.log(`Day of the year: ${dayOfYear}`); // Debugging
    return dayOfYear;
}

// Function to display daily affirmations
function displayDailyAffirmation() {
    const dayOfYear = getDayOfYear();
    const affirmationRef = ref(database, `affirmations/${dayOfYear}`);

    get(affirmationRef).then((snapshot) => {
        const affirmationContainer = document.getElementById('affirmations-list');
        if (snapshot.exists()) {
            const affirmations = snapshot.val();
            console.log(`Affirmations for day ${dayOfYear}:`, affirmations); // Debugging
            affirmationContainer.innerHTML = affirmations.map(affirmation => `<p>${affirmation}</p>`).join('');
        } else {
            console.log(`No affirmations found for day ${dayOfYear}`); // Debugging
            affirmationContainer.innerHTML = '<p>No affirmations available for today.</p>';
        }
    }).catch((error) => {
        console.error('Error fetching daily affirmation:', error);
    });
}

// Function to add a new affirmation
function addAffirmation(affirmation) {
    const user = auth.currentUser;
    if (user) {
        const dayOfYear = getDayOfYear();
        const newAffirmationRef = ref(database, `affirmations/${dayOfYear}`);

        get(newAffirmationRef).then((snapshot) => {
            let affirmations = [];
            if (snapshot.exists()) {
                affirmations = snapshot.val();
            }
            affirmations.push(affirmation);

            set(newAffirmationRef, affirmations).then(() => {
                displayDailyAffirmation();
            }).catch((error) => {
                console.error('Error adding affirmation:', error);
            });
        }).catch((error) => {
            console.error('Error fetching affirmations:', error);
        });
    } else {
        console.log('User is not logged in.');
    }
}

// Handle form submission for adding new affirmations
document.addEventListener('DOMContentLoaded', () => {
    displayDailyAffirmation();

    const addAffirmationForm = document.getElementById('add-affirmation-form');
    addAffirmationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newAffirmation = document.getElementById('new-affirmation').value.trim();
        console.log(`New affirmation to add: ${newAffirmation}`); // Debugging
        addAffirmation(newAffirmation);
        document.getElementById('new-affirmation').value = ''; // Clear input
    });
});