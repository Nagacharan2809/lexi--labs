"use client";

/* ONBOARDING — eight steps from hire to live. Progress persists locally. */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getEmployee } from "@/lib/app/data";
import { PageHead, Panel, Chip, Tile } from "@/components/app/ui";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Confirm the role", body: "Read the role line, objective and success metric. Sign off that this is the person you hired.", detail: "Role text, objective and measurable success derive from the template — editable before knowledge lands." },
  { title: "Attach knowledge", body: "Confirm the source list — policy PDFs, pricing sheets, FAQs. The employee may never speak from anything else.", detail: "The default bundle covers pricing v4, objection handbook v3, scripts v9 and the booking FAQ. Add or drop sources freely." },
  { title: "Connect tools", body: "Toggle the tool set — phone gateway, CRM, calendar, WhatsApp. Unconfigured tools cannot join a rail.", detail: "Tools carry their scopes with them: call, send, read, book. Revoke one and the workflow revalidates." },
  { title: "Sign permissions", body: "Walk the decision matrix — what runs inline, what pauses for a human, what is impossible by design.", detail: "Approvals carry limits: discounts up to 15% inline, refunds up to ₹5,000, deletions never." },
  { title: "Review workflows", body: "The rails this employee executes — triggers, AI reasoning blocks, tools, escalation moments.", detail: "The callback rail stays separate: quieter path, same ledger, full attempt history." },
  { title: "Sandbox smoke test", body: "Five sample calls replay in sandbox — connect, qualify, object, book, escalate. Watch the trace live.", detail: "Sandbox exists so surprises happen here instead of with customers." },
  { title: "Run the release gate", body: "12 scenario tests across six categories. 90/100 is the hard floor for production access.", detail: "Fails block the deploy button and name their own fix path — never a mute failure." },
  { title: "Schedule go-live", body: "Set the starting shift window and the first workload queue. The employee clocks in on schedule.", detail: "Defaults: 09:00 IST window, the role's workload template, 2× concurrency." },
];

const storageKey = (slug: string) => `lexi-onboarding-${slug}`;

