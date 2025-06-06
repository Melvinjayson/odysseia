import './styles/globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'OΔYSSEIA',
  description: 'Odysseia: Your journey, your story.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <nav className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-700 tracking-tight">OΔYSSEIA</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">MVP</span>
          </div>
          <div className="space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-700 font-medium">Home</a>
            <a href="/dashboard" className="text-gray-700 hover:text-blue-700 font-medium">Dashboard</a>
            <a href="/odyssey-starter" className="text-gray-700 hover:text-blue-700 font-medium">Odyssey Starter</a>
            <a href="/login" className="text-gray-700 hover:text-blue-700 font-medium">Login</a>
          </div>
        </nav>
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="bg-gray-50 border-t border-gray-200 py-4 text-center text-sm text-gray-500 mt-8">
          © 2025 OΔYSSEIA. All rights reserved. <a href="https://github.com/odysseia" className="text-blue-600 hover:underline ml-2">GitHub</a>
        </footer>
      </body>
    </html>
  );
}
