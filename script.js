import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";



const firebaseConfig = {
    apiKey: "AIzaSyA2sFPqPlegCzKATP6gaDH2o83kn5y1P98",
    authDomain: "manifestation-61973.firebaseapp.com",
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






document.addEventListener('DOMContentLoaded', function() {
    // Signup functionality
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    set(ref(database, 'users/' + user.uid), {
                        email: user.email,
                        uid: user.uid
                    }).then(() => {
                        window.location.href = 'index.html';
                    }).catch((error) => {
                        console.error('Error saving user data: ', error.message);
                    });
                })
                .catch((error) => {
                    console.error('Error signing up: ', error.message);
                });
        });
    }

    // Login functionality
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error('Error signing in: ', error.message);
                });
        });
    }
});
