import "./styles/globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "OΔYSSEIA Venus",
  description: "Odysseia Venus: multi-agent orchestration for guided journeys.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-gray-950 via-slate-950 to-gray-900 text-gray-100">
        <nav className="sticky top-0 z-50 backdrop-blur bg-black/60 border-b border-indigo-900/40 px-4 md:px-10 py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold text-indigo-300 tracking-tight">OΔYSSEIA</span>
            <span className="text-xs bg-indigo-900 text-indigo-100 px-2 py-1 rounded-full">Venus</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#voice" className="hover:text-indigo-200 transition">Voice</a>
            <a href="#chat" className="hover:text-indigo-200 transition">Chat</a>
            <a href="#agents" className="hover:text-indigo-200 transition">Sesame</a>
            <a href="#reveta" className="hover:text-indigo-200 transition">Opportunities</a>
            <a href="#arcs" className="hover:text-indigo-200 transition">Odysseia Arcs</a>
          </div>
          <a
            className="text-xs font-semibold px-3 py-1 rounded-full border border-indigo-700 text-indigo-100 bg-indigo-900/40 hover:bg-indigo-800/60 transition"
            href="/login"
          >
            Access Console
          </a>
        </nav>
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 pb-20 pt-10 space-y-12">{children}</main>
        <footer className="bg-gradient-to-t from-gray-900 via-slate-900 to-gray-950 border-t border-indigo-900/40 py-4 text-center text-xs text-gray-400 mt-10">
          © 2025 OΔYSSEIA Venus. Crafted for responsive, accessible journeys.
        </footer>
      </body>
    </html>
  );
}
