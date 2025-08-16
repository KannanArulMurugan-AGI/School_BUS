import React, { useState } from 'react';
import { signUpWithEmail, signInWithEmail, sendPasswordReset } from '../services/firebase';

function Onboarding({ onSignInSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
      try {
        const userCredential = await signUpWithEmail(email, password);
        onSignInSuccess(userCredential.user);
      } catch (err) {
        setError(err.message);
      }
    } else {
      try {
        const userCredential = await signInWithEmail(email, password);
        onSignInSuccess(userCredential.user);
      } catch (err) {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  const handlePasswordReset = () => {
    setError('');
    if (!email) {
      setError('Please enter your email address to reset your password.');
      return;
    }
    sendPasswordReset(email)
      .then(() => {
        setResetSent(true);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isSignUp ? 'Create an Account' : 'Welcome Back'}
        </h2>
        <form onSubmit={handleAuth} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          {isSignUp && (
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          )}
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          {resetSent && <p className="text-sm text-center text-green-600">Password reset email sent!</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {loading ? '...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        <div className="text-sm text-center">
          <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-indigo-600 hover:text-indigo-500">
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
        {!isSignUp && (
          <div className="text-sm text-center">
            <button onClick={handlePasswordReset} className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot Password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Onboarding;
