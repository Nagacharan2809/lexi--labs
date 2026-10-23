/* Server-safe SVG charts — no chart dependency; tuned to the brand palette. */

import { cn } from "@/lib/utils";
import { num } from "@/lib/app/format";

export function Spark({ points, tone = "#2b5aa7", height = 44, className }: {
  points: number[]; tone?: string; height?: number; className?: string;
}) {
  if (!points.length) return null;
  const w = 120;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const px = (i: number) => (i / (points.length - 1)) * w;
  const py = (v: number) => height - 4 - ((v - min) / Math.max(1, max - min)) * (height - 10);
  const line = points.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(" ");
  const id = `sg-${tone.replace("#", "")}`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className={cn("w-full", className)} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity="0.22" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w},${height} L0,${height} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={tone} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={px(points.length - 1)} cy={py(points[points.length - 1])} r="2.4" fill={tone} />
    </svg>
  );
}

export function Bars({ data, tone = "#2b5aa7", height = 120, unit = "", className, highlightLast }: {
  data: { label: string; value: number }[]; tone?: string; height?: number; unit?: string;
  className?: string; highlightLast?: boolean;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const last = data.length - 1;
  return (
    <div className={className}>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((d, i) => (
          <div key={d.label + i} className="group flex flex-1 flex-col items-center justify-end gap-1.5" title={`${d.label}: ${num(d.value)}${unit}`}>
            <span className="meta hidden tabular-nums text-grey group-hover:block">{num(d.value)}</span>
            <span
              className={cn("w-full rounded-t-[2px] transition-all duration-300", highlightLast && i === last && "ring-1 ring-orange/40")}
              style={{
                height: `${Math.max(3, (d.value / max) * (height - 18))}px`,
                background: i === last && highlightLast
                  ? "linear-gradient(180deg,#e8763a,#d95f2b)"
                  : `linear-gradient(180deg,${tone}, ${tone}55)`,
                opacity: i === last && highlightLast ? 1 : 0.92,
              }}
            />
          </div>
        ))}
      </div>
      <div className="meta mt-2 flex justify-between text-grey-2">
        <span>{data[0]?.label}</span><span>{data[last]?.label}</span>
      </div>
    </div>
  );
}

export function Donut({ value, size = 84, tone = "#2b5aa7", track = "#ecece6", stroke = 8, label, sub }: {
  value: number; size?: number; tone?: string; track?: string; stroke?: number; label?: string; sub?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={tone} strokeWidth={stroke}
          strokeDasharray={`${filled} ${c - filled}`} strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="display tabular-nums text-[1.05rem] text-ink">{label ?? `${Math.round(value)}`}</span>
        {sub ? <span className="meta text-grey-2">{sub}</span> : null}
      </div>
    </div>
  );
}

/* Vertical funnel — the spec's block-funnel: intent outcomes, sales
   outcomes and final outcomes as separate labelled bands. */
export function VFunnel({ steps, note }: {
  steps: { label: string; value: React.ReactNode; band?: string; tone?: string }[]; note?: string;
}) {
  return (
    <div className="flex flex-col">
      {steps.map((s, i) => (
        <div key={s.label + i} className="flex flex-col">
          <div className="flex items-baseline justify-between gap-6 border-b border-line py-3.5">
            <span className="meta text-grey">{s.label}</span>
            <span className="display tabular-nums text-[1.5rem] text-ink">{s.value}</span>
          </div>
          {s.tone ? <div aria-hidden="true" className="h-[2px] w-full opacity-80" style={{ background: s.tone }} /> : null}
          {s.band ? <span className="meta mt-1 text-grey-2">{s.band}</span> : null}
          {i < steps.length - 1 ? <span aria-hidden="true" className="meta my-1 text-grey-2">↓</span> : null}
        </div>
      ))}
      {note ? <p className="mt-4 text-[0.82rem] leading-relaxed text-grey-2">{note}</p> : null}
    </div>
  );
}

export function HBars({ rows, max, unit = "" }: {
  rows: { label: string; value: number; display?: string; sub?: string; tone?: string }[];
  max?: number; unit?: string;
}) {
  const m = max ?? Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="flex flex-col">
      {rows.map((r, i) => (
        <div key={r.label + i} className="border-b border-line py-3 last:border-b-0">
          <div className="flex items-baseline justify-between gap-4">
            <span className="meta text-grey">{r.label}</span>
            <span className="meta tabular-nums text-ink">{r.display ?? num(r.value)}{unit}</span>
          </div>
          <div className="mt-2 h-[6px] w-full overflow-hidden rounded-full bg-paper-3">
            <div className="h-full rounded-full" style={{
              width: `${(r.value / m) * 100}%`,
              background: r.tone ?? "linear-gradient(90deg,#2b5aa7,#e8763a)",
            }} />
          </div>
          {r.sub ? <p className="meta mt-1.5 text-grey-2">{r.sub}</p> : null}
        </div>
      ))}
    </div>
  );
}

/* execution-stack bar — used for cost + value breakdowns */
export function StackBar({ parts }: { parts: { label: string; value: number; tone: string }[] }) {
  const total = parts.reduce((a, p) => a + p.value, 0) || 1;
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-paper-3">
        {parts.map((p, i) => (
          <div key={p.label} style={{ width: `${(p.value / total) * 100}%`, background: p.tone }} className={i === 0 ? "" : "ml-[1px]"} title={`${p.label}: ${num(p.value)}`} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {parts.map((p) => (
          <span key={p.label} className="meta inline-flex items-center gap-2 text-grey">
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-[2px]" style={{ background: p.tone }} />
            {p.label} <span className="tabular-nums text-grey-2">{num(p.value)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
