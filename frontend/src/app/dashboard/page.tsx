'use client'; // Mark as a Client Component

import Loader from '../../components/global/Loader';
import React, { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import CreatePoll from '../../components/dashboard/CreatePoll'; // Import the CreatePoll component
import Accuracy from '../../components/dashboard/Accuracy';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [creatorId, setCreatorId] = useState(null); // State to store the creatorId

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) signIn(); // Redirect to sign-in if not authenticated

    // Set the creatorId once the session is available
    if (session?.user?.id) {
      setCreatorId(session.user.id);
    }
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

      <Accuracy /> {/* Render the Accuracy component */}

      {/* Render the CreatePoll component */}
      <div className="mt-4">
        <CreatePoll creatorId={creatorId} />
      </div>

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