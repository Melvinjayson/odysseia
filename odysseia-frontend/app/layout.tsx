import './styles/globals.css'
import "./styles/globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "OΔYSSEIA",
  description: "Odysseia: Your journey, your story.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-gray-900/95 via-gray-800/95 to-gray-900/80 border-t border-gray-700 flex justify-around items-center py-2 px-2 md:hidden rounded-t-2xl shadow-2xl">
          <a href="/" className="flex flex-col items-center text-gray-400 hover:text-indigo-400 transition">
            <span className="material-icons text-2xl mb-1">home</span>
            <span className="text-xs">Home</span>
          </a>
          <a href="/dashboard" className="flex flex-col items-center text-gray-400 hover:text-indigo-400 transition">
            <span className="material-icons text-2xl mb-1">dashboard</span>
            <span className="text-xs">Dashboard</span>
          </a>
          <a href="/odyssey-starter" className="flex flex-col items-center text-gray-400 hover:text-indigo-400 transition">
            <span className="material-icons text-2xl mb-1">auto_awesome</span>
            <span className="text-xs">Odyssey</span>
          </a>
          <a href="/login" className="flex flex-col items-center text-gray-400 hover:text-indigo-400 transition">
            <span className="material-icons text-2xl mb-1">person</span>
            <span className="text-xs">Login</span>
          </a>
        </nav>
        <nav className="hidden md:flex bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 px-8 py-4 justify-between items-center rounded-b-2xl shadow-xl">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-extrabold text-indigo-400 tracking-tight">OΔYSSEIA</span>
            <span className="text-xs bg-indigo-900 text-indigo-200 px-2 py-1 rounded">MVP</span>
          </div>
          <div className="space-x-8">
            <a href="/" className="text-gray-300 hover:text-indigo-400 font-medium transition">Home</a>
            <a href="/dashboard" className="text-gray-300 hover:text-indigo-400 font-medium transition">Dashboard</a>
            <a href="/odyssey-starter" className="text-gray-300 hover:text-indigo-400 font-medium transition">Odyssey Starter</a>
            <a href="/login" className="text-gray-300 hover:text-indigo-400 font-medium transition">Login</a>
          </div>
        </nav>
        <main className="flex-1 w-full max-w-2xl mx-auto px-2 pt-8 pb-24 md:pb-8 md:pt-12">{children}</main>
        <footer className="bg-gradient-to-t from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 py-4 text-center text-xs text-gray-500 mt-8 rounded-t-2xl shadow-inner">
          © 2025 OΔYSSEIA. All rights reserved. <a href="https://github.com/odysseia" className="text-indigo-400 hover:underline ml-2">GitHub</a>
        </footer>
      </body>
    </html>
  );
}
