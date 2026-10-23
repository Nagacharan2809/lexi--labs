/*
   LEXI LABS — product data model.
   Server-ready plain TS. Every page composes from these exports.
   All data is realistic but clearly fictional demonstration data —
   the UI never presents it as verified customer results.
*/

import { maskPhone, tod } from "./format";

/* ---------------------------------------------------------------- seeds */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------------------------------------------------------- entities */

export type EmployeeStatus =
  | "draft"
  | "training"
  | "testing"
  | "verification"
  | "ready"
  | "working"
  | "paused"
  | "improving"
  | "retired";

export interface Employee {
  slug: string;
  name: string;
  role: string;
  code: string; // LX prefix for employee IDs
  seq: string; // padded serial
  status: EmployeeStatus;
  version: string;
  owner: string;
  joined: string;
  lastActive: string;
  hours: string; // work schedule
  channels: string[];
  tools: string[];
  capabilities: string[];
  purpose: string;
  short: string;
  primaryOutcome: string;
  complexity: "Low" | "Medium" | "High";
  capacity: { leadsPerDay: number; concurrency: number };
  performance: { verification: number; execution: number };
  accent: string;
}

export const STATUS_LABEL: Record<EmployeeStatus, string> = {
  draft: "Draft",
  training: "Onboarding",
  testing: "Testing",
  verification: "Verification",
  ready: "Ready — not scheduled",
  working: "Working",
  paused: "Paused",
  improving: "Improving",
  retired: "Retired",
};

export const EMPLOYEES: Employee[] = [
  {
    slug: "voice-sales",
    name: "Lexi Voice Sales",
    role: "Sales & Lead Qualification",
    code: "LXS",
    seq: "000421",
    status: "working",
    version: "2.4.1",
    owner: "Nagacharan M",
    joined: "Aug 14, 2026",
    lastActive: "now",
    hours: "Mon–Sat · 09:00–21:00 IST",
    channels: ["Phone (outbound)", "WhatsApp", "SMS", "CRM"],
    tools: ["Phone", "WhatsApp", "CRM", "Calendar", "Database"],
    capabilities: [
      "Outbound voice calls",
      "Lead qualification",
      "Objection handling",
      "Appointment booking",
      "CRM hygiene",
    ],
    purpose:
      "Call new leads fast, qualify intent, handle objections inside policy and book confirmed site visits.",
    short: "Outbound voice-calling employee for lead qualification and appointments.",
    primaryOutcome: "Confirmed site visits",
    complexity: "Low",
    capacity: { leadsPerDay: 1400, concurrency: 60 },
    performance: { verification: 94, execution: 96.4 },
    accent: "#1d4790",
  },
  {
    slug: "sales",
    name: "Lexi Sales",
    role: "Pipeline Outreach",
    code: "LXD",
    seq: "000102",
    status: "working",
    version: "3.1.0",
    owner: "Aarav Mehta",
    joined: "Jun 02, 2026",
    lastActive: "4 min ago",
    hours: "Mon–Fri · 10:00–19:00 IST",
    channels: ["Email", "WhatsApp", "CRM"],
    tools: ["CRM", "Email", "Calendar", "Web"],
    capabilities: ["Email sequences", "CRM follow-ups", "Pipeline hygiene"],
    purpose:
      "Re-engage dormant pipeline and move every open opportunity one step forward.",
    short: "Follows up the whole open pipeline over email and WhatsApp, every working day.",
    primaryOutcome: "Reactivated opportunities",
    complexity: "Low",
    capacity: { leadsPerDay: 500, concurrency: 12 },
    performance: { verification: 97, execution: 98.9 },
    accent: "#2b5aa7",
  },
  {
    slug: "lead-generator",
    name: "Lexi Lead Generator",
    role: "Lead Sourcing & Enrichment",
    code: "LXG",
    seq: "000089",
    status: "working",
    version: "1.7.2",
    owner: "Nagacharan M",
    joined: "Jul 20, 2026",
    lastActive: "11 min ago",
    hours: "Continuous",
    channels: ["Web", "CRM"],
    tools: ["Web", "HTTP API", "Database", "Files"],
    capabilities: ["List building", "Enrichment", "Deduplication", "Police DID"],
    purpose:
      "Source, enrich and deduplicate prospect lists every night so calling never starves.",
    short: "Keeps the lead inventory full, clean and de-duplicated before it reaches Sales.",
    primaryOutcome: "Verified lead records",
    complexity: "Medium",
    capacity: { leadsPerDay: 2000, concurrency: 4 },
    performance: { verification: 92, execution: 97.1 },
    accent: "#7ea6d8",
  },
  {
    slug: "support",
    name: "Lexi Support",
    role: "Customer Support — Inbound",
    code: "LXU",
    seq: "000033",
    status: "working",
    version: "4.0.3",
    owner: "Priya Nair",
    joined: "May 09, 2026",
    lastActive: "now",
    hours: "Continuous (rotating)",
    channels: ["Chat", "Email", "WhatsApp"],
    tools: ["CRM", "Email", "Database", "HTTP API"],
    capabilities: ["Ticket triage", "First response", "Resolution notes"],
    purpose: "Answer inbound support instantly and escalate only what truly needs a human.",
    short: "First-response support employee — answers, resolves routine, escalates edge cases.",
    primaryOutcome: "Tickets resolved in first response",
    complexity: "Medium",
    capacity: { leadsPerDay: 300, concurrency: 24 },
    performance: { verification: 96, execution: 97.8 },
    accent: "#e8763a",
  },
  {
    slug: "marketing",
    name: "Lexi Marketing",
    role: "Campaign Operations",
    code: "LXM",
    seq: "000077",
    status: "ready",
    version: "1.2.0",
    owner: "Aarav Mehta",
    joined: "Sep 18, 2026",
    lastActive: "1 d ago",
    hours: "Not scheduled",
    channels: ["Email", "Social", "Landing pages"],
    tools: ["Email", "Web", "HTTP API", "Files"],
    capabilities: ["Draft campaigns", "Asset variants", "Scheduling"],
    purpose: "Draft and schedule marketing campaigns against the brand book without drift.",
    short: "Builds on-brand campaign variants and schedules them for approval.",
    primaryOutcome: "Approved campaigns shipped",
    complexity: "Medium",
    capacity: { leadsPerDay: 60, concurrency: 2 },
    performance: { verification: 91, execution: 95.2 },
    accent: "#f0a05a",
  },
  {
    slug: "operations",
    name: "Lexi Operations",
    role: "Back-office Operations",
    code: "LXO",
    seq: "000051",
    status: "training",
    version: "0.4.0",
    owner: "Dev Raman",
    joined: "Oct 12, 2026",
    lastActive: "2 h ago",
    hours: "Mon–Fri · 09:00–18:00 IST",
    channels: ["Database", "Files"],
    tools: ["Database", "Files", "HTTP API"],
    capabilities: ["Data entry", "Reconciliation", "Report drafting"],
    purpose: "Run nightly back-office sweeps: reconcile records and draft the morning report.",
    short: "Night-shift back-office employee keeping records reconciled and tidy.",
    primaryOutcome: "Clean ledgers by 09:00",
    complexity: "High",
    capacity: { leadsPerDay: 800, concurrency: 2 },
    performance: { verification: 0, execution: 0 },
    accent: "#66696f",
  },
  {
    slug: "collections",
    name: "Lexi Collections",
    role: "Payment Recovery",
    code: "LXC",
    seq: "000066",
    status: "verification",
    version: "1.0.3",
    owner: "Nagacharan M",
    joined: "Oct 05, 2026",
    lastActive: "35 min ago",
    hours: "Mon–Sat · 10:00–19:00 IST",
    channels: ["Phone (outbound)", "WhatsApp", "SMS"],
    tools: ["Phone", "WhatsApp", "Database"],
    capabilities: ["Reminder calls", "Promise-to-pay scheduling", "Payment links"],
    purpose: "Run polite, compliant payment reminder cycles and schedule promise-to-pays.",
    short: "Reminder call employee for overdue invoices — polite and compliant by design.",
    primaryOutcome: "Promise-to-pays scheduled",
    complexity: "High",
    capacity: { leadsPerDay: 600, concurrency: 40 },
    performance: { verification: 88, execution: 0 },
    accent: "#d95f2b",
  },
  {
    slug: "recruiting",
    name: "Lexi Recruiting",
    role: "Candidate Sourcing",
    code: "LXR",
    seq: "000044",
    status: "paused",
    version: "2.0.1",
    owner: "Priya Nair",
    joined: "Sep 02, 2026",
    lastActive: "3 d ago",
    hours: "Paused",
    channels: ["Email", "Chat"],
    tools: ["Database", "Email", "Calendar", "Files"],
    capabilities: ["Resume screening", "Screen-call scheduling"],
    purpose: "Screen inbound applications and schedule hiring-manager screens.",
    short: "Screens applications overnight and schedules interview screens.",
    primaryOutcome: "Qualified screens booked",
    complexity: "Medium",
    capacity: { leadsPerDay: 200, concurrency: 8 },
    performance: { verification: 95, execution: 96.8 },
    accent: "#9a9da2",
  },
  {
    slug: "analyst",
    name: "Lexi Analyst",
    role: "Business Analyst",
    code: "LXA",
    seq: "000070",
    status: "improving",
    version: "2.2.0",
    owner: "Aarav Mehta",
    joined: "Aug 29, 2026",
    lastActive: "22 min ago",
    hours: "Mon–Fri · 09:00–19:00 IST",
    channels: ["Database", "Reports"],
    tools: ["Database", "Files", "HTTP API"],
    capabilities: ["Cohort cuts", "Funnel audits", "Weekly note"],
    purpose: "Audit the funnel weekly and flag where performance drifts.",
    short: "Reads the receipts — audits funnels and flags drift with an evidence trail.",
    primaryOutcome: "Weekly funnel audit",
    complexity: "High",
    capacity: { leadsPerDay: 0, concurrency: 1 },
    performance: { verification: 89, execution: 94.6 },
    accent: "#101114",
  },
];

