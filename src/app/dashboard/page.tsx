'use client'; // Mark as a Client Component

import Loader from '@/components/Loader';
import React, { useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Dashboard() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) signIn(); // Redirect to sign-in if not authenticated
  }, [session, status]);

  if (status === 'loading') {
    return <Loader />;
  }

  if (!session) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Hello, {session.user.name}</h1>
      <h2 className="text-xl mt-2">Dashboard</h2>
      {/* Render polls or other content here */}

      {/* Sign Out Button */}
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
}