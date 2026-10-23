/* ------------------------------------------------------------------ */
/*  Lexi Labs — site content model                                     */
/*  All product, workflow and pricing copy lives here so components    */
/*  stay structural and the story stays editable in one place.         */
/* ------------------------------------------------------------------ */

export interface Employee {
  index: string;
  slug: string;
  role: string;
  short: string;
  purpose: string;
  capabilities: string[];
  channels: string[];
  workflow: string[];
  accent: string; // spectral role tint, saturated variant
  tint: string; // same hue, wash variant for surfaces
}

export const employees: Employee[] = [
  {
    index: "01",
    slug: "sales",
    role: "Sales Employee",
    short: "Sales",
    purpose: "Turns incoming leads into qualified opportunities.",
    capabilities: [
      "Lead qualification",
      "Follow-up",
      "CRM updates",
      "Appointment booking",
      "Sales handoff",
    ],
    channels: ["Phone", "WhatsApp", "Email", "CRM"],
    workflow: [
      "Lead received",
      "Requirement understood",
      "Customer qualified",
      "Follow-up sent",
      "Handed to sales",
    ],
    accent: "#2b5aa7",
    tint: "#e3ecf7",
  },
  {
    index: "02",
    slug: "voice",
    role: "Voice Employee",
    short: "Voice",
    purpose: "Answers, qualifies and routes calls around the clock.",
    capabilities: [
      "Inbound call answering",
      "Outbound calling",
      "Call qualification",
      "Live transfer",
      "Call summaries",
    ],
    channels: ["Phone", "IVR", "CRM", "Call logs"],
    workflow: [
      "Call received",
      "Intent identified",
      "Context recalled",
      "Call handled or transferred",
      "Summary filed",
    ],
    accent: "#3e7dbf",
    tint: "#e4eef8",
  },
  {
    index: "03",
    slug: "lead-generator",
    role: "Lead Generator",
    short: "Leads",
    purpose: "Finds, researches and prepares prospects before a human ever calls.",
    capabilities: [
      "Prospect research",
      "List building",
      "Enrichment",
      "Outreach drafts",
      "Handover packages",
    ],
    channels: ["LinkedIn", "Email", "CRM", "Data sources"],
    workflow: [
      "Segment defined",
      "Prospects sourced",
      "Accounts enriched",
      "Outreach prepared",
      "Package delivered",
    ],
    accent: "#1f7a6b",
    tint: "#e2f0ed",
  },
  {
    index: "04",
    slug: "marketing",
    role: "Marketing Employee",
    short: "Marketing",
    purpose: "Runs campaigns, reads the signals and acts on what it finds.",
    capabilities: [
      "Campaign monitoring",
      "Performance analysis",
      "Content operations",
      "Anomaly detection",
      "Approved optimisation",
    ],
    channels: ["Ads platforms", "Analytics", "Email", "CMS"],
    workflow: [
      "Data read",
      "Anomaly detected",
      "Cause analysed",
      "Action proposed",
      "Change executed",
    ],
    accent: "#d99136",
    tint: "#f8eede",
  },
  {
    index: "05",
    slug: "support",
    role: "Support Employee",
    short: "Support",
    purpose: "Resolves customer issues end-to-end with real system access.",
    capabilities: [
      "Order & account lookup",
      "Issue resolution",
      "Policy handling",
      "Refund & replacement",
      "Escalation to humans",
    ],
    channels: ["Chat", "Email", "Voice", "Helpdesk"],
    workflow: [
      "Query received",
      "Customer identified",
      "System checked",
      "Issue resolved",
      "Ticket closed",
    ],
    accent: "#5a7a4a",
    tint: "#ebf1e6",
  },
  {
    index: "06",
    slug: "operations",
    role: "Operations Employee",
    short: "Operations",
    purpose: "Keeps the internal machine running — reports, records, renewals.",
    capabilities: [
      "Report generation",
      "Data entry & sync",
      "Renewal tracking",
      "Process execution",
      "Exception flagging",
    ],
    channels: ["ERP", "Sheets", "Email", "Internal tools"],
    workflow: [
      "Schedule triggered",
      "Systems reconciled",
      "Work executed",
      "Exceptions flagged",
      "Report delivered",
    ],
    accent: "#e8763a",
    tint: "#fbe9dd",
  },
  {
    index: "07",
    slug: "collections",
    role: "Collections Employee",
    short: "Collections",
    purpose: "Recovers revenue with firm, compliant, well-timed follow-up.",
    capabilities: [
      "Payment reminders",
      "Promise-to-pay capture",
      "Payment talk tracks",
      "Dispute logging",
      "Recovery reporting",
    ],
    channels: ["Phone", "SMS", "Email", "Billing system"],
    workflow: [
      "Overdue detected",
      "History reviewed",
      "Cadence chosen",
      "Customer contacted",
      "Outcome recorded",
    ],
    accent: "#b4542e",
    tint: "#f7e6de",
  },
  {
    index: "08",
    slug: "recruiting",
    role: "Recruiting Employee",
    short: "Recruiting",
    purpose: "Screens, schedules and keeps candidates moving.",
    capabilities: [
      "Resume screening",
      "Candidate outreach",
      "Interview scheduling",
      "Pipeline tracking",
      "Recruiter briefing",
    ],
    channels: ["ATS", "Email", "Calendar", "Phone"],
    workflow: [
      "Role opened",
      "Applications screened",
      "Shortlist prepared",
      "Interviews scheduled",
      "Brief delivered",
    ],
    accent: "#8a4049",
    tint: "#f2e5e7",
  },
  {
    index: "09",
    slug: "analyst",
    role: "Analyst Employee",
    short: "Analyst",
    purpose: "Reads the business daily and reports what changed, and why.",
    capabilities: [
      "Data pipeline checks",
      "Metric monitoring",
      "Anomaly analysis",
      "Narrative reporting",
      "Action recommendations",
    ],
    channels: ["Warehouse", "Sheets", "Slack", "Email"],
    workflow: [
      "Data pulled",
      "Metrics computed",
      "Anomalies isolated",
      "Findings written",
      "Actions recommended",
    ],
    accent: "#101114",
    tint: "#e8e8e2",
  },
];

