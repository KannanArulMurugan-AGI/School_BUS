// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyApIk3uPCGhpd2ZiKVlircgq1GABE-ApGk",
  authDomain: "school-bus-6fc23.firebaseapp.com",
  databaseURL: "https://school-bus-6fc23-default-rtdb.firebaseio.com",
  projectId: "school-bus-6fc23",
  storageBucket: "school-bus-6fc23.appspot.com",
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

/**
 * Creates a new user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<import("firebase/auth").UserCredential>} A promise that resolves with the user credential.
 */
const signUpWithEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Signs in a user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<import("firebase/auth").UserCredential>} A promise that resolves with the user credential.
 */
const signInWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sends a password reset email to the given email address.
 * @param {string} email - The user's email.
 * @returns {Promise<void>} A promise that resolves when the email has been sent.
 */
const sendPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
};

export {
  app,
  auth,
  database,
  signIn,
  signUpWithEmail,
  signInWithEmail,
  sendPasswordReset,
};
