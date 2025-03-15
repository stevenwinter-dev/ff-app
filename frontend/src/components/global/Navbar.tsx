'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import SignInButton from './SignIn';

export default function Navbar() {
  const { data: session, status } = useSession();

  console.log('Navbar Session:', session); // Debugging: Log the session
  console.log('Navbar Status:', status); // Debugging: Log the session status

  return (
    <nav className='bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950'>
      <ul className="flex space-x-4 p-8">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/polls">Polls</Link>
        </li>
        <li>
          <Link href="/players">Players</Link>
        </li>
        {status === 'authenticated' ? (
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
        ) : (
          <li>
            <SignInButton />
          </li>
        )}
      </ul>
    </nav>
  );
}