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
console.log(groupStorage)
export const groupObject = JSON.parse(groupStorage); // This will cause the error
console.log(groupObject)
