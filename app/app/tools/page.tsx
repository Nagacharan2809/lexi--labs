import Link from "next/link";
import { TOOLS } from "@/lib/app/data";
import { PageHead, Panel, Tile, Chip } from "@/components/app/ui";

/* which employees hold which tool scopes */
const HOLDERS: Record<string, string> = {
  "Phone (Fleen Voice Gateway)": "Voice Sales · Sales · Lead Gen · Support · Collections",
  "WhatsApp Business": "Voice Sales · Support · Marketing",
  "Email (workspace SMTP)": "Voice Sales · Sales · Support",
  "CRM — Nova Realty": "Sales · Voice Sales · Operations",
  "Google Calendar": "Voice Sales · Sales",
  "Web": "Analyst · Marketing",
  "PostgreSQL — leads": "Operations · Analyst",
  "HTTP API": "Analyst",
  "Files": "Not yet configured",
};

export default function WorkspaceToolsPage() {
  const live = TOOLS.filter((t) => t.connected).length;
  const callsTotal = 79092; /* sum of TOOLS lifetime calls (rounded) */

  return (
    <>
      <PageHead
        kicker="Tools · Workspace"
        title="The tool floor."
        sub="A tool is a scoped permission the runtime executes on an employee's behalf — before every call there is a policy check, after every call a ledger row."
      />

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Tools registered" value={TOOLS.length} sub={`${live} live · 1 pending config`} />
        <Tile label="Lifetime tool calls" value={callsTotal.toLocaleString("en-IN")} sub="Across all employees" />
        <Tile label="Median success" value="97.2%" sub="Voice gateway hot path" tone="blue" />
        <Tile label="Error budget" value="Intact" sub="0.9% blended error rate" />
      </div>

      <Panel className="mb-6" title="Registry" kicker="SCOPES ARE DECLARED, NOT IMPLIED" pad>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-line">
                {["Tool", "Scope", "Held by", "Calls (30d)", "Success", "State"].map((h) => (
                  <th key={h} className="meta px-3 py-2.5 first:pl-0 text-grey-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOOLS.map((t) => (
                <tr key={t.name} className="border-b border-line/70 text-[0.86rem] last:border-b-0">
                  <td className="py-3 pl-0 pr-3">
                    <Link href="/app/workforce/voice-sales/tools" className="font-medium text-ink transition-colors hover:text-orange-deep">{t.name}</Link>
                    <span className="meta ml-2.5 text-grey-2">{t.kind.toUpperCase()}</span>
                  </td>
                  <td className="px-3 py-3 text-grey">{t.permission}</td>
                  <td className="px-3 py-3 text-grey">{HOLDERS[t.name]}</td>
                  <td className="px-3 py-3 font-mono tabular-nums text-ink">{t.calls}</td>
                  <td className="px-3 py-3 font-mono tabular-nums text-ink">{t.success === null ? "—" : `${t.success}%`}</td>
                  <td className="px-3 py-3">
                    {t.connected ? <Chip tone="green">LIVE</Chip> : <Chip tone="neutral">NOT CONFIGURED</Chip>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { t: "Policy check before every call", b: "The runtime validates the tool + arguments against the employee's permission matrix; blocked scopes fail at compile time." },
          { t: "Ledger row after every call", b: "Inputs, outputs, latency and cost land in the execution trace — nothing a tool touches is invisible." },
          { t: "Rate windows and budgets", b: "Voice windows (09:00–21:00), retry caps and monthly ceilings are properties of the tool binding, not software settings." },
        ].map((b) => (
          <div key={b.t} className="rounded-md border border-line bg-paper p-5">
            <p className="display text-[0.98rem] uppercase text-ink">{b.t}</p>
            <p className="mt-2 text-[0.86rem] leading-relaxed text-grey">{b.b}</p>
          </div>
        ))}
      </div>
    </>
  );
}
