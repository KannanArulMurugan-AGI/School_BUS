const admin = require('firebase-admin');

// Initialize the Firebase Admin SDK.
// The SDK automatically finds and uses the service account credentials from
// the GOOGLE_APPLICATION_CREDENTIALS environment variable.
try {
  admin.initializeApp();
} catch (error) {
  console.error('[FIREBASE] Failed to initialize Firebase Admin SDK:', error.message);
  // In a real app, you might want to exit the process if Firebase is essential.
  // process.exit(1);
}


/**
 * Creates a custom Firebase authentication token for the given user ID and claims.
 * @param {string} uid - The user ID to associate with the custom token.
 * @param {object} claims - Custom claims to include in the token (e.g., { tenantId, role }).
 * @returns {Promise<string>} A Firebase custom token.
 */
const createCustomToken = async (uid, claims) => {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin SDK not initialized.');
  }
  try {
    const customToken = await admin.auth().createCustomToken(uid, claims);
    console.log(`[FIREBASE] Created custom token for uid: ${uid}`);
    return customToken;
  } catch (error) {
    console.error(`[FIREBASE] Error creating custom token for uid ${uid}:`, error);
    throw error;
  }
};

/**
 * Initializes a new tenant's data structure in the Firebase Realtime Database.
 * @param {string} tenantId - The ID of the new tenant.
 */
const initializeTenantNamespace = async (tenantId) => {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin SDK not initialized.');
  }
  const db = admin.database();
  const tenantRef = db.ref(`/schools/${tenantId}`);

  const initialStructure = {
    routes: true,
    drivers: true,
    parents: true,
    notifications: true,
    metadata: {
      initializedAt: admin.database.ServerValue.TIMESTAMP,
    },
  };

  try {
    await tenantRef.set(initialStructure);
    console.log(`[FIREBASE] Initialized namespace for tenant: ${tenantId}`);
  } catch (error) {
    console.error(`[FIREBASE] Error initializing namespace for tenant ${tenantId}:`, error);
    throw error;
  }
};

module.exports = {
  createCustomToken,
  initializeTenantNamespace,
  // Exporting admin for advanced use or testing if needed
  _admin: admin,
};
