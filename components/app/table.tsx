"use client";

/*
   DataTable — search, faceted filters, sort and progressive rows.
   Every aggregate number in Lexi is derived from these rows, never
   asserted: NUMBER → RECORDS → EXECUTION → EVIDENCE.
*/

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { num } from "@/lib/app/format";
import { EmptyState } from "./ui";

export interface Col<T> {
  key: string;
  label: string;
  cell: (row: T) => React.ReactNode;
  text?: (row: T) => string;
  filterable?: boolean;
  align?: "left" | "right" | "center";
  width?: string;
  hideBelow?: "sm" | "md" | "lg" | "xl";
}

const HIDE = {
  sm: ["hidden", "sm:table-cell"],
  md: ["hidden", "md:table-cell"],
  lg: ["hidden", "lg:table-cell"],
  xl: ["hidden", "xl:table-cell"],
} as const;

export function DataTable<T>({
  rows, cols, rowKey, search = true, searchPlaceholder = "Search", pageSize = 12,
  onRow, empty, toolbar, compact,
}: {
  rows: T[];
  cols: Col<T>[];
  rowKey: (r: T, i: number) => string;
  search?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  onRow?: (r: T) => void;
  empty?: { title: string; body: string };
  toolbar?: React.ReactNode;
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<Record<string, Set<string>>>({});
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [limit, setLimit] = useState(pageSize);

  const filtered = useMemo(() => {
    let out = rows;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter((r) =>
        cols.some((c) => (c.text ? c.text(r).toLowerCase().includes(q) : false)));
    }
    for (const [key, opts] of Object.entries(picked)) {
      if (!opts.size) continue;
      const col = cols.find((c) => c.key === key);
      out = out.filter((r) => opts.has(col?.text?.(r) ?? String((r as never)[key])));
    }
    if (sort) {
      const col = cols.find((c) => c.key === sort.key);
      if (col?.text) {
        const t = col.text;
        out = [...out].sort((a, b) => t(a).localeCompare(t(b)) * sort.dir);
      }
    }
    return out;
  }, [rows, cols, query, picked, sort]);

  const shown = filtered.slice(0, limit);
  const facetCols = cols.filter((c) => c.filterable);

  const toggle = (key: string, opt: string) =>
    setPicked((p) => {
      const next = new Set(p[key] ?? []);
      if (next.has(opt)) next.delete(opt);
      else next.add(opt);
      return { ...p, [key]: next };
    });

  return (
    <div>
      {/* controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        {search ? (
          <label className="relative block min-w-[240px] flex-1 md:max-w-xs">
            <span className="sr-only">Search records</span>
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setLimit(pageSize); }}
              placeholder={searchPlaceholder}
              className="field w-full rounded-xs border-b border-line bg-transparent py-2.5 pr-8 font-mono text-[0.86rem] text-ink outline-none placeholder:text-grey-2"
            />
            <svg viewBox="0 0 16 16" fill="none" className="pointer-events-none absolute right-1 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-grey-2">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />
            </svg>
          </label>
        ) : null}

        {facetCols.map((c) => (
          <FilterChip
            key={c.key}
            label={c.label}
            options={optionsFor(rows, c)}
            picked={picked[c.key] ?? new Set()}
            onToggle={(o) => toggle(c.key, o)}
          />
        ))}
        {Object.values(picked).some((s) => s.size) || query ? (
          <button
            onClick={() => { setPicked({}); setQuery(""); }}
            className="meta rounded-full border px-3 py-1.5 border-line-2 text-grey transition-colors hover:border-red-300 hover:text-red-700"
          >
            CLEAR ×
          </button>
        ) : null}
        <div className="ml-auto flex items-center gap-2">{toolbar}</div>
      </div>

      {/* active facets hint */}
      <AnimatePresence>
        {Object.values(picked).some((s) => s.size) ? (
          <motion.div exit={{ opacity: 0 }} className="meta mb-2 text-grey-2">
            FILTERED — {num(filtered.length)} OF {num(rows.length)} RECORDS
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* table */}
      {filtered.length === 0 ? (
        empty ? <EmptyState title={empty.title} body={empty.body} /> : (
          <div className="meta rounded-md border border-dashed border-line-2 px-6 py-10 text-center text-grey-2">No records match the current filters.</div>
        )
      ) : (
        <div className="overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[720px] border-collapse bg-paper text-left">
            <thead>
              <tr className="border-b border-line bg-paper-2/60">
                {cols.map((c) => (
                  <th key={c.key} style={{ width: c.width }} className={cn(HIDE[c.hideBelow ?? "" as keyof typeof HIDE] ?? [], "meta whitespace-nowrap px-3.5 py-3 text-grey-2")}>
                    {c.text ? (
                      <button
                        onClick={() => setSort((s) => s?.key === c.key ? { key: c.key, dir: s.dir === 1 ? -1 : 1 } : { key: c.key, dir: 1 })}
                        className={cn("inline-flex items-center gap-1 transition-colors hover:text-ink", sort?.key === c.key && "text-ink")}
                      >
                        {c.label}
                        <span aria-hidden="true" className={cn("transition-opacity", sort?.key === c.key ? "opacity-100" : "opacity-0")}>
                          {sort?.dir === -1 ? "▲" : "▼"}
                        </span>
                      </button>
                    ) : c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((r, i) => (
                <tr
                  key={rowKey(r, i)}
                  tabIndex={onRow ? 0 : undefined}
                  onClick={onRow ? () => onRow(r) : undefined}
                  onKeyDown={onRow ? (e) => e.key === "Enter" && onRow(r) : undefined}
                  className={cn(
                    "group cursor-default border-b border-line/70 last:border-b-0 text-[0.86rem] text-ink transition-colors",
                    !compact && "py-1",
                    onRow && "cursor-pointer hover:bg-paper-2",
                  )}
                >
                  {cols.map((c) => (
                    <td key={c.key} style={{ width: c.width }}
                      className={cn(
                        "px-3.5 py-3 align-middle",
                        HIDE[c.hideBelow ?? "" as keyof typeof HIDE] ?? [],
                        c.align === "right" && "text-right tabular-nums",
                        c.text && "font-mono text-[0.8rem]",
                      )}
                    >
                      {c.cell(r)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > limit ? (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setLimit((l) => l + pageSize)}
            className="meta link-underline px-4 py-2 text-ink"
          >
            SHOW {Math.min(pageSize, filtered.length - limit)} MORE — {num(filtered.length - limit)} REMAINING
          </button>
        </div>
      ) : null}
    </div>
  );
}

function optionsFor<T>(rows: T[], c: Col<T>): string[] {
  const set = new Map<string, number>();
  for (const r of rows) {
    const v = c.text?.(r) ?? String((r as never)[c.key]);
    set.set(v, (set.get(v) ?? 0) + 1);
  }
  return [...set.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([v]) => v);
}

function FilterChip({ label, options, picked, onToggle }: {
  label: string; options: string[]; picked: Set<string>; onToggle: (o: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "meta inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 whitespace-nowrap transition-colors",
          picked.size ? "border-ink bg-ink text-paper" : "border-line-2 text-grey hover:border-ink hover:text-ink",
        )}
      >
        {picked.size ? `${label} · ${picked.size}` : label}
        <span aria-hidden="true">▾</span>
      </button>
      {open ? (
        <>
          <button aria-hidden="true" tabIndex={-1} className="fixed inset-0 z-30 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-40 mt-1.5 w-56 rounded-md border border-line bg-paper p-1.5 shadow-lift">
            {options.map((o) => (
              <button
                key={o}
                onClick={() => { onToggle(o); setOpen(false); }}
                className={cn(
                  "meta flex w-full items-center gap-2 rounded-xs px-2.5 py-2 text-left transition-colors",
                  picked.has(o) ? "bg-ink text-paper" : "text-grey hover:bg-paper-2 hover:text-ink",
                )}
              >
                <span aria-hidden="true" className={cn("inline-block h-2.5 w-2.5 rounded-full border", picked.has(o) ? "border-paper bg-paper" : "border-line-2")} />
                <span className="truncate">{o}</span>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
