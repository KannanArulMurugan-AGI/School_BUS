import React, { useEffect, useState } from 'react';
import { auth, database } from '../services/firebase';
import { ref, onValue } from 'firebase/database';

/**
 * A placeholder component for the main map view.
 * This component will display the live location of a school bus on a map.
 * It also demonstrates how to subscribe to live data from Firebase.
 * @param {object} props
 * @param {import("firebase/auth").User} props.user - The authenticated Firebase user object.
 * @param {() => void} props.onSignOut - Callback function to handle user sign-out.
 */
function MapView({ user, onSignOut }) {
  const [liveGpsData, setLiveGpsData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // This function will be the subscription canceller.
    let unsubscribe = () => {};

    const getTenantIdAndSubscribe = async () => {
      try {
        const idTokenResult = await user.getIdTokenResult(true); // Force refresh of the token
        const tenantId = idTokenResult.claims.tenantId;

        if (!tenantId) {
          setError("Could not find a tenant ID for your account.");
          console.error("No tenantId claim found in user's token.");
          return;
        }

        // In a real application, the parent would be associated with one or more children,
        // who are in turn assigned to specific routes. This logic would determine the routeId.
        const routeId = 'route-1'; // This is a placeholder and should be dynamic.

        const liveRouteRef = ref(database, `schools/${tenantId}/routes/${routeId}/live`);

        console.log(`Subscribing to Firebase path: schools/${tenantId}/routes/${routeId}/live`);

        unsubscribe = onValue(liveRouteRef, (snapshot) => {
          const data = snapshot.val();
          console.log('Received live GPS update:', data);
          setLiveGpsData(data);
        }, (err) => {
          console.error("Firebase subscription error:", err);
          setError("Could not connect to live data feed.");
        });

      } catch (err) {
        console.error("Failed to get user's token or subscribe to updates:", err);
        setError("An error occurred while setting up the live data feed.");
      }
    };

    getTenantIdAndSubscribe();

    // The cleanup function returned by useEffect will be called when the component unmounts.
    return () => {
      console.log('Unsubscribing from route updates.');
      unsubscribe();
    };
  }, [user]); // Rerun this effect if the user object ever changes.

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      if (onSignOut) {
        onSignOut();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="text-xl font-bold text-gray-800">School Bus Tracker</div>
        <div className="flex items-center">
          <span className="mr-4 text-sm text-gray-600">
            Welcome, {user.email || 'Parent'}!
          </span>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign Out
          </button>
        </div>
      </header>
      <main className="flex-grow bg-gray-200">
        {/*
          This is where the map component would be rendered.

          TODO: Integrate a mapping library like Mapbox or React Leaflet.
          1. Install the chosen library (e.g., `npm install mapbox-gl`).
          2. Import the map component here.
          3. Pass the `liveGpsData` state object to the map component to render a marker for the bus.
          4. Optionally, draw the route polyline on the map.
        */}
        <div className="flex items-center justify-center w-full h-full">
          <div className="p-8 text-center bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold">Map Placeholder</h3>
            <p className="mt-2 text-gray-600">The live map will be displayed here.</p>
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            <div className="mt-4 text-left p-4 bg-gray-50 rounded-md text-sm">
              <p className="font-mono"><strong>Status:</strong> {liveGpsData ? 'Receiving live data...' : 'Waiting for data...'}</p>
              <p className="font-mono"><strong>Latitude:</strong> {liveGpsData?.lat || 'N/A'}</p>
              <p className="font-mono"><strong>Longitude:</strong> {liveGpsData?.lng || 'N/A'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MapView;