/* ----------------------------- use cases ----------------------------- */

export interface StageResult {
  stage: string;
  entry: string;
  status: string;
  state: "received" | "done" | "checked" | "sent" | "verified" | "queued";
}

export interface TestCase {
  index: string;
  name: string;
  domain: string;
  employee: string;
  stages: StageResult[];
}

export const useCases: TestCase[] = [
  {
    index: "01",
    name: "Real estate lead",
    domain: "Lead handling",
    employee: "Sales Employee",
    stages: [
      {
        stage: "Input",
        entry: "Meta lead form received — 2 BHK, Whitefield, budget ₹1.2 Cr",
        status: "Received",
        state: "received",
      },
      {
        stage: "Action",
        entry: "Lead parsed, requirement structured, CRM record created",
        status: "Structured",
        state: "done",
      },
      {
        stage: "Decision",
        entry: "Budget and location match active inventory — qualify",
        status: "Qualified",
        state: "checked",
      },
      {
        stage: "Execution",
        entry: "Qualifying call placed 14:32 · site-visit options sent on WhatsApp",
        status: "Contacted",
        state: "sent",
      },
      {
        stage: "Result",
        entry: "Site visit booked Sat 11:00 · CRM updated · handoff complete",
        status: "Booked",
        state: "verified",
      },
    ],
  },
  {
    index: "02",
    name: "E-commerce support",
    domain: "Customer support",
    employee: "Support Employee",
    stages: [
      {
        stage: "Input",
        entry: "Customer message — “Order #48210 has not arrived”",
        status: "Received",
        state: "received",
      },
      {
        stage: "Action",
        entry: "Identity verified · order history pulled from commerce system",
        status: "Identified",
        state: "done",
      },
      {
        stage: "Decision",
        entry: "Shipment delayed in transit — replacement eligible under policy",
        status: "Approved",
        state: "checked",
      },
      {
        stage: "Execution",
        entry: "Replacement created · shipping refund initiated · timeline sent",
        status: "Resolved",
        state: "sent",
      },
      {
        stage: "Result",
        entry: "Customer notified · no human touch required · escalation skipped",
        status: "Closed",
        state: "verified",
      },
    ],
  },
  {
    index: "03",
    name: "Sales follow-up",
    domain: "Pipeline recovery",
    employee: "Sales Employee",
    stages: [
      {
        stage: "Input",
        entry: "Pipeline signal — qualified lead inactive for 9 days",
        status: "Detected",
        state: "received",
      },
      {
        stage: "Action",
        entry: "Last interaction rebuilt from CRM notes and email thread",
        status: "Analysed",
        state: "done",
      },
      {
        stage: "Decision",
        entry: "Pricing objection unresolved — send value recap, offer call",
        status: "Strategy set",
        state: "checked",
      },
      {
        stage: "Execution",
        entry: "Follow-up email sent Tue 10:05 · call task scheduled Thursday",
        status: "Contacted",
        state: "sent",
      },
      {
        stage: "Result",
        entry: "Response received · meeting booked · pipeline stage advanced",
        status: "Revived",
        state: "verified",
      },
    ],
  },
  {
    index: "04",
    name: "Marketing",
    domain: "Campaign operations",
    employee: "Marketing Employee",
    stages: [
      {
        stage: "Input",
        entry: "Campaign metrics pulled — CPL up 38% on ads-search-01",
        status: "Received",
        state: "received",
      },
      {
        stage: "Action",
        entry: "Week-over-week performance compared across channels",
        status: "Analysed",
        state: "done",
      },
      {
        stage: "Decision",
        entry: "Creative fatigue detected — pause variant, request budget shift",
        status: "Recommendation",
        state: "checked",
      },
      {
        stage: "Execution",
        entry: "Pause action queued pending approval · reallocation plan drafted",
        status: "Awaiting approval",
        state: "queued",
      },
      {
        stage: "Result",
        entry: "Approval received · change executed · CPL monitoring continues",
        status: "Executed",
        state: "verified",
      },
    ],
  },
];

