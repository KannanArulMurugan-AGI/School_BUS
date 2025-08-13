// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Replace with your app's actual Firebase configuration.
// These details can be found in your Firebase project settings.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
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
