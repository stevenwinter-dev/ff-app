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
    <button onClick={() => signIn()} className="bg-black text-white border border-emerald-400 px-4 py-2 rounded hover:bg-gray-800">
      Sign in
    </button>
  );
}