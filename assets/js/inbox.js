'use strict';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    get,
    onChildAdded,
    push,
    query,
    limitToLast
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { groupObject } from "./app.js";

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
let clickedUser = null;

// Fetch users from the database and display in the user list
// Fetch users from the database and display in the user list
function loadUsers() {
    const usersRef = ref(database, "groups");

    get(usersRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val();
                const userDiv = document.querySelector(".user-list");
                const members = groupObject.members;
                const userTimestampList = [];

                // Fetch last message timestamp for each user
                const timestampPromises = members.map((element) => {
                    return new Promise((resolve) => {
                        const sentText = query(ref(database, `messages/${localUsername}_${element}`), limitToLast(1));
                        const receivedText = query(ref(database, `messages/${element}_${localUsername}`), limitToLast(1));

                        Promise.all([get(sentText), get(receivedText)])
                            .then(([sentSnapshot, receivedSnapshot]) => {
                                let lastTimestamp = 0;

                                if (sentSnapshot.exists()) {
                                    sentSnapshot.forEach((childSnapshot) => {
                                        const messageData = childSnapshot.val();
                                        if (messageData.timestamp > lastTimestamp) {
                                            lastTimestamp = messageData.timestamp;
                                        }
                                    });
                                }

                                if (receivedSnapshot.exists()) {
                                    receivedSnapshot.forEach((childSnapshot) => {
                                        const messageData = childSnapshot.val();
                                        if (messageData.timestamp > lastTimestamp) {
                                            lastTimestamp = messageData.timestamp;
                                        }
                                    });
                                }

                                // Store user and last timestamp for sorting
                                userTimestampList.push({ username: element, timestamp: lastTimestamp });
                                resolve();
                            });
                    });
                });

                // Wait for all timestamps to be fetched, then sort and display
                Promise.all(timestampPromises).then(() => {
                    // Sort users by timestamp in descending order
                    userTimestampList.sort((a, b) => b.timestamp - a.timestamp);

                    // Clear previous users
                    userDiv.innerHTML = "";

                    // Display sorted users and fetch last message
                    userTimestampList.forEach(({ username }) => {
                        const userElement = document.createElement("div");
                        userElement.classList.add("user");
                        userElement.innerHTML = `
                            <strong class="sender-name">${username}</strong>
                            <div class="last-message">Loading last message...</div>
                        `;
                        userDiv.appendChild(userElement);

                        // Fetch and display the last message for each user
                        fetchLastMessage(username, userElement);

                        // Open chat on click
                        userElement.addEventListener("click", () => {
                            openChat(username);
                            localStorage.setItem("firstnamewhenclicked", username);
                        });
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

// Fetch the last message sent or received for a specific user
function fetchLastMessage(username, userElement) {
    const lastMessageDiv = userElement.querySelector(".last-message");

    // Get last sent and received messages
    const sentText = query(ref(database, `messages/${localUsername}_${username}`), limitToLast(1));
    const receivedText = query(ref(database, `messages/${username}_${localUsername}`), limitToLast(1));

    Promise.all([get(sentText), get(receivedText)])
        .then(([sentSnapshot, receivedSnapshot]) => {
            let lastMessage = null;
            let lastTimestamp = 0;

            // Check sent messages
            if (sentSnapshot.exists()) {
                sentSnapshot.forEach((childSnapshot) => {
                    const messageData = childSnapshot.val();
                    if (messageData.timestamp > lastTimestamp) {
                        lastMessage = messageData.text;
                        lastTimestamp = messageData.timestamp;
                    }
                });
            }

            // Check received messages
            if (receivedSnapshot.exists()) {
                receivedSnapshot.forEach((childSnapshot) => {
                    const messageData = childSnapshot.val();
                    if (messageData.timestamp > lastTimestamp) {
                        lastMessage = messageData.text;
                        lastTimestamp = messageData.timestamp;
                    }
                });
            }

            // Update the last message display
            lastMessageDiv.textContent = lastMessage ? lastMessage : "No messages yet.";
        })
        .catch((error) => {
            console.error("Error fetching last message: ", error);
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

    onChildAdded(sentText, (snapshot) => {
        const messageData = snapshot.val();

        console.log("sentText: ", messageData);
        if (messageData.receptor === clickedUser || messageData.sender === clickedUser) {
            displayMessage(messageData.text, messageData.sender === localUsername ? 'sender' : 'receiver', messageData.timestamp);
        }
        
    });
}


// Display a message in the chat
function displayMessage(text, type, timestamp) {
    const messagesDiv = document.getElementById("messages");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", type);

    const date = new Date(timestamp);
    const options = { hour: '2-digit', minute: '2-digit' };
    const formattedTimestamp = date.toLocaleTimeString([], options);

    messageElement.innerHTML = `
        <span class="message-text">${text}</span>
        <span class="timestamp">${formattedTimestamp}</span>
    `;

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Helper function to format last message with a max of 5 words
function formatLastMessage(text) {
    const words = text.split(" ");
    return words.length > 5 ? words.slice(0, 5).join(" ") + "…" : text;
}

// Send message button functionality
document.getElementById("sendButton").addEventListener("click", () => {
    const messageText = document.getElementById("chatInput").value;
    if (messageText.trim() !== "" && localUsername && clickedUser) { 
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
                
                // Update the last message display for the clicked user
                updateLastMessageDisplay(clickedUser, messageText);
            })
            .catch((error) => {
                console.error("Error sending message: ", error);
            });

        // Clear the input field
        document.getElementById("chatInput").value = "";
    } else {
        console.warn("Message is empty or no chat user selected.");
    }
});

// Helper function to update the last message display
function updateLastMessageDisplay(username, messageText) {
    const userElements = document.querySelectorAll(".user");
    userElements.forEach((userElement) => {
        if (userElement.querySelector(".sender-name").textContent === username) {
            const lastMessageDiv = userElement.querySelector(".last-message");
            lastMessageDiv.textContent = formatLastMessage(messageText); // Ensure to format the message
        }
    });
}



// Load users on page load
window.onload = function () {
    loadUsers();
};
