'use client';

import type React from 'react';

import { useState } from 'react';
import { useAuth } from '../auth-provider/AuthProvider';
import styles from './authComponent.module.css';

export default function AuthComponent() {
  const { user, signIn, signUp } = useAuth();
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
    return null;
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {isSignUp && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className={styles.input}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? '...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <button
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
        className={styles.toggleButton}
      >
        {isSignUp ? 'Sign In' : 'Sign Up'}
      </button>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
