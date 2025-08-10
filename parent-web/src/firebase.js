// This file acts as a bridge between the Firebase SDK loaded from the CDN
// in index.html and the rest of the React application.

// The "compat" scripts in index.html create a global `firebase` object.
// We access that global object here.

// It's good practice to check if the object exists before using it.
if (!window.firebase) {
  throw new Error("Firebase SDK not loaded. Check the script tags in index.html");
}

const firebaseApp = window.firebase;
const auth = firebaseApp.auth();
const database = firebaseApp.database();

export { firebaseApp, auth, database };
