import React from "react";

export default function WelcomeScreen({ onStartVoice }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] dark:bg-black relative overflow-hidden">
      {/* Neon gradient background particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 opacity-30 rounded-full blur-3xl left-[-10%] top-[-10%] animate-pulse" />
        <div className="absolute w-72 h-72 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 opacity-20 rounded-full blur-2xl right-[-10%] bottom-[-10%] animate-pulse" />
      </div>
      {/* Glassmorphic card */}
      <div className="z-10 p-8 rounded-3xl bg-white/10 backdrop-blur-md shadow-xl border border-white/20 flex flex-col items-center max-w-xs w-full">
        <h1 className="text-3xl font-extrabold text-white mb-2 text-center drop-shadow-lg">Welcome to Odyssey</h1>
        <p className="text-white/80 text-center mb-6">Your AI Workflow Copilot. Start your journey by speaking, typing, or uploading an image.</p>
        {/* Glowing CTA button */}
        <button
          onClick={onStartVoice}
          className="relative px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-400/40 animate-glow"
        >
          <span className="relative z-10">Start with Voice</span>
          <span className="absolute inset-0 rounded-full blur-md opacity-60 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-pulse" />
        </button>
        <div className="flex gap-4 mt-6">
          <button className="text-xs text-white/70 hover:text-white transition">New Chat</button>
          <button className="text-xs text-white/70 hover:text-white transition">Upload Image</button>
          <button className="text-xs text-white/70 hover:text-white transition">Recent</button>
        </div>
      </div>
    </div>
  );
}
