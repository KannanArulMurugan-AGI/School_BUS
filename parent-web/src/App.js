import React, { useState, useEffect } from 'react';
import { auth, database, firebaseApp } from './firebase';
import MapComponent from './MapComponent';
import './App.css';

// The main app view after login, now with a real map
const BusMapPage = ({ user, claims, onLogout }) => {
  const [busPosition, setBusPosition] = useState({ lat: 51.505, lng: -0.09 }); // Default position
  const [error, setError] = useState('');

  useEffect(() => {
    // claims would come from the custom token. We'll use defaults if they're not present.
    const tenantId = claims?.tenantId || 'tenant-123';
    // Let's assume the user's authorized route is also in the claims.
    const routeId = claims?.routeId || 'route-1';

    if (!tenantId || !routeId) {
      setError("User is not authorized for any route.");
      return;
    }

    const routePath = `/schools/${tenantId}/routes/${routeId}/live`;
    console.log("Subscribing to route:", routePath);
    const routeRef = firebaseApp.database().ref(routePath);

    const listener = routeRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data && data.lat && data.lng) {
        setBusPosition({ lat: data.lat, lng: data.lng });
        setError('');
      } else {
        setError('Waiting for bus location data...');
      }
    }, (errorObject) => {
      console.error('Firebase read failed: ' + errorObject.name);
      setError('Could not connect to location service.');
    });

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      routeRef.off('value', listener);
    };
  }, [claims]); // Rerun effect if claims change

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Live School Bus Map</h1>
          <p className="mt-1 text-sm text-gray-600">Welcome, Parent! (User: {user.uid})</p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="mt-4 border rounded-lg h-96 bg-gray-200 relative">
        {error && <div className="absolute top-2 left-2 bg-yellow-200 p-2 rounded z-10">{error}</div>}
        <MapComponent position={busPosition} />
      </div>
    </div>
  );
};

// A simple login component
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: `user-for-${email}`,
          tenantId: 'tenant-123',
          role: 'parent',
          // In a real scenario, the backend would determine the authorized route for this user
          // and include it in the token claims. We simulate this here.
          routeId: 'route-1'
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to get auth token');
      }

      const { token } = await response.json();
      await onLogin(token);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="p-8 bg-white rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Parent Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="******************"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  );
};


function App() {
  const [authState, setAuthState] = useState({ user: null, claims: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // When user is signed in, get the token result to access custom claims.
        const idTokenResult = await user.getIdTokenResult();
        setAuthState({ user: user, claims: idTokenResult.claims });
      } else {
        setAuthState({ user: null, claims: null });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (customToken) => {
    await firebaseApp.auth().signInWithCustomToken(customToken);
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {authState.user ? (
        <BusMapPage user={authState.user} claims={authState.claims} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
