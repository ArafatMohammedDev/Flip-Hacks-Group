import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyCVIym8X-GDRx6_1256dtVZdo3hIm7TRgI",
    authDomain: "flipper-hack.firebaseapp.com",
    databaseURL: "https://flipper-hack-default-rtdb.firebaseio.com",
    projectId: "flipper-hack",
    storageBucket: "flipper-hack.appspot.com",
    messagingSenderId: "9118741906",
    appId: "1:9118741906:web:d8860d3094a46bafd37d4b",
    measurementId: "G-EYLLFHW5XS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Get the username from the local storage (you'll save it when the user logs in)
// Assuming username is being stored as a username, not email
const username = localStorage.getItem('username'); // Ensure this is set during login
console.log("Fetching data for username:", username); // This should not be null now

// Reference to the user data in the database
const userRef = ref(database, `users/${username}`); // Use the username directly

// Get the user data
get(userRef)
    .then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            // Update the welcome message and user data
            document.querySelector('.welcome').innerText = `Welcome, ${userData.firstName} ${userData.lastName}!`;
            document.querySelector('.Username').innerHTML = `${userData.username}`;
            document.querySelector(".phone-number").innerHTML = `${userData.phoneNumber}`
            document.getElementById('user-data').innerText = `Your security code is: ${userData.securityCode}`;
            document.querySelector('.passfail').innerText = `${userData.passFail}`;
        } else {
            document.getElementById('user-data').innerText = "No user data found.";
        }
    })
    .catch((error) => {
        console.error("Error fetching user data: ", error);
    });

    console.log("Fetching data for username:", username);

