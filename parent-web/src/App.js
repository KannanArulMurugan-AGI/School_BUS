import React, { useState, useEffect } from 'react';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Onboarding from './components/Onboarding';
import MapView from './components/MapView';
import './App.css';

/**
 * The main application component.
 * It handles the authentication state and renders the appropriate
 * view (Onboarding or MapView) based on whether a user is signed in.
 */
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The onAuthStateChanged observer returns an unsubscribe function.
    // We can use this for cleanup when the component unmounts.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup the subscription on component unmount
    return () => {
      console.log('Cleaning up auth state listener.');
      unsubscribe();
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  const handleSignInSuccess = (signedInUser) => {
    // The onAuthStateChanged listener above will automatically update the state.
    // This function is passed as a prop mainly to fulfill the component's contract,
    // but we could also add any post-login logic here if needed.
    console.log('Sign-in successful, App component notified.');
  };

  const handleSignOut = () => {
    // The onAuthStateChanged listener will handle setting the user state to null.
    console.log('User signed out, App component notified.');
  };

  // While we're checking the initial auth state, show a simple loading indicator.
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading Application...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        <MapView user={user} onSignOut={handleSignOut} />
      ) : (
        <Onboarding onSignInSuccess={handleSignInSuccess} />
      )}
    </div>
  );
}

export default App;
