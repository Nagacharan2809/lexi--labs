/* Small shared renderers for lead/call/outcome surfaces. */

import { cn } from "@/lib/utils";
import type { Lead } from "@/lib/app/data";

export function BoolCell({ v }: { v: boolean }) {
  return (
    <span className={cn("meta inline-flex rounded-full border px-2 py-0.5",
      v ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-line-2 bg-paper-3 text-grey-2")}>
      {v ? "YES" : "NO"}
    </span>
  );
}

const STATUS: Record<Lead["status"], { label: string; cls: string }> = {
  called: { label: "CONNECTED", cls: "border-blue/25 bg-blue-tint text-blue-deep" },
  connected: { label: "CONNECTED", cls: "border-blue/25 bg-blue-tint text-blue-deep" },
  "no-answer": { label: "NO ANSWER", cls: "border-line-2 bg-paper-3 text-grey" },
  busy: { label: "BUSY", cls: "border-line-2 bg-paper-3 text-grey" },
  failed: { label: "FAILED", cls: "border-red-200 bg-red-50 text-red-700" },
  "wrong-number": { label: "WRONG NO.", cls: "border-line-2 bg-paper-3 text-grey" },
};

export function StatusCell({ s }: { s: Lead["status"] }) {
  const st = STATUS[s];
  return <span className={cn("meta inline-flex whitespace-nowrap rounded-full border px-2 py-0.5", st.cls)}>{st.label}</span>;
}

const INTEREST: Record<Lead["interest"], { label: string; cls: string }> = {
  interested: { label: "INTERESTED", cls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  "not-interested": { label: "NOT INTERESTED", cls: "border-line-2 bg-paper-3 text-grey" },
  callback: { label: "CALLBACK", cls: "border-orange/30 bg-orange-tint text-orange-deep" },
  maybe: { label: "MAYBE", cls: "border-line-2 bg-paper-3 text-grey" },
  "needs-info": { label: "NEEDS INFO", cls: "border-blue/25 bg-blue-tint text-blue-deep" },
};

export function InterestCell({ i }: { i: Lead["interest"] }) {
  const v = INTEREST[i];
  return <span className={cn("meta inline-flex whitespace-nowrap rounded-full border px-2 py-0.5", v.cls)}>{v.label}</span>;
}

const TONE_INTENT: Record<Lead["intent"], string> = {
  high: "border-orange/40 bg-orange-tint text-orange-deep",
  med: "border-blue/20 bg-blue-tint text-blue-deep",
  low: "border-line-2 bg-paper-3 text-grey",
};
export function IntentCell({ i }: { i: Lead["intent"] }) {
  return <span className={cn("meta inline-flex rounded-full border px-2 py-0.5", TONE_INTENT[i])}>{i.toUpperCase()}</span>;
}

const TONE_SENT: Record<Lead["sentiment"], string> = {
  positive: "text-emerald-700",
  neutral: "text-grey",
  negative: "text-red-700",
};
export function SentimentCell({ s }: { s: Lead["sentiment"] }) {
  return <span className={cn("meta", TONE_SENT[s])}>{s.toUpperCase()}</span>;
}

export function ScopeList({ items }: { items: string[] }) {
  return (
    <ul role="list" className="flex flex-col gap-2">
      {items.map((t, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[0.88rem] text-ink">
          <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full grad-rule" />
          {t}
        </li>
      ))}
    </ul>
  );
}