/* ------------------------------ pricing ------------------------------ */

export interface Plan {
  index: string;
  name: string;
  price: string;
  cadence: string;
  audience: string;
  includes: string[];
  featured: boolean;
  cta: string;
}

export const plans: Plan[] = [
  {
    index: "01",
    name: "Starter",
    price: "₹24,999",
    cadence: "per month",
    audience: "For one AI employee and basic workflows.",
    includes: [
      "One AI employee",
      "Core integrations — CRM, email, WhatsApp",
      "Standard verification rules",
      "Monthly performance review",
      "Business-hours support",
    ],
    featured: false,
    cta: "Deploy one employee",
  },
  {
    index: "02",
    name: "Growth",
    price: "₹59,999",
    cadence: "per month",
    audience: "For businesses deploying AI across multiple workflows.",
    includes: [
      "Up to three AI employees",
      "Voice, CRM, email and WhatsApp integrations",
      "Human approval flows",
      "Fortnightly performance review",
      "Priority support",
    ],
    featured: true,
    cta: "Deploy a workforce",
  },
  {
    index: "03",
    name: "Workforce",
    price: "₹1,49,999+",
    cadence: "per month",
    audience: "For multiple AI employees and advanced business automation.",
    includes: [
      "Multiple AI employees",
      "Custom integrations and internal tools",
      "Dedicated Fleen orchestration",
      "SLA and quarterly optimisation",
      "Named success engineer",
    ],
    featured: false,
    cta: "Talk to sales",
  },
];

export const navLinks = [
  { label: "AI Employees", href: "#employees" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Why Lexi", href: "#why-lexi" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
] as const;

/** Event used to pre-fill the demo form's "Preferred AI Employee". */
export const PREFILL_EVENT = "lexi:prefill-employee";
export function prefillEmployee(slug: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: slug }));
  }
}

/** For the "how do I start" nav + footer product links summary. */
export const EMPLOYEES_NAV = employees;
export type Content = Employee;
