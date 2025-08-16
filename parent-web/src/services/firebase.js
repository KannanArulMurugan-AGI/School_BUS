// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getDatabase } from "firebase/database";

// The user has provided the following Firebase configuration.
const firebaseConfig = {
  apiKey: "AIzaSyApIk3uPCGhpd2ZiKVlircgq1GABE-ApGk",
  authDomain: "school-bus-6fc23.firebaseapp.com",
  databaseURL: "https://school-bus-6fc23.firebaseio.com",
  projectId: "school-bus-6fc23",
  storageBucket: "school-bus-6fc23.firebasestorage.app",
  messagingSenderId: "669929320524",
  appId: "1:669929320524:web:8df55a748ec089a63c04e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the auth and database services
const auth = getAuth(app);
const database = getDatabase(app);

/**
 * Signs in the user with a custom token obtained from the backend.
 * @param {string} token - The custom Firebase token.
 * @returns {Promise<import("firebase/auth").UserCredential>} A promise that resolves with the user credential.
 */
const signIn = (token) => {
  if (!token) {
    return Promise.reject(new Error('A custom token must be provided.'));
  }
  return signInWithCustomToken(auth, token);
};

export {
  app,
  auth,
  database,
  signIn,
};
