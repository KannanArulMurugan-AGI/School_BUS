import React, { useState } from 'react';
import { getCustomToken } from '../services/api';
import { signIn } from '../services/firebase';

/**
 * A simple onboarding/login component for the parent web app.
 * It takes user details, fetches a custom token, and signs into Firebase.
 * @param {object} props
 * @param {(user: import("firebase/auth").User) => void} props.onSignInSuccess - Callback function for successful sign-in.
 */
function Onboarding({ onSignInSuccess }) {
  const [email, setEmail] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !tenantId) {
      setError('Email and Tenant ID are required.');
      setLoading(false);
      return;
    }

    try {
      // In a real app, the backend would first verify the user's identity against the database.
      // Here, we assume the backend can issue a token based on this info.
      // The `userId` would likely be the user's ID from the `users` table.
      // For this example, we'll use the email as the user identifier, as it's unique per tenant.
      const token = await getCustomToken({
        userId: email, // This is a simplification for the example.
        tenantId: tenantId,
        role: 'parent',
      });

      // Use the custom token to sign into Firebase
      const userCredential = await signIn(token);

      console.log('Successfully signed in:', userCredential.user);

      // Notify the parent component of the successful sign-in
      if (onSignInSuccess) {
        onSignInSuccess(userCredential.user);
      }

    } catch (err) {
      console.error('Onboarding failed:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Welcome to School Bus Tracker
        </h2>
        <p className="text-center text-gray-600">
          Please enter your details to view the map.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Your Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700">
              School ID / Tenant ID
            </label>
            <input
              id="tenantId"
              type="text"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              placeholder="e.g., sunnyvale-elementary"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;
