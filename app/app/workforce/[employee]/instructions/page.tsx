"use client";

/* INSTRUCTIONS — the employee's constitution: role, rules, escalation, restrictions. */

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getEmployee } from "@/lib/app/data";
import { PageHead, Panel, Chip, EmptyState } from "@/components/app/ui";
import { cn } from "@/lib/utils";

interface Section { key: string; title: string; hint: string; body: string }

const FLAGSHIP_SECTIONS: Section[] = [
  { key: "role", title: "Role", hint: "One line the employee can be named by", body: "Voice Sales employee for Nova Realty — first-line inbound and outbound caller for new leads." },
  { key: "objective", title: "Objective", hint: "What success means, measurable", body: "Maximise interested-to-confirmed conversions: connect fast, qualify honestly, book site visits, and hand messy humans to real humans." },
  { key: "responsibilities", title: "Responsibilities", hint: "Bullets the runtime treats as duties", body: "1. Call every new lead within 60 seconds.\n2. Qualify on requirement, budget band, timeline.\n3. Answer objections from the objection handbook v3.\n4. Book site-visit slots on the site-visit calendar only.\n5. Log every call outcome to CRM with next action.\n6. Schedule callbacks the customer asked for — never drop one." },
  { key: "communication", title: "Communication style", hint: "Voice and register", body: "Speak simple English + recognisable Hindi phrases. Short sentences. Confirm numbers by repeating them. No promises about price except reading the approved pricing sheet. Never argue with a customer." },
  { key: "rules", title: "Rules", hint: "Hard behavioural constraints", body: "Never invent facts, prices, availability or Offers. Never claim to be human. Respect DNC and call windows. Max 3 attempts per lead per day. Say 'I will check with the team and get back on WhatsApp' when unsupported." },
  { key: "restrictions", title: "Restrictions", hint: "What the employee cannot do at all", body: "No discount beyond 15% without approval. No refunds above ₹5,000 without approval. No publishing anywhere. No deleting of CRM records. No calling outside 09:00–21:00." },
  { key: "decision", title: "Decision rules", hint: "How to behave in the grey zone", body: "If intent ≥ 0.72 → continue to booking. If objection exists → attempt once from handbook, then offer callback or human. If angry → hand over after one calm attempt. If unsure → ask one clarifying question, then fall back to callback." },
  { key: "escalation", title: "Escalation rules", hint: "When a human must take over", body: "Money promises, legal questions, competitor claims with threats, angry requests for a manager, and any request to change booking amounts — warm transfer with context pack." },
];

const GENERIC_SECTIONS: Section[] = [
  { key: "role", title: "Role", hint: "One line the employee can be named by", body: "Operations employee for Nova Realty — back-office execution across reporting, data and documents." },
  { key: "objective", title: "Objective", hint: "What success means, measurable", body: "Keep the operating ledger honest: nightly reports complete, records reconciled, exceptions surfaced by 08:00." },
  { key: "responsibilities", title: "Responsibilities", hint: "Bullets the runtime treats as duties", body: "1. Reconcile CRM records against the call ledger nightly.\n2. Prepare the morning ops report from report series.\n3. Flag records with failed calls for retry review.\n4. Maintain employee knowledge status notes." },
  { key: "rules", title: "Rules", hint: "Hard behavioural constraints", body: "Never modify financial records. Never edit human-owned fields. Every write is attributed and traced." },
  { key: "decision", title: "Decision rules", hint: "How to behave in the grey zone", body: "When reconciliation mismatches — surface the diff, never overwrite history." },
  { key: "escalation", title: "Escalation rules", hint: "When a human must take over", body: "Any mismatch above ₹10,000 and any policy ambiguity — human queue." },
  { key: "restrictions", title: "Restrictions", hint: "What the employee cannot do at all", body: "No public publishing. No outbound messaging without approval." },
];

