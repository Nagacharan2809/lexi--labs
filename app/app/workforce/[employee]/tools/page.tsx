"use client";

/* TOOLS — what the employee may touch, and how often it succeeds. */

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { TOOLS, getEmployee, type ToolRow } from "@/lib/app/data";
import { PageHead, Chip, EmptyState } from "@/components/app/ui";
import { DataTable, type Col } from "@/components/app/table";
import { Modal } from "@/components/app/overlay";

export default function ToolsPage() {
  const { employee: slug } = useParams<{ employee: string }>();
  const e = getEmployee(slug ?? "");
  const [tools, setTools] = useState<ToolRow[]>(TOOLS);
  const [connectOpen, setConnectOpen] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [tested, setTested] = useState<string[]>([]);

  if (!e) {
    return (
      <>
        <PageHead kicker="Tools" title="Tools." />
        <EmptyState title="Employee not found." body="Return to the workforce and pick a valid employee." />
      </>
    );
  }

  const toggleConnect = () => {
    setTools((ts) => ts.map((t) => (
      t.name === "Files" ? { ...t, connected: true, permission: "Read", lastUsed: "just connected", success: null, calls: "0" } : t
    )));
    setConnectOpen(false);
  };

  const runTest = (name: string) => {
    setTesting(name);
    window.setTimeout(() => {
      setTesting(null);
      setTested((x) => [...x, name]);
    }, 1600);
  };

  const connected = tools.filter((t) => t.connected).length;

  const cols: Col<ToolRow>[] = [
    { key: "name", label: "Tool", text: (t) => t.name, cell: (t) => (
      <span>
        <span className="font-medium text-ink">{t.name}</span>
        <span className="meta ml-2.5 text-grey-2">{t.kind.toUpperCase()}</span>
      </span>
    ) },
    { key: "perm", label: "Permission", filterable: true, text: (t) => t.permission, cell: (t) => (
      <Chip tone={t.permission === "Not configured" ? "neutral" : "blue"}>{t.permission.toUpperCase()}</Chip>
    ), hideBelow: "md" },
    { key: "calls", label: "Calls", align: "right", text: (t) => t.calls, cell: (t) => <span className="tabular-nums">{t.calls}</span>, hideBelow: "sm" },
    { key: "success", label: "Success", align: "right", text: (t) => t.success?.toFixed(1) ?? "—", cell: (t) => (
      <span className={"font-mono tabular-nums " + (t.success === null ? "text-grey-2" : t.success >= 97 ? "text-emerald-700" : "text-ink")}>
        {t.success === null ? "—" : `${t.success}%`}
      </span>
    ), hideBelow: "md" },
    { key: "last", label: "Last used", text: (t) => t.lastUsed, cell: (t) => t.lastUsed, hideBelow: "xl" },
    { key: "state", label: "State", text: (t) => (t.connected ? "connected" : "disconnected"), cell: (t) => (
      tested.includes(t.name) ? <Chip tone="green" pulse>TEST PASSED</Chip>
        : t.connected ? <Chip tone="green">CONNECTED</Chip> : <Chip tone="neutral">NOT CONNECTED</Chip>
    ) },
    { key: "act", label: "Action", cell: (t) => (
      <span className="meta flex gap-3">
        {t.connected ? (
          <button onClick={(ev) => { ev.stopPropagation(); runTest(t.name); }} className="link-underline text-ink whitespace-nowrap">
            {testing === t.name ? "TESTING…" : "TEST"}
          </button>
        ) : (
          <button onClick={(ev) => { ev.stopPropagation(); setConnectOpen(true); }} className="link-underline text-blue-deep whitespace-nowrap">CONNECT</button>
        )}
      </span>
    ), hideBelow: "sm" },
  ];

  return (
    <>
      <PageHead
        kicker={`${e.name} · Tools`}
        title="Tools."
        sub="A tool is a scoped permission, not an app icon. Each one is tested from a live hot-path call and rate-limited by policy."
        actions={<Chip tone={connected >= 8 ? "green" : "amber"} pulse>{connected} OF {tools.length} LIVE</Chip>}
      />

      <div className="grid gap-3 md:grid-cols-3">
        {[
          { k: "VOICE GATEWAY", v: "Fleen — ₹0.62/min", d: "69,208 calls · 97.2% success · tool error budget intact" },
          { k: "CRM + CALENDAR", d: "Nova Realty CRM · Google Calendar — booking slot-locked", v: "2,410 · 198 calls" },
          { k: "MESSAGING", d: "WhatsApp Business + workspace SMTP — templates pre-approved", v: "2,311 sends" },
        ].map((b) => (
          <div key={b.k} className="rounded-md border border-line bg-paper p-5">
            <p className="meta text-grey-2">{b.k}</p>
            <p className="display mt-2 text-[1.02rem] uppercase text-ink">{b.v}</p>
            <p className="meta mt-2 text-grey">{b.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <DataTable rows={tools} cols={cols} rowKey={(t) => t.name} searchPlaceholder="Filter tools…" pageSize={10} />
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-md border border-line bg-paper p-5 md:flex-row md:items-center">
        <p className="max-w-[70ch] text-[0.88rem] leading-relaxed text-grey">
          Every tool action is executed through the Fleen runtime with policy validation before the call and a
          ledger entry after it. A tool without permission never appears in the workflow canvas.
        </p>
        <Link href={`/app/workforce/${slug}/permissions`} className="meta shrink-0 rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">
          Edit permissions →
        </Link>
      </div>

      <Modal open={connectOpen} onClose={() => setConnectOpen(false)} kicker="Tools · configure" title="Connect the Files tool"
        footer={
          <>
            <button onClick={() => setConnectOpen(false)} className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">Cancel</button>
            <button onClick={toggleConnect} className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">Connect — Read only</button>
          </>
        }>
        <p className="text-[0.9rem] leading-relaxed text-grey">
          Grants read-only document access inside the workspace bucket. No delete, no external share — uploads by
          employees stay in policy.
        </p>
        <div className="mt-4 flex flex-col gap-2.5">
          {["Read — workspace documents", "Search — full-text index", "No write · no delete"].map((r) => (
            <div key={r} className="flex items-center justify-between rounded-sm border border-line px-3.5 py-2.5 text-[0.86rem]">
              <span className="text-ink">{r}</span>
              <span aria-hidden="true" className="meta flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[0.6rem] text-emerald-700">✓</span>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