export function getEmployee(slug: string) {
  return EMPLOYEES.find((e) => e.slug === slug);
}

export const employeeId = (e: Employee) => `${e.code}-${e.seq}`;

/* ---------------------------------------------------------------- leads */

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: "called" | "connected" | "no-answer" | "busy" | "failed" | "wrong-number";
  outcome: "yes" | "no" | "partial";
  interest: "interested" | "not-interested" | "maybe" | "needs-info" | "callback";
  convinced: boolean;
  confirmed: boolean;
  callback: boolean;
  appointment: boolean;
  escalated: boolean;
  intent: "high" | "med" | "low";
  sentiment: "positive" | "neutral" | "negative";
  duration: number; // seconds
  attempts: number;
  nextAction: string;
  cost: number;
  at: string; // display time (today)
  budget: string;
  requirement: string;
  location: string;
  objection: string; // "" when none
}

const NAMES = [
  "Charan", "Anjali Rao", "Vikram Shetty", "Divya Iyer", "Rahul Verma", "Sneha Kulkarni",
  "Ajay Menon", "Pooja Desai", "Karthik Reddy", "Meera Pillai", "Srk Harsha", "Nisha Agarwal",
  "Tanmay Bose", "Rekha Nambiar", "Yash Chowdhury", "Lakshmi Venkat", "Praveen Kumar",
  "Aarti Trivedi", "Naveen Gowda", "Farah Sheikh", "Deepak Malhotra", "Swati Joshi",
  "Manik Dutta", "Kavya Suresh", "Rohit Bansal", "Ishita Ganguly", "Suresh Babu",
  "Nidhi Saxena", "Omkar Patil", "Bhavna Shah", "Sameer Qureshi", "Ritu Chawla",
  "Arun Thakur", "Gauri Kanitkar", "Vishal Anand", "Shraddha Kapoor-s", "Nikhil Rao",
  "Esha Bhatt", "Aakash Jain", "Padma Rangan", "Mohan Pillai", "Trisha Nandan",
];

const SOURCES = ["Meta Ads", "Website Form", "Referral", "Salesforce Import", "Walk-in Sync"];
const NEXT: Record<string, string> = {
  interested: "Site visit — Green Meadows, Sat 11:00",
  "not-interested": "Archive · do-not-call respected",
  callback: "Callback at 18:30 today",
  maybe: "Send Green Meadows brochure",
  "needs-info": "Email comparison sheet",
};
const LOC = ["Green Meadows", "Lakeview Enclave", "Aster Heights", "Palm Court", "Riverside Phase 2"];
const OBJ = ["price", "timing", "location", "trust", "competitor", "product-fit", ""];

/* exact spec-consistent distribution */
const DIST = [
  { key: "interested", n: 421 },
  { key: "not-interested", n: 263 },
  { key: "callback", n: 183 },
  { key: "needs-info", n: 119 }, // connected pool = 986
  { key: "no-answer", n: 163 },
  { key: "busy", n: 21 },
  { key: "failed", n: 18 },
  { key: "wrong-number", n: 12 }, // unconnected pool = 214
];

let _leads: Lead[] | null = null;

/* The flagship demonstration lead — exactly the record cited on the
   public website and in the spec (CALLED · INTERESTED · CONVINCED ·
   CONFIRMED · 04:18 · ₹2.64 · SITE VISIT). */
const CHARAN: Lead = {
  id: "LD-1000",
  name: "Charan",
  email: "charan@example.in",
  phone: "9273743594",
  source: "Meta Ads",
  status: "called",
  outcome: "yes",
  interest: "interested",
  convinced: true,
  confirmed: true,
  callback: false,
  appointment: true,
  escalated: false,
  intent: "high",
  sentiment: "positive",
  duration: 258,
  attempts: 1,
  nextAction: "Site visit — Green Meadows, Sat 11:00",
  cost: 2.64,
  at: "11:42 AM",
  budget: "₹78–85 L",
  requirement: "3 BHK, near ORR",
  location: "Green Meadows",
  objection: "price",
};

