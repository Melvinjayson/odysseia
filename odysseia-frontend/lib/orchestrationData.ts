export type Task = {
  id: string;
  name: string;
  status: "waiting" | "running" | "complete";
  eta: string;
  impact: string;
};

export type Opportunity = {
  id: string;
  title: string;
  org: string;
  fitScore: number;
  summary: string;
  tags: string[];
};

export type Arc = {
  id: string;
  title: string;
  stage: string;
  guidance: string;
  emphasis: string;
};

export type ApplicationFlow = {
  id: string;
  name: string;
  destination: string;
  steps: string[];
  status: "configured" | "in-flight" | "delivered";
  lastAction: string;
};

export type MeshNode = {
  id: string;
  region: string;
  status: "online" | "degraded" | "offline";
  load: number;
  capability: string;
};

export type DataAnchor = {
  id: string;
  location: string;
  status: "active" | "syncing";
  latency: string;
  assurance: string;
};

export const fallbackTasks: Task[] = [
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

export const fallbackOpportunities: Opportunity[] = [
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

export const fallbackArcs: Arc[] = [
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

export const fallbackApplications: ApplicationFlow[] = [
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

export const fallbackMeshNodes: MeshNode[] = [
  {
    id: "edge-paris",
    region: "Paris",
    status: "online",
    load: 34,
    capability: "Voice + chat",
  },
  {
    id: "edge-nairobi",
    region: "Nairobi",
    status: "degraded",
    load: 68,
    capability: "Reveta scoring",
  },
  {
    id: "edge-mexico",
    region: "Mexico City",
    status: "online",
    load: 52,
    capability: "Odysseia arcs",
  },
];

export const fallbackAnchors: DataAnchor[] = [
  {
    id: "anchor-01",
    location: "Local secure enclave",
    status: "active",
    latency: "22 ms",
    assurance: "Persona + memory stay sovereign",
  },
  {
    id: "anchor-02",
    location: "Community IPFS mirror",
    status: "syncing",
    latency: "140 ms",
    assurance: "Reveta + Sesame task traces verified",
  },
];
