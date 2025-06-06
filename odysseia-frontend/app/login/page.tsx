
import React from 'react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md p-8 bg-gray-50 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-700">Login to OΔYSSEIA</h2>
        <form className="flex flex-col gap-4">
          <input type="email" placeholder="Email" className="p-2 border rounded" required />
          <input type="password" placeholder="Password" className="p-2 border rounded" required />
          <button type="submit" className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Login</button>
        </form>
      </div>
    </main>
  );
}