export default function OnboardingPage() {
  const { employee: slug } = useParams<{ employee: string }>();
  const e = getEmployee(slug ?? "");

  /* hydrated localStorage progress */
  const [done, setDone] = useState<boolean[]>(STEPS.map(() => false));
  const [open, setOpen] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!slug) return;
    /* deferred so hydration paints the empty checklist before localStorage reads */
    const id = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(storageKey(slug));
        if (raw) {
          const parsed = JSON.parse(raw) as boolean[];
          if (Array.isArray(parsed) && parsed.length === STEPS.length) setDone(parsed);
        }
      } catch {
        /* private mode — progress stays in this view only */
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, [slug]);

  const persist = (next: boolean[]) => {
    setDone(next);
    try {
      window.localStorage.setItem(storageKey(slug ?? ""), JSON.stringify(next));
    } catch {
      /* swallow — private browsing */
    }
  };

  const completed = done.filter(Boolean).length;
  const allDone = completed === STEPS.length;

  return (
    <>
      <PageHead
        kicker={`Onboarding · ${e?.name ?? "New employee"}`}
        title="Eight steps to the floor."
        sub={e ? `${e.name} (${e.role.toLowerCase()}) — one working day. Progress saves locally and survives refreshes.` : "One working day. Progress saves locally and survives refreshes."}
        actions={<Chip tone={allDone ? "green" : "amber"} pulse={!allDone}>{completed}/{STEPS.length} STEPS</Chip>}
      />

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Steps signed" value={`${completed}/${STEPS.length}`} sub={allDone ? "Ready for the gate" : "Continue below"} />
        <Tile label="Estimated time left" value={allDone ? "0 min" : `${Math.max(0, (STEPS.length - completed) * 38)} min`} sub="Per historical hires" />
        <Tile label="Blocking dept" value="Verify bot" sub="Owns step 7 — the gate" />
        <Tile label="Go-live" value={allDone ? "Tonight 09:00" : "After step 8"} sub="09:00 IST window" tone={allDone ? "blue" : undefined} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Panel title="The checklist" kicker={hydrated ? "PROGRESS SAVED LOCALLY — REFRESH-PROOF" : "LOADING PROGRESS…"} pad>
          <ol role="list" className="divide-y divide-line">
            {STEPS.map((s, i) => {
              const stepDone = done[i];
              const isOpen = open === i;
              return (
                <li key={s.title} className={cn("py-1", stepDone && "opacity-70")}>
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => persist(done.map((d, j) => (j === i ? !d : d)))}
                      aria-pressed={stepDone}
                      aria-label={`${stepDone ? "Unmark" : "Mark complete"}: ${s.title}`}
                      className={cn(
                        "mt-1 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border font-mono text-[0.66rem] transition-all duration-200",
                        stepDone ? "border-emerald-500 bg-emerald-500 text-white" : "border-line-2 text-grey hover:border-ink hover:text-ink",
                      )}
                    >
                      {stepDone ? "✓" : i + 1}
                    </button>
                    <div className="flex-1">
                      <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="w-full py-2 text-left">
                        <p className={cn("text-[0.95rem] font-medium", stepDone ? "text-grey line-through" : "text-ink")}>
                          {i + 1}. {s.title}
                        </p>
                        <p className="mt-0.5 text-[0.85rem] leading-snug text-grey">{s.body}</p>
                      </button>
                      {isOpen ? (
                        <div className="mb-3 ml-0 rounded-sm border border-line-2 bg-paper-2/60 px-3.5 py-3">
                          <p className="meta text-grey">{s.detail}</p>
                          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
                            {e && i === 0 ? <span className="meta text-blue-deep">ROLE · {e.role.toUpperCase()}</span> : null}
                            {e && i === 5 ? <Link href={`/app/workforce/${e.slug}/calls`} className="meta link-underline text-ink">REPLAY FLAGSHIP SANDBOX →</Link> : null}
                            {e && i === 6 ? <Link href={`/app/workforce/${e.slug}/evaluations`} className="meta link-underline text-ink">SEE THE 12 TESTS →</Link> : null}
                            {e && i === 7 ? <Link href={`/app/workforce/${e.slug}/deployment`} className="meta link-underline text-ink">DEPLOYMENT CENTRE →</Link> : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {allDone ? (
            <div className="mt-5 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="meta text-emerald-800">✓ ALL STEPS SIGNED — THE RELEASE GATE UNLOCKED THE DEPLOY. SUBMIT AT DEPLOYMENT WITH A TYPED CONFIRM.</p>
            </div>
          ) : null}
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="Here's the state" kicker={e ? `${e.name.toUpperCase()} — ONBOARDING` : "BLUEPRINT HIRE"}>
            <dl className="text-[0.86rem]">
              {(e
                ? [
                    ["Role", e.role],
                    ["Knowledge", "5 sources queued"],
                    ["Tools", "6 of 9 toggled"],
                    ["Gate", "Pending — step 7"],
                    ["Version", `v${e.version} draft`],
                  ]
                : [
                    ["Role", "Blueprint hire"],
                    ["Knowledge", "Default bundle"],
                    ["Tools", "Start empty"],
                    ["Gate", "Pending"],
                    ["Version", "v0.9.0 draft"],
                  ]
              ).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-b border-line py-2.5 last:border-none">
                  <dt className="meta text-grey-2">{k}</dt>
                  <dd className="text-right text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel title="Why the gate is the contract" kicker="NO-EXCEPTIONS HIRING">
            <p className="text-[0.86rem] leading-relaxed text-grey">
              Onboarding edits behaviour; testing proves it. The 12-scenario gate replays deterministically with the
              same seeds, so what passed at signup is what runs at go-live — and what breaks later is traceable to a
              signed change, never a mystery.
            </p>
          </Panel>
        </div>
      </div>
    </>
  );
}
