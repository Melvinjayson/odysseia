
import React from 'react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <h1 className="text-4xl font-bold mb-4 text-indigo-800">Welcome to OΔYSSEIA</h1>
      <p className="text-lg text-gray-700 mb-8">Your journey begins here. Please <a href="/login" className="text-indigo-600 underline">log in</a> to continue.</p>
    </main>
  );
}
