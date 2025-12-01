"use client";

import { useEffect, useMemo, useState } from "react";

import {
  fallbackAnchors,
  fallbackApplications,
  fallbackArcs,
  fallbackMeshNodes,
  fallbackOpportunities,
  fallbackTasks,
  type ApplicationFlow,
  type Arc,
  type DataAnchor,
  type MeshNode,
  type Opportunity,
  type Task,
} from "../lib/orchestrationData";

type ChatMessage = {
  sender: "You" | "Venus";
  text: string;
  emotion: "calm" | "curious" | "excited" | "concerned" | "confident";
  intent: string;
  time: string;
};

export default function Home() {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [persona, setPersona] = useState("Venus Navigator");
  const [memoryMode, setMemoryMode] = useState("Experiences + Voiceprints");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "Venus",
      text: "I am listening. Where should we steer next?",
      emotion: "calm",
      intent: "open",
      time: "just now",
    },
    {
      sender: "You",
      text: "Line up opportunities that resonate with my civic design arc.",
      emotion: "curious",
      intent: "search",
      time: "30s ago",
    },
  ]);
  const [tasks, setTasks] = useState<Task[]>(fallbackTasks);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(fallbackOpportunities);
  const [arcs, setArcs] = useState<Arc[]>(fallbackArcs);
  const [applications, setApplications] = useState<ApplicationFlow[]>(fallbackApplications);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [savingPersona, setSavingPersona] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [meshEnabled, setMeshEnabled] = useState(true);
  const [dataResidency, setDataResidency] = useState("Local-first");
  const [meshNodes, setMeshNodes] = useState<MeshNode[]>(fallbackMeshNodes);
  const [anchors, setAnchors] = useState<DataAnchor[]>(fallbackAnchors);

  const emotionPalette: Record<ChatMessage["emotion"], string> = useMemo(
    () => ({
      calm: "text-cyan-200 bg-cyan-900/30 border-cyan-800/40",
      curious: "text-amber-200 bg-amber-900/30 border-amber-800/40",
      excited: "text-pink-200 bg-pink-900/30 border-pink-800/40",
      concerned: "text-red-200 bg-red-900/30 border-red-800/40",
      confident: "text-emerald-200 bg-emerald-900/30 border-emerald-800/40",
    }),
    [],
  );

  useEffect(() => {
    const fetchOrFallback = async <T,>(url: string, fallback: T, setter: (value: T) => void) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("bad status");
        const data = (await res.json()) as T;
        setter(data);
      } catch {
        setter(fallback);
      }
    };

    fetchOrFallback<Task[]>("/api/orchestration/sesame", fallbackTasks, setTasks);
    fetchOrFallback<Opportunity[]>("/api/orchestration/reveta", fallbackOpportunities, setOpportunities);
    fetchOrFallback<Arc[]>("/api/orchestration/arcs", fallbackArcs, setArcs);
    fetchOrFallback<ApplicationFlow[]>("/api/orchestration/applications", fallbackApplications, setApplications);
    fetchOrFallback<MeshNode[]>("/api/orchestration/mesh", fallbackMeshNodes, setMeshNodes);
    fetchOrFallback<DataAnchor[]>("/api/orchestration/anchors", fallbackAnchors, setAnchors);
  }, []);

  useEffect(() => {
    const ticker = setInterval(() => {
      setTasks(current =>
        current.map(task =>
          task.status === "running"
            ? { ...task, eta: "<30s", status: "complete" }
            : task.status === "waiting"
              ? { ...task, status: "running" }
              : task,
        ),
      );
    }, 8000);
    return () => clearInterval(ticker);
  }, []);

  const toggleListening = () => {
    setLoadingVoice(true);
    setTimeout(() => {
      setListening(prev => !prev);
      setLoadingVoice(false);
    }, 500);
  };

  const toggleSpeaking = () => {
    setSpeaking(prev => !prev);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMessage: ChatMessage = {
      sender: "You",
      text: chatInput.trim(),
      emotion: "confident",
      intent: "update",
      time: "now",
    };
    setChatMessages(prev => [newMessage, ...prev]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages(prev => [
        {
          sender: "Venus",
          text: "Logging that. I will mirror this across Sesame and Reveta streams.",
          emotion: "calm",
          intent: "confirm",
          time: "just now",
        },
        ...prev,
      ]);
    }, 400);
  };

  const savePersona = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPersona(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/orchestration/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona,
          memoryMode,
          meshEnabled,
          dataResidency,
        }),
      });
      if (!res.ok) throw new Error("Failed to persist persona");
      const body = (await res.json()) as { status?: string };
      setSaveMessage(body.status ?? "Persona synced with orchestration API.");
    } catch {
      setSaveMessage("Orchestration API unavailable; saved locally for now.");
    } finally {
      setSavingPersona(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-12">
      <header className="rounded-3xl border border-indigo-900/40 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.08),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(236,72,153,0.08),transparent_30%)] pointer-events-none" aria-hidden />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">Venus experience</p>
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-sm">Real-time, emotion-aware orchestration</h1>
            <p className="mt-3 text-indigo-100/80 max-w-2xl">
              Voice-first guidance, Sesame tasking, Reveta matches, and Odysseia arcs—stitched into a single responsive console with narrative tone intact and a sovereign mesh that keeps data close.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-black/30 border border-indigo-900/30 rounded-2xl px-4 py-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-pulse" aria-hidden />
            <div>
              <p className="text-xs text-indigo-100/70">Live orchestrator</p>
              <p className="text-sm font-semibold text-white">Venus + Sesame + Reveta</p>
            </div>
          </div>
        </div>
      </header>

      <section id="voice" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-indigo-900/40 bg-slate-950/80 shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Voice I/O console</h2>
            <span className="text-xs text-indigo-200">Real-time stream</span>
          </div>
          <p className="text-sm text-indigo-100/80">
            Capture live intent, playback guidance, and keep memory in sync while respecting accessibility cues.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="group" aria-label="Voice controls">
            <button
              type="button"
              onClick={toggleListening}
              disabled={loadingVoice}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-pink-400 ${
                listening
                  ? "bg-pink-900/40 border-pink-700 text-pink-100"
                  : "bg-slate-900 border-slate-800 text-slate-100"
              }`}
              aria-pressed={listening}
            >
              <div>
                <p className="text-sm font-semibold">Voice input</p>
                <p className="text-xs opacity-80">Live mic + emotional resonance</p>
              </div>
              <span className="text-2xl">{loadingVoice ? "⏳" : listening ? "🎙️" : "🎤"}</span>
            </button>
            <button
              type="button"
              onClick={toggleSpeaking}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                speaking
                  ? "bg-indigo-900/40 border-indigo-700 text-indigo-100"
                  : "bg-slate-900 border-slate-800 text-slate-100"
              }`}
              aria-pressed={speaking}
            >
              <div>
                <p className="text-sm font-semibold">Voice output</p>
                <p className="text-xs opacity-80">Attuned audio responses</p>
              </div>
              <span className="text-2xl">{speaking ? "🔊" : "🎧"}</span>
            </button>
            <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/40 px-4 py-3">
              <p className="text-sm font-semibold text-emerald-100">Latency</p>
              <p className="text-2xl font-black text-emerald-200">110 ms</p>
              <p className="text-[11px] text-emerald-100/70">Live orchestration API</p>
            </div>
          </div>
          <div className="rounded-2xl border border-indigo-900/30 bg-gradient-to-r from-slate-900 to-indigo-950 px-4 py-5">
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-200 mb-2">Current utterance</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-16 bg-black/40 rounded-xl overflow-hidden">
                <div className="h-full w-full bg-[repeating-linear-gradient(90deg,rgba(129,140,248,0.4)_0,rgba(129,140,248,0.4)_8px,transparent_8px,transparent_16px)] animate-[pulse_1.5s_ease-in-out_infinite]" aria-hidden />
              </div>
              <div className="min-w-[140px] text-right">
                <p className="text-xs text-indigo-100/70">Emotion signal</p>
                <p className="text-lg font-semibold text-indigo-100">Steady / curious</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-indigo-900/40 bg-slate-950/80 shadow-xl p-6 space-y-4">
          <h3 className="text-xl font-bold text-white">Persona & memory onboarding</h3>
          <p className="text-sm text-indigo-100/80">
            Configure who is speaking, how they remember, and where Venus should store voiceprints.
          </p>
          <form className="space-y-4" onSubmit={savePersona}>
            <label className="block text-sm font-semibold text-indigo-100" htmlFor="persona">
              Persona title
            </label>
            <input
              id="persona"
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400"
              value={persona}
              onChange={e => setPersona(e.target.value)}
              aria-label="Persona title"
            />
            <label className="block text-sm font-semibold text-indigo-100" htmlFor="memory">
              Memory mode
            </label>
            <select
              id="memory"
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm focus-visible:outline focus-visible:ring-2 focus-visible:ring-pink-400"
              value={memoryMode}
              onChange={e => setMemoryMode(e.target.value)}
              aria-label="Memory mode"
            >
              <option>Experiences + Voiceprints</option>
              <option>Text-only</option>
              <option>Consent-driven bursts</option>
            </select>
            <button
              type="submit"
              disabled={savingPersona}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold shadow-lg hover:shadow-xl focus-visible:outline focus-visible:ring-2 focus-visible:ring-pink-400"
            >
              {savingPersona ? "Saving..." : "Save to orchestration API"}
            </button>
            {saveMessage && (
              <p
                className={`text-xs ${saveMessage.includes("unavailable") ? "text-amber-200" : "text-emerald-200"}`}
                role="status"
                aria-live="polite"
              >
                {saveMessage}
              </p>
            )}
          </form>
        </div>
      </section>

      <section
        id="decentralized"
        className="grid grid-cols-1 xl:grid-cols-3 gap-6 rounded-3xl border border-indigo-900/40 bg-gradient-to-br from-slate-95
0 via-indigo-950 to-slate-900 shadow-2xl p-6"
      >
        <div className="xl:col-span-2 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Decentralized orchestration</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Mesh control + sovereignty</h2>
              <p className="text-sm text-indigo-100/80 max-w-2xl">
                Keep Venus responsive while honoring local-first storage, mirrored anchors, and shared execution across regions.
              </p>
            </div>
            <div className="flex gap-3" role="group" aria-label="Mesh configuration">
              <button
                type="button"
                onClick={() => setMeshEnabled(prev => !prev)}
                aria-pressed={meshEnabled}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition focus-visible:outline focus-vi
sible:ring-2 focus-visible:ring-pink-400 ${
                  meshEnabled
                    ? "bg-pink-900/30 border-pink-700 text-pink-100"
                    : "bg-slate-900 border-slate-800 text-slate-100"
                }`}
              >
                {meshEnabled ? "Mesh active" : "Mesh paused"}
                <p className="text-[11px] font-normal opacity-80">Autonomous routing across Venus edges</p>
              </button>
              <label className="block text-sm text-indigo-100" htmlFor="residency">
                <span className="sr-only">Data residency preference</span>
                <select
                  id="residency"
                  value={dataResidency}
                  onChange={e => setDataResidency(e.target.value)}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm focus-visible:outline focus-visibl
e:ring-2 focus-visible:ring-indigo-400"
                >
                  <option>Local-first</option>
                  <option>Hybrid mesh</option>
                  <option>Cloud assist</option>
                </select>
                <p className="mt-1 text-[11px] text-indigo-100/70">Sovereignty lane: {dataResidency}</p>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3" role="list" aria-label="Mesh nodes">
            {meshNodes.map(node => (
              <div key={node.id} className="rounded-2xl border border-slate-800 bg-black/30 px-4 py-3 space-y-2" role="listitem">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{node.region}</p>
                  <span
                    className={`text-[11px] px-2 py-1 rounded-full border ${
                      node.status === "online"
                        ? "border-emerald-700 bg-emerald-900/30 text-emerald-100"
                        : node.status === "degraded"
                          ? "border-amber-700 bg-amber-900/30 text-amber-100"
                          : "border-slate-700 bg-slate-900 text-slate-100"
                    }`}
                  >
                    {node.status}
                  </span>
                </div>
                <p className="text-xs text-indigo-100/80">{node.capability}</p>
                <div className="flex items-center justify-between text-[11px] text-indigo-200/80">
                  <span>Node · {node.id}</span>
                  <span>Load · {node.load}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-indigo-900/40 bg-slate-950/80 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Anchors & proofs</h3>
            <span className="text-[11px] text-indigo-200">Decentralized storage</span>
          </div>
          <p className="text-sm text-indigo-100/80">
            Routing keeps your persona, memory, and task traces pinned to local or community-owned anchors.
          </p>
          <div className="space-y-3" role="list" aria-label="Anchors">
            {anchors.map(anchor => (
              <div key={anchor.id} className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3" role="listitem">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{anchor.location}</p>
                  <span
                    className={`text-[11px] px-2 py-1 rounded-full border ${
                      anchor.status === "active"
                        ? "border-emerald-700 bg-emerald-900/30 text-emerald-100"
                        : "border-amber-700 bg-amber-900/30 text-amber-100"
                    }`}
                  >
                    {anchor.status}
                  </span>
                </div>
                <p className="text-xs text-indigo-100/80">{anchor.assurance}</p>
                <div className="flex items-center justify-between text-[11px] text-indigo-200/80">
                  <span>Anchor · {anchor.id}</span>
                  <span>Latency · {anchor.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="chat" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-3xl border border-indigo-900/40 bg-slate-950/80 shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Emotion-aware chat</h2>
            <span className="text-xs text-indigo-200">Mirrors voice state</span>
          </div>
          <form onSubmit={handleSend} className="flex gap-3" aria-label="Send chat message">
            <input
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400"
              placeholder="Tell Venus what you need next"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              aria-label="Chat input"
            />
            <button
              type="submit"
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 text-sm font-semibold shadow-lg hover:shadow-xl focus-visible:outline focus-visible:ring-2 focus-visible:ring-pink-400"
            >
              Send
            </button>
          </form>
          <div className="space-y-3" role="list" aria-label="Chat transcript">
            {chatMessages.map(message => (
              <article
                key={`${message.sender}-${message.time}-${message.text}`}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3"
                role="listitem"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-indigo-100">{message.sender}</span>
                    <span className={`text-[11px] px-2 py-1 rounded-full border ${emotionPalette[message.emotion]}`}>
                      {message.emotion}
                    </span>
                  </div>
                  <span className="text-[11px] text-indigo-100/70">{message.time}</span>
                </div>
                <p className="mt-2 text-sm text-slate-100">{message.text}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-indigo-200">Intent · {message.intent}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-indigo-900/40 bg-gradient-to-b from-indigo-950 via-slate-950 to-slate-950 shadow-xl p-6 space-y-4">
          <h3 className="text-xl font-bold text-white">Narrative guidance</h3>
          <p className="text-sm text-indigo-100/80">Odysseia arcs that adapt as Venus hears you.</p>
          <div className="space-y-3" id="arcs" role="list" aria-label="Odysseia arcs">
            {arcs.map(arc => (
              <div key={arc.id} className="rounded-2xl border border-indigo-900/40 bg-black/30 px-4 py-3" role="listitem">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{arc.title}</p>
                  <span className="text-[11px] text-indigo-200">{arc.stage}</span>
                </div>
                <p className="text-sm text-indigo-100/80 mt-1">{arc.guidance}</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-pink-200 mt-2">{arc.emphasis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="agents" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-indigo-900/40 bg-slate-950/80 shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Sesame agent execution</h2>
            <span className="text-xs text-indigo-200">Live tasks</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3" role="list" aria-label="Sesame tasks">
            {tasks.map(task => (
              <div key={task.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 space-y-2" role="listitem">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{task.name}</p>
                  <span
                    className={`text-[11px] px-2 py-1 rounded-full border ${
                      task.status === "complete"
                        ? "border-emerald-700 bg-emerald-900/30 text-emerald-100"
                        : task.status === "running"
                          ? "border-amber-700 bg-amber-900/30 text-amber-100"
                          : "border-slate-700 bg-slate-900 text-slate-100"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <p className="text-xs text-indigo-100/80">{task.impact}</p>
                <div className="flex items-center justify-between text-[11px] text-indigo-200/80">
                  <span>Task ID · {task.id}</span>
                  <span>ETA · {task.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-indigo-900/40 bg-gradient-to-b from-slate-950 to-indigo-950 shadow-xl p-6 space-y-3">
          <h3 className="text-xl font-bold text-white">Execution heatmap</h3>
          <p className="text-sm text-indigo-100/80">Where Sesame is allocating focus.</p>
          <div className="grid grid-cols-2 gap-3" aria-label="Execution focus stats">
            <div className="rounded-2xl border border-indigo-900/40 bg-black/30 px-3 py-3">
              <p className="text-xs text-indigo-200">Embeddings</p>
              <p className="text-2xl font-black text-white">64%</p>
              <p className="text-[11px] text-indigo-100/60">Memory fusion</p>
            </div>
            <div className="rounded-2xl border border-pink-900/40 bg-pink-900/20 px-3 py-3">
              <p className="text-xs text-pink-100">Applications</p>
              <p className="text-2xl font-black text-white">36%</p>
              <p className="text-[11px] text-pink-100/70">UNDP & Notion</p>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/30 px-3 py-3">
            <p className="text-xs text-emerald-100">Stability</p>
            <p className="text-sm text-emerald-200">All agents synchronized to orchestration API.</p>
          </div>
        </div>
      </section>

      <section id="reveta" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-3xl border border-indigo-900/40 bg-slate-950/80 shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Reveta opportunity matching</h2>
            <span className="text-xs text-indigo-200">Curated in real time</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="Opportunities">
            {opportunities.map(opp => (
              <article key={opp.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4 space-y-2" role="listitem">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{opp.title}</p>
                    <p className="text-xs text-indigo-200">{opp.org}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-indigo-200">Fit</p>
                    <p className="text-lg font-black text-white">{opp.fitScore}%</p>
                  </div>
                </div>
                <p className="text-sm text-indigo-100/80">{opp.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {opp.tags.map(tag => (
                    <span key={tag} className="text-[11px] px-2 py-1 rounded-full border border-indigo-900/60 text-indigo-100 bg-indigo-900/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-indigo-900/40 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 shadow-xl p-6 space-y-3">
          <h3 className="text-xl font-bold text-white">Automated applications</h3>
          <p className="text-sm text-indigo-100/80">Venus can ship updates to UNDP or Notion on your behalf.</p>
          <div className="space-y-3" role="list" aria-label="Application flows">
            {applications.map(flow => (
              <div key={flow.id} className="rounded-2xl border border-slate-800 bg-black/30 px-4 py-3" role="listitem">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{flow.name}</p>
                  <span
                    className={`text-[11px] px-2 py-1 rounded-full border ${
                      flow.status === "delivered"
                        ? "border-emerald-700 bg-emerald-900/30 text-emerald-100"
                        : flow.status === "in-flight"
                          ? "border-amber-700 bg-amber-900/30 text-amber-100"
                          : "border-slate-700 bg-slate-900 text-slate-100"
                    }`}
                  >
                    {flow.status}
                  </span>
                </div>
                <p className="text-xs text-indigo-100/80">Destination · {flow.destination}</p>
                <ol className="mt-2 space-y-1 text-[11px] text-indigo-100/80 list-decimal list-inside">
                  {flow.steps.map(step => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p className="text-[11px] text-indigo-200/80 mt-2">{flow.lastAction}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
