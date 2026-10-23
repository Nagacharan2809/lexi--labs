"use client";

/* ACTIVITY — the auditable event log. Kind filters, expandable rows. */

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ACTIVITY, LIVE_FEED, getEmployee, type ActivityEvent } from "@/lib/app/data";
import { PageHead, Panel, Chip, Tile, EmptyState } from "@/components/app/ui";
import { cn } from "@/lib/utils";

type Ev = { at: string; who: string; kind: string; text: string };
const KIND_TONE: Record<string, { tone: "blue" | "green" | "amber" | "red" | "neutral"; label: string }> = {
  WORK: { tone: "blue", label: "WORK" },
  EVAL: { tone: "amber", label: "EVAL" },
  DEPLOY: { tone: "green", label: "DEPLOY" },
  APPROVAL: { tone: "amber", label: "APPROVAL" },
  KNOWLEDGE: { tone: "blue", label: "KNOWLEDGE" },
  SYSTEM: { tone: "neutral", label: "SYSTEM" },
};

export default function EmployeeActivityPage() {
  const { employee: slug } = useParams<{ employee: string }>();
  const e = getEmployee(slug ?? "");
  const flagship = slug === "voice-sales";

  const events = useMemo<Ev[]>(() => {
    if (flagship) {
      const fromFeed: Ev[] = (LIVE_FEED as { t: string; text: string; lead?: string }[]).map((f) => ({
        at: f.t, who: "Lexi Voice Sales", kind: "WORK", text: f.lead ? `${f.text} (${f.lead})` : f.text,
      }));
      return [...fromFeed, ...ACTIVITY.map((a: ActivityEvent) => ({ at: a.at, who: a.who, kind: a.kind, text: a.text }))];
    }
    return ACTIVITY.filter((a) => a.who === e?.name || a.kind !== "WORK");
  }, [flagship, e?.name]);

  const kinds = ["ALL", ...new Set(events.map((x) => x.kind))];
  const [filter, setFilter] = useState("ALL");
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const shown = filter === "ALL" ? events : events.filter((x) => x.kind === filter);

  if (!e) {
    return (
      <>
        <PageHead kicker="Activity" title="Activity." />
        <EmptyState title="Employee not found." body="Return to the workforce and pick a valid employee." />
      </>
    );
  }

  return (
    <>
      <PageHead
        kicker={`${e.name} · Activity`}
        title="Activity."
        sub="The audit trail — what the employee did, what changed, who signed it. The ledger writes once; this page is a read."
        actions={<Chip tone="neutral">{events.length} EVENTS · TODAY</Chip>}
      />

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Events" value={events.length} sub="Newest first" />
        <Tile label="Work events" value={events.filter((x) => x.kind === "WORK").length} sub="Executions + outcomes" />
        <Tile label="Audits" value={events.filter((x) => x.kind !== "WORK").length} sub="Evals · deploys · approvals" />
        <Tile label="On-chain report" value="Unbroken" sub="Every event signed" />
      </div>

      {/* kind filter */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {kinds.map((k) => (
          <button
            key={k}
            onClick={() => { setFilter(k); setOpenIdx(null); }}
            className={cn(
              "meta rounded-full border px-3.5 py-1.5 transition-all duration-200",
              filter === k ? "border-ink bg-ink text-paper" : "border-line-2 bg-paper text-grey hover:border-ink hover:text-ink",
            )}
          >
            {k}
          </button>
        ))}
      </div>

      <Panel title="Event log" kicker={filter === "ALL" ? "UNFILTERED" : `FILTER · ${filter}`}>
        <ol className="relative flex flex-col">
          <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-line-2" />
          {shown.map((ev, i) => {
            const t = KIND_TONE[ev.kind] ?? KIND_TONE.SYSTEM;
            const open = openIdx === i;
            return (
              <li key={i} className="relative py-1.5 pl-8">
                <span aria-hidden="true" className={cn(
                  "absolute left-0 top-4 h-[15px] w-[15px] rounded-full border-[1.5px] bg-paper",
                  i === 0 ? "border-blue-deep" : "border-line-2",
                )} />
                <button
                  onClick={() => setOpenIdx(open ? null : i)}
                  aria-expanded={open}
                  className="w-full rounded-sm px-2.5 py-1.5 text-left transition-colors hover:bg-paper-2"
                >
                  <div className="meta flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="flex items-baseline gap-2.5">
                      <span className="text-ink">{ev.who}</span>
                      <Chip tone={t.tone}>{t.label}</Chip>
                    </span>
                    <span className="font-mono text-grey-2">{ev.at}</span>
                  </div>
                  <p className="mt-1 text-[0.86rem] leading-snug text-grey">{ev.text}</p>
                </button>
                {open ? (
                  <div className="mt-2 mb-1 ml-2.5 rounded-sm border border-line-2 bg-paper-2/60 px-3.5 py-3">
                    <dl className="text-[0.8rem]">
                      <div className="flex justify-between gap-4 py-1"><dt className="meta text-grey-2">Event class</dt><dd className="font-mono text-ink">{ev.kind}</dd></div>
                      <div className="flex justify-between gap-4 py-1"><dt className="meta text-grey-2">Ledger reference</dt><dd className="font-mono text-ink">AUD-{(1000 + i).toString()}</dd></div>
                      <div className="flex justify-between gap-4 py-1"><dt className="meta text-grey-2">Signature</dt><dd className="font-mono text-ink">SARE · sha256 ledger hash</dd></div>
                      <div className="flex justify-between gap-4 py-1"><dt className="meta text-grey-2">Verdict</dt><dd className="text-emerald-700">COMMITTED</dd></div>
                    </dl>
                    {ev.kind === "WORK" ? (
                      <Link href="/app/workforce/voice-sales/leads" className="meta link-underline mt-2 inline-block text-ink">OPEN RELATED RECORDS →</Link>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </Panel>
    </>
  );
}
