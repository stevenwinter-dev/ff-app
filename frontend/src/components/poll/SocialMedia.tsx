import React from 'react';

export default function SocialMedia({ poll, pollUrl, pollId }) {
  return (
    <div className="flex justify-center space-x-4 w-full p-4 bg-slate-950 border-t-2 border-white">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pollUrl)}&text=${encodeURIComponent(`I just voted on this poll! Who would you choose: ${poll.player1.name} or ${poll.player2.name}?`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.384 4.482A13.937 13.937 0 0 1 1.671 3.149a4.93 4.93 0 0 0 1.523 6.574 4.903 4.903 0 0 1-2.229-.616v.061a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.926 4.926 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.054 0 14.001-7.496 14.001-14 0-.213-.005-.426-.015-.637A10.004 10.004 0 0 0 24 4.557z" />
        </svg>
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pollUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.733 0 1.325-.592 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z" />
        </svg>
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(pollUrl)}&title=${encodeURIComponent(`Fantasy Football Poll: ${poll.player1.name} vs ${poll.player2.name}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 hover:text-blue-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M19 0H5a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" />
        </svg>
      </a>
    </div>
  );
}