export default function InstructionsPage() {
  const { employee: slug } = useParams<{ employee: string }>();
  const e = getEmployee(slug ?? "");
  const initial = slug === "voice-sales" ? FLAGSHIP_SECTIONS : slug === "operations" ? GENERIC_SECTIONS : GENERIC_SECTIONS;
  const [sections, setSections] = useState<Section[]>(initial);
  const [dirty, setDirty] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>("responsibilities");

  if (!e) {
    return (
      <>
        <PageHead kicker="Instructions" title="Instructions." />
        <EmptyState title="Employee not found." body="Return to the workforce and pick a valid employee." />
      </>
    );
  }

  const update = (key: string, body: string) => {
    setSections((ss) => ss.map((s) => (s.key === key ? { ...s, body } : s)));
    setDirty(key);
    setSaved(false);
  };

  const save = () => {
    setSaved(true);
    setDirty(null);
    window.setTimeout(() => setSaved(false), 3600);
  };

  return (
    <>
      <PageHead
        kicker={`${e.name} · Instructions`}
        title="Instructions."
        sub="The constitution. Instruction sections map 1:1 onto runtime guardrails — editing one schedules a verification, not a silent change."
        actions={
          <button
            onClick={save}
            className={cn(
              "meta rounded-sm px-4 py-2.5 transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift",
              dirty ? "bg-ink text-paper" : "border border-line-2 text-grey hover:border-ink hover:text-ink",
            )}
          >
            {dirty ? "Save changes" : saved ? "Saved ✓" : "No changes"}
          </button>
        }
      />

      {saved ? (
        <div className="mb-6 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="meta text-emerald-800">✓ SAVED — LOCAL DRAFT · NEXT GATE RUN BENCHMARKS AGAINST THIS VERSION · RELEASE NOTE SUGGESTED: “INSTRUCTIONS UPDATED”</p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Panel title="Instruction sections" kicker="EDIT INLINE — CHANGES VERSION-IN-PLACE">
          <div className="flex flex-col divide-y divide-line">
            {sections.map((s) => {
              const open = openKey === s.key;
              return (
                <div key={s.key}>
                  <button
                    onClick={() => setOpenKey(open ? null : s.key)}
                    aria-expanded={open}
                    className="flex w-full items-start justify-between gap-4 py-3.5 text-left"
                  >
                    <div>
                      <p className="text-[0.92rem] font-medium text-ink">
                        {s.title}
                        {dirty === s.key ? <span aria-hidden="true" className="ml-2 inline-block h-2 w-2 rounded-full bg-orange-deep align-middle" /> : null}
                      </p>
                      <p className="meta mt-0.5 text-grey-2">{s.hint}</p>
                    </div>
                    <span aria-hidden="true" className={cn("meta text-grey-2 transition-transform duration-300", open && "rotate-180")}>▾</span>
                  </button>
                  {open ? (
                    <div className="pb-4">
                      <textarea
                        value={s.body}
                        onChange={(ev) => update(s.key, ev.target.value)}
                        rows={Math.min(12, s.body.split("\n").length + 2)}
                        className="field w-full resize-y font-mono text-[0.8rem] leading-relaxed"
                      />
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <span className="meta text-grey-2">{s.body.length} chars · {s.body.split("\n").length} lines</span>
                        {dirty === s.key ? <Chip tone="amber" pulse>UNSAVED</Chip> : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="How instructions reach work" kicker="BINDING, NOT SUGGESTIONS">
            <ul role="list" className="flex flex-col gap-3 text-[0.86rem] leading-relaxed text-grey">
              <li className="flex gap-2.5"><span aria-hidden="true" className="font-mono text-grey-2">01</span><span>Instructions compile into the employee&apos;s runtime policy layer — alongside policy guards and tool permissions.</span></li>
              <li className="flex gap-2.5"><span aria-hidden="true" className="font-mono text-grey-2">02</span><span>The release gate replays the 12 scenario tests against the edited text before any promotion.</span></li>
              <li className="flex gap-2.5"><span aria-hidden="true" className="font-mono text-grey-2">03</span><span>Violations surface in <Link href="/app/workforce/voice-sales/evaluations" className="link-underline text-ink">evaluations</Link> with the exact case name and a fix path.</span></li>
              <li className="flex gap-2.5"><span aria-hidden="true" className="font-mono text-grey-2">04</span><span>Everything — including who edited what and when — lands in the activity audit.</span></li>
            </ul>
          </Panel>

          <Panel title="Change protocol" kicker="WHY A TEXTBOX CAN'T BREAK PRODUCTION">
            <p className="text-[0.86rem] leading-relaxed text-grey">
              Instructions are part of the employee version. An edit creates a draft that must clear the gate before
              deploy — the sandbox can run it earlier. Nothing reaches live calling from this page alone.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link href={`/app/workforce/${slug}/evaluations`} className="meta rounded-sm bg-ink px-4 py-3 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
                Run the gate on the draft →
              </Link>
              <Link href={`/app/workforce/${slug}/deployment`} className="meta rounded-sm border border-line-2 px-4 py-3 text-grey transition-colors hover:border-ink hover:text-ink">
                Deployment centre →
              </Link>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
