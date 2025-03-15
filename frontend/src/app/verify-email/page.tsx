'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Verify the email if a token is present
  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`/api/verify-email?token=${token}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify email');
      }

      setMessage('Email verified successfully! Redirecting to sign-in...');
      setTimeout(() => {
        router.push('/sign-in'); // Redirect to sign-in after verification
      }, 3000);
    } catch (error) {
      console.error('Error verifying email:', error);
      setMessage(error.message || 'An error occurred while verifying your email.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-white">Verify Your Email</h1>
        {token ? (
          <p className="text-gray-400 mb-4">Verifying your email...</p>
        ) : (
          <>
            <p className="text-gray-400 mb-4">
              A verification email has been sent to <strong>{email}</strong>. Please check your inbox.
            </p>
          </>
        )}
        {message && <p className="text-green-500 mt-4">{message}</p>}
      </div>
    </div>
  );
}