import Link from "next/link";
import { KNOWLEDGE, KNOWLEDGE_TOTAL, KNOWLEDGE_GAPS, EMPLOYEES } from "@/lib/app/data";
import { PageHead, Panel, Tile, Chip, EmptyState } from "@/components/app/ui";
import { HBars } from "@/components/app/charts";

const EMPLOYEE_BUNDLES: Record<string, string[]> = {
  "Lexi Voice Sales": ["Pricing sheet v4", "Objection handbook v3", "Call scripts v9", "Booking & EMI FAQ", "Qualification policy v2"],
  "Lexi Support": ["Refund policy (draft)", "Booking & EMI FAQ", "Site visit guidelines"],
  "Lexi Operations": ["Qualification policy v2", "Site visit guidelines"],
  "Lexi Collections": ["Qualification policy v2", "Home loan partner sheet"],
};

export default function WorkspaceKnowledgePage() {
  const bundled = Object.entries(EMPLOYEE_BUNDLES).filter(([emp]) => EMPLOYEES.some((e) => e.name === emp));
  if (bundled.length === 0) {
    return (
      <>
        <PageHead kicker="Knowledge" title="Knowledge." />
        <EmptyState title="No knowledge attached yet." body="Add sources to start the workspace truth layer." />
      </>
    );
  }

  return (
    <>
      <PageHead
        kicker="Knowledge · Workspace"
        title="One truth layer."
        sub="Employees never invent because they never guess: every employee answers only from the sources assigned here, and the workspace owns the index."
      />

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Sources" value={KNOWLEDGE_TOTAL.sources} sub="Workspace-wide index" />
        <Tile label="Indexed sections" value={KNOWLEDGE_TOTAL.sections.toLocaleString("en-IN")} sub="Re-embedded on change" />
        <Tile label="Average coverage" value={`${KNOWLEDGE_TOTAL.coverage}%`} sub="Weighted, audited quarterly" tone="blue" />
        <Tile label="Open gaps" value={KNOWLEDGE_GAPS.length} sub="Escalation-backed until fixed" tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Panel title="Source index" kicker="SHARED BY EVERY EMPLOYEE IT IS ASSIGNED TO" pad>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left">
              <thead>
                <tr className="border-b border-line">
                  {["Source", "Type", "Sections", "Coverage", "Status"].map((h) => (
                    <th key={h} className="meta px-3 py-2.5 first:pl-0 text-grey-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {KNOWLEDGE.map((k) => (
                  <tr key={k.name} className="border-b border-line/70 text-[0.86rem] last:border-b-0">
                    <td className="py-3 pl-0 pr-3 font-medium text-ink">{k.name}</td>
                    <td className="px-3 py-3"><Chip tone="neutral">{k.type}</Chip></td>
                    <td className="px-3 py-3 font-mono tabular-nums text-ink">{k.sections}</td>
                    <td className="px-3 py-3 font-mono tabular-nums text-ink">{k.coverage}%</td>
                    <td className="px-3 py-3">
                      <Chip tone={k.status === "indexed" ? "green" : "amber"}>{k.status.toUpperCase()}</Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="meta mt-4 text-grey-2">THE PAGES BELOW ARE THE SAME LEDGER, SCOPED PER EMPLOYEE — <Link href="/app/workforce/voice-sales/knowledge" className="link-underline text-ink">OPEN FLAGSHIP VIEW →</Link></p>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="Coverage by source" kicker="WEIGHTED INDEX QUALITY">
            <HBars rows={KNOWLEDGE.map((k) => ({ label: k.name.split("—").pop()!.trim(), value: k.coverage }))} max={100} />
          </Panel>

          <Panel title="Assigned bundles" kicker="WHO READS WHAT">
            <ul role="list" className="flex flex-col divide-y divide-line">
              {bundled.map(([emp, srcs]) => (
                <li key={emp} className="py-3 first:pt-0 last:pb-0">
                  <p className="meta text-grey-2">{emp.toUpperCase()}</p>
                  <p className="mt-1 text-[0.85rem] text-grey">{srcs.join(" · ")}</p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Gaps — tracked, not hidden" kicker="THE ESCALATION SAFETY NET">
            <ul role="list" className="flex flex-col gap-2.5">
              {KNOWLEDGE_GAPS.map((g) => (
                <li key={g} className="flex items-start justify-between gap-3 rounded-sm border border-line px-3.5 py-2.5">
                  <span className="text-[0.86rem] text-ink">{g}</span>
                  <Chip tone="amber">OPEN</Chip>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
