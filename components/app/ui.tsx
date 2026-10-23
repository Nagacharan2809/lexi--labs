/* LEXI product atoms — server-safe, no hooks. Client pieces live in ./live.tsx */

import { cn } from "@/lib/utils";
import Link from "next/link";

export type Tone =
  | "blue" | "blue-deep" | "orange" | "orange-deep" | "ember"
  | "green" | "amber" | "red" | "neutral" | "ink" | "paper";

const TONE: Record<Tone, string> = {
  blue: "bg-blue-tint text-blue-deep border-blue/25",
  "blue-deep": "bg-blue-deep text-paper border-blue-deep",
  orange: "bg-orange-tint text-orange-deep border-orange/30",
  "orange-deep": "bg-orange-deep text-paper border-orange-deep",
  ember: "bg-orange-tint text-[#9c5a17] border-ember/40",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-red-50 text-red-700 border-red-200",
  neutral: "bg-paper-3 text-grey border-line-2",
  ink: "bg-ink text-paper border-ink",
  paper: "bg-paper text-ink border-line-2",
};

export function Chip({ tone = "neutral", children, className, pulse }: {
  tone?: Tone; children: React.ReactNode; className?: string; pulse?: boolean;
}) {
  return (
    <span className={cn("meta inline-flex items-center gap-2 rounded-full border px-2.5 py-1", TONE[tone], className)}>
      {pulse ? <span aria-hidden="true" className="chip-live text-current" /> : null}
      {children}
    </span>
  );
}

export function Dot({ tone = "green", className }: { tone?: Tone; className?: string }) {
  return <span aria-hidden="true" className={cn("chip-live", TONE[tone].split(" ").find((c) => c.startsWith("text-")), className)} />;
}

/* ------------------------------------------------------------- layout */

