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

  const now = admin.database.ServerValue.TIMESTAMP;

  // Define sample IDs for relationships
  const sampleDriverId = 'driver-01';
  const sampleRouteId = 'route-a';
  const sampleParentId = 'parent-jane-doe';
  const sampleChildId = 'child-timmy-doe';

  const initialStructure = {
    metadata: {
      schoolName: `School #${tenantId}`,
      initializedAt: now,
    },
    routes: {
      [sampleRouteId]: {
        name: 'Morning Sun Route',
        driverId: sampleDriverId,
        stops: {
          '0': { name: 'Central Station', lat: 34.056, lng: -118.234 },
          '1': { name: 'Elm Street & 4th', lat: 34.058, lng: -118.238 },
        },
        live: {
          lat: 34.056,
          lng: -118.234,
          timestamp: now,
        },
      },
    },
    drivers: {
      [sampleDriverId]: {
        name: 'John Doe',
        contact: '555-0101',
        assignedRouteId: sampleRouteId,
      },
    },
    children: {
      [sampleChildId]: {
        name: 'Timmy Doe',
        routeId: sampleRouteId,
        parentId: sampleParentId,
      },
    },
    parents: {
      [sampleParentId]: {
        name: 'Jane Doe',
        // This is the UID that would be used to log in.
        // For a real app, this would be created via the auth system.
        email: `parent.${tenantId}@example.com`,
        children: {
          [sampleChildId]: true,
        },
      },
    },
    notifications: {}, // Keep notifications but initialize as an empty object
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
