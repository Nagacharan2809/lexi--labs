"use client";

/* TEAM — humans who run the floor. Invite, roles, access; everything audited. */

import { useState } from "react";
import { TEAM, type Member } from "@/lib/app/data";
import { PageHead, Panel, Tile, Chip } from "@/components/app/ui";
import { Modal } from "@/components/app/overlay";
import { cn } from "@/lib/utils";

const ROLES: Member["role"][] = ["Owner", "Admin", "Builder", "Operator", "Viewer"];

const ROLE_NOTE: Record<Member["role"], string> = {
  Owner: "Full control incl. billing + deletion requests.",
  Admin: "Everything except workspace deletion.",
  Builder: "Builds and edits employees; cannot deploy to production.",
  Operator: "Runs approvals, escalations, schedules; cannot edit instructions.",
  Viewer: "Read-only across the ledger.",
};

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>(TEAM);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [draft, setDraft] = useState({ email: "", role: "Builder" as Member["role"] });
  const [err, setErr] = useState<string | null>(null);
  const [flashed, setFlashed] = useState<string | null>(null);

  const invite = () => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email);
    if (!ok) { setErr("That email won't reach a human — check it."); return; }
    if (members.some((m) => m.email === draft.email)) { setErr("Already on the team."); return; }
    setErr(null);
    const name = draft.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    setMembers((ms) => [...ms, { name, email: draft.email, role: draft.role, status: "Invited", lastSeen: "—" }]);
    setInviteOpen(false);
    setDraft({ email: "", role: "Builder" });
    setFlashed(`✓ Invite queued for ${draft.email} — role ${draft.role}. An acceptance is required before any access exists.`);
    window.setTimeout(() => setFlashed(null), 4200);
  };

  const cycleRole = (email: string) =>
    setMembers((ms) => ms.map((m) => (m.email === email ? { ...m, role: ROLES[(ROLES.indexOf(m.role) + 1) % ROLES.length] } : m)));

  const remove = (email: string) => setMembers((ms) => ms.filter((m) => m.email !== email));

  return (
    <>
      <PageHead
        kicker="Team · Workspace"
        title="The humans."
        sub="Nagacharan runs the floor with four humans. Roles are few and blunt — the employee permission matrix carries the nuance."
        actions={
          <button onClick={() => { setInviteOpen(true); setErr(null); }} className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
            Invite teammate
          </button>
        }
      />

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Members" value={members.length} sub={`${members.filter((m) => m.status === "Active").length} active · ${members.filter((m) => m.status === "Invited").length} invited`} />
        <Tile label="Owners / Admins" value={members.filter((m) => m.role === "Owner" || m.role === "Admin").length} sub="Deploy + billing authority" />
        <Tile label="Seat cost" value="₹0" sub="Seats included in the Growth plan" />
        <Tile label="SSO" value="Google" sub="Workspace SSO + magic links" tone="blue" />
      </div>

      {flashed ? (
        <div className="mb-8 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="meta text-emerald-800">{flashed}</p>
        </div>
      ) : null}

      <Panel className="mb-6" title="Members" kicker="ROLE CYCLES ON CLICK — CHANGES ARE AUDITED">
        <ul role="list" className="divide-y divide-line">
          {members.map((m) => (
            <li key={m.email} className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
              <div className="flex min-w-0 items-center gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-2 bg-paper-3 font-mono text-[0.66rem] text-grey">
                  {m.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </span>
                <div className="min-w-0">
                  <p className="text-[0.9rem] font-medium text-ink">{m.name}</p>
                  <p className="meta mt-0.5 truncate text-grey-2">{m.email} · {m.status.toUpperCase()} · LAST SEEN {m.lastSeen.toUpperCase()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => cycleRole(m.email)}
                  className={cn(
                    "meta rounded-full border px-3 py-1.5 transition-colors",
                    m.role === "Owner" ? "border-blue/30 bg-blue-tint text-blue-deep"
                      : m.role === "Admin" ? "border-orange/30 bg-orange-tint text-orange-deep"
                      : "border-line-2 text-grey hover:border-ink hover:text-ink",
                  )}
                >
                  {ROLE_NOTE[m.role] ? m.role.toUpperCase() : m.role}
                </button>
                {m.role === "Owner" ? null : (
                  <button onClick={() => remove(m.email)} className="meta text-red-700 transition-colors hover:text-red-800">REMOVE</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="What each role means" kicker="BLUNT ROLES — EMPLOYEE MATRIX HAS THE NUISANCE POWER">
        <ul role="list" className="grid gap-3 md:grid-cols-2">
          {ROLES.map((r) => (
            <li key={r} className="flex items-start gap-3 rounded-sm border border-line px-4 py-3">
              <Chip tone={r === "Owner" ? "blue" : r === "Admin" ? "orange" : "neutral"}>{r.toUpperCase()}</Chip>
              <p className="text-[0.85rem] leading-snug text-grey">{ROLE_NOTE[r]}</p>
            </li>
          ))}
        </ul>
      </Panel>

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} kicker="Team · invite" title="Invite a teammate"
        footer={
          <>
            <button onClick={() => setInviteOpen(false)} className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">Cancel</button>
            <button onClick={invite} className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">Queue invite</button>
          </>
        }>
        <div className="flex flex-col gap-3.5">
          <label className="block">
            <span className="meta text-grey-2">WORK EMAIL *</span>
            <input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="founder@company.in" className="field mt-1.5 w-full" />
          </label>
          <div>
            <span className="meta text-grey-2">ROLE</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {ROLES.filter((r) => r !== "Owner").map((r) => (
                <button key={r} onClick={() => setDraft({ ...draft, role: r })}
                  className={cn("meta rounded-full border px-3 py-1.5 transition-colors", draft.role === r ? "border-ink bg-ink text-paper" : "border-line-2 text-grey hover:border-ink hover:text-ink")}>
                  {r}
                </button>
              ))}
            </div>
            <p className="meta mt-1.5 text-grey-2">{ROLE_NOTE[draft.role]}</p>
          </div>
          {err ? <p className="meta text-red-700">✕ {err}</p> : null}
        </div>
      </Modal>
    </>
  );
}
