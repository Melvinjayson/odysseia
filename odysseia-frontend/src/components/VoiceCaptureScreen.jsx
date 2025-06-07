import React, { useRef, useEffect } from "react";

export default function VoiceCaptureScreen({ onStop, onCancel, prompt }) {
  // Simple animated SVG voice sphere
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#232526] via-[#2c5364] to-[#0f2027] dark:bg-black relative overflow-hidden">
      {/* Neon gradient background particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-80 h-80 bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 opacity-20 rounded-full blur-3xl left-[-10%] top-[-10%] animate-pulse" />
        <div className="absolute w-60 h-60 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 opacity-10 rounded-full blur-2xl right-[-10%] bottom-[-10%] animate-pulse" />
      </div>
      <div className="z-10 flex flex-col items-center">
        <div className="mb-8">
          <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto animate-spin-slow">
            <defs>
              <radialGradient id="voiceGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.6" />
              </radialGradient>
            </defs>
            <circle cx="70" cy="70" r="60" fill="url(#voiceGradient)" filter="url(#blur)" />
            <circle cx="70" cy="70" r="40" fill="#fff" fillOpacity="0.1" />
            <circle cx="70" cy="70" r="30" fill="#a78bfa" fillOpacity="0.2" />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <button className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 shadow-lg flex items-center justify-center animate-pulse">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v2m0 0c-3.314 0-6-2.686-6-6v-2a6 6 0 1112 0v2c0 3.314-2.686 6-6 6z" /></svg>
            </button>
          </div>
        </div>
        <div className="text-white text-lg font-semibold mb-4 text-center px-4">
          {prompt || "Listening... Speak your request."}
        </div>
        <div className="flex gap-4">
          <button onClick={onStop} className="px-6 py-2 rounded-full bg-white/10 text-white font-bold shadow hover:bg-white/20 transition">Stop</button>
          <button onClick={onCancel} className="px-6 py-2 rounded-full bg-red-500/80 text-white font-bold shadow hover:bg-red-600 transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}
