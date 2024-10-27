'use strict';


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    get,
    child
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Firebase configuration (replace with your actual config)
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

// Assuming you have already initialized Firebase and imported the necessary functions

import { fetchData } from "./api.js";
import { numberToKilo } from "./module.js";


const userDataLocalStorage = localStorage.getItem('firstName');




/**
 * Add eventlistener on multiple elements
 * @param {NodeList} $elements NodeList
 * @param {String} eventType String
 * @param {Function} callback Function
 */

const addEventOnElements = function ($elements, eventType, callback) {
  for (const $item of $elements) {
    $item.addEventListener(eventType, callback);
  }
}







// Get the username from local storage
const username = localStorage.getItem("username");

// Fetch user details from the database to get the first name
const getUserFirstName = async (username) => {
    try {
        const userRef = ref(database, `users/${username}`); // Assuming you have users stored by their username
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            return userData.firstName; // Return the first name
        } else {
            console.log("No user found in the database.");
            return null; // Return null if no user is found
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null; // Return null on error
    }
};

// Use the function to get the first name and check user group
const checkUser = async () => {
    const firstNameStored = await getUserFirstName(username);
    
    if (firstNameStored) {
        await checkUserGroup(firstNameStored); // Call the function with the first name
    } else {
       // window.location.href = "login.html"; // Redirect to login if no first name is found
    }
};

// Call the checkUser function to start the process
checkUser();
let memberFirstName;

export let group;


