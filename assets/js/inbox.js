'use strict';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    get,
    onChildAdded,
    push
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { groupObject } from "./app.js";
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";


// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCVIym8X-GDRx6_1256dtVZdo3hIm7TRgI",
    authDomain: "flipper-hack.firebaseapp.com",
    databaseURL: "https://flipper-hack-default-rtdb.firebaseio.com",
    projectId: "flipper-hack",
    storageBucket: "flipper-hack.appspot.com",
    messagingSenderId: "9118741906",
    appId: "1:9118741906:web:d8860d3094a46bafd37d4b",
    measurementId: "G-EYLLFHW5XS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


const localUsername = localStorage.getItem('firstName');
console.log(localUsername); // Sender’s username
let clickedUser = null;  // Recipient's name, stored from click events

// Fetch users from the database and display in the user list
function loadUsers() {
    const usersRef = ref(database, "groups");

    get(usersRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val(); // Fetch the actual users from the database
                const userDiv = document.querySelector(".user-list");

                // Clear previous users before adding new ones
                userDiv.innerHTML = "";


                const key = users[localUsername];
                const group = users[key];
                const members = groupObject.members;

                // Loop through the members of the group
                members.forEach(element => {
                    // Create a new div for each user
                    const userElement = document.createElement("div");
                    userElement.classList.add("user");
                    userElement.setAttribute("data-username", key);
                    userElement.innerHTML = `
                        <strong class="sender-name">${element}</strong>
                        <div class="last-message">Loading last message...</div>
                    `;

                    // Append the user element to the userDiv
                    userDiv.appendChild(userElement);

                    // Add click event to open chat for the selected user
                    userElement.addEventListener("click", () => {
                        openChat(element, key);  // Set clickedUser when opening chat
                        localStorage.setItem("firstnamewhenclicked", element);
                    });
                });
            
            } else {
                alert("No user data found.");
            }
        })
        .catch((error) => {
            console.error("Error fetching user data: ", error);
        });
}




function openChat(firstName, username) {
        clickedUser = firstName;
        const messagesDiv = document.getElementById("messages");
        messagesDiv.innerHTML = "";
        messagesDiv.innerHTML = `<h2 class="chat-with">Chatting with ${firstName}</h2>`;
      
        const allMessages = []; // Array to hold all messages temporarily
      
        const sentText = ref(database, `messages/${localUsername}_${clickedUser}`);
        const receivedText = ref(database, `messages/${clickedUser}_${localUsername}`);
      
        // Fetch and store sent messages
        get(sentText).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const messageData = childSnapshot.val();
                    allMessages.push({
                        ...messageData,
                        type: messageData.sender === localUsername ? 'sender' : 'receiver'
                    });
                });
            }
      
            // Fetch and store received messages
            get(receivedText).then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const messageData = childSnapshot.val();
                        allMessages.push({
                            ...messageData,
                            type: messageData.receptor === localUsername ? 'receiver' : 'sender'
                        });
                    });
                }
      
                // Sort messages by timestamp
                allMessages.sort((a, b) => a.timestamp - b.timestamp);
      
                // Display sorted messages
                allMessages.forEach((message) => {
                    displayMessage(message.text, message.type, message.timestamp, message.seen);
                });
            });

            
        });

        if (messageData.receptor === clickedUser || messageData.sender === clickedUser) {
            displayMessage(messageData.text, messageData.sender === localUsername ? 'sender' : 'receiver', messageData.timestamp);
        }
      }



    console.log("clickedUser: ", `messages/${clickedUser}_${localUsername}`);

    onChildAdded(recivedText, (snapshot) => {
        const messageData = snapshot.val();


    });


// Function to display a message in the chat
function displayMessage(text, type, timestamp) {
    const messagesDiv = document.getElementById("messages");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", type);

    // Format the timestamp to include seconds
    const date = new Date(timestamp);
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const formattedTimestamp = date.toLocaleTimeString([], options);

    messageElement.innerHTML = `
        <span class="message-text">${text}</span>
        <span class="timestamp">${formattedTimestamp}</span>
    `;

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;  // Scroll to the bottom
}

console.log("localUsername: ", localUsername);
// Send message button functionality
// Send message button functionality
document.getElementById("sendButton").addEventListener("click", sendMessage);

// Add "Enter" key event to send message
document.getElementById("chatInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent newline in the input field
        sendMessage();          // Call the send message function
    }
});

// Function to handle sending a message
function sendMessage() {
    const messageText = document.getElementById("chatInput").value;
    if (messageText.trim() !== "" && localUsername && clickedUser) { 
        // Path for sender and receiver
        const messagePath = `messages/${localUsername}_${clickedUser}`;
        const messageObject = {
            text: messageText,
            sender: localUsername,
            receptor: clickedUser,
            timestamp: Date.now(),
        };

        // Push message to Firebase
        const newMessageRef = push(ref(database, messagePath));
        set(newMessageRef, messageObject)
            .then(() => {
                console.log("Message sent successfully.");
            })
            .catch((error) => {
                console.error("Error sending message: ", error);
            });

        // Clear the input field
        document.getElementById("chatInput").value = "";
    } else {
        console.warn("Message is empty or no chat user selected.");
    }
}

// Load users on page load
window.onload = function () {
    loadUsers();
};


