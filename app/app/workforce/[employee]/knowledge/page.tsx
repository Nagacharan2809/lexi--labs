"use client";

/* KNOWLEDGE — what the employee believes, where it came from, what is missing. */

import { useState } from "react";
import { useParams } from "next/navigation";
import { KNOWLEDGE, KNOWLEDGE_TOTAL, KNOWLEDGE_GAPS, getEmployee, type KnowledgeSource } from "@/lib/app/data";
import { PageHead, Panel, Chip, Tile, EmptyState } from "@/components/app/ui";
import { Donut, HBars } from "@/components/app/charts";
import { DataTable, type Col } from "@/components/app/table";
import { AnimatedNumber } from "@/components/app/live";
import { cn } from "@/lib/utils";

const SRC_STATUS: Record<KnowledgeSource["status"], { tone: "green" | "amber" | "blue"; label: string }> = {
  indexed: { tone: "green", label: "INDEXED" },
  processing: { tone: "amber", label: "PROCESSING" },
  stale: { tone: "amber", label: "STALE" },
};

export default function KnowledgePage() {
  const { employee: slug } = useParams<{ employee: string }>();
  const e = getEmployee(slug ?? "");
  const flagship = slug === "voice-sales";
  const [sources, setSources] = useState<KnowledgeSource[]>(KNOWLEDGE);
  const [addOpen, setAddOpen] = useState(false);
  const [queue, setQueue] = useState<{ name: string; stage: number }[]>([]);
  const [reindex, setReindex] = useState<string | null>(null);

  if (!flagship) {
    return (
      <>
        <PageHead kicker={e ? `${e.name} · Knowledge` : "Knowledge"} title="Knowledge." />
        <EmptyState
          title="This employee hasn't been given knowledge yet."
          body="Add policy PDFs, pricing sheets and FAQ docs — the employee only answers from sources, never from intuition."
          action={
            <button onClick={() => setAddOpen(true)} className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
              Add knowledge
            </button>
          }
        />
      </>
    );
  }

  const coverageRows = sources.map((s) => ({ label: s.name.replace("Nova Realty — ", ""), value: s.coverage }));

  const addQueue = (name: string) => {
    setSources((s) => [{ name, type: "PDF", sections: 0, coverage: 0, updated: "just now", status: "processing" }, ...s]);
    setAddOpen(false);
    const idx = { name, stage: 1 };
    setQueue((q) => [...q, idx]);
    const advance = (nameLocal: string) => window.setTimeout(() => {
      setQueue((q) => {
        const cur = q.find((x) => x.name === nameLocal);
        if (!cur) return q;
        if (cur.stage >= 3) {
          window.setTimeout(() => setQueue((qq) => qq.filter((x) => x.name !== nameLocal)), 1400);
          return q.map((x) => (x.name === nameLocal ? { ...x, stage: 4 } : x));
        }
        advance(nameLocal);
        return q.map((x) => (x.name === nameLocal ? { ...x, stage: x.stage + 1 } : x));
      });
    }, 1200);
    advance(name);
    window.setTimeout(() => {
      setSources((s) => s.map((x) => (
        x.name === name && x.sections === 0
          ? { ...x, sections: 37, coverage: 72, updated: "just now", status: "indexed" }
          : x
      )));
    }, 4600);
  };

  const doReindex = (name: string) => {
    setReindex(name);
    window.setTimeout(() => {
      setSources((s) => s.map((x) => (
        x.name === name ? { ...x, status: "indexed", coverage: Math.min(100, x.coverage + 12), updated: "just now" } : x
      )));
      setReindex(null);
    }, 1700);
  };

  const srcCols: Col<KnowledgeSource>[] = [
    { key: "name", label: "Source", text: (s) => s.name, cell: (s) => <span className="font-medium">{s.name}</span> },
    { key: "type", label: "Type", filterable: true, text: (s) => s.type, cell: (s) => <Chip tone="neutral">{s.type}</Chip>, hideBelow: "sm" },
    { key: "sections", label: "Sections", align: "right", text: (s) => String(s.sections), cell: (s) => s.sections },
    { key: "coverage", label: "Coverage", align: "right", text: (s) => String(s.coverage), cell: (s) => <span className="tabular-nums">{s.coverage}%</span>, hideBelow: "md" },
    { key: "updated", label: "Updated", text: (s) => s.updated, cell: (s) => s.updated, hideBelow: "md" },
    { key: "status", label: "Status", filterable: true, text: (s) => s.status, cell: (s) => (
      <span className="flex items-center gap-2">
        <Chip tone={SRC_STATUS[s.status].tone}>{SRC_STATUS[s.status].label}</Chip>
        {s.status !== "indexed" ? (
          <button
            onClick={() => doReindex(s.name)}
            className="meta link-underline whitespace-nowrap text-ink"
          >
            {reindex === s.name ? "REINDEXING…" : "FIX"}
          </button>
        ) : null}
      </span>
    ) },
  ];

  return (
    <>
      <PageHead
        kicker="Lexi Voice Sales · Knowledge"
        title="Knowledge."
        sub="The documents the employee is allowed to speak from. It never invents: unsupported questions route to humans, and this page shows exactly why."
        actions={
          <button onClick={() => setAddOpen(true)} className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
            Add knowledge
          </button>
        }
      />

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Tile label="Sources" value={<AnimatedNumber value={KNOWLEDGE_TOTAL.sources} />} sub="All workspace-truth" />
        <Tile label="Indexed sections" value={num(KNOWLEDGE_TOTAL.sections)} sub="Re-embedded on change" />
        <Tile label="FAQs" value={KNOWLEDGE_TOTAL.faqs} sub="Approved Q&A pairs" />
        <Tile label="Coverage" value={`${KNOWLEDGE_TOTAL.coverage}%`} sub="Weighted across sources" tone="blue" />
        <Tile label="Gaps" value={KNOWLEDGE_GAPS.length} sub="Tracked below" tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        {/* sources table */}
        <Panel title="Sources" kicker="STATUS · SECTION COUNT · FRESHNESS — RE-STALE, RE-INDEX" pad>
          <DataTable
            rows={sources}
            cols={srcCols}
            rowKey={(s) => s.name}
            searchPlaceholder="Filter 12 sources…"
            pageSize={8}
          />
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="Coverage by source" kicker="WEIGHTED INDEX QUALITY">
            <Donut value={KNOWLEDGE_TOTAL.coverage} size={92} label={`${KNOWLEDGE_TOTAL.coverage}%`} sub="WORKSPACE AVG" />
            <div className="mt-4">
              <HBars rows={coverageRows.map((r) => ({ label: r.label, value: r.value })).slice(0, 6)} max={100} />
            </div>
          </Panel>

          <Panel title="Known gaps" kicker="THE EMPLOYEE CHOSE 'I WILL CHECK WITH THE TEAM' HERE">
            <ul role="list" className="flex flex-col gap-2.5">
              {KNOWLEDGE_GAPS.map((g) => (
                <li key={g} className="flex items-start justify-between gap-3 rounded-sm border border-line px-3.5 py-2.5">
                  <span className="text-[0.86rem] text-ink">{g}</span>
                  <Chip tone="amber">OPEN</Chip>
                </li>
              ))}
            </ul>
            <p className="meta mt-3.5 text-grey-2">UNTIL A GAP IS INDEXED, ANSWERS FALL BACK TO ESCALATION — POLICY, NOT APOLOGY.</p>
          </Panel>
        </div>
      </div>

      {/* processing queue toasts */}
      {queue.length ? (
        <div className="fixed bottom-5 right-5 z-40 flex w-[300px] flex-col gap-2.5">
          {queue.map((q) => {
            const stage = ["", "UPLOADING", "PARSING SECTIONS", "EMBEDDING · v4 INDEX", "✓ INDEXED — LIVE FOR THE EMPLOYEE"][Math.min(q.stage, 4)];
            return (
              <div key={q.name} className="rounded-md border border-line bg-paper p-3.5 shadow-elevated">
                <p className="meta text-grey-2">KNOWLEDGE · {q.name}</p>
                <p className={"meta mt-1.5 " + (q.stage >= 4 ? "text-emerald-700" : "text-blue-deep")}>{stage}</p>
                <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-paper-3">
                  <div className="h-full grad-rule transition-all duration-700" style={{ width: `${q.stage * 25}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <AddKnowledgeModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={addQueue} />
    </>
  );
}

function AddKnowledgeModal({ open, onClose, onSubmit }: {
  open: boolean; onClose: () => void; onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [kind, setKind] = useState<KnowledgeSource["type"]>("PDF");
  const [err, setErr] = useState<string | null>(null);
  if (!open) return null;
  const submit = () => {
    if (name.trim().length < 3) { setErr("Give the source a real name."); return; }
    onSubmit(name.trim());
    setName("");
    setErr(null);
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Add knowledge">
      <button aria-label="Close" className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-md border border-line bg-paper p-6 shadow-elevated">
        <p className="meta text-grey-2">KNOWLEDGE · NEW SOURCE</p>
        <h3 className="display mt-2 text-[1.2rem] uppercase text-ink">Give the employee a truth source</h3>
        <div className="mt-4 flex flex-col gap-3">
          <label className="block">
            <span className="meta text-grey-2">SOURCE NAME *</span>
            <input value={name} onChange={(ev) => setName(ev.target.value)} placeholder="e.g. Aster Heights — variant price list v2" className="field mt-1.5 w-full" />
          </label>
          <div>
            <span className="meta text-grey-2">KIND</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {(["PDF", "DOCX", "TXT", "CSV", "URL", "FAQ"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={cn(
                    "meta rounded-sm border px-3 py-1.5 transition-colors",
                    kind === k ? "border-ink bg-ink text-paper" : "border-line-2 text-grey hover:border-ink hover:text-ink",
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
          <p className="meta text-grey-2">ON SUBMIT: UPLOAD → PARSE → EMBED → INDEX · THE EMPLOYEE READS FROM IT IMMEDIATELY.</p>
        </div>
        {err ? <p className="meta mt-3 text-red-700">✕ {err}</p> : null}
        <div className="mt-5 flex justify-end gap-2.5">
          <button onClick={onClose} className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">Cancel</button>
          <button onClick={submit} className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">Start indexing</button>
        </div>
      </div>
    </div>
  );
}

function num(n: number) { return n.toLocaleString("en-IN"); }
