import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
      <main className="flex-grow" style={{ height: 'calc(100vh - 64px)' }}>
        {error && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] p-4 bg-red-100 text-red-700 rounded-lg shadow-lg">
            <p>{error}</p>
          </div>
        )}
        <MapContainer
          center={[37.3861, -122.0839]} // Default center (e.g., Mountain View, CA)
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {liveGpsData && liveGpsData.lat && liveGpsData.lng && (
            <Marker position={[liveGpsData.lat, liveGpsData.lng]}>
              <Popup>
                Bus Location: <br />
                Lat: {liveGpsData.lat.toFixed(6)}, Lng: {liveGpsData.lng.toFixed(6)}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </main>
    </div>
  );
}

export default MapView;
