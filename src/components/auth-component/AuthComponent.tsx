'use client';

import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';
import { useAuth } from '../auth-provider/auth-provider';
import styles from './authComponent.module.css';

interface AuthComponentProps {
  onSuccess?: () => void;
}

export default function AuthComponent({ onSuccess }: AuthComponentProps) {
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
      // Call onSuccess callback if provided
      onSuccess?.();
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
      <div className={styles.imageColumn}>
        <Image
          src="/signinleftcolimg.jpg"
          alt="Create your account"
          width={500}
          height={500}
          className={styles.sideImage}
          priority
        />
        <div className={styles.imageOverlay}>
          <h2 className={styles.overlayTitle}>Create your Account</h2>
          <p className={styles.overlayText}>
            Start creating custom beautifully designed resumes efortlessly!
          </p>
        </div>
      </div>
      <div className={styles.formColumn}>
        <h2 className={styles.formTitle}>Fill in your details</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {isSignUp && (
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className={styles.input}
            />
          )}

          <input
            type="email"
            placeholder="Email address"
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
          <div className={styles.termsCheckbox}>
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              Accept
              <Link
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.termsLink}
              >
                Terms & Conditions
              </Link>
            </label>
          </div>
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
    </div>
  );
}
