"use client";

/* INTEGRATIONS (workspace) — the developer surface employees inherit from. */

import { useState } from "react";
import Link from "next/link";
import { INTEGRATIONS, getEmployee, type Integration } from "@/lib/app/data";
import { PageHead, Tile, Chip } from "@/components/app/ui";
import { cn } from "@/lib/utils";

const STATE_TONE: Record<Integration["state"], { tone: "green" | "amber" | "neutral"; label: string }> = {
  connected: { tone: "green", label: "CONNECTED" },
  error: { tone: "amber", label: "ACTION NEEDED" },
  disconnected: { tone: "neutral", label: "AVAILABLE" },
};

export default function WorkspaceIntegrationsPage() {
  const e = getEmployee("voice-sales");
  void e;
  const [list, setList] = useState<Integration[]>(INTEGRATIONS);
  const [busy, setBusy] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const set = (name: string, patch: Partial<Integration>) =>
    setList((xs) => xs.map((x) => (x.name === name ? { ...x, ...patch } : x)));

  const toggle = (x: Integration) => {
    setBusy(x.name);
    window.setTimeout(() => {
      if (x.state === "connected") {
        set(x.name, { state: "disconnected", detail: "" });
        setFlash(`${x.name} — DISCONNECTED · EMPLOYEE SCOPES REVOKED AT NEXT CALL`);
      } else {
        set(x.name, { state: "connected", detail: "Connected just now — scopes provisioned" });
        setFlash(`${x.name} — CONNECTED · 3 CHECKS PASSED`);
      }
      setBusy(null);
      window.setTimeout(() => setFlash(null), 3200);
    }, 1200);
  };

  const connected = list.filter((x) => x.state === "connected").length;

  return (
    <>
      <PageHead
        kicker="Integrations · Workspace"
        title="The runtime's hands."
        sub="Connections live here once — employees inherit scoped subsets. Revoking here is instant, because permission is re-evaluated on every tool call."
        actions={<Chip tone="green" pulse>{connected} LIVE</Chip>}
      />

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Connected" value={connected} sub={`${list.length - connected} available`} />
        <Tile label="Records synced today" value="166" sub="Marketplace CRMs" />
        <Tile label="Channel traffic" value="2,311" sub="WhatsApp + email + voice" />
        <Tile label="Token health" value="1 expiring" sub="Salesforce — refresh queued" tone="amber" />
      </div>

      {flash ? (
        <div className="mb-6 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="meta text-emerald-800">✓ {flash}</p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((x) => {
          const t = STATE_TONE[x.state];
          return (
            <div key={x.name} className={cn(
              "group relative flex flex-col rounded-md border bg-paper p-5 transition-all duration-300 ease-brand hover:-translate-y-px hover:shadow-lift",
              x.state === "error" ? "border-amber-300" : "border-line",
            )}>
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 grad-rule transition-transform duration-500 ease-brand group-hover:scale-x-100" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="display text-[1rem] uppercase text-ink">{x.name}</p>
                  <p className="meta mt-1 text-grey">{x.category.toUpperCase()} · {x.blurb}</p>
                </div>
                <Chip tone={t.tone}>{t.label}</Chip>
              </div>
              {x.detail ? <p className="meta mt-3 text-grey-2">{x.detail}</p> : <p className="meta mt-3 text-grey-2">No traffic on record yet.</p>}
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-3.5">
                {x.permissions.map((p) => (
                  <span key={p} className="meta rounded-full bg-paper-3 px-2.5 py-1 text-grey">{p.toUpperCase()}</span>
                ))}
              </div>
              <div className="mt-4 pt-1">
                <button
                  onClick={() => toggle(x)}
                  disabled={busy === x.name}
                  className={cn(
                    "meta rounded-sm px-4 py-2.5 transition-all duration-200",
                    busy === x.name
                      ? "cursor-wait border border-line-2 text-grey-2"
                      : x.state === "connected"
                        ? "border border-line-2 text-grey hover:border-red-300 hover:text-red-700"
                        : "bg-ink text-paper hover:-translate-y-px hover:shadow-lift",
                  )}
                >
                  {x.state === "connected" ? "Disconnect" : x.state === "error" ? "Refresh token" : "Connect"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-md border border-line bg-paper p-5 md:flex-row md:items-center">
        <p className="max-w-[70ch] text-[0.88rem] leading-relaxed text-grey">
          Employees never hold raw credentials — the runtime brokers every call. Keys, scopes and webhooks belong to the
          developer surface, and employee access is assigned inside each profile.
        </p>
        <div className="flex shrink-0 gap-2.5">
          <Link href={`/app/workforce/voice-sales/integrations`} className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">
            Employee view →
          </Link>
          <Link href="/app/api" className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
            API &amp; webhooks →
          </Link>
        </div>
      </div>
    </>
  );
}