export const checkUserGroup = async (firstNameStored) => {
  try {
    const userGroupsRef = ref(database, 'groups'); // Reference to the groups node in the database
    const snapshot = await get(userGroupsRef); // Get the data from Firebase

    if (snapshot.exists()) {
      const groups = snapshot.val(); // Get all groups

      // Loop through each group
      for (const groupId in groups) {
        const currentGroup = groups[groupId];
        group = currentGroup;


        // Check if the group has members
        if (currentGroup.members) {
          // Loop through each member in the group
          for (const member of Object.values(currentGroup.members)) { // Use Object.values to get member names
            // Check if the current user's first name matches a member's first name
            if (member === firstNameStored) {
              
              group = currentGroup; // Assign the found group to the exported variable
              localStorage.setItem("group", JSON.stringify(group)); // Save to local storage

              // Optionally, redirect or perform other actions here
              return group; // Return the found group
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error checking user group:", error);
  }

  return null; // Return null if no matching group is found
};






/**
 * Header scroll state
 */

const /** {NodeElement} */ $header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  $header.classList[window.scrollY > 50 ? "add" : "remove"]("active");
});


/**
 * Search toggle
 */

const /** {NodeElement} */ $searchToggler = document.querySelector("[data-search-toggler]");
const /** {NodeElement} */ $searchField = document.querySelector("[data-search-field]");
let /** {Boolean} */ isExpanded = false;

$searchToggler.addEventListener("click", function () {
  $header.classList.toggle("search-active");
  isExpanded = isExpanded ? false : true;
  this.setAttribute("aria-expanded", isExpanded);
  $searchField.focus();
});


/**
 * Tab navigation
 */

const /** {NodeList} */ $tabBtns = document.querySelectorAll("[data-tab-btn]");
const /** {NodeList} */ $tabPanels = document.querySelectorAll("[data-tab-panel]");

let /** {NodeElement} */[$lastActiveTabBtn] = $tabBtns;
let /** {NodeElement} */[$lastActiveTabPanel] = $tabPanels;

addEventOnElements($tabBtns, "click", function () {
  $lastActiveTabBtn.setAttribute("aria-selected", "false");
  $lastActiveTabPanel.setAttribute("hidden", "");

  this.setAttribute("aria-selected", "true");
  const /** {NodeElement} */ $currentTabPanel = document.querySelector(`#${this.getAttribute("aria-controls")}`);
  $currentTabPanel.removeAttribute("hidden");

  $lastActiveTabBtn = this;
  $lastActiveTabPanel = $currentTabPanel;
});

/**
 * Keyboard accessibility for tab buttons
 */

addEventOnElements($tabBtns, "keydown", function (e) {
  const /** {NodeElement} */ $nextElement = this.nextElementSibling;
  const /** {NodeElement} */ $previousElement = this.previousElementSibling;

  if (e.key === "ArrowRight" && $nextElement) {
    this.setAttribute("tabindex", "-1");
    $nextElement.setAttribute("tabindex", "0");
    $nextElement.focus();
  } else if (e.key === "ArrowLeft" && $previousElement) {
    this.setAttribute("tabindex", "-1");
    $previousElement.setAttribute("tabindex", "0");
    $previousElement.focus();
  }
});


/**
 * Work with API
 */

/**
 * Search
 */

const /** {NodeElement} */ $searchSubmit = document.querySelector("[data-search-submit]");

let /** {String} */ apiUrl = "https://api.github.com/users/codewithsadee";
let /** {String} */ repoUrl, followerUrl, followingUrl = "";

const searchUser = function () {
  if (!$searchField.value) return;

  apiUrl = `https://api.github.com/users/${$searchField.value}`;
  updateProfile(apiUrl);
}

$searchSubmit.addEventListener("click", searchUser);

// Search when press Enter key
$searchField.addEventListener("keydown", e => {
  if (e.key === "Enter") searchUser();
});


/**
 * Profile
 */


/**
 * Repository
 */

const groupStorage = localStorage.getItem("group");
console.log(groupStorage); // Log the raw data from localStorage

// Check if groupStorage is not null before parsing
export const groupObject = groupStorage ? JSON.parse(groupStorage) : null; 
console.log(groupObject); // Log the parsed groupObject


/**
 * Forked repository
 */

const /** {NodeElement} */ $forkePanel = document.querySelector("[data-fork-panel]");
const /** {NodeElement} */ $forkTabBtn = document.querySelector("[data-forked-tab-btn]");



/**
 * Follower
 */

const /** {NodeElement} */ $followerTabBtn = document.querySelector("[data-follower-tab-btn]");
const /** {NodeElement} */ $followerPanel = document.querySelector("[data-follower-panel]");

const updateFollower = function () {

  $followerPanel.innerHTML = `
    <div class="card follower-skeleton">
      <div class="skeleton avatar-skeleton"></div>

      <div class="skeleton title-skeleton"></div>
    </div>
  `.repeat(12);

  fetchData(followerUrl, function (data) {

    $followerPanel.innerHTML = `<h2 class="sr-only">Followers</h2>`;

    if (data.length) {
      for (const item of data) {

        const {
          login: username,
          avatar_url,
          url
        } = item;

        const /** {NodeElement} */ $followerCard = document.createElement("article");
        $followerCard.classList.add("card", "follower-card");

        $followerCard.innerHTML = `
          <figure class="avatar-circle img-holder">
            <img src="${avatar_url}&s=64" width="56" height="56" loading="lazy" alt="${username}"
              class="img-cover">
          </figure>

          <h3 class="card-title">${username}</h3>

          <button class="icon-btn" onclick="updateProfile(\'${url}\')" aria-label="Go to ${username} profile">
            <span class="material-symbols-rounded" aria-hidden="true">link</span>
          </button>
        `;

        $followerPanel.appendChild($followerCard);

      }
    } else {
      $followerPanel.innerHTML = `
        <div class="error-content">
          <p class="title-1">Oops! :(</p>
          <p class="text">
            Doesn't have any follower yet.
          </p>
        </div>
      `;
    }

  });

}

$followerTabBtn.addEventListener("click", updateFollower);


/**
 * Following
 */

const /** {NodeElement} */ $followingTabBtn = document.querySelector("[data-following-tab-btn]");
const /** {NodeElement} */ $followingPanel = document.querySelector("[data-following-panel]");

const updateFollowing = function () {

  $followingPanel.innerHTML = `
    <div class="card follower-skeleton">
      <div class="skeleton avatar-skeleton"></div>

      <div class="skeleton title-skeleton"></div>
    </div>
  `.repeat(12);

  fetchData(followingUrl, function (data) {

    $followingPanel.innerHTML = `<h2 class="sr-only">Followings</h2>`;

    if (data.length) {
      for (const item of data) {

        const {
          login: username,
          avatar_url,
          url
        } = item;

        const /** {NodeElement} */ $followingCard = document.createElement("article");
        $followingCard.classList.add("card", "follower-card");

        $followingCard.innerHTML = `
          <figure class="avatar-circle img-holder">
            <img src="${avatar_url}&s=64" width="56" height="56" loading="lazy" alt="${username}"
              class="img-cover">
          </figure>

          <h3 class="card-title">${username}</h3>

          <button class="icon-btn" onclick="updateProfile(\'${url}\')" aria-label="Go to ${username} profile">
            <span class="material-symbols-rounded" aria-hidden="true">link</span>
          </button>
        `;

        $followingPanel.appendChild($followingCard);

      }
    } else {
      $followingPanel.innerHTML = `
        <div class="error-content">
          <p class="title-1">Oops! :(</p>
          <p class="text">
            Doesn't have any following yet.
          </p>
        </div>
      `;
    }

  });

}

$followingTabBtn.addEventListener("click", updateFollowing);







let userData;

// Function to retrieve user data
function fetchUserData(username) {
    const databaseRef = ref(database);
    get(child(databaseRef, `users/${username}`)) // Assuming your users are stored under "users"
        .then((snapshot) => {
            if (snapshot.exists()) {
                userData = snapshot.val();
                updateUserInfo(userData);
            } else {
                console.error("No data available");
            }
        })
        .catch((error) => {
            console.error("Error fetching user data: ", error);
        });

    const userRef = ref(database, `users/${username}`);

    return get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val(); // Returns the user data
        } else {
            console.error("No user data found.");
            return null; // Ensure null is returned
        }
    }).catch((error) => {
        console.error("Error fetching user data: ", error);
        return null; // Ensure null is returned on error
    });
};





