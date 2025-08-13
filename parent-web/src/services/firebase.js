// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For more information on how to get this, visit the Firebase documentation:
// https://firebase.google.com/docs/web/setup#available-libraries

// This configuration is loaded from environment variables.
// You must create a `.env.local` file in the root of the `parent-web` directory
// and add the following variables:
// REACT_APP_FIREBASE_API_KEY=your_api_key
// REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
// REACT_APP_FIREBASE_DATABASE_URL=your_database_url
// REACT_APP_FIREBASE_PROJECT_ID=your_project_id
// REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
// REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
// REACT_APP_FIREBASE_APP_ID=your_app_id

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
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
