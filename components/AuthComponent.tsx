'use client';

import type React from 'react';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

export default function AuthComponent() {
  const { user, signIn, signUp, signOut } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signUp(email, password, fullName);
      } else {
        await signIn(email, password);
      }
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex  items-center md:space-x-4">
        <span className="text-sm text-gray-600">
          Welcome, {user.user_metadata?.full_name || user.email}
        </span>
        <button
          type="button"
          onClick={signOut}
          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center sm:space-x-4">
      <form
        onSubmit={handleSubmit}
        className="flex mt-2 md:mt-0 md:w-2/3 gap-2 flex-col md:flex-row lg:flex-row md:items-center sm:space-x-2"
      >
        {isSignUp && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {loading ? '...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <button
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
        className=" mt-2 text-xs text-teal-600 hover:text-teal-700 rounded "
      >
        {isSignUp ? 'Sign In' : 'Sign Up'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
