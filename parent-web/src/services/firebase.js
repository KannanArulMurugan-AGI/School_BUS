// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Replace with your app's actual Firebase configuration.
// These details can be found in your Firebase project settings.
// IMPORTANT: These are placeholder values. Replace them with your actual Firebase project credentials.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "YOUR_APP_ID"
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
