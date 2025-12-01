"use client";

import { useEffect, useMemo, useState } from "react";

type ChatMessage = {
  sender: "You" | "Venus";
  text: string;
  emotion: "calm" | "curious" | "excited" | "concerned" | "confident";
  intent: string;
  time: string;
};

type Task = {
  id: string;
  name: string;
  status: "waiting" | "running" | "complete";
  eta: string;
  impact: string;
};

type Opportunity = {
  id: string;
  title: string;
  org: string;
  fitScore: number;
  summary: string;
  tags: string[];
};

type Arc = {
  id: string;
  title: string;
  stage: string;
  guidance: string;
  emphasis: string;
};

type ApplicationFlow = {
  id: string;
  name: string;
  destination: string;
  steps: string[];
  status: "configured" | "in-flight" | "delivered";
  lastAction: string;
};

const fallbackTasks: Task[] = [
  {
    id: "sesame-01",
    name: "Profile vector refresh",
    status: "running",
    eta: "45s",
    impact: "Aligning persona embeddings with live context",
  },
  {
    id: "sesame-02",
    name: "Signal triage",
    status: "waiting",
    eta: "2m",
    impact: "Prioritizing high-signal threads for Venus guidance",
  },
  {
    id: "sesame-03",
    name: "Memory stitch",
    status: "complete",
    eta: "0s",
    impact: "Linked recent sessions into persistent narrative",
  },
];

const fallbackOpportunities: Opportunity[] = [
  {
    id: "reveta-01",
    title: "UNDP Youth Innovation Fellowship",
    org: "UNDP",
    fitScore: 92,
    summary: "Global social impact residency seeking narrative-first builders.",
    tags: ["UNDP", "Global", "Impact", "Remote"],
  },
  {
    id: "reveta-02",
    title: "Notion AI Templates Partner",
    org: "Notion",
    fitScore: 88,
    summary: "Build guided workspaces that ship with emotion-aware copilots.",
    tags: ["Notion", "Builder", "Templates", "Revenue"],
  },
  {
    id: "reveta-03",
    title: "City Lab Residency",
    org: "Civic Futures",
    fitScore: 79,
    summary: "Prototype neighborhood-scale storytelling pilots with local partners.",
    tags: ["Local", "Pilot", "Story", "Field"],
  },
];

const fallbackArcs: Arc[] = [
  {
    id: "arc-01",
    title: "Call to Adventure",
    stage: "Opening",
    guidance: "Frame your north star, voice what feels unresolved, and let Venus listen.",
    emphasis: "Attune",
  },
  {
    id: "arc-02",
    title: "Crossing the Threshold",
    stage: "Activation",
    guidance: "Accept a matched opportunity and let Sesame orchestrate first moves.",
    emphasis: "Commit",
  },
  {
    id: "arc-03",
    title: "Return with Elixir",
    stage: "Integration",
    guidance: "Publish the learnings back into your Notion or UNDP dossier with memory grafts.",
    emphasis: "Reflect",
  },
];

const fallbackApplications: ApplicationFlow[] = [
  {
    id: "flow-01",
    name: "UNDP application",
    destination: "UNDP Portal",
    steps: ["Draft narrative", "Collect references", "Submit dossier"],
    status: "in-flight",
    lastAction: "Draft synced with Venus guidance",
  },
  {
    id: "flow-02",
    name: "Notion workspace push",
    destination: "Notion",
    steps: ["Assemble page", "Embed memory", "Share with team"],
    status: "configured",
    lastAction: "Awaiting approval to publish to shared space",
  },
  {
    id: "flow-03",
    name: "Arc export",
    destination: "Odysseia archive",
    steps: ["Collate transcripts", "Tag emotions", "Publish story"],
    status: "delivered",
    lastAction: "Story released with emotion markers",
  },
];

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
  const [personaSaved, setPersonaSaved] = useState(false);

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

  const savePersona = (e: React.FormEvent) => {
    e.preventDefault();
    setPersonaSaved(true);
    setTimeout(() => setPersonaSaved(false), 3000);
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
              Voice-first guidance, Sesame tasking, Reveta matches, and Odysseia arcs—stitched into a single responsive console with narrative tone intact.
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
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold shadow-lg hover:shadow-xl focus-visible:outline focus-visible:ring-2 focus-visible:ring-pink-400"
            >
              Save to orchestration API
            </button>
            {personaSaved && <p className="text-xs text-emerald-200">Persona synced with memory orchestrator.</p>}
          </form>
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
