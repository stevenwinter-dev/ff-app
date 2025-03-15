'use client';

import { useRouter } from 'next/navigation';

export default function SignUpButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/sign-up')}
      className="bg-black text-white border border-emerald-400 px-4 py-2 rounded hover:bg-gray-800"
    >
      Sign up
    </button>
  );
}