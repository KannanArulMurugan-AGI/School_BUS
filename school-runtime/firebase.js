const admin = require('firebase-admin');

// Initialize the Firebase Admin SDK.
// The SDK automatically finds and uses the service account credentials from
// the GOOGLE_APPLICATION_CREDENTIALS environment variable.
try {
  admin.initializeApp();
  console.log('[FIREBASE] Firebase Admin SDK initialized successfully.');
} catch (error) {
  console.error('[FIREBASE] Failed to initialize Firebase Admin SDK:', error.message);
  // In a real app, you might want to exit the process if Firebase is essential.
  // process.exit(1);
}

/**
 * A placeholder function to demonstrate usage.
 * This could be expanded to include functions for managing tenants, drivers, etc.
 */
const getFirebaseAdmin = () => {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin SDK not initialized.');
  }
  return admin;
};

module.exports = {
  getFirebaseAdmin,
  // Exporting admin for advanced use or testing if needed
  _admin: admin,
};