// Function to update the DOM with user information
function updateUserInfo(userData) {





  const /** {NodeElement} */ $profileCard = document.querySelector("[data-profile-card]");
const /** {NodeElement} */ $repoPanel = document.querySelector("[data-repo-panel]");
const /** {NodeElement} */ $error = document.querySelector("[data-error]");

window.updateProfile = function (profileUrl) {

  $error.style.display = "none";
  document.body.style.overflowY = "visible";

  $profileCard.innerHTML = `
    <div class="profile-skeleton">
      <div class="skeleton avatar-skeleton"></div>
      <div class="skeleton title-skeleton"></div>
      <div class="skeleton text-skeleton text-1"></div>
      <div class="skeleton text-skeleton text-2"></div>
      <div class="skeleton text-skeleton text-3"></div>
    </div>
  `;

  $tabBtns[0].click();

  $repoPanel.innerHTML = `
    <div class="card repo-skeleton">

      <div class="card-body">
        <div class="skeleton title-skeleton"></div>
        <div class="skeleton text-skeleton text-1"></div>
        <div class="skeleton text-skeleton text-2"></div>
      </div>

      <div class="card-footer">
        <div class="skeleton text-skeleton"></div>
        <div class="skeleton text-skeleton"></div>
        <div class="skeleton text-skeleton"></div>
      </div>

    </div>
  `.repeat(6);

  fetchData(profileUrl, data => {

    const {
      type,
      avatar_url,
      name,
      login: username,
      html_url: githubPage,
      bio,
      location,
      company,
      blog: website,
      twitter_username,
      public_repos,
      followers,
      following,
      followers_url,
      following_url,
      repos_url
    } = data;

    repoUrl = repos_url;
    followerUrl = followers_url;
    followingUrl = following_url.replace("{/other_user}", "");

    $profileCard.innerHTML = `
      <figure class="${type === "User" ? "avatar-circle" : "avatar-rounded"} img-holder" style="--width: 280; --height: 280">
        <img src="${avatar_url}" width="280" height="280" alt="${username}" class="img-cover">
      </figure>

      ${name ?
        `<h1 class="title-2">${userData.firstName} ${userData.lastName}</h1>` : ""
      }
      
      <p class="username text-primary">${userData.username}</p>

      ${bio ?
        `<p class="bio">${bio}</p>` : ""
      }

      <a href="https://t.me/FlipHacks" target="_blank" class="btn btn-secondary">
        <span class="material-symbols-rounded" aria-hidden="true">open_in_new</span>

        <span class="span">Join us on telegram</span>
      </a>

      <ul class="profile-meta">



      </ul>

      <ul class="profile-stats">

        <li class="stats-item">
          <span class="body">Team</span>: ${groupObject ? groupObject.name : 'N/A'}
        </li>

        <li class="stats-item">
          <span class="body">Team Number: </span> ${groupObject ? groupObject.members.length  : 'N/A'}
        </li>

        <li class="stats-item">
          <span class="body">Role:</span> ${userData.role}  
        </li>

      </ul>

      <div class="footer">
        <p class="copyright">&copy; 2023 codewithsadee</p>
      </div>
    `;

    updateGroupMembers();

  }, () => {
    $error.style.display = "grid";
    document.body.style.overflowY = "hidden";

    $error.innerHTML = `
      <p class="title-1">Oops! :(</p>

      <p class="text">
        There is no account with this username yet.
      </p>
    `;
  });

}

let /** {Array} */ forkedRepos = [];

const updateGroupMembers = function () {

  // Assuming `groupObject` is defined elsewhere and contains the group data
  const groupObjectMembers = groupObject.members; // Members list from the group object
  // Clear the current panel content
  $repoPanel.innerHTML = `<h2 class="sr-only">Group Members</h2>`;
  
  // Check if there are members in the group
  if (groupObjectMembers && groupObjectMembers.length > 0) {
    // Loop through each member in the group
    groupObjectMembers.forEach(member => {
      // Assuming each member object contains properties like `name`, `role`, `profile_url`, etc.
      const {
        name,
        role,           // e.g. Developer, Admin, etc.
        profile_url,    // URL to member's profile or social account
        teamNumber,     // Team number if applicable
        avatar_url      // URL to member's profile picture
      } = member;

      // Create a new card element for each member
      const $memberCard = document.createElement("article");
      $memberCard.classList.add("card", "repo-card");

      // Fill the card with member information
      $memberCard.innerHTML = `
        <div class="card-body">
          <a href="#" class="card-title">
            <h3 class="title-3">${member}</h3>
          </a>
          ${role ? `<p class="card-text">Role: ${role}</p>` : ""}
          ${teamNumber ? `<p class="card-text">Team: ${teamNumber}</p>` : ""}
        </div>
      `;

      // Append the member card to the panel
      $repoPanel.appendChild($memberCard);
    });
  } else {
    // Display a message if no group members are found
    $repoPanel.innerHTML = `
      <div class="error-content">
        <p class="title-1">Oops! :(</p>
        <p class="text">
          No group members found.
        </p>
      </div>
    `;
  }
};



const fetchMessages = async (username) => {
  try {
      const messageRef = ref(database, `messages/${username}`); // Reference to the user's messages in Firebase
      const snapshot = await get(messageRef); // Fetch the messages from Firebase

      if (snapshot.exists()) {
          const messages = snapshot.val(); // Get all messages
          return messages; // Return the messages
      } else {
          console.log("No messages found for this user.");
          return null;
      }
  } catch (error) {
      console.error("Error fetching messages:", error);
      return null;
  }
};




const populateGroupMembers = function (groupObjectMembers) {
  const $groupMembersPanel = document.querySelector("#groupMembersPanel");

  // Clear the group members panel
  $groupMembersPanel.innerHTML = "";

  // Check if there are members in the group
  if (groupObjectMembers && groupObjectMembers.length > 0) {
    // Loop through each member in the group
    groupObjectMembers.forEach(member => {
      // Create a button for each member
      const memberButton = document.createElement("button");
      memberButton.classList.add("member-button");
      memberButton.textContent = member.name; // Display their name on the button
      memberButton.onclick = () => {
        document.querySelector("#messageInput").value = `@${member.username} `; // Populate textarea with recipient's username
      };
      
      $groupMembersPanel.appendChild(memberButton); // Add button to the panel
    });
  } else {
    // If no members are found, show a message
    $groupMembersPanel.innerHTML = `<p>No group members found</p>`;
  }
};





const updateMessages = function (messages) {
  //window.location.href = "inbox.html"; // Redirect to the inbox page
};





const sendMessage = async (senderUsername) => {
  const recipientUsername = document.querySelector("#groupMembers").value; // Get the selected recipient from the dropdown
  const messageText = document.querySelector("#messageInput").value;

  if (!recipientUsername || !messageText) {
    alert("Please select a group member and type a message.");
    return;
  }

  const messageRef = ref(database, `messages/${recipientUsername}`); // Store the message under the recipient's username
  const newMessageRef = push(messageRef); // Generate a new message ID

  const messageData = {
    senderName: senderUsername,
    message: messageText,
    timestamp: new Date().toLocaleString(),
    read: false,
  };

  try {
    await set(newMessageRef, messageData); // Save the message to Firebase
    document.querySelector("#messageInput").value = ""; // Clear the message input after sending
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Add event listener for the Send button
document.querySelector("button").addEventListener("click", () => {
  sendMessage(username); // Pass the current user's username as the sender
});




const fetchGroupMembers = async () => {
  const groupStorage = localStorage.getItem("group");
  if (groupStorage) {
    const groupObject = JSON.parse(groupStorage);
    return groupObject.members; // Return the group members
  } else {
    console.error("No group information found.");
    return [];
  }
};

// Fetch group members and populate the dropdown when the page loads
window.onload = async () => {
  const groupMembers = await fetchGroupMembers();
  populateGroupMembers(groupMembers); // Populate the group members in the dropdown
};





$forkTabBtn.addEventListener("click", updateMessages);

document.querySelector("[data-forked-tab-btn]").addEventListener("click", async () => {
    const messages = await fetchMessages(username); // Fetch messages for the current user
    updateMessages(messages); // Update the message tab with the fetched messages
});

updateProfile(apiUrl);




};






// Fetch members data when the page loads
window.onload = () => {
  fetchUserData(username);
};