export function PageHead({ kicker, title, sub, actions, children, wide }: {
  kicker: string; title: string; sub?: React.ReactNode;
  actions?: React.ReactNode; children?: React.ReactNode; wide?: boolean;
}) {
  return (
    <header className={cn("mb-10 flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between", wide && "md:mb-12")}>
      <div className="max-w-[72ch]">
        <p className="meta text-grey">{kicker}</p>
        <h1 className="display-md mt-3 text-[clamp(2rem,4.6vw,3.4rem)] uppercase text-ink">{title}</h1>
        {sub ? <div className="mt-3 text-[0.98rem] leading-relaxed text-grey">{sub}</div> : null}
        {children}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function Panel({ title, kicker, actions, children, className, pad = true }: {
  title?: string; kicker?: string; actions?: React.ReactNode; children: React.ReactNode;
  className?: string; pad?: boolean;
}) {
  return (
    <section className={cn("rounded-md border border-line bg-paper", className)}>
      {title || actions ? (
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5 md:px-6">
          <div className="min-w-0">
            {kicker ? <p className="meta text-grey-2">{kicker}</p> : null}
            <h2 className="display truncate text-[0.98rem] font-semibold uppercase tracking-[0.04em] text-ink">{title}</h2>
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      <div className={pad ? "p-5 md:p-6" : ""}>{children}</div>
    </section>
  );
}

export function Tile({ label, value, sub, href, className, big }: {
  label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: Tone;
  href?: string; className?: string; big?: boolean;
}) {
  const body = (
    <div className={cn(
      "group relative overflow-hidden rounded-md border border-line bg-paper p-5 transition-all duration-300 ease-brand",
      href && "cursor-pointer hover:-translate-y-px hover:border-line-2 hover:shadow-lift",
      className,
    )}>
      {/* spectral hairline, revealed on hover like the brand sweep */}
      <span aria-hidden="true" className={cn(
        "absolute inset-x-0 top-0 h-[2px] grad-rule transition-transform duration-500 ease-brand scale-x-0 origin-left",
        "group-hover:scale-x-100",
      )} />
      <p className="meta text-grey-2">{label}</p>
      <p className={cn("display mt-2.5 tabular-nums text-ink", big ? "text-[clamp(2.2rem,4vw,3rem)]" : "text-[1.9rem]")}>{value}</p>
      {sub ? <div className="meta mt-2 text-grey">{sub}</div> : null}
    </div>
  );
  return href ? <Link href={href} className="block">{body}</Link> : body;
}

export function KeyVal({ k, v, mono }: { k: string; v: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-line py-2.5 last:border-b-0">
      <span className="meta text-grey-2">{k}</span>
      <span className={cn("text-right text-[0.9rem] text-ink", mono && "font-mono text-[0.82rem]")}>{v}</span>
    </div>
  );
}

/* ------------------------------------------------------------- states */

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-md border border-dashed border-line-2 bg-paper px-8 py-14 text-center">
      <span aria-hidden="true" className="inline-block h-8 w-12 rounded-[2px]" style={{ background: "linear-gradient(100deg,#2b5aa7,#e8763a)", opacity: 0.85 }} />
      <p className="display text-[1.4rem] uppercase text-ink">{title}</p>
      <p className="max-w-[46ch] text-[0.9rem] leading-relaxed text-grey">{body}</p>
      {action}
    </div>
  );
}

export function ErrorState({ title, what, why, fix, retry, }: {
  title: string; what: string; why: string; fix: string; retry?: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50/60 p-6">
      <p className="meta text-red-700">Error — {title}</p>
      <p className="mt-3 text-[0.95rem] font-medium text-ink">{what}</p>
      <p className="mt-1 text-[0.9rem] text-grey">Why: {why}</p>
      <p className="text-[0.9rem] text-grey">Fix: {fix}</p>
      <div className="mt-4 flex items-center gap-3">{retry ?? <span className="meta text-grey-2">Retry is instantiated by the surface that raised it.</span>}</div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("block animate-pulse rounded-sm bg-paper-3", className)} />;
}

export function SkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-24" />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- misc */

export function Progress({ value, tone = "blue", className, label }: {
  value: number; tone?: Tone; className?: string; label?: string;
}) {
  const fill: Record<string, string> = {
    blue: "bg-blue", "blue-deep": "bg-blue-deep", orange: "bg-orange",
    "orange-deep": "bg-orange-deep", ember: "bg-ember", green: "bg-emerald-500",
    amber: "bg-amber-500", red: "bg-red-500", neutral: "bg-grey-2", ink: "bg-ink", paper: "bg-paper",
  };
  return (
    <div className={className}>
      {label ? <div className="meta mb-1.5 flex justify-between text-grey-2"><span>{label}</span><span className="tabular-nums">{Math.round(value)}%</span></div> : null}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-3">
        <div className={cn("h-full rounded-full transition-[width] duration-700 ease-brand", fill[tone])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

export function BadgeRef({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[0.78rem] text-grey">{children}</span>;
}

/* controlled on/off switch — works in server pages via client-parent onChange */
export function Toggle({ on, onChange, label }: {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn(
        "relative h-6 w-10 shrink-0 rounded-full border transition-colors duration-200",
        on ? "border-ink bg-ink" : "border-line-2 bg-paper-3",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-all duration-200",
          on ? "left-[calc(100%-18px)] bg-paper" : "left-[2px] bg-grey-2",
        )}
      />
    </button>
  );
}

/* employee identity mark — gradient tick + initials, echoes the brand logo */
export function EmployeeMark({ name, className = "h-10 w-10" }: { name: string; className?: string }) {
  const parts = name.replace("Lexi ", "").split(" ").filter(Boolean);
  const initials = (parts[0]?.[0] ?? "L") + (parts[1]?.[0] ?? "");
  return (
    <span className={cn("relative inline-flex items-center justify-center overflow-hidden rounded-sm", className)}
      style={{ background: "linear-gradient(100deg,#1d4790 0%,#2b5aa7 45%,#7ea6d8 70%,#e8763a 100%)" }}>
      <span className="display absolute inset-0 flex items-center justify-center text-[42%] uppercase text-white/95">{initials}</span>
    </span>
  );
}

export function MonoLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const cls = "meta link-underline inline-flex items-center gap-1.5 text-ink transition-colors hover:text-orange-deep";
  return external ? <a href={href} className={cls} target="_blank" rel="noreferrer">{children}</a> : <Link href={href} className={cls}>{children}</Link>;
}
