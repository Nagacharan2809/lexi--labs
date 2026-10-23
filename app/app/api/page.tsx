"use client";

/* API — keyed access, webhook wiring, and docs that compile in your head. */

import { useState } from "react";
import { API_KEYS, WEBHOOKS } from "@/lib/app/data";
import { PageHead, Panel, Chip, Tile, Toggle } from "@/components/app/ui";
import { cn } from "@/lib/utils";

interface KeyRow {
  id: string;
  label: string;
  masked: string;
  full: string;
  created: string;
  scopes: string;
  lastUsed: string;
  env: "production" | "sandbox";
  revoked: boolean;
}

const KEYS: KeyRow[] = API_KEYS.map((k, i) => ({
  id: `KEY-${i + 1}`,
  label: k.label,
  masked: k.masked,
  full: k.masked.replace("••••••••", i === 0 ? "xa4k2f9mtz" : "tes0731demo"),
  created: k.created,
  scopes: k.scope,
  lastUsed: k.lastUsed,
  env: k.label.includes("production") ? "production" : "sandbox",
  revoked: false,
}));

export default function ApiPage() {
  const [keys, setKeys] = useState<KeyRow[]>(KEYS);
  const [hooks, setHooks] = useState(() => WEBHOOKS.map((w, i) => ({ ...w, id: `WH-${i + 1}`, on: true })));
  const [revealed, setRevealed] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [tab, setTab] = useState<"curl" | "js" | "py">("curl");

  const reveal = (id: string) =>
    setRevealed((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));

  const copy = async (k: KeyRow) => {
    try {
      await navigator.clipboard.writeText(keys.find((x) => x.id === k.id)?.full ?? k.masked);
    } catch {
      /* clipboard unavailable in some browsers — the flash still confirms the press */
    }
    setCopied(k.id);
    window.setTimeout(() => setCopied(null), 2200);
  };

  return (
    <>
      <PageHead
        kicker="Developer · API & webhooks"
        title="The dev surface."
        sub="The same runtime the employees run on, keyed for your own software. Read-mostly by default; mutations are scoped and logged."
      />

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Active keys" value={keys.filter((k) => !k.revoked).length} sub={`${keys.filter((k) => k.revoked).length} revoked · rotation 90d`} />
        <Tile label="Calls today (keys)" value="748" sub="₹9 / 1k calls · provider pass-through" />
        <Tile label="Webhooks" value={`${hooks.filter((h) => h.on).length}/${hooks.length}`} sub="Event streams · toggled live" />
        <Tile label="Error rate" value="0.4%" sub="429/5xx on key traffic" tone="blue" />
      </div>

      <Panel className="mb-6" title="API keys" kicker="MASKED BY DEFAULT — REVEAL IS PER-KEY" pad>
        <ul role="list" className="divide-y divide-line">
          {keys.map((k) => {
            const shown = revealed.includes(k.id);
            return (
              <li key={k.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-baseline gap-2.5">
                    <span className="text-[0.9rem] font-medium text-ink">{k.label}</span>
                    <Chip tone={k.env === "production" ? "green" : "neutral"}>{k.env.toUpperCase()}</Chip>
                    {k.revoked ? <Chip tone="red">REVOKED</Chip> : null}
                  </p>
                  <p className="meta mt-1 text-grey-2">
                    CREATED {k.created.toUpperCase()} · LAST USED {k.lastUsed.toUpperCase()} · SCOPES {k.scopes.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <code className={cn("hidden rounded-sm bg-paper-3 px-3 py-2 font-mono text-[0.78rem] lg:block", k.revoked && "text-grey-2 line-through")}>
                    {shown ? k.full : k.masked}
                  </code>
                  {!k.revoked ? (
                    <>
                      <button onClick={() => reveal(k.id)} className="meta link-underline text-ink">{shown ? "HIDE" : "REVEAL"}</button>
                      <button onClick={() => copy(k)} className="meta link-underline text-blue-deep">{copied === k.id ? "COPIED ✓" : "COPY"}</button>
                      <button onClick={() => setKeys((ks) => ks.map((x) => (x.id === k.id ? { ...x, revoked: true } : x)))} className="meta text-red-700 hover:text-red-800">REVOKE</button>
                    </>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="meta mt-4 text-grey-2">KEYS CARRY SCOPES, NOT ROLES — EMPLOYEES INHERIT NOTHING FROM A KEY. SECRET IS SHOWN ONCE; ROTATION SHOULD FOLLOW.</p>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Webhooks" kicker="TOGGLE A STREAM — STATUS IS THE REAL DELIVERY LANE" pad>
          <ul role="list" className="divide-y divide-line">
            {hooks.map((h) => (
              <li key={h.id} className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="font-mono text-[0.82rem] text-ink">{h.url}</p>
                  <p className="meta mt-1 text-grey-2">{h.events.join(" · ")}</p>
                  <p className={cn("meta mt-1", h.on ? "text-emerald-700" : "text-grey")}>
                    {(h.on ? h.status : `PAUSED — was: ${h.status}`).toUpperCase()}
                  </p>
                </div>
                <Toggle on={h.on} label={`Toggle ${h.url}`} onChange={(v) => setHooks((hs) => hs.map((x) => (x.id === h.id ? { ...x, on: v } : x)))} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Docs — first call in one minute" kicker="SWITCH A DIALECT" pad
          actions={
            <div className="flex gap-1.5">
              {(["curl", "js", "py"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={cn("meta rounded-sm border px-2.5 py-1.5 transition-colors", tab === t ? "border-ink bg-ink text-paper" : "border-line-2 text-grey hover:border-ink hover:text-ink")}>
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          }>
          <div className="rounded-sm border border-line-2 bg-ink p-4">
            <pre className="overflow-x-auto font-mono text-[0.74rem] leading-relaxed text-paper/90">{DOCS[tab]}</pre>
          </div>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-[0.82rem]">
            <dt className="meta text-grey-2">BASE</dt><dd className="font-mono text-ink">https://api.lexi-labs.ai/v1</dd>
            <dt className="meta text-grey-2">AUTH</dt><dd className="text-grey">Bearer — a key from the table above</dd>
            <dt className="meta text-grey-2">IDEMPOTENCY</dt><dd className="text-grey">Idempotency-Key header on every POST</dd>
            <dt className="meta text-grey-2">REPLAY</dt><dd className="text-grey">Every ledger query is deterministic</dd>
            <dt className="meta text-grey-2">NO-THOUGHT</dt><dd className="text-grey">Traces expose auditable actions only — never chain-of-thought</dd>
          </dl>
        </Panel>
      </div>
    </>
  );
}

const DOCS: Record<"curl" | "js" | "py", string> = {
  curl: `# Ledger — outcomes of the flagship employee
curl https://api.lexi-labs.ai/v1/employees/LXS-000421/outcomes \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Idempotency-Key: demo-001"

# → { "date": "2026-10-23",
#     "leads": 1200, "connected": 986,
#     "interested": 421, "convinced": 94, "confirmed": 126,
#     "records": "…/outcomes/records" }`,
  js: `import { Lexi } from "@lexi-labs/sdk";

const lexi = new Lexi({ key: process.env.LEXI_KEY });
const day = await lexi.employees("LXS-000421")
  .outcomes.for("2026-10-23");

console.log(day.confirmed); // 126 — open .records to drill
const trace = await lexi.ledgers.trace("LD-1000"); // signed action edges`,
  py: `from lexi_labs import Lexi

lexi = Lexi(key=os.environ["LEXI_KEY"])
day = lexi.employees("LXS-000421").outcomes.for_("2026-10-23")
print(day.confirmed)  # 126

trace = lexi.ledgers.trace("LD-1000")  # auditable action edges`,
};
