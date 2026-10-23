import Link from "next/link";
import { WORKFLOW_VOICES, WORKFLOW_CALLBACK, EMPLOYEES } from "@/lib/app/data";
import { PageHead, Panel, Tile, Chip } from "@/components/app/ui";

const RAILS = [
  {
    name: "New lead → qualification → booking",
    employee: "Lexi Voice Sales",
    nodes: WORKFLOW_VOICES,
    else: WORKFLOW_CALLBACK,
    status: "PRODUCTION",
    runs: "1,186 today",
    success: "96.4%",
  },
  {
    name: "Pipeline follow-up cadence",
    employee: "Lexi Sales",
    nodes: [
      { id: "r1", kind: "trigger" as const, title: "SIGNAL: STALE OPPORTUNITY", config: { Source: "CRM", Condition: "no touch 5d" } },
      { id: "r2", kind: "ai" as const, title: "COMPOSE NUDGE", config: { Tone: "direct · no fluff" } },
      { id: "r3", kind: "tool" as const, title: "SEND + LOG", config: { Tool: "Email/WhatsApp" } },
      { id: "r4", kind: "end" as const, title: "END", config: { Outcome: "recorded" } },
    ],
    else: null,
    status: "PRODUCTION",
    runs: "486 today",
    success: "97.0%",
  },
  {
    name: "Nightly reconciliation",
    employee: "Lexi Operations",
    nodes: [
      { id: "o1", kind: "trigger" as const, title: "CRON 23:00 IST", config: { Schedule: "nightly" } },
      { id: "o2", kind: "tool" as const, title: "PULL LEDGER DELTA", config: { Tool: "PostgreSQL" } },
      { id: "o3", kind: "approval" as const, title: "DIFF > ₹10K → HUMAN", config: { Queue: "morning 08:00" } },
      { id: "o4", kind: "end" as const, title: "END", config: { Outcome: "report draft" } },
    ],
    else: null,
    status: "TESTING",
    runs: "1 tonight",
    success: "—",
  },
];

const KIND_LABEL: Record<string, string> = {
  trigger: "TRIGGER", ai: "AI", condition: "IF", tool: "TOOL", action: "DO",
  approval: "HUMAN", wait: "WAIT", webhook: "HOOK", end: "END",
};

export default function WorkflowsPage() {
  const voiceSalesHired = EMPLOYEES.some((x) => x.slug === "voice-sales");

  return (
    <>
      <PageHead
        kicker="Workflows · Workspace"
        title="Workflows."
        sub="Employees don't freeform — they execute rails. Every rail is versioned, gated and traced like code."
      />

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Rails in production" value={RAILS.filter((r) => r.status === "PRODUCTION").length} sub="Executed by 4 employees" />
        <Tile label="Node executions today" value="3,214" sub="96.4% without intervention" />
        <Tile label="Human pauses" value="23" sub="Approval + escalation moments" tone="amber" />
        <Tile label="Median run" value="03:42" sub="Trigger → ledger commit" />
      </div>

      <div className="flex flex-col gap-6">
        {RAILS.map((r) => (
          <Panel
            key={r.name}
            title={r.name}
            kicker={`${r.employee.toUpperCase()} · ${r.runs} TODAY · SUCCESS ${r.success}`}
            actions={
              <>
                <Chip tone={r.status === "PRODUCTION" ? "green" : "amber"} pulse={r.status === "PRODUCTION"}>{r.status}</Chip>
                {(r.employee === "Lexi Voice Sales" && voiceSalesHired) ? (
                  <Link href="/app/workforce/voice-sales/workflow" className="meta link-underline text-ink">OPEN CANVAS →</Link>
                ) : null}
              </>
            }
            pad
          >
            <ol role="list" className="flex flex-wrap items-center gap-2">
              {r.nodes.map((n, i) => (
                <li key={n.id} className="flex items-center gap-2">
                  <span className="flex items-center gap-2 rounded-sm border border-line bg-paper px-3 py-2">
                    <span className={n.kind === "ai" ? "meta rounded-full bg-ink px-1.5 py-0.5 text-paper" : "meta text-grey-2"}>{KIND_LABEL[n.kind]}</span>
                    <span className="font-mono text-[0.74rem] text-ink">{n.title}</span>
                  </span>
                  {i < r.nodes.length - 1 ? <span aria-hidden="true" className="meta text-grey-2">→</span> : null}
                </li>
              ))}
            </ol>
            {r.else ? (
              <p className="meta mt-3 text-grey-2">
                OTHERWISE: {r.else.length}-NODE CALLBACK RAIL — {r.else[1].title} → {r.else[r.else.length - 1].title}
              </p>
            ) : null}
          </Panel>
        ))}
      </div>

      <div className="mt-8 rounded-md border border-line bg-paper p-6">
        <p className="meta text-grey-2">PHILOSOPHY — RAILS, NOT AUTOPILOT</p>
        <p className="mt-2 max-w-[80ch] text-[0.9rem] leading-relaxed text-grey">
          Rails, not autopilot: employees pause at exactly two kinds of nodes — approval and escalation. Everything else
          streams. That is how the funnel stays readable from outcome back to trigger without interviewing the software.
        </p>
      </div>
    </>
  );
}
