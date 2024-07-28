import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, set, get, push } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

// Firebase configuration
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

const samplePrompts = [
    "What is your biggest goal for today?",
    "How will you achieve your dreams today?",
    "What are you grateful for?",
    "Visualize achieving your goals.",
    "Write down three things you want to manifest.",
    "Imagine your ideal day."
];

// Function to populate the database with prompts for 365 days
function populateDatabaseWithPrompts() {
    const promptsRef = ref(database, 'manifestationPrompts');
    const promptsData = {};
    for (let day = 1; day <= 365; day++) {
        promptsData[day] = samplePrompts; // Repeat the same sample prompts for simplicity
    }
    set(promptsRef, promptsData)
        .then(() => {
            console.log("Database populated with manifestation prompts for 365 days.");
        })
        .catch((error) => {
            console.error("Error populating database:", error);
        });
}

// Call the function to populate the database (only run this once)
// populateDatabaseWithPrompts(); // Uncomment this line to populate the database initially

// Display daily prompt
function displayDailyManifestationPrompts() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000) + 1;
    console.log(`Day of the year: ${dayOfYear}`);

    const promptsRef = ref(database, `manifestationPrompts/${dayOfYear}`);

    get(promptsRef).then((snapshot) => {
        const promptsContainer = document.getElementById('prompts-list');
        if (snapshot.exists()) {
            const prompts = snapshot.val();
            promptsContainer.innerHTML = prompts.map(prompt => `<p>${prompt}</p>`).join('');
            console.log(`Prompts for day ${dayOfYear}:`, prompts);
        } else {
            promptsContainer.innerHTML = '<p>No prompts available for today.</p>';
            console.log(`No prompts found for day ${dayOfYear}`);
        }
    }).catch((error) => {
        console.error('Error fetching daily prompts:', error);
    });
}

// Add journal entry
function addJournalEntry(entry) {
    const user = auth.currentUser;
    if (user) {
        const userJournalRef = ref(database, `journals/${user.uid}`);
        const newEntryRef = push(userJournalRef);
        set(newEntryRef, entry).then(() => {
            displayJournalEntries();
        }).catch((error) => {
            console.error('Error adding journal entry:', error);
        });
    } else {
        console.log('User is not logged in.');
    }
}

// Display journal entries
function displayJournalEntries() {
    const user = auth.currentUser;
    if (user) {
        const userJournalRef = ref(database, `journals/${user.uid}`);
        get(userJournalRef).then((snapshot) => {
            const entriesList = document.getElementById('entries-list');
            entriesList.innerHTML = '';
            if (snapshot.exists()) {
                const entries = snapshot.val();
                for (const key in entries) {
                    const entry = entries[key];
                    const li = document.createElement('li');
                    li.innerText = entry;
                    entriesList.appendChild(li);
                }
            } else {
                entriesList.innerHTML = '<li>No journal entries found.</li>';
            }
        }).catch((error) => {
            console.error('Error fetching journal entries:', error);
        });
    } else {
        console.log('User is not logged in.');
    }
}

// Add gratitude entry
function addGratitudeEntry(entry) {
    const user = auth.currentUser;
    if (user) {
        const userGratitudeRef = ref(database, `gratitudes/${user.uid}`);
        const newEntryRef = push(userGratitudeRef);
        set(newEntryRef, entry).then(() => {
            displayGratitudeEntries();
        }).catch((error) => {
            console.error('Error adding gratitude entry:', error);
        });
    } else {
        console.log('User is not logged in.');
    }
}

// Display gratitude entries
function displayGratitudeEntries() {
    const user = auth.currentUser;
    if (user) {
        const userGratitudeRef = ref(database, `gratitudes/${user.uid}`);
        get(userGratitudeRef).then((snapshot) => {
            const gratitudeList = document.getElementById('gratitude-list');
            gratitudeList.innerHTML = '';
            if (snapshot.exists()) {
                const entries = snapshot.val();
                for (const key in entries) {
                const entry = entries[key];
                const li = document.createElement('li');
                li.innerText = entry;
                gratitudeList.appendChild(li);
                }
                } else {
                gratitudeList.innerHTML = '<li>No gratitude entries found.</li>';
                }
                }).catch((error) => {
                console.error('Error fetching gratitude entries:', error);
                });
                } else {
                console.log('User is not logged in.');
                }
                }
                
                // Event listeners for form submissions
                document.addEventListener('DOMContentLoaded', () => {
                displayDailyManifestationPrompts();
                displayJournalEntries();
                displayGratitudeEntries();
                document.getElementById('journal-form').addEventListener('submit', (e) => {
                    e.preventDefault();
                    const entry = document.getElementById('journal-entry').value.trim();
                    if (entry) {
                        addJournalEntry(entry);
                        document.getElementById('journal-entry').value = ''; // Clear input
                    }
                });
                
                document.getElementById('gratitude-form').addEventListener('submit', (e) => {
                    e.preventDefault();
                    const entry = document.getElementById('gratitude-entry').value.trim();
                    if (entry) {
                        addGratitudeEntry(entry);
                        document.getElementById('gratitude-entry').value = ''; // Clear input
                    }
                });
            });                
