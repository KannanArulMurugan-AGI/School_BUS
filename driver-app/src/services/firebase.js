const admin = require('firebase-admin');

// IMPORTANT:
// To run this, you must set up authentication.
// 1. Go to your Firebase project settings and download a service account key file.
// 2. Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the path of this file.
//    export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"
// 3. You also need to specify your database URL below.

try {
  admin.initializeApp({
    // Replace this with your Firebase project's database URL
    databaseURL: "https://school-bus-6fc23.firebaseio.com"
  });
} catch (error) {
  console.error('[FIREBASE] Failed to initialize Firebase Admin SDK:', error.message);
}

const database = admin.database();

module.exports = { database, admin };
