"use client";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    setTimeout(() => {
      setLoading(false);
      if (email === "user@example.com" && password === "password") {
        setSuccess(true);
      } else {
        setError("Invalid credentials.");
      }
    }, 1200);
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-sm bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 mt-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 text-center drop-shadow">Login to OΔYSSEIA</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition shadow-inner"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400 transition shadow-inner"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-2 rounded-xl font-bold shadow-lg hover:scale-105 hover:shadow-2xl transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in…" : "Login"}
          </button>
          {error && <div className="text-pink-400 text-sm text-center">{error}</div>}
          {success && <div className="text-green-400 text-sm text-center">Login successful!</div>}
        </form>
        <div className="text-xs text-gray-500 text-center mt-4">Demo: user@example.com / password</div>
      </div>
    </section>
  );
}
