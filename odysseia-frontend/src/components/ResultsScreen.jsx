import React from "react";

const responses = [
  { id: 1, text: "Here's your AI-generated insight!", type: "ai" },
  { id: 2, text: "Thank you! Can you elaborate?", type: "user" },
  { id: 3, text: "Certainly! Here's more detail...", type: "ai" },
];

export default function ResultsScreen({ onCopy, onEdit, onShare, onReload, onInput }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f2027] via-[#232526] to-[#2c5364] dark:bg-black relative overflow-hidden">
      {/* Neon gradient background particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-80 h-80 bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 opacity-20 rounded-full blur-3xl left-[-10%] top-[-10%] animate-pulse" />
        <div className="absolute w-60 h-60 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 opacity-10 rounded-full blur-2xl right-[-10%] bottom-[-10%] animate-pulse" />
      </div>
      <div className="z-10 flex-1 flex flex-col justify-end p-4 space-y-4">
        {responses.map((msg) => (
          <div key={msg.id} className={`max-w-[80%] rounded-2xl px-4 py-3 mb-2 shadow-lg ${msg.type === 'ai' ? 'self-start bg-white/10 backdrop-blur-md border border-white/20 text-white' : 'self-end bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white'}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-base font-medium">{msg.text}</span>
              {msg.type === 'ai' && (
                <div className="flex gap-1 ml-2">
                  <button onClick={() => onCopy(msg)} className="p-1 hover:bg-white/20 rounded transition" title="Copy"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><rect x="3" y="3" width="13" height="13" rx="2"/></svg></button>
                  <button onClick={() => onEdit(msg)} className="p-1 hover:bg-white/20 rounded transition" title="Edit"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z"/></svg></button>
                  <button onClick={() => onShare(msg)} className="p-1 hover:bg-white/20 rounded transition" title="Share"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg></button>
                  <button onClick={() => onReload(msg)} className="p-1 hover:bg-white/20 rounded transition" title="Reload"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v6h6M20 20v-6h-6"/><path d="M20 9A9 9 0 1 0 5 19"/></svg></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Multimodal input bar */}
      <div className="z-10 p-4 bg-black/60 backdrop-blur-md flex items-center gap-2 rounded-t-2xl shadow-2xl">
        <button className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center animate-pulse"><svg width="22" height="22" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 18v2m0 0c-3.314 0-6-2.686-6-6v-2a6 6 0 1112 0v2c0 3.314-2.686 6-6 6z" /></svg></button>
        <input type="text" placeholder="Type a message or paste image/audio..." className="flex-1 px-4 py-2 rounded-full bg-white/10 text-white placeholder-white/60 focus:outline-none" onKeyDown={e => e.key === 'Enter' && onInput(e.target.value)} />
        <button className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center"><svg width="22" height="22" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v16h16V4H4zm4 4h8v8H8V8z"/></svg></button>
      </div>
    </div>
  );
}
