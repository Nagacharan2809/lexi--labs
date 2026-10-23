"use client";

/*
   ExecutionTrace — the auditable action trail. It deliberately never
   claims private model reasoning; each node records what the workforce
   runtime (Fleen) actually did, in the customer's interest.
*/

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TraceNode } from "@/lib/app/data";
import { dur } from "@/lib/app/format";

const STATE_DOT: Record<TraceNode["state"], string> = {
  done: "bg-blue-deep",
  info: "border-[1.5px] border-grey-2 bg-paper",
  alert: "bg-amber-500",
  blocked: "bg-red-500",
};

export function ExecutionTrace({ nodes, defaultOpen = 0 }: { nodes: TraceNode[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <ol className="relative flex flex-col">
      <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-line-2" />
      {nodes.map((n, i) => (
        <li key={n.label + i} className="relative pl-8">
          <span aria-hidden="true" className={cn("absolute left-0 top-[9px] h-[15px] w-[15px] rounded-full", STATE_DOT[n.state])} />
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="group -mx-2 flex w-[calc(100%+1rem)] items-baseline justify-between gap-4 rounded-xs px-2 py-2 text-left transition-colors hover:bg-paper-2"
          >
            <span className="meta flex items-center gap-2 text-ink">
              {n.label}
              <span className="font-normal text-grey-2">· {n.state === "done" || n.state === "info" ? "done" : n.state}</span>
            </span>
            <span className="font-mono text-[0.72rem] tabular-nums text-grey-2">{n.at} · {dur(n.duration)}</span>
          </button>
          <AnimatePresence initial={false}>
            {open === i ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <dl className="mb-3 mt-1 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-sm bg-paper-2/60 p-3.5">
                  <dt className="meta text-grey-2">Input</dt>
                  <dd className="truncate text-[0.82rem] text-ink">{n.input}</dd>
                  <dt className="meta text-grey-2">Decision</dt>
                  <dd className="text-[0.82rem] text-ink">{n.decision}</dd>
                  <dt className="meta text-grey-2">Tool</dt>
                  <dd className="font-mono text-[0.78rem] text-blue-deep">{n.tool}</dd>
                  <dt className="meta text-grey-2">Result</dt>
                  <dd className="text-[0.82rem] text-ink">{n.result}</dd>
                  <dt className="meta text-grey-2">Validation</dt>
                  <dd className="text-[0.82rem] text-emerald-700">✓ {n.validation}</dd>
                </dl>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </li>
      ))}
    </ol>
  );
}
