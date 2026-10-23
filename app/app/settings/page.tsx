"use client";

/* SETTINGS — workspace configuration, notifications, and a guarded danger zone. */

import { useState } from "react";
import Link from "next/link";
import { PageHead, Panel, Tile, Chip } from "@/components/app/ui";
import { Toggle } from "@/components/app/ui";
import { cn } from "@/lib/utils";

const DEFAULT_PREFERENCES = [
  { key: "approvals", label: "Approvals to Slack + email", note: "#lexi-ops relay · SLA 15 min on sensitive", on: true },
  { key: "digest", label: "Daily morning digest 08:30", note: "Outcomes, costs, gate status — one email", on: true },
  { key: "gate", label: "Release gate results", note: "Notify on every suite completion", on: true },
  { key: "cost", label: "Cost spike alerts", note: "Voice spend beyond 110% of plan", on: true },
  { key: "knowledge", label: "Knowledge staleness", note: "Source untouched 14+ days", on: false },
];

export default function SettingsPage() {
  const [org, setOrg] = useState({ name: "Nova Realty", id: "nova-realty", region: "ap-south-1 (Mumbai)", tz: "Asia/Kolkata", currency: "INR" });
  const [wage, setWage] = useState({ window: "09:00–21:00", weekend: "Bank holidays only", language: "English + Hindi" });
  const [prefs, setPrefs] = useState(DEFAULT_PREFERENCES);
  const [dirty, setDirty] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "guarded">("idle");

  const patch = (mut: () => void) => { mut(); setDirty(true); setSavedFlash(false); };

  const save = () => { setSavedFlash(true); setDirty(false); window.setTimeout(() => setSavedFlash(false), 3600); };

  const requestDelete = () => {
    setDeleting(false);
    setDeleteStatus("guarded");
  };

  return (
    <>
      <PageHead
        kicker="Settings · Workspace"
        title="Workspace."
        sub="Org identity, guardrails and quiet channels. The things employees feel first — call windows, language, region — live here."
        actions={
          <button
            onClick={save}
            className={cn("meta rounded-sm px-4 py-2.5 transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift",
              dirty ? "bg-ink text-paper" : "border border-line-2 text-grey hover:border-ink hover:text-ink")}
          >
            {dirty ? "Save changes" : savedFlash ? "Saved ✓" : "No changes"}
          </button>
        }
      />

      {savedFlash ? (
        <div className="mb-8 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="meta text-emerald-800">✓ SETTINGS SAVED — CALL-WINDOW AND LANGUAGE CHANGES APPLY ON THE NEXT EMPLOYEE SHIFT, NOT MID-CALL.</p>
        </div>
      ) : null}

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Workspace" value="Nova Realty" sub="nova-realty · ap-south-1" />
        <Tile label="Employees" value="9" sub="5 working · 4 setup lanes" />
        <Tile label="Plan" value="Growth" sub="Billing seat — see billing" />
        <Tile label="Data residency" value="India" sub="ap-south-1 · in-region storage" tone="blue" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Organisation" kicker="LEGAL IDENTITY + REGION" pad>
          <div className="grid gap-3.5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="meta text-grey-2">WORKSPACE NAME</span>
              <input value={org.name} onChange={(e) => patch(() => setOrg({ ...org, name: e.target.value }))} className="field mt-1.5 w-full" />
            </label>
            <label className="block">
              <span className="meta text-grey-2">WORKSPACE ID</span>
              <input value={org.id} disabled className="field mt-1.5 w-full cursor-not-allowed bg-paper-3 text-grey" />
            </label>
            <label className="block">
              <span className="meta text-grey-2">DATA REGION</span>
              <select value={org.region} onChange={(e) => patch(() => setOrg({ ...org, region: e.target.value }))} className="field mt-1.5 w-full">
                <option value="ap-south-1 (Mumbai)">ap-south-1 — Mumbai</option>
                <option value="me-central-1">me-central-1 — Dubai</option>
                <option value="us-east-1">us-east-1 — Virginia</option>
              </select>
            </label>
            <label className="block">
              <span className="meta text-grey-2">TIMEZONE</span>
              <select value={org.tz} onChange={(e) => patch(() => setOrg({ ...org, tz: e.target.value }))} className="field mt-1.5 w-full">
                <option value="Asia/Kolkata">Asia/Kolkata — IST</option>
                <option value="Asia/Dubai">Asia/Dubai — GST</option>
              </select>
            </label>
            <label className="block">
              <span className="meta text-grey-2">CURRENCY</span>
              <select value={org.currency} onChange={(e) => patch(() => setOrg({ ...org, currency: e.target.value }))} className="field mt-1.5 w-full">
                <option value="INR">INR — ₹</option>
                <option value="USD">USD — $</option>
              </select>
            </label>
          </div>
        </Panel>

        <Panel title="Employee guardrails" kicker="FELT BY THE FLOOR ON THE NEXT SHIFT" pad>
          <div className="grid gap-3.5 md:grid-cols-2">
            <label className="block">
              <span className="meta text-grey-2">CALL WINDOW</span>
              <select value={wage.window} onChange={(e) => patch(() => setWage({ ...wage, window: e.target.value }))} className="field mt-1.5 w-full">
                <option>09:00–21:00</option>
                <option>10:00–19:00</option>
                <option>09:00–23:00</option>
              </select>
            </label>
            <label className="block">
              <span className="meta text-grey-2">WEEKENDS</span>
              <select value={wage.weekend} onChange={(e) => patch(() => setWage({ ...wage, weekend: e.target.value }))} className="field mt-1.5 w-full">
                <option>Bank holidays only</option>
                <option>Sundays off</option>
                <option>Always on</option>
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="meta text-grey-2">SPEAKING LANGUAGE</span>
              <select value={wage.language} onChange={(e) => patch(() => setWage({ ...wage, language: e.target.value }))} className="field mt-1.5 w-full">
                <option>English + Hindi</option>
                <option>English only</option>
                <option>Hindi + Marathi</option>
              </select>
            </label>
            <p className="meta text-grey-2 md:col-span-2">HARD FLOOR: ALL EMPLOYEES RESPECT DNC SUPPRESSION AND THE RETRY CAP REGARDLESS OF THESE SETTINGS.</p>
          </div>
        </Panel>
      </div>

      <Panel className="mt-6 mb-6" title="Quiet channels" kicker="NOTIFICATIONS — DELIVERED, NEVER FLOODED">
        <ul role="list" className="divide-y divide-line">
          {prefs.map((p) => (
            <li key={p.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-[0.9rem] font-medium text-ink">{p.label}</p>
                <p className="meta mt-0.5 text-grey-2">{p.note.toUpperCase()}</p>
              </div>
              <Toggle
                on={p.on}
                label={`Toggle ${p.label}`}
                onChange={(v) => { setPrefs((ps) => ps.map((x) => (x.key === p.key ? { ...x, on: v } : x))); setDirty(true); setSavedFlash(false); }}
              />
            </li>
          ))}
        </ul>
      </Panel>

      <div className="mb-6 flex flex-col items-start justify-between gap-5 rounded-md border border-red-200 bg-red-50/60 p-6 md:flex-row md:items-center">
        <div>
          <p className="meta text-red-700">DANGER ZONE</p>
          <h2 className="display mt-2 text-[1.15rem] uppercase text-ink">Delete workspace — disabled by policy</h2>
          <p className="mt-2 max-w-[64ch] text-[0.87rem] leading-relaxed text-grey">
            Workspaces hold employee identities, verification ledgers and audit chains. Deletion requires a typed
            request and is a write-once event: the ledger is preserved for compliance even after every employee is
            removed.
          </p>
        </div>
        <button
          onClick={() => { setDeleting(true); setConfirmText(""); }}
          className="meta shrink-0 rounded-sm border border-red-300 bg-white px-4 py-3 text-red-700 transition-colors hover:border-red-400"
        >
          Request deletion
        </button>
      </div>

      {deleteStatus === "guarded" ? (
        <div className="mb-6 rounded-sm border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="meta text-amber-800">✓ DELETION REQUEST RECORDED — GUARDED UNTIL TWO OWNERS SIGN WITHIN 72 HOURS · <Link href="/app/activity" className="link-underline text-ink">TRACK IN THE AUDIT →</Link></p>
        </div>
      ) : null}

      {deleting ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Request workspace deletion">
          <button aria-label="Close" className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]" onClick={() => setDeleting(false)} />
          <div className="relative w-full max-w-md rounded-md border border-line bg-paper p-6 shadow-elevated">
            <p className="meta text-grey-2">IRREVERSIBLE STATE CHANGE</p>
            <h3 className="display mt-2 text-[1.2rem] uppercase text-ink">Request workspace deletion?</h3>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-grey">
              Employees pause, approval queues clear, and the workspace drainage begins at cycle end. Type the workspace
              ID to confirm intent — nothing is removed automatically; two owners must sign.
            </p>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder='Type "nova-realty" to confirm'
              aria-label="Type workspace id to confirm"
              className="field mt-4 w-full"
            />
            <div className="mt-5 flex justify-end gap-2.5">
              <button onClick={() => setDeleting(false)} className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">Keep workspace</button>
              <button
                onClick={requestDelete}
                disabled={confirmText !== org.id}
                className={cn("meta rounded-sm px-4 py-2.5 transition-all",
                  confirmText === org.id ? "bg-red-600 text-white hover:bg-red-700" : "cursor-not-allowed bg-paper-3 text-grey-2")}
              >
                Queue deletion request
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <p className="meta mt-8 text-grey-2">EVERY SETTINGS CHANGE IS <Chip tone="neutral">SIGNED + AUDITED</Chip> — SEE <Link href="/app/activity" className="link-underline text-ink">THE AUDIT →</Link></p>
    </>
  );
}
