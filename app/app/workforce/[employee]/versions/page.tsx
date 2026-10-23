"use client";

/* VERSIONS — every change to the employee, with compare + rollback flows. */

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { VERSIONS, getEmployee } from "@/lib/app/data";
import { PageHead, Panel, Chip, EmptyState, Progress } from "@/components/app/ui";
import { Modal } from "@/components/app/overlay";
import { cn } from "@/lib/utils";

export default function VersionsPage() {
  const { employee: slug } = useParams<{ employee: string }>();
  const e = getEmployee(slug ?? "");
  const [cmpA, setCmpA] = useState("2.4.1");
  const [cmpB, setCmpB] = useState("2.2.0");
  const [rollback, setRollback] = useState<string | null>(null);
  const [rollbackDone, setRollbackDone] = useState<string | null>(null);

  if (!e || slug !== "voice-sales") {
    return (
      <>
        <PageHead kicker={e ? `${e.name} · Versions` : "Versions"} title="Versions." />
        <EmptyState
          title="One version — the hired build."
          body="This employee has not shipped changes yet. Versions appear after the first knowledge or workflow promotion."
          action={
            <Link href={`/app/workforce/${slug ?? "operations"}/knowledge`} className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
              Manage knowledge
            </Link>
          }
        />
      </>
    );
  }

  const a = VERSIONS.find((v) => v.v === cmpA)!;
  const b = VERSIONS.find((v) => v.v === cmpB)!;

  return (
    <>
      <PageHead
        kicker="Lexi Voice Sales · Versions"
        title="Versions."
        sub="Every promotion is a signed, scored, audited change — production keeps a warm rollback target at all times."
        actions={<Chip tone="green" pulse>PRODUCTION · v2.4.1</Chip>}
      />

      {/* timeline */}
      <Panel className="mb-6" title="Version history" kicker="NEWEST FIRST — SCORE IS THE GATE RESULT OF ITS DAY">
        <ol className="relative flex flex-col">
          <span aria-hidden="true" className="absolute bottom-3 left-[9px] top-3 w-px bg-line-2" />
          {VERSIONS.map((v) => {
            const isProd = v.deployed === "Production";
            return (
              <li key={v.v} className="relative flex flex-col gap-2 py-4 pl-10">
                <span aria-hidden="true" className={cn(
                  "absolute left-0 top-5 h-[19px] w-[19px] rounded-full border-2 bg-paper text-center font-mono leading-[16px] text-[0.55rem]",
                  isProd ? "border-blue-deep text-blue-deep" : "border-line-2 text-grey-2",
                )}>
                  {isProd ? "★" : ""}
                </span>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className={cn("font-mono text-[1rem]", isProd ? "font-semibold text-ink" : "text-grey")}>v{v.v}</span>
                    <Chip tone={isProd ? "blue" : v.deployed === "Sandbox" ? "amber" : "neutral"}>
                      {v.deployed.toUpperCase()}
                    </Chip>
                    {v.production ? <span className="meta text-grey">PROD SUCCESS · {v.production}%</span> : null}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="meta text-grey-2">{v.date}</span>
                    {v.deployed === "Archived" ? (
                      <button
                        onClick={() => { setRollback(v.v); setRollbackDone(null); }}
                        className="meta rounded-sm border border-line-2 px-3 py-1.5 text-grey transition-colors hover:border-ink hover:text-ink"
                      >
                        Roll here
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="grid items-center gap-3 md:grid-cols-[auto_1fr]">
                  <span className="meta w-[76px] text-grey-2">GATE {v.score}%</span>
                  <div className="max-w-[420px]"><Progress value={v.score} tone={v.score >= 94 ? "green" : v.score >= 88 ? "blue" : "orange"} /></div>
                </div>
                <ul role="list" className="flex flex-wrap gap-x-6 gap-y-1">
                  {v.changes.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-[0.85rem] text-grey">
                      <span aria-hidden="true" className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-grey-2" />{c}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </Panel>

      {rollbackDone ? (
        <div className="mb-6 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="meta text-emerald-800">✓ ROLLBACK OF PRODUCTION → v{rollbackDone} RECORDED — SIGNED BY YOU · GATE REPLAYED · PREVIOUS VERSION KEPT WARM</p>
        </div>
      ) : null}

      {/* compare */}
      <Panel title="Compare versions" kicker="SIDE-BY-SIDE — GATE SCORES AND CHANGES">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <select value={cmpA} onChange={(ev) => setCmpA(ev.target.value)} aria-label="Version A" className="field w-[140px] font-mono">
            {VERSIONS.map((v) => <option key={v.v} value={v.v}>v{v.v}</option>)}
          </select>
          <span className="meta text-grey-2">VS</span>
          <select value={cmpB} onChange={(ev) => setCmpB(ev.target.value)} aria-label="Version B" className="field w-[140px] font-mono">
            {VERSIONS.map((v) => <option key={v.v} value={v.v}>v{v.v}</option>)}
          </select>
          {a.score === b.score ? <Chip tone="neutral">SCORES TIED</Chip> : <Chip tone={a.score > b.score ? "green" : "amber"}>{`Δ ${a.score - b.score > 0 ? "+" : ""}${(a.score - b.score).toFixed(0)} PTS`}</Chip>}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[a, b].map((v) => (
            <div key={v.v} className="rounded-sm border border-line p-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-[1rem] text-ink">v{v.v}</p>
                <p className="meta text-grey-2">{v.date} · {v.deployed.toUpperCase()}</p>
              </div>
              <div className="mt-3"><Progress value={v.score} tone={v.score >= 94 ? "green" : v.score >= 88 ? "blue" : "orange"} label={`GATE ${v.score}%`} /></div>
              <ul role="list" className="mt-4 flex flex-col gap-2 border-t border-line pt-3">
                {v.changes.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-[0.85rem] text-grey">
                    <span aria-hidden="true" className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-grey-2" />{c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Panel>

      <Modal open={Boolean(rollback)} onClose={() => setRollback(null)} kicker="Deployment control" title={`Roll production back to v${rollback ?? ""}?`}
        footer={
          <>
            <button onClick={() => setRollback(null)} className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">Cancel</button>
            <button
              onClick={() => { setRollbackDone(rollback); setRollback(null); }}
              className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift"
            >
              Sign rollback
            </button>
          </>
        }>
        <p className="text-[0.9rem] leading-relaxed text-grey">
          Live traffic returns to the archived build. The gate replays against it first; the current version stays warm
          so the move back is equally quick. Everything is audited — versions are never deleted.
        </p>
      </Modal>
    </>
  );
}
