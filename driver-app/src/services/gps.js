/**
 * @fileoverview
 * This file contains the logic for the driver's device to report its GPS location
 * to the Firebase Realtime Database. This is a Node.js-based simulation.
 * A native Android implementation would use the Firebase Android SDK to achieve the same result.
 */

const { database, admin } = require('./firebase'); // Assumes a firebase.js setup for Node.js

/**
 * Updates the live location of a specific bus route in the database.
 * @param {string} tenantId - The ID of the school/tenant.
 * @param {string} routeId - The ID of the route the driver is on.
 * @param {number} lat - The current latitude.
 * @param {number} lng - The current longitude.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
async function updateBusLocation(tenantId, routeId, lat, lng) {
  const livePath = `schools/${tenantId}/routes/${routeId}/live`;
  const liveRef = database.ref(livePath);

  const newLocation = {
    lat: lat,
    lng: lng,
    timestamp: admin.database.ServerValue.TIMESTAMP,
  };

  console.log(`Updating location for ${livePath}:`, newLocation);
  try {
    await liveRef.update(newLocation);
  } catch (error) {
    console.error('Failed to update bus location:', error);
  }
}

/**
 * Simulates a bus moving along a path by sending periodic GPS updates.
 * @param {string} tenantId - The ID of the school/tenant.
 * @param {string} routeId - The ID of the route to simulate.
 * @param {{lat: number, lng: number}} startLocation - The starting coordinates.
 */
function startGpsSimulation(tenantId, routeId, startLocation) {
  let { lat, lng } = startLocation;

  console.log(`Starting GPS simulation for route ${routeId} of tenant ${tenantId}...`);

  setInterval(() => {
    // Simulate movement by slightly changing coordinates
    lat += 0.0001;
    lng += 0.0001;
    updateBusLocation(tenantId, routeId, lat, lng);
  }, 5000); // Update every 5 seconds

  console.log('Simulation running. Press Ctrl+C to stop.');
}

// Example of how to run the simulation:
// To run this, you would execute `node gps.js` from the terminal after setting up credentials.
if (require.main === module) {
  // These values would come from the driver's logged-in session in a real app
  const TENANT_ID = 'tenant-123'; // Sample tenant
  const ROUTE_ID = 'route-a'; // Sample route
  const START_LOCATION = { lat: 34.056, lng: -118.234 };

  startGpsSimulation(TENANT_ID, ROUTE_ID, START_LOCATION);
}

module.exports = {
  updateBusLocation,
  startGpsSimulation,
};