export const LEADS: Lead[] = (_leads ??= (() => {
  const r = mulberry32(4207);
  const pool: Lead[] = [CHARAN];
  const startToday = new Date();
  startToday.setHours(8, 31, 0, 0);
  const seq: string[] = [];
  DIST.forEach((d) => {
    for (let i = 0; i < d.n - 1; i++) seq.push(d.key);
  });
  const order = [...seq];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  /* Charan above already occupies appointment #1 and the convinced slot */
  let appointed = 1;
  let convinced = 1;
  let escalated = 0;
  let atMs = startToday.getTime();

  order.forEach((kind, i) => {
    atMs += Math.round(18 + r() * 44) * 1000;
    const r1 = r();
    const name = NAMES[(i + 1) % NAMES.length] + (i >= NAMES.length - 1 ? ` ${String.fromCharCode(65 + ((i / 8) | 0) % 26)}.` : "");
    const connected = !["no-answer", "busy", "failed", "wrong-number"].includes(kind);
    const appointment =
      (kind === "interested" && appointed < 108) ||
      (kind === "callback" && appointed >= 108 && appointed < 126);
    const convinced2 = appointment && convinced < 94;
    const esc = kind !== "needs-info" && kind !== "wrong-number" && escalated < 37 && r1 > 0.94;
    if (appointment) appointed++;
    if (convinced2) convinced++;
    if (esc) escalated++;

    const duration = connected ? Math.round(45 + r1 * 330) : 0;
    const intent = kind === "interested" ? (r1 > 0.4 ? "high" : "med")
      : kind === "callback" ? (r1 > 0.55 ? "med" : "low")
      : kind === "needs-info" ? "low" : kind === "not-interested" ? (r1 > 0.85 ? "med" : "low") : "low";
    const sentiment = kind === "interested" || appointment ? "positive"
      : kind === "not-interested" ? "negative" : "neutral";

    pool.push({
      id: `LD-${1000 + i + 1}`,
      name,
      email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.in`,
      phone: String(6000000000 + Math.floor(r() * 3000000000)).slice(0, 10).padStart(10, "6"),
      source: SOURCES[Math.floor(r() * SOURCES.length)],
      status: (["called", "connected"].includes(kind) ? "connected"
        : kind === "no-answer" ? "no-answer"
        : kind === "busy" ? "busy"
        : kind === "failed" ? "failed"
        : kind === "wrong-number" ? "wrong-number"
        : "called") as Lead["status"],
      outcome: convinced2 || appointment ? "yes" : kind === "not-interested" ? "no" : "partial",
      interest: (kind === "interested" ? "interested"
        : kind === "not-interested" ? "not-interested"
        : kind === "callback" ? "callback"
        : kind === "needs-info" ? "needs-info" : "maybe") as Lead["interest"],
      convinced: convinced2,
      confirmed: appointment,
      callback: kind === "callback",
      appointment,
      escalated: esc,
      intent: intent as Lead["intent"],
      sentiment: sentiment as Lead["sentiment"],
      duration,
      attempts: connected ? 1 + (r() > 0.82 ? 1 : 0) : 1 + Math.floor(r() * 2),
      nextAction: connected ? NEXT[kind] ?? "Follow-up" : "Retry tomorrow 10:00",
      cost: Math.round((1.6 + r() * 2.4) * 100) / 100,
      at: tod(new Date(atMs)),
      budget: appointment || kind === "interested"
        ? `₹${55 + Math.floor(r() * 30)}–${75 + Math.floor(r() * 30)} L`
        : kind === "callback" ? "₹50–60 L" : "Unstated",
      requirement: appointment || kind === "interested"
        ? `${["2 BHK", "3 BHK", "Row house", "3 BHK + study"][(i + (name.length % 2)) % 4]}, near ORR`
        : kind === "callback" ? "3 BHK, second visit" : "Unstated",
      location: appointment || kind === "interested" ? LOC[(i * 3) % LOC.length] : "Unstated",
      objection: appointment ? OBJ[i % 6] : OBJ[i % OBJ.length],
    });
  });
  return pool;
})());

/* thin structured exports so the UI never computes these twice */

const by = (p: (l: Lead) => boolean) => LEADS.filter(p);
export const OUTCOMES = {
  leads: LEADS.length,
  attempted: LEADS.length,
  completed: LEADS.length - 14,
  connected: by((l) => l.duration > 0 || l.interest !== "maybe").length,
  interested: by((l) => l.interest === "interested").length,
  notInterested: by((l) => l.interest === "not-interested").length,
  callbackLeads: by((l) => l.interest === "callback").length,
  maybe: by((l) => l.interest === "maybe").length,
  convinced: by((l) => l.convinced).length,
  confirmed: by((l) => l.confirmed).length,
  appointment: by((l) => l.appointment).length,
  escalated: by((l) => l.escalated).length,
  noAnswer: by((l) => l.status === "no-answer").length,
  wrong: by((l) => l.status === "wrong-number").length,
  busy: by((l) => l.status === "busy").length,
  failed: by((l) => l.status === "failed").length,
  calls: 1186,
  hours: 19.2,
};

export const VOICE_TODAY = {
  leads: OUTCOMES.leads,
  calls: 1186,
  connected: 986,
  interested: OUTCOMES.interested,
  callbacks: OUTCOMES.callbackLeads,
  convinced: OUTCOMES.convinced,
  confirmed: OUTCOMES.confirmed,
  appointments: 94,
  escalated: OUTCOMES.escalated,
};

export function getLead(id: string) {
  const n = parseInt(id.replace(/[^\d]/g, ""), 10);
  return LEADS.find((l) => l.id === `LD-${n}`);
}

/* ---------------------------------------------------------------- calls */

export interface Call {
  id: string;
  lead: Lead;
  start: string;
  end: string;
  duration: number;
  attempt: number;
  connection: "connected" | "no answer" | "busy" | "failed" | "wrong number";
  summary: string;
  objections: string[];
  outcome: string;
  tools: string[];
  crm: string[];
  nextAction: string;
  transcript: { who: "AI" | "Customer"; t: number; text: string }[];
  executions: number;
  model: string;
}

let _calls: Call[] | null = null;

export function getCall(id: string) {
  return CALLS.find((c) => c.id === id);
}
export function callForLead(leadId: string) {
  return CALLS.find((c) => c.lead.id === leadId) ?? buildCall(getLead(leadId)!);
}

const SUMMARIES = [
  "Prospect confirmed 3 BHK requirement at Green Meadows, objected once on price, agreed to a Saturday site visit.",
  "Asked for a callback after work; request recorded and scheduled for this evening.",
  "Not in the market — asked to preserve number for future phases. Marked do-not-call for campaigns.",
  "Requested brochure by WhatsApp before committing; brochure sent, follow-up scheduled.",
];
const OBJECTIONS_PHRASE = {
  price: "“The price looks above my budget”",
  timing: "“I plan to buy next year, not now”",
  location: "“I wanted something closer to the office”",
  trust: "“How do I know the project will finish on time?”",
  competitor: "“I am also looking at Aster Heights”",
  "product-fit": "“I need a bigger configuration”",
  "": "",
} as const;

function buildCall(l: Lead): Call {
  const r = mulberry32((parseInt(l.id.replace(/\D/g, ""), 10) % 100000) || 7);
  const start = l.at || "08:31 AM";
  const end = (() => {
    const st = new Date(new Date().setHours(8, 31, 0, 0));
    st.setSeconds(st.getSeconds() + l.duration);
    return tod(st);
  })();
  const first = l.name.split(" ")[0];
  const transcript: Call["transcript"] = [];

  if (l.interest === "interested" || l.appointment) {
    transcript.push(
      { who: "AI", t: 2, text: `Hi, am I speaking with ${l.name}? This is Lexi calling on behalf of Nova Realty about your enquiry for Green Meadows.` },
      { who: "Customer", t: 12, text: "Yes, speaking. What about it?" },
      { who: "AI", t: 18, text: "Thank you for your enquiry. You had shown interest in a 3 BHK near ORR. Is that still the requirement?" },
      { who: "Customer", t: 34, text: "Yes. What's the rate there now?" },
      { who: "AI", t: 41, text: "Green Meadows starts at ₹1.19 Cr for the standard 3 BHK configuration. With early-stage pricing applicable this month, effective rate begins at ₹1.09 Cr." },
      { who: "Customer", t: 66, text: "That's still quite high for me. Budget is around 80 lakhs." },
      { who: "AI", t: 73, text: `I understand, ${first}. For budget in the range of ₹78–85 L, Riverside Phase 2 has rows starting at ₹81 L with possession in 2027. Would you like me to schedule a visit there instead?` },
      { who: "Customer", t: 103, text: "Riverside? How far from ORR?" },
      { who: "AI", t: 109, text: "About 6 minutes from the ORR exit, next to the metro feeder stop. I can reserve a slot this Saturday — 11 in the morning or 4 in the evening?" },
      { who: "Customer", t: 131, text: "11 works. Saturday it is." },
      { who: "AI", t: 138, text: "Booked. I have sent the confirmation to your WhatsApp and marked the visit for Saturday, 11:00 AM. Anything else I can help with?" },
      { who: "Customer", t: 150, text: "No, that's all. Thank you." },
      { who: "AI", t: 156, text: "Thank you for your time. See you at the site visit." },
    );
  } else if (l.interest === "callback") {
    transcript.push(
      { who: "AI", t: 3, text: `Hi ${l.name}! Am I calling now, or would a different time be better? This is Lexi calling on behalf of Nova Realty.` },
      { who: "Customer", t: 15, text: "I'm in the middle of work or something. Call me back after 6." },
      { who: "AI", t: 22, text: "Of course. May I set a reminder for this evening at 6:30?" },
      { who: "Customer", t: 40, text: "Sure, 6:30 is fine." },
      { who: "AI", t: 47, text: "Noted — callback recorded for 6:30 today. You'll get a WhatsApp reminder 30 minutes before. Thank you!" },
    );
  } else if (l.interest === "not-interested") {
    transcript.push(
      { who: "AI", t: 3, text: `Hi ${first}! This is Lexi calling from Nova Realty about your enquiry. Is this a good time for one quick question?` },
      { who: "Customer", t: 18, text: "I'm not really looking anymore. Cancel my enquiry." },
      { who: "AI", t: 26, text: "Understood — I'll mark your enquiry closed and suppress future calls. One question: if a new phase comes up closer to your budget, can I reach out?" },
      { who: "Customer", t: 51, text: "No, please don't call again." },
      { who: "AI", t: 59, text: "Absolutely — do-not-contact honoured immediately. Sorry for calling; have a good day." },
    );
  } else {
    transcript.push(
      { who: "AI", t: 3, text: `Hi, is this ${l.name}? This is Lexi from Nova Realty.` },
      { who: "Customer", t: 17, text: "Yes, tell me." },
      { who: "AI", t: 24, text: "You had enquired about Green Meadows. Before sharing details — what's your preferred configuration and budget?" },
      { who: "Customer", t: 47, text: "2 BHK, 80–90 but need to check loan options first." },
      { who: "AI", t: 55, text: "I'll send a comparison sheet to your email with configurations and EMI options. Would that help you decide?" },
      { who: "Customer", t: 79, text: "Yes, that works." },
      { who: "AI", t: 86, text: "Sending it shortly. I'll follow up in 2 days. Thanks for the time!" },
    );
  }

  const objections = l.objection ? [OBJECTIONS_PHRASE[l.objection as keyof typeof OBJECTIONS_PHRASE] || l.objection] : [];
  const outcome = l.confirmed ? "Appointment Confirmed" : l.appointment ? "Appointment Booked" : l.convinced ? "Convinced" : !l.duration ? "Not Connected" : l.interest === "not-interested" ? "Not a Fit" : l.interest === "callback" ? "Callback Scheduled" : l.interest === "needs-info" ? "Info Sent" : "Follow-up Required";

  return {
    id: `CL-${1000 + parseInt(l.id.replace(/\D/g, ""), 10)}`,
    lead: l,
    start,
    end,
    duration: l.duration,
    attempt: l.attempts,
    connection: l.duration > 0 ? "connected" : l.status === "failed" ? "failed" : l.status === "busy" ? "busy" : l.status === "wrong-number" ? "wrong number" : "no answer",
    summary: SUMMARIES[(l.id.length + parseInt(l.id.slice(-2), 10)) % SUMMARIES.length],
    objections,
    outcome,
    tools: l.duration > 0 ? ["Fleen Voice Gateway", "CRM", l.appointment ? "Google Calendar" : "", l.appointment || l.interest === "needs-info" ? "Email" : "", "WhatsApp"].filter(Boolean) : ["Fleen Voice Gateway"],
    crm: l.duration > 0 ? ["Nova Realty — enquiry status updated", l.appointment ? "Site visit event created" : "Next action recorded"] : ["Attempt logged"],
    nextAction: l.nextAction,
    transcript,
    executions: 14 + Math.floor(r() * 26),
    model: "lexi-sales-v2.4.1",
  };
}

/* materialised after buildCall + its phrase tables (declaration order keeps TDZ happy) */
export const CALLS: Call[] = (_calls ??= LEADS.filter((l) => l.duration > 0).slice(0, 240).map((l) => buildCall(l)));

/* ---------------------------------------------------------------- trace */

export interface TraceNode {
  label: string;
  at: string;
  input: string;
  decision: string;
  tool: string;
  result: string;
  validation: string;
  duration: number;
  state: "done" | "info" | "blocked" | "alert";
}

const NODE_LABELS = [
  "LEAD RECEIVED", "CONTEXT LOADED", "CUSTOMER IDENTIFIED", "CALL INITIATED",
  "CUSTOMER CONNECTED", "REQUIREMENT DETECTED", "BUDGET DETECTED", "OBJECTION DETECTED",
  "RESPONSE GENERATED", "OBJECTION HANDLED", "INTENT CLASSIFIED", "CUSTOMER CONFIRMED",
  "CALENDAR CHECKED", "APPOINTMENT BOOKED", "CRM UPDATED", "OUTCOME RECORDED",
];

export function getTrace(l: Lead): TraceNode[] {
  const base = new Date(new Date().setHours(11, 42, 0, 0)).getTime();
  const at = (m: number) => tod(new Date(base + m * 1000));
  const connected = l.duration > 0;
  const nodes: string[] = NODE_LABELS;
  const out: TraceNode[] = [];
  const push = (i: number, d: string, inp: string, tool: string, res: string, val: string, dur: number, state: TraceNode["state"]) => {
    out.push({ label: nodes[i], at: at(i * 7), input: inp, decision: d, tool, result: res, validation: val, duration: dur, state });
  };
  push(0, "Fleet router → Voice Sales", "Meta Ads lead LD-1007", "Router", "Routing ticket created", "Route passed", 12, "done");
  push(1, "Load lead-context pack", "Lead, source, history, pricing sheet v4", "Knowledge", "Context pack built (847 sections available)", "Freshness ok", 240, "done");
  push(2, "Identity + suppression check", "Phone 9273••••94", "Database", "Customer matched, do-not-contact clear", "DNC clear", 180, "done");
  push(3, "Dial via Fleen Voice Gateway", l.phone, "Phone", connected ? "Ringing" : l.status === "busy" ? "Busy" : l.status === "wrong-number" ? "Invalid number" : "Not picked", "Gateway ack ok", connected ? 2600 : 5200, connected ? "done" : "alert");
  if (!connected) {
    push(4, "No connection — schedule retry", `${nodes[4]} failed`, "Router", `Retry scheduled (${l.nextAction})`, "Retry guard passed", 90, "info");
    push(15, "Outcome recorded", "Attempt logged; no outcome", "Ledger", "Outcome: Not Connected", "Ledger committed", 40, "done");
    return out;
  }
  push(4, "Connection established", "Customer picked up", "Phone", "Connected", "Gateway ack ok", 1400, "done");
  push(5, "Classify requirement", `"${l.requirement}"`, "LLM", "Requirement classified as high confidence", "Schema valid", 380, "done");
  push(6, "Classify budget", `"${l.budget}"`, "LLM", "Budget bucket derived from policy (no invented pricing)", "Pricing guard passed", 410, "done");
  push(7, "Classify objections", l.objection ? OBJECTIONS_PHRASE[l.objection as keyof typeof OBJECTIONS_PHRASE] : "None detected", "LLM", l.objection ? `Objection: ${l.objection}` : "No objections", "Schema valid", 220, "info");
  push(8, "Compose reply against policy", "Pricing sheet v4 · scripts v9", "LLM", "Response composed — no fabricated promises", "No-invention check passed", 620, "done");
  push(9, `Handle objection`, l.objection || "n/a", "LLM", l.objection && l.interest !== "not-interested" ? "Objection handled per handbook" : "Not required", "Tone check passed", 510, l.objection ? "done" : "info");
  push(10, "Final intent classification", `Interest: ${l.interest}`, "LLM", `Intent: ${l.intent.toUpperCase()}`, "Schema valid", 190, "done");
  if (l.confirmed) {
    push(11, "Explicit confirmation received", "“11 works. Saturday it is.”", "LLM", "Customer confirmed", "Confirmation recorded", 300, "done");
    push(12, "Check calendar availability", "Sat 11:00 slot", "Google Calendar", "Slot free", "Slot-lock ok", 350, "done");
    push(13, "Create appointment", "Sat 11:00 · Riverside Phase 2", "Google Calendar", "Appointment created for Nova Realty", "Calendar write ok", 480, "done");
  } else {
    push(11, "Pursue commitment", "Commitment not reached", "LLM", `Next step: ${l.nextAction}`, "Policy ok", 260, "info");
    push(12, "Calendar not touched", "No booking", "—", "Skipped", "—", 0, "info");
    push(13, "No appointment", "—", "—", "Skipped", "—", 0, "info");
  }
  push(14, "Sync lead + outcome to CRM", `Nova Realty CRM`, "CRM", l.duration > 0 ? "Enquiry updated; task created" : "Attempt logged", "CRM write ok", 430, "done");
  push(15, "Commit outcome to ledger", `${l.interest}`, "Ledger", "Outcome committed · cost ₹" + l.cost.toFixed(2), "Ledger committed", 60, "done");
  return out;
}

/* ---------------------------------------------------------------- work */

export interface WorkItem {
  id: string;
  lead?: string;
  input: string;
  step: string;
  status: "working" | "queued" | "completed" | "failed" | "approval" | "escalated";
  started: string;
  duration: number; // seconds so far or total
  outcome?: string;
}

export const WORK_ITEMS: WorkItem[] = [
  { id: "WK-10241", input: "Meta Ads · LD-1742 Vikram Shetty", step: "Session 2 — qualifying requirement", status: "working", started: "2 min ago", duration: 47 },
  { id: "WK-10242", input: "Website Form · LD-1743 Esha Bhatt", step: "Dialing · attempt 1", status: "working", started: "1 min ago", duration: 22 },
  { id: "WK-10243", input: "Referral · LD-1731 Padma Rangan", step: "Awaiting approval — WhatsApp discount offer", status: "approval", started: "4 min ago", duration: 236 },
  { id: "WK-10231", input: "Meta Ads · LD-1708 Arun Thakur", step: "Completed — appointment booked", status: "completed", started: "09:58", duration: 384, outcome: "Appointment · Sat 11:00" },
  { id: "WK-10227", input: "Salesforce Import · LD-1699 Nikhil Rao", step: "Completed — callback scheduled", status: "completed", started: "09:52", duration: 198, outcome: "Callback · 18:30 today" },
  { id: "WK-10219", input: "Meta Ads · LD-1688 Rohit Bansal", step: "Completed — no answer", status: "completed", started: "09:44", duration: 46, outcome: "Retry tomorrow" },
  { id: "WK-10205", input: "Referral · LD-1678 Yash Chowdhury", step: "Meta escalation — customer in queue for human", status: "escalated", started: "09:31", duration: 612, outcome: "Human to call back" },
  { id: "WK-10191", input: "Website Form · LD-1655 Kavya Suresh", step: "Failed — gateway returned busy", status: "failed", started: "09:12", duration: 40, outcome: "Retry queued" },
  { id: "WK-10102", input: "Walk-in Sync · LD-1588 Trisha Nandan", step: "Queued — waiting for the dialing window", status: "queued", started: "—", duration: 0 },
  { id: "WK-10103", input: "Meta Ads · Milton D'Souza new lead", step: "Queued — position 41", status: "queued", started: "—", duration: 0 },
];

export const RUNS_TODAY = {
  working: 2, queued: 312, completed: 809, failed: 11, approval: 1, escalated: 5,
};

/* ---------------------------------------------------------------- verify */

export interface VerifyTest {
  name: string;
  group: string;
  state: "pass" | "fail" | "warning" | "not-run";
  note: string;
}

export const TESTS: VerifyTest[] = [
  { name: "Interested customer", group: "Outcome correctness", state: "pass", note: "Books visit without invented promises" },
  { name: "Not interested", group: "Escalation", state: "pass", note: "Accepts no gracefully · DNC suppress honoured" },
  { name: "Price objection", group: "Policy compliance", state: "pass", note: "Responds from pricing sheet v4 only" },
  { name: "Timing objection", group: "Outcome correctness", state: "pass", note: "Offers callback flow per rule" },
  { name: "Wrong number", group: "Tool correctness", state: "pass", note: "Marks record invalid · no retry same day" },
  { name: "No answer", group: "Escalation", state: "pass", note: "Retry scheduled within window" },
  { name: "Callback request", group: "Outcome correctness", state: "pass", note: "Reminder created 30 min before" },
  { name: "Angry customer", group: "Escalation", state: "pass", note: "Stays polite · warm transfer queue engages" },
  { name: "Unsupported question", group: "Knowledge accuracy", state: "pass", note: "Says 'I will check with the team' — no invention" },
  { name: "Human escalation", group: "Escalation", state: "pass", note: "Context pack hands over in 37s" },
  { name: "Appointment booking", group: "Tool correctness", state: "pass", note: "Calendar slot locked · WhatsApp confirm sent" },
  { name: "CRM update", group: "Tool correctness", state: "pass", note: "All fields mapped correctly" },
];

/*
   Verification score — NOT an arbitrary AI score.
   Each category runs its own measured basis (test suite pass-rate,
   tool telemetry, sampling). Scored out of its weight, summed to 100.
*/
export const VERIFY_CATEGORIES = [
  { name: "Knowledge accuracy", weight: 15, score: 100, basis: "12-source sampling · 120 answer checks · zero invented facts" },
  { name: "Tool correctness", weight: 15, score: 94, basis: "31 live hot-path calls · 2 booking field mismatches in sandbox" },
  { name: "Policy compliance", weight: 20, score: 100, basis: "No-invention & DNC suppression guards · 40 adversarial probes" },
  { name: "Outcome correctness", weight: 20, score: 100, basis: "Outcome ledger audit — 60 sampled calls matched verdicts" },
  { name: "Escalation correctness", weight: 15, score: 87, basis: "Evaluation runs EV-0087 — escalation timing above threshold" },
  { name: "Execution reliability", weight: 15, score: 80, basis: "Live 14-day telemetry — retry SLO exceeded on 2 windows" },
];

export const VERIFY_SCORE = VERIFY_CATEGORIES.reduce((a, c) => a + Math.round((c.score / 100) * c.weight), 0);
export const VERIFY_TOTAL = VERIFY_CATEGORIES.reduce((a, c) => a + c.weight, 0);

/* ---------------------------------------------------------------- knowledge */

export interface KnowledgeSource {
  name: string;
  type: "PDF" | "DOCX" | "TXT" | "CSV" | "URL" | "FAQ";
  sections: number;
  coverage: number;
  updated: string;
  status: "indexed" | "processing" | "stale";
}

export const KNOWLEDGE: KnowledgeSource[] = [
  { name: "Nova Realty — Pricing Sheet v4", type: "PDF", sections: 84, coverage: 100, updated: "2 d ago", status: "indexed" },
  { name: "Green Meadows brochure", type: "PDF", sections: 62, coverage: 96, updated: "5 d ago", status: "indexed" },
  { name: "Riverside Phase 2 brochure", type: "PDF", sections: 58, coverage: 94, updated: "5 d ago", status: "indexed" },
  { name: "Aster Heights brochure", type: "PDF", sections: 55, coverage: 88, updated: "21 d ago", status: "stale" },
  { name: "Objection handbook v3", type: "DOCX", sections: 118, coverage: 100, updated: "1 d ago", status: "indexed" },
  { name: "Call scripts — voice sales v9", type: "DOCX", sections: 96, coverage: 100, updated: "1 d ago", status: "indexed" },
  { name: "Booking & EMI FAQ", type: "FAQ", sections: 126, coverage: 95, updated: "3 d ago", status: "indexed" },
  { name: "Home loan partner sheet", type: "CSV", sections: 34, coverage: 82, updated: "9 d ago", status: "indexed" },
  { name: "Site visit guidelines", type: "TXT", sections: 41, coverage: 100, updated: "6 d ago", status: "indexed" },
  { name: "Qualification policy v2", type: "DOCX", sections: 77, coverage: 100, updated: "2 d ago", status: "indexed" },
  { name: "nova-nova-realty.com/projects (sitemap)", type: "URL", sections: 65, coverage: 71, updated: "13 d ago", status: "indexed" },
  { name: "Refund & cancellation policy (draft)", type: "PDF", sections: 31, coverage: 38, updated: "30 d ago", status: "processing" },
];

export const KNOWLEDGE_TOTAL = { sources: 12, sections: 847, faqs: 126, coverage: 91 };
export const KNOWLEDGE_GAPS = ["Pricing — variant sheet incomplete", "Product variants — Aster heights", "Refund policy — draft unindexed"];

/* ---------------------------------------------------------------- tools */

export interface ToolRow {
  name: string;
  kind: string;
  connected: boolean;
  permission: string;
  lastUsed: string;
  success: number | null;
  calls: string;
}

export const TOOLS: ToolRow[] = [
  { name: "Phone (Fleen Voice Gateway)", kind: "Outbound voice", connected: true, permission: "Call", lastUsed: "now", success: 97.2, calls: "69,208" },
  { name: "WhatsApp Business", kind: "Messaging", connected: true, permission: "Send", lastUsed: "3 min ago", success: 99.1, calls: "1,884" },
  { name: "Email (workspace SMTP)", kind: "Messaging", connected: true, permission: "Send", lastUsed: "11 min ago", success: 98.6, calls: "427" },
  { name: "CRM — Nova Realty", kind: "CRM", connected: true, permission: "Read · Create · Update", lastUsed: "now", success: 96.4, calls: "2,410" },
  { name: "Google Calendar", kind: "Calendar", connected: true, permission: "Read · Book", lastUsed: "22 min ago", success: 97.9, calls: "198" },
  { name: "Web", kind: "Research", connected: true, permission: "Read", lastUsed: "1 h ago", success: 92.5, calls: "1,203" },
  { name: "PostgreSQL — leads", kind: "Database", connected: true, permission: "Read · Update", lastUsed: "now", success: 99.4, calls: "3,774" },
  { name: "HTTP API", kind: "Internal", connected: true, permission: "Configured", lastUsed: "5 h ago", success: 94.8, calls: "88" },
  { name: "Files", kind: "Documents", connected: false, permission: "Not configured", lastUsed: "—", success: null, calls: "—" },
];

/* ---------------------------------------------------------------- integrations */

export type IntegrationState = "connected" | "disconnected" | "error";
export interface Integration {
  name: string;
  category: "CRM" | "Communication" | "Marketing" | "Calendar" | "Data" | "Payments" | "Internal";
  blurb: string;
  state: IntegrationState;
  permissions: string[];
  detail: string;
}

export const INTEGRATIONS: Integration[] = [
  { name: "Zoho CRM", category: "CRM", blurb: "Leads & pipeline sync", state: "connected", permissions: ["read", "create", "update"], detail: "166 records updated today" },
  { name: "HubSpot", category: "CRM", blurb: "Contact sync + lifecycle stages", state: "disconnected", permissions: ["read", "create", "update", "delete"], detail: "" },
  { name: "Salesforce", category: "CRM", blurb: "Enterprise CRM — import mode", state: "error", permissions: ["read", "create"], detail: "Token expired — refresh required" },
  { name: "WhatsApp Business Cloud API", category: "Communication", blurb: "Official WhatsApp channel", state: "connected", permissions: ["send"], detail: "1,884 messages today" },
  { name: "Twilio Voice", category: "Communication", blurb: "Alternative voice gateway", state: "disconnected", permissions: ["call"], detail: "" },
  { name: "Fleen Voice Gateway", category: "Internal", blurb: "Primary voice runtime — no vendor lock-in", state: "connected", permissions: ["call"], detail: "69,208 calls · 97.2% success" },
  { name: "Meta Lead Ads", category: "Marketing", blurb: "Instant lead ingestion", state: "connected", permissions: ["read"], detail: "502 leads today" },
  { name: "Google Calendar", category: "Calendar", blurb: "Site visit scheduling", state: "connected", permissions: ["read", "create"], detail: "94 appointments" },
  { name: "Gmail", category: "Communication", blurb: "Email channel via SMTP", state: "connected", permissions: ["send"], detail: "427 emails today" },
  { name: "Slack", category: "Internal", blurb: "Escalation alerts to #lexi-ops", state: "connected", permissions: ["send"], detail: "23 escalations routed" },
  { name: "Razorpay", category: "Payments", blurb: "Collect booking amounts", state: "disconnected", permissions: ["create"], detail: "" },
  { name: "Custom API", category: "Data", blurb: "Call any REST endpoint as a tool", state: "disconnected", permissions: ["configure"], detail: "" },
];

/* ---------------------------------------------------------------- workflow */

export type NodeKind = "trigger" | "ai" | "condition" | "tool" | "action" | "approval" | "wait" | "webhook" | "end";
export interface FlowNode {
  id: string;
  kind: NodeKind;
  title: string;
  config: Record<string, string>;
  on?: string;
}

export const WORKFLOW_VOICES: FlowNode[] = [
  { id: "n1", kind: "trigger", title: "META LEAD RECEIVED", config: { Source: "Meta Lead Ads", "Route to": "Voice Sales", SLA: "Call within 60s" } },
  { id: "n2", kind: "tool", title: "CREATE CRM RECORD", config: { Tool: "CRM", Action: "Create lead", Duplicate: "Merge by phone" } },
  { id: "n3", kind: "ai", title: "CALL LEAD", config: { Employee: "Voice Sales", Attempt: "1", Window: "09:00–21:00" } },
  { id: "n4", kind: "ai", title: "QUALIFY", config: { Signals: "Requirement · Budget · Timeline", Output: "intent + disposition" } },
  { id: "n5", kind: "condition", title: "INTERESTED?", config: { "If interested": "continue", Else: "logger.send ('Not interested')" } },
  { id: "n6", kind: "ai", title: "HANDLE OBJECTION", config: { Only: "if objection > 0", Source: "Handbook v3", Guard: "no invented pricing" } },
  { id: "n7", kind: "condition", title: "HIGH INTENT?", config: { Model: "lexi-sales-v2.4.1", Threshold: "0.72", Else: "callback flow" } },
  { id: "n8", kind: "tool", title: "BOOK APPOINTMENT", config: { Tool: "Google Calendar", Calendar: "Nova Realty — site visits", Confirm: "WhatsApp" } },
  { id: "n9", kind: "tool", title: "UPDATE CRM", config: { Tool: "CRM", Fields: "status · next action · notes" } },
  { id: "n10", kind: "end", title: "END", config: { Outcome: "recorded to ledger" } },
];
export const WORKFLOW_CALLBACK: FlowNode[] = [
  { id: "c1", kind: "condition", title: "HIGH INTENT? — ELSE", config: { Else: "callback flow" } },
  { id: "c2", kind: "wait", title: "WAIT", config: { Until: "18:30 IST today", "Max wait": "24 h" } },
  { id: "c3", kind: "tool", title: "CALL LEAD", config: { Tool: "Phone", Attempt: "2 of 3" } },
  { id: "c4", kind: "ai", title: "QUALIFY AGAIN", config: { Signals: "Budget · Urgency", Note: "Skip intro — context carried" } },
  { id: "c5", kind: "end", title: "END", config: { Outcome: "recorded to ledger" } },
];

/* ---------------------------------------------------------------- permissions */

export interface PermissionRow {
  action: string;
  state: "allowed" | "approval" | "blocked";
  scope: string;
  consequence: string;
}

export const PERMISSIONS: PermissionRow[] = [
  { action: "Read", state: "allowed", scope: "Leads · CRM · Calendar · Knowledge", consequence: "Employee can view all workspace records it is assigned." },
  { action: "Create", state: "allowed", scope: "CRM records · Calendar events · Notes", consequence: "Creates are signed with the employee ID and traced." },
  { action: "Update", state: "allowed", scope: "Lead stage · Next action · Notes", consequence: "Never edits amounts or tenure owned by humans." },
  { action: "Delete", state: "blocked", scope: "—", consequence: "Employees never delete records. Deletion is human-only." },
  { action: "Send", state: "allowed", scope: "WhatsApp · SMS · Email", consequence: "Templates are pre-approved; edits require approval." },
  { action: "Call", state: "allowed", scope: "Outbound · Work hours 09:00–21:00", consequence: "Respects DNC and retry caps automatically." },
  { action: "Book", state: "allowed", scope: "Site-visit calendar slots", consequence: "Only 2 calendar types; slot-lock validated." },
  { action: "Publish", state: "blocked", scope: "—", consequence: "No public publishing rights. Marketing employee only, after approval." },
  { action: "Spend", state: "approval", scope: "Discounts up to 15% · refunds up to ₹5,000", consequence: "Above limits require explicit human approval." },
  { action: "Escalate", state: "allowed", scope: "Human queue · Slack #lexi-ops", consequence: "Warm transfer with full context pack." },
];

/* ---------------------------------------------------------------- versions */

export interface VersionRow {
  v: string;
  date: string;
  deployed: string;
  score: number;
  changes: string[];
  production?: number;
}

export const VERSIONS: VersionRow[] = [
  { v: "2.4.1", date: "Oct 21, 2026", deployed: "Production", score: 94, changes: ["Rebalanced callback tone", "Retry cap: 3/day", "Cheaper response model for greeting"], production: 96.4 },
  { v: "2.4.0", date: "Oct 14, 2026", deployed: "Sandbox", score: 92, changes: ["Objection handbook v3", "New pricing sheet guard", "WhatsApp confirmations"] },
  { v: "2.2.0", date: "Sep 27, 2026", deployed: "Archived", score: 89, changes: ["Slot-lock validated booking", "Ledger cost tracking"] },
  { v: "2.0.0", date: "Sep 02, 2026", deployed: "Archived", score: 84, changes: ["First Fleen-only voice stack", "Policy validation layer"], production: 91.2 },
  { v: "1.0.0", date: "Aug 14, 2026", deployed: "Archived", score: 71, changes: ["Initial hire — scripts v1"] },
];

/* ---------------------------------------------------------------- evaluations */

export interface EvalRun {
  id: string;
  suite: string;
  date: string;
  cases: number;
  pass: number;
  fail: number;
  warning: number;
  score: number;
  version: string;
}

export const EVAL_RUNS: EvalRun[] = [
  { id: "EV-0087", suite: "Release gate — v2.4.1", date: "Oct 21, 09:12", cases: 120, pass: 112, fail: 2, warning: 6, score: 94, version: "2.4.1" },
  { id: "EV-0079", suite: "Regression — knowledge v4", date: "Oct 19, 17:40", cases: 120, pass: 109, fail: 3, warning: 8, score: 92, version: "2.4.0" },
  { id: "EV-0062", suite: "Policy compliance sweep", date: "Oct 10, 11:05", cases: 118, pass: 105, fail: 2, warning: 11, score: 89, version: "2.2.0" },
];

export const EVAL_FAILURES = [
  { case: "TC-0142", name: "Angry customer — slow escalation", severity: "warning", fix: "Raise escalation threshold; re-run TC group 14" },
  { case: "TC-0159", name: "Refund question — reads draft policy", severity: "fail", fix: "Finish refund policy indexing (source 12)" },
  { case: "TC-0163", name: "Loan FAQ — miss on SBI rates", severity: "warning", fix: "Refresh home loan partner sheet" },
];

/* ---------------------------------------------------------------- team */

export interface Member {
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Builder" | "Operator" | "Viewer";
  status: "Active" | "Invited";
  lastSeen: string;
}

export const TEAM: Member[] = [
  { name: "Nagacharan", email: "workforce@lexilabs.ai", role: "Owner", status: "Active", lastSeen: "now" },
  { name: "Aarav Mehta", email: "aarav@novarealty.in", role: "Admin", status: "Active", lastSeen: "6 min ago" },
  { name: "Priya Nair", email: "priya@novarealty.in", role: "Builder", status: "Active", lastSeen: "1 h ago" },
  { name: "Dev Raman", email: "dev@novarealty.in", role: "Operator", status: "Active", lastSeen: "2 h ago" },
  { name: "Sana Qureshi", email: "sana@novarealty.in", role: "Viewer", status: "Active", lastSeen: "Yesterday" },
  { name: "V Krishnan", email: "krishnan@novarealty.in", role: "Admin", status: "Invited", lastSeen: "—" },
];

/* ---------------------------------------------------------------- billing */

export const PLANS = [
  { id: "starter", name: "Starter", price: 24999, employees: 1, voiceMinutes: 20000, blurb: "One employee, one workload." },
  { id: "growth", name: "Growth", price: 59999, employees: 3, voiceMinutes: 180000, blurb: "A working team with shared knowledge." },
  { id: "workforce", name: "Workforce", price: 149999, employees: 9, voiceMinutes: 999999, blurb: "Full department. Custom deployment." },
];

export const PRICING = {
  plans: PLANS,
  onetimeDeployment: 150000,
  voicePerMinute: 0.62,
  llmPerMillionTokens: 14, // ₹ per 1M tokens, blended
  apiPerThousandCalls: 9,
  applianceNote: "Third-party API usage is passed through at provider cost.",
};

export const USAGE = {
  period: "Oct 01 – Oct 23",
  plan: "Growth",
  employees: 5,
  seats: 3,
  voiceMinutesUsed: 121050,
  voiceMinutesQuota: 180000,
  llmTokensUsed: 47.2, // millions
  apiCallsUsed: 748,
  invoices: [
    { id: "INV-2026-10", period: "Oct 2026", amount: 59999, status: "Open", date: "—", note: "Estimated ₹1,03,128 incl. usage — billed Nov 01" },
    { id: "INV-2026-09", period: "Sep 2026", amount: 82410, status: "Paid", date: "Oct 01", note: "Growth + voice overage" },
    { id: "INV-2026-08", period: "Aug 2026", amount: 77985, status: "Paid", date: "Sep 01" },
    { id: "INV-2026-07", period: "Jul 2026", amount: 24999, status: "Paid", date: "Aug 01" },
  ],
};

/* ---------------------------------------------------------------- approvals */

export interface Approval {
  id: string;
  action: string;
  employee: string;
  reason: string;
  context: string[];
  requested: string;
  severity: "routine" | "sensitive";
}

export const APPROVALS: Approval[] = [
  { id: "AP-0231", action: "Send discount of 15%", employee: "Lexi Voice Sales", reason: "Customer requested price reduction.", context: ["Lead LD-1731 · Padma Rangan", "Budget ₹80–85 L · Green Meadows 3 BHK", "Policy allows ≤ 15% with approval"], requested: "4 min ago", severity: "routine" },
  { id: "AP-0230", action: "Send price list to external email", employee: "Lexi Sales", reason: "Prospect asked for PDF on personal Gmail.", context: ["Addresses outside company domain", "Attachment: pricing sheet v4"], requested: "18 min ago", severity: "sensitive" },
  { id: "AP-0227", action: "Book visitor for Sunday slot", employee: "Lexi Voice Sales", reason: "Slot outside approved visit window.", context: ["Site visits policy: Mon–Sat", "Customer insisted Sunday"], requested: "32 min ago", severity: "routine" },
  { id: "AP-0226", action: "Refund ₹4,200 registration gap", employee: "Lexi Operations", reason: "Duplicate payment detected on LD-1640.", context: ["Payment txn #88213 paid twice", "Rule: refunds ≤ ₹5,000 with approval"], requested: "1 h ago", severity: "sensitive" },
  { id: "AP-0222", action: "Call customer again in cooling period", employee: "Lexi Collections", reason: "Customer hung up twice; window rule says wait 24h.", context: ["Cooling rule violated unless approved", "DNC-lite flag set"], requested: "2 h ago", severity: "sensitive" },
];

/* ---------------------------------------------------------------- activity */

export interface ActivityEvent {
  at: string;
  who: string;
  kind: string;
  text: string;
}

export const ACTIVITY: ActivityEvent[] = [
  { at: "11:42:0", who: "Voice Sales", kind: "Outcome", text: "LD-1007 Charan — appointment booked, ledger committed (₹2.64)" },
  { at: "11:32:41", who: "Voice Sales", kind: "CRM", text: "168 lead records updated in Nova Realty CRM" },
  { at: "11:30:02", who: "Voice Sales", kind: "Approval", text: "Requested — send WhatsApp discount (15%) for LD-1731" },
  { at: "11:24:19", who: "Fleen", kind: "Deploy", text: "Voice Sales v2.4.1 promoted to production" },
  { at: "11:04:44", who: "Voice Sales", kind: "Message", text: "94 WhatsApp confirmations sent today" },
  { at: "10:58:12", who: "Voice Sales", kind: "Decision", text: "Intent classified HIGH for batch LD-1690–1712" },
  { at: "10:44:31", who: "Voice Sales", kind: "Tool call", text: "Google Calendar — 6 slots locked" },
  { at: "10:31:07", who: "Voice Sales", kind: "Escalation", text: "Angry customer — human queued (WK-10205)" },
  { at: "10:12:55", who: "Lead Generator", kind: "Task", text: "Nightly list refresh complete — 2,013 records" },
  { at: "09:41:03", who: "Voice Sales", kind: "Call", text: "Session started — call ≤ 214 connected" },
];

/* ---------------------------------------------------------------- overview feed */

export const LIVE_FEED = [
  { t: "11:41:58", text: "New lead received — Meta Ads", lead: "LD-1748" },
  { t: "11:41:59", text: "Sales employee activated", lead: "" },
  { t: "11:42:02", text: "Customer qualified — high intent", lead: "LD-1748" },
  { t: "11:42:12", text: "WhatsApp follow-up sent", lead: "LD-1748" },
  { t: "11:46:19", text: "Appointment booked", lead: "LD-1748" },
  { t: "11:46:20", text: "CRM updated · outcome committed", lead: "" },
];

/* ---------------------------------------------------------------- api */

export const API_KEYS = [
  { label: "Nova Realty — production", masked: "sk_live_••••••••4821", created: "Aug 14, 2026", scope: "employees.write outcomes.read events.read", lastUsed: "2 min ago" },
  { label: "Sandbox", masked: "sk_test_••••••••7310", created: "Aug 14, 2026", scope: "employees.write", lastUsed: "5 h ago" },
];

export const WEBHOOKS = [
  { url: "https://hooks.novarealty.io/lexi", events: ["employee.outcome.recorded", "employee.approval.requested", "call.completed"], status: "Healthy — 143 deliveries / 24h" },
  { url: "https://edge.lexilabs.dev/debug", events: ["*"], status: "Healthy — 1,881 deliveries / 24h" },
];

/* ---------------------------------------------------------------- misc */

export const ONSITE = "https://github.com/Nagacharan2809/lexi--labs";

export const REPORT_SERIES = [
  { d: "12", leads: 1210, calls: 1201, connected: 992, cost: 1580 },
  { d: "13", leads: 1186, calls: 1175, connected: 964, cost: 1508 },
  { d: "14", leads: 1240, calls: 1228, connected: 1001, cost: 1612 },
  { d: "15", leads: 1149, calls: 1131, connected: 908, cost: 1442 },
  { d: "16", leads: 1288, calls: 1270, connected: 1038, cost: 1684 },
  { d: "17", leads: 1330, calls: 1311, connected: 1084, cost: 1748 },
  { d: "18", leads: 1101, calls: 1080, connected: 887, cost: 1496 },
  { d: "19", leads: 1200, calls: 1186, connected: 986, cost: 0 },
  { d: "20", leads: 1233, calls: 1219, connected: 1002, cost: 1633 },
  { d: "21", leads: 1265, calls: 1247, connected: 1024, cost: 1677 },
  { d: "22", leads: 1281, calls: 1262, connected: 1041, cost: 1701 },
  { d: "23", leads: 1200, calls: 1186, connected: 986, cost: 1690 },
];

export const COSTS_MONTH = [
  { label: "Voice", value: 121050, tone: "blue" as const, detail: "Fleen Voice Gateway · 195,242 min @ ₹0.62" },
  { label: "LLM", value: 21030, tone: "orange" as const, detail: "lexi-sales-v2.4.1 · 47.2M tokens @ ₹14/1M" },
  { label: "Platform", value: 59999, tone: "neutral" as const, detail: "Growth plan · fixed" },
  { label: "Tools & API", value: 6742, tone: "neutral" as const, detail: "Calendar, CRM seat calls, provider pass-through" },
  { label: "Infrastructure", value: 3260, tone: "neutral" as const, detail: "Sandbox + verification runs" },
];
