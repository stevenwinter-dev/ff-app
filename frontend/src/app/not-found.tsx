import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold mb-4">Page not found</h1>
      <p className="text-xl mb-8 text-center">
        Looks like we fumbled the snap and lost the page. Time to call an audible!
      </p>
      <div className="flex space-x-4">
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition duration-300"
        >
          Return Home
        </Link>
        <Link
          href="/dashboard"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition duration-300"
        >
          Create a New Poll
        </Link>
      </div>
    </div>
  );
}