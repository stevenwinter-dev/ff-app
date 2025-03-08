// pages/index.js
import React from 'react';

export default function About() {


  return (
    <div>
      <h1>About</h1>
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Classic Sporty Contrast</h2>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-2 px-4 rounded m-2">
          Callout
        </button>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded m-2">
          Normal
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2">
          Vote Yes
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-2">
          Vote No
        </button>
      </section>

      {/* Sleek Modern */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Sleek Modern</h2>
        <button className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded m-2">
          Callout
        </button>
        <button className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded m-2">
          Normal
        </button>
        <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded m-2">
          Vote Yes
        </button>
        <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded m-2">
          Vote No
        </button>
      </section>

      {/* Vibrant Energy */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Vibrant Energy</h2>
        <button className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold py-2 px-4 rounded m-2">
          Callout
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded m-2">
          Normal
        </button>
        <button className="bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded m-2">
          Vote Yes
        </button>
        <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded m-2">
          Vote No
        </button>
      </section>

      {/* Dark Mode Vibes */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Dark Mode Vibes</h2>
        <button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-2 px-4 rounded m-2">
          Callout
        </button>
        <button className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded m-2">
          Normal
        </button>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded m-2">
          Vote Yes
        </button>
        <button className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded m-2">
          Vote No
        </button>
      </section>

      {/* Retro Gamer */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Retro Gamer</h2>
        <button className="bg-orange-400 hover:bg-orange-500 text-slate-900 font-bold py-2 px-4 rounded m-2">
          Callout
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded m-2">
          Normal
        </button>
        <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded m-2">
          Vote Yes
        </button>
        <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded m-2">
          Vote No
        </button>
      </section>
    </div>
  );
}