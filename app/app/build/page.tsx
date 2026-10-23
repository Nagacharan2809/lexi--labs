"use client";

/* BUILD — draft a new employee in five steps, then submit to the gate. */

import { useState } from "react";
import Link from "next/link";
import { PageHead, Panel, Chip } from "@/components/app/ui";
import { KNOWLEDGE, TOOLS, WORKFLOW_VOICES, EMPLOYEES, STATUS_LABEL } from "@/lib/app/data";
import { cn } from "@/lib/utils";

const STEPS = ["Role", "Knowledge", "Tools", "Workflow", "Instructions"] as const;

const ROLE_KINDS = [
  { id: "voice", label: "Voice Sales", blurb: "Outbound + inbound calling, qualification, booking." },
  { id: "desk", label: "Sales Desk", blurb: "Pipeline follow-ups, proposals, CRM hygiene." },
  { id: "leadgen", label: "Lead Generation", blurb: "Harvest, dedupe and score inbound leads." },
  { id: "support", label: "Support", blurb: "Ticket triage, first-line answers, handovers." },
  { id: "ops", label: "Operations", blurb: "Reconciliation, reports, record prep." },
  { id: "custom", label: "Something else", blurb: "Draft from a blank canvas." },
];

export default function BuildPage() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [sources, setSources] = useState<string[]>(["Objection handbook v3", "Call scripts — voice sales v9"]);
  const [tools, setTools] = useState<string[]>(["Phone (Fleen Voice Gateway)", "CRM — Nova Realty"]);
  const [rails, setRails] = useState<string[]>(["Meta lead → call → qualify → book"]);
  const [instructions, setInstructions] = useState("Never invent facts. Call within 60 seconds. Ask before committing money.");
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const next = () => {
    setErr(null);
    if (step === 0 && !role) { setErr("Pick a role to continue."); return; }
    if (step === 0 && name.trim().length < 3) { setErr("Name the employee — hires deserve names."); return; }
    if (step === 1 && sources.length === 0) { setErr("Give at least one knowledge source — no-source employees guess."); return; }
    if (step === 2 && tools.length === 0) { setErr("At least one tool is required for an employee to act."); return; }
    if (step === 4 && instructions.trim().length < 40) { setErr("Instructions too thin — 40+ characters of policy, please."); return; }
    if (step === STEPS.length - 1) {
      const id = `LXS-${420 + EMPLOYEES.length + 3}`;
      setDone(`${id} · ${name.trim()}`);
      return;
    }
    setStep((s) => s + 1);
  };

  const toggle = (list: string[], set: (v: string[]) => void, key: string) =>
    set(list.includes(key) ? list.filter((x) => x !== key) : [...list, key]);

  return (
    <>
      <PageHead
        kicker="Build"
        title="Draft an employee."
        sub="Five decisions create a person — role, knowledge, tools, workflow, instructions. Verification is mandatory; you cannot skip the gate."
      />

      {done ? (
        <Panel className="mx-auto max-w-2xl" title="Employee drafted — submitted to the gate" kicker="DRAFT · v0.9.0" pad>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="green" pulse>{STATUS_LABEL.draft.toUpperCase()}</Chip>
              <Chip tone="blue">{name.toUpperCase()}</Chip>
              <Chip tone="neutral">GATE PENDING</Chip>
            </div>
            <p className="text-[0.9rem] leading-relaxed text-grey">
              Registered to the workspace: <span className="font-mono text-ink">{done.split(" · ")[0]}</span>. The onboarding
              checklist (documents, policy signatures, sandbox smoke-test) is scheduled in its profile. Verification must
              reach 90/100 before the deploy button unlocks — the same discipline as every employee on the floor.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link href="/app/workforce/operations" className="meta rounded-sm bg-ink px-4 py-3 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
                Model from an onboarding employee →
              </Link>
              <button onClick={() => { setDone(null); setStep(0); setRole(null); setName(""); }} className="meta rounded-sm border border-line-2 px-4 py-3 text-grey transition-colors hover:border-ink hover:text-ink">
                Draft another
              </button>
            </div>
          </div>
        </Panel>
      ) : (
        <>
          {/* stepper */}
          <div className="mb-8 grid grid-cols-5 gap-1.5">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => (i < step ? setStep(i) : undefined)}
                aria-current={i === step ? "step" : undefined}
                className={cn(
                  "flex flex-col gap-1.5 border-b-2 py-2 text-left transition-colors",
                  i === step ? "border-ink" : i < step ? "border-blue/40 cursor-pointer" : "border-line",
                )}
              >
                <span className={cn("meta", i === step ? "text-ink" : "text-grey-2")}>STEP {i + 1}</span>
                <span className={cn("text-[0.8rem] font-medium", i === step ? "text-ink" : i < step ? "text-grey" : "text-grey-2")}>{s}</span>
              </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {step === 0 ? (
              <Panel title="Step 1 — role & identity" kicker="WHO IS JOINING THE FLOOR" pad>
                <label className="block">
                  <span className="meta text-grey-2">EMPLOYEE NAME *</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lexi Reception" className="field mt-1.5 w-full" />
                </label>
                <div className="mt-5 grid gap-2.5 md:grid-cols-2">
                  {ROLE_KINDS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      aria-pressed={role === r.id}
                      className={cn(
                        "rounded-sm border px-4 py-3.5 text-left transition-all duration-200",
                        role === r.id ? "border-ink bg-paper-2" : "border-line hover:border-ink",
                      )}
                    >
                      <p className="text-[0.9rem] font-medium text-ink">{r.label}</p>
                      <p className="mt-1 text-[0.8rem] leading-snug text-grey">{r.blurb}</p>
                    </button>
                  ))}
                </div>
              </Panel>
            ) : null}

            {step === 1 ? (
              <Panel title="Step 2 — knowledge" kicker="WHAT IT MAY SPEAK FROM" pad>
                <ul role="list" className="grid gap-2.5 md:grid-cols-2">
                  {KNOWLEDGE.map((k) => (
                    <li key={k.name}>
                      <button onClick={() => toggle(sources, setSources, k.name)} aria-pressed={sources.includes(k.name)}
                        className={cn("flex w-full items-center justify-between gap-3 rounded-sm border px-3.5 py-3 text-left transition-all duration-200",
                          sources.includes(k.name) ? "border-ink bg-paper-2" : "border-line hover:border-ink")}>
                        <span className="min-w-0">
                          <span className="block truncate text-[0.88rem] font-medium text-ink">{k.name}</span>
                          <span className="meta text-grey-2">{k.type} · {k.sections} SECTIONS · {k.coverage}%</span>
                        </span>
                        <span aria-hidden="true" className={cn("meta flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[0.6rem]",
                          sources.includes(k.name) ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-line-2 text-grey-2")}>
                          {sources.includes(k.name) ? "✓" : ""}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Panel>
            ) : null}

            {step === 2 ? (
              <Panel title="Step 3 — tools" kicker="HANDS, WITH PERMISSIONS" pad>
                <ul role="list" className="grid gap-2.5 md:grid-cols-2">
                  {TOOLS.map((t) => (
                    <li key={t.name}>
                      <button onClick={() => toggle(tools, setTools, t.name)} aria-pressed={tools.includes(t.name)}
                        className={cn("flex w-full items-center justify-between gap-3 rounded-sm border px-3.5 py-3 text-left transition-all duration-200",
                          tools.includes(t.name) ? "border-ink bg-paper-2" : "border-line hover:border-ink")}>
                        <span className="min-w-0">
                          <span className="block truncate text-[0.88rem] font-medium text-ink">{t.name}</span>
                          <span className="meta text-grey-2">{t.kind.toUpperCase()} · {t.permission}</span>
                        </span>
                        <span aria-hidden="true" className={cn("meta flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[0.6rem]",
                          tools.includes(t.name) ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-line-2 text-grey-2")}>
                          {tools.includes(t.name) ? "✓" : ""}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Panel>
            ) : null}

            {step === 3 ? (
              <Panel title="Step 4 — workflows" kicker="THE Rails IT MAY EXECUTE" pad>
                <ul role="list" className="flex flex-col gap-2.5">
                  {["Meta lead → call → qualify → book", "Callback rail — patient follow-ups", "Nightly CRM reconciliation", "Morning ops report draft"].map((w) => (
                    <li key={w}>
                      <button onClick={() => toggle(rails, setRails, w)} aria-pressed={rails.includes(w)}
                        className={cn("flex w-full items-center justify-between gap-3 rounded-sm border px-3.5 py-3 text-left transition-all duration-200",
                          rails.includes(w) ? "border-blue-deep bg-blue-tint" : "border-line hover:border-ink")}>
                        <span className="font-mono text-[0.82rem] text-ink">{w}</span>
                        <span aria-hidden="true" className={cn("meta flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[0.6rem]",
                          rails.includes(w) ? "border-blue/30 bg-paper text-blue-deep" : "border-line-2 text-grey-2")}>
                          {rails.includes(w) ? "✓" : ""}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="meta mt-3 text-grey-2">REFERENCE RAIL: {WORKFLOW_VOICES.length} NODES — {WORKFLOW_VOICES[0].title} → {WORKFLOW_VOICES[WORKFLOW_VOICES.length - 1].title}</p>
              </Panel>
            ) : null}

            {step === 4 ? (
              <Panel title="Step 5 — instructions" kicker="THE CONSTITUTION, SMALL BUT BINDING" pad>
                <label className="block">
                  <span className="meta text-grey-2">CORE INSTRUCTIONS *</span>
                  <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={7}
                    placeholder="Rules, escalation, restrictions — the runtime compiles these into policy guards."
                    className="field mt-1.5 w-full resize-none font-mono text-[0.82rem] leading-relaxed" />
                </label>
                <p className="meta mt-3 text-grey-2">{instructions.length} CHARS · EVERY LINE IS GARDENED BY THE 12-TEST GATE AFTER HIRE.</p>
              </Panel>
            ) : null}

            {/* summary rail */}
            <div className="flex flex-col gap-6">
              <Panel title="Draft summary" kicker={`STEP ${step + 1} OF ${STEPS.length}`}>
                <dl className="flex flex-col gap-2.5 text-[0.84rem]">
                  {[
                    ["Name", name || "—"],
                    ["Role", role ? ROLE_KINDS.find((r) => r.id === role)?.label : "—"],
                    ["Knowledge", `${sources.length} sources`],
                    ["Tools", `${tools.length} of ${TOOLS.length}`],
                    ["Workflows", `${rails.length} rails`],
                    ["Instructions", `${instructions.length} chars`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-line pb-2 last:border-none">
                      <dt className="meta text-grey-2">{k}</dt>
                      <dd className={"truncate text-ink " + (k === "Name" ? "font-mono text-[0.8rem]" : "")}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </Panel>

              <Panel title="What happens on submit" kicker="THE GATE IS NON-NEGOTIABLE">
                <ol role="list" className="flex flex-col gap-2.5 text-[0.84rem] leading-relaxed text-grey">
                  <li className="flex gap-2.5"><span aria-hidden="true" className="font-mono text-grey-2">01</span><span>Draft registers in the workforce as <strong className="text-ink">v0.9.0</strong>.</span></li>
                  <li className="flex gap-2.5"><span aria-hidden="true" className="font-mono text-grey-2">02</span><span>Knowledge embeds; tools smoke-test from sandbox.</span></li>
                  <li className="flex gap-2.5"><span aria-hidden="true" className="font-mono text-grey-2">03</span><span>12-test release gate; score ≥ 90 unlocks deploy.</span></li>
                </ol>
              </Panel>
            </div>
          </div>

          {err ? (
            <div className="mt-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3">
              <p className="meta text-red-700">✕ {err}</p>
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              onClick={() => (step > 0 ? (setErr(null), setStep(step - 1)) : undefined)}
              className={cn("meta rounded-sm border px-5 py-3 transition-colors", step > 0 ? "border-line-2 text-grey hover:border-ink hover:text-ink" : "border-line text-grey-2 cursor-not-allowed")}
            >
              ← Back
            </button>
            <button onClick={next} className="meta rounded-sm bg-ink px-6 py-3 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
              {step === STEPS.length - 1 ? "Submit to gate" : "Continue →"}
            </button>
          </div>
        </>
      )}
    </>
  );
}
