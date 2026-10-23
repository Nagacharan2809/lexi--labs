"use client";

/* INTEGRATIONS — employee-scoped connection surface with live toggles + tests. */

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { INTEGRATIONS, getEmployee, type Integration } from "@/lib/app/data";
import { PageHead, Panel, Chip, Tile } from "@/components/app/ui";
import { Modal } from "@/components/app/overlay";
import { cn } from "@/lib/utils";

const STATE_TONE: Record<Integration["state"], { tone: "green" | "amber" | "neutral"; label: string }> = {
  connected: { tone: "green", label: "CONNECTED" },
  error: { tone: "amber", label: "ACTION NEEDED" },
  disconnected: { tone: "neutral", label: "AVAILABLE" },
};

export default function IntegrationsPage() {
  const { employee: slug } = useParams<{ employee: string }>();
  const e = getEmployee(slug ?? "");
  const [list, setList] = useState<Integration[]>(INTEGRATIONS);
  const [detailName, setDetailName] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const [testDone, setTestDone] = useState<string | null>(null);

  if (!e) {
    return (
      <>
        <PageHead kicker="Integrations" title="Integrations." />
        <p className="text-[0.9rem] text-grey">Employee not found — return to the workforce.</p>
      </>
    );
  }

  const set = (name: string, patch: Partial<Integration>) =>
    setList((xs) => xs.map((x) => (x.name === name ? { ...x, ...patch } : x)));

  const connect = (name: string) => {
    set(name, { state: "connected", detail: "Connected just now — permissions provisioned" });
    setDetailName(null);
  };
  const disconnect = (name: string) => {
    set(name, { state: "disconnected", detail: "" });
  };
  const refresh = (name: string) => {
    setTesting(name);
    window.setTimeout(() => {
      set(name, { state: "connected", detail: "Token refreshed · 3/3 checks passed just now" });
      setTesting(null);
      setTestDone(name);
      window.setTimeout(() => setTestDone(null), 2600);
    }, 1500);
  };

  const detail = list.find((x) => x.name === detailName) ?? null;
  const connected = list.filter((x) => x.state === "connected").length;

  return (
    <>
      <PageHead
        kicker={`${e.name} · Integrations`}
        title="Integrations."
        sub="Where the employee's hands reach — CRM, channels, calendar. Every connection declares its permissions and is revocable in one click."
        actions={<Chip tone="green" pulse>{connected} LIVE</Chip>}
      />

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Connected" value={connected} sub={`of ${list.length} available`} />
        <Tile label="Records updated today" value="166" sub="Nova Realty CRM via sync" />
        <Tile label="Messages sent" value="2,311" sub="WhatsApp + email templates" />
        <Tile label="Action needed" value="1" sub="Salesforce token expired" tone="amber" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((x) => {
          const t = STATE_TONE[x.state];
          return (
            <div
              key={x.name}
              className={cn(
                "group relative flex flex-col rounded-md border bg-paper p-5 transition-all duration-300 ease-brand hover:-translate-y-px hover:shadow-lift",
                x.state === "error" ? "border-amber-300" : "border-line",
              )}
            >
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

              <div className="mt-4 flex items-center gap-3 pt-1">
                <button onClick={() => setDetailName(x.name)} className="meta link-underline text-ink">MANAGE →</button>
                {x.state === "connected" ? (
                  <>
                    <button onClick={() => refresh(x.name)} className="meta text-grey transition-colors hover:text-ink">
                      {testing === x.name ? "TESTING…" : "TEST"}
                    </button>
                    <button onClick={() => disconnect(x.name)} className="meta text-red-700 transition-colors hover:text-red-800">DISCONNECT</button>
                  </>
                ) : (
                  <button onClick={() => (x.state === "error" ? refresh(x.name) : setDetailName(x.name))} className="meta text-blue-deep transition-colors hover:text-ink">
                    {x.state === "error" ? (testing === x.name ? "REFRESHING…" : "REFRESH TOKEN") : "CONNECT"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {testDone ? (
        <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-elevated">
          <p className="meta text-emerald-800">✓ {testDone} — 3 CHECKS PASSED · auth · permissions · round-trip call</p>
        </div>
      ) : null}

      <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-md border border-line bg-paper p-5 md:flex-row md:items-center">
        <p className="max-w-[70ch] text-[0.88rem] leading-relaxed text-grey">
          Employee integrations mirror the workspace developer surface — keys, scopes and webhooks are managed once
          and every employee inherits the scoped subset its manager assigns.
        </p>
        <Link href="/app/api" className="meta shrink-0 rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">
          API &amp; webhooks →
        </Link>
      </div>

      <Modal open={Boolean(detail)} onClose={() => setDetailName(null)} kicker={detail ? `${detail.category} integration` : ""} title={detail?.name ?? ""}
        footer={
          <>
            <button onClick={() => setDetailName(null)} className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">Close</button>
            {detail?.state === "connected" ? (
              <button onClick={() => detail && disconnect(detail.name)} className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">Keep connected</button>
            ) : (
              <button onClick={() => detail && connect(detail.name)} className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">Connect</button>
            )}
          </>
        }>
        {detail ? (
          <div className="flex flex-col gap-4">
            <p className="text-[0.9rem] leading-relaxed text-grey">{detail.blurb}. {detail.detail || "Nothing recorded yet."}</p>
            <div>
              <p className="meta mb-2 text-grey-2">PERMISSIONS DECLARED</p>
              <div className="flex flex-wrap gap-1.5">
                {detail.permissions.map((p) => (
                  <span key={p} className="meta rounded-full bg-paper-3 px-2.5 py-1 font-mono text-grey">{p}</span>
                ))}
              </div>
            </div>
            <Panel title="Scope bound to this employee" kicker="DIFFERENT FROM KEY SCOPES" pad>
              <p className="text-[0.86rem] leading-relaxed text-grey">
                {e.name} only sees records its workflows touch. Access is re-evaluated at runtime on every tool call,
                so revoking here takes effect on the next call — no restart window.
              </p>
            </Panel>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
