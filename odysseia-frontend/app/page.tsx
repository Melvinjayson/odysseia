
"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-black/60 rounded-3xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4 text-center">
          OΔYSSEIA
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-6 text-center">
          Embark on your personal odyssey. Transform, connect, and explore new horizons with AI-powered journeys.
        </p>
        <Link href="/login">
          <a className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 mb-8">
            Start Your Journey
          </a>
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-800 p-4 flex flex-col items-center shadow-md">
            <span className="text-2xl mb-2">🧭</span>
            <h2 className="font-bold text-lg text-white mb-1">Odyssey Starter</h2>
            <p className="text-gray-300 text-sm text-center">Begin a guided journey tailored to your goals.</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-800 p-4 flex flex-col items-center shadow-md">
            <span className="text-2xl mb-2">📊</span>
            <h2 className="font-bold text-lg text-white mb-1">Dashboard</h2>
            <p className="text-gray-300 text-sm text-center">Track your progress and milestones in real time.</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-800 p-4 flex flex-col items-center shadow-md">
            <span className="text-2xl mb-2">🤝</span>
            <h2 className="font-bold text-lg text-white mb-1">Community</h2>
            <p className="text-gray-300 text-sm text-center">Connect, share, and grow with fellow explorers.</p>
          </div>
        </div>
      </div>
      <footer className="mt-10 text-gray-500 text-xs text-center">
        &copy; {new Date().getFullYear()} OΔYSSEIA. All rights reserved.
      </footer>
    </main>
  );
}
