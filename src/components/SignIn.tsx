// src/app/components/SignInButton.js
'use client'; // Mark as a Client Component

import { signIn } from 'next-auth/react';

export default function SignInButton() {
  const handleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/' }); // Redirect to homepage after sign-in
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <button onClick={handleSignIn} className="bg-blue-500 text-white px-4 py-2 rounded">
      Sign in with Google
    </button>
  );
}