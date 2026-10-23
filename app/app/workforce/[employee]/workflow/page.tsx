"use client";

/* WORKFLOW — the execution canvas: two branches, editable nodes, add/remove/reorder. */

import { useState } from "react";
import { useParams } from "next/navigation";
import { WORKFLOW_VOICES, WORKFLOW_CALLBACK, getEmployee, type FlowNode, type NodeKind } from "@/lib/app/data";
import { PageHead, Panel, Chip, EmptyState } from "@/components/app/ui";
import { Drawer } from "@/components/app/overlay";
import { cn } from "@/lib/utils";

const KIND_META: Record<NodeKind, { chip: string; label: string }> = {
  trigger: { chip: "border-blue/40 bg-blue-tint text-blue-deep", label: "TRIGGER" },
  ai: { chip: "border-ink bg-ink text-paper", label: "AI" },
  condition: { chip: "border-orange/50 bg-orange-tint text-orange-deep", label: "IF" },
  tool: { chip: "border-line-2 bg-paper-3 text-ink", label: "TOOL" },
  action: { chip: "border-line-2 bg-paper-3 text-ink", label: "DO" },
  approval: { chip: "border-amber-300 bg-amber-50 text-amber-700", label: "HUMAN" },
  wait: { chip: "border-line-2 bg-paper-3 text-grey", label: "WAIT" },
  webhook: { chip: "border-line-2 bg-paper-3 text-ink", label: "HOOK" },
  end: { chip: "border-line-2 bg-paper-3 text-grey", label: "END" },
};

const ADDABLE: NodeKind[] = ["ai", "tool", "condition", "wait", "approval", "webhook"];

export default function WorkflowPage() {
  const { employee: slug } = useParams<{ employee: string }>();
  const e = getEmployee(slug ?? "");
  const flagship = slug === "voice-sales";

  const [nodes, setNodes] = useState<FlowNode[]>(WORKFLOW_VOICES);
  const [callback, setCallback] = useState<FlowNode[]>(WORKFLOW_CALLBACK);
  const [editing, setEditing] = useState<{ branch: "main" | "else"; id: string } | null>(null);
  const [saved, setSaved] = useState(false);
  const [addKind, setAddKind] = useState<NodeKind | null>(null);
  const [dirty, setDirty] = useState(false);

  if (!e) {
    return (
      <>
        <PageHead kicker="Workflow" title="Workflow." />
        <EmptyState title="Employee not found." body="Return to the workforce and pick a valid employee." />
      </>
    );
  }

  if (!flagship) {
    return (
      <>
        <PageHead kicker={`${e.name} · Workflow`} title="Workflow." />
        <EmptyState
          title="No workflow attached yet."
          body="Workflows decide what this employee actually executes — triggers, tools, approvals and escalation. Attach the first one to start."
          action={<Chip tone="amber" pulse>ONBOARDING LANE</Chip>}
        />
      </>
    );
  }

  const branchOf = (b: "main" | "else") => (b === "main" ? nodes : callback);
  const setBranch = (b: "main" | "else", f: (ns: FlowNode[]) => FlowNode[]) =>
    (b === "main" ? setNodes : setCallback)((ns) => f(ns));

  const move = (branch: "main" | "else", id: string, dir: -1 | 1) => {
    setBranch(branch, (ns) => {
      const i = ns.findIndex((n) => n.id === id);
      const j = i + dir;
      if (j < 1 || j >= ns.length - 1) return ns;
      const out = [...ns];
      [out[i], out[j]] = [out[j], out[i]];
      return out;
    });
    setDirty(true); setSaved(false);
  };

  const remove = (branch: "main" | "else", id: string) => {
    setBranch(branch, (ns) => ns.filter((n) => n.id !== id));
    setDirty(true); setSaved(false);
  };

  const add = (kind: NodeKind) => {
    setAddKind(null);
    const titles: Record<string, string> = { ai: "AI WORK", tool: "TOOL CALL", condition: "CONDITION", wait: "WAIT", approval: "HUMAN APPROVAL", webhook: "NOTIFY WEBHOOK" };
    setBranch("main", (ns) => [
      ...ns.slice(0, -1),
      { id: `n${Date.now()}`, kind, title: titles[kind].toUpperCase(), config: kind === "ai" ? { Employee: "Voice Sales", Task: "Describe the reasoning-free task" } : kind === "tool" ? { Tool: "Pick a connected tool", Action: "—" } : kind === "condition" ? { If: "condition text", Else: "callback flow" } : kind === "wait" ? { Until: "DT + 1h", "Max wait": "24 h" } : kind === "approval" ? { Approver: "Manager", Timeout: "4 h" } : { Url: "https://hooks.internal/…" } },
      ...ns.slice(-1),
    ]);
    setDirty(true); setSaved(false);
  };

  const save = () => { setSaved(true); setDirty(false); };

  const editingNode = editing ? branchOf(editing.branch).find((n) => n.id === editing.id) ?? null : null;

  return (
    <>
      <PageHead
        kicker="Lexi Voice Sales · Workflow"
        title="Workflow."
        sub="The canvas the employee executes — triggers, AI reasoning blocks, tools, conditions and a human escalation rail. Click any node to edit its inputs."
        actions={
          <>
            <button onClick={() => setAddKind("ai")} className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">
              Add node
            </button>
            <button
              onClick={save}
              className={cn("meta rounded-sm px-4 py-2.5 transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift",
                dirty ? "bg-ink text-paper" : "border border-line-2 text-grey hover:border-ink hover:text-ink")}
            >
              {dirty ? "Save workflow" : saved ? "Saved ✓" : "In sync"}
            </button>
          </>
        }
      />

      {saved ? (
        <div className="mb-8 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="meta text-emerald-800">✓ WORKFLOW SAVED — VERSION DRAFT CREATED · IT CLEARS THE RELEASE GATE BEFORE ANY LIVE TRAFFIC</p>
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        {/* main branch */}
        <Panel title="Main branch — new lead → booking" kicker={`${nodes.length} NODES · FLEEN RUNTIME`} pad>
          <ol role="list" className="relative flex flex-col">
            <span aria-hidden="true" className="absolute bottom-6 left-[21px] top-6 w-px bg-line-2" />
            {nodes.map((n, i) => {
              const m = KIND_META[n.kind];
              return (
                <li key={n.id} className="relative flex gap-4 py-2">
                  <span className={cn("relative z-10 flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full border font-mono text-[0.55rem]", m.chip)}>
                    {String(i + 1).padStart(2, "0")}
                    <span className="sr-only">{m.label}</span>
                  </span>
                  <div className="flex-1 rounded-sm border border-line bg-paper px-4 py-3 transition-all duration-200 hover:border-ink">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="flex flex-wrap items-baseline gap-3">
                        <Chip tone={n.kind === "ai" ? "neutral" : n.kind === "condition" ? "orange" : n.kind === "tool" ? "blue" : "neutral"}>{m.label}</Chip>
                        <span className="font-mono text-[0.86rem] font-medium text-ink">{n.title}</span>
                      </p>
                      <span className="meta flex items-center gap-2 text-grey-2">
                        <button onClick={() => move("main", n.id, -1)} aria-label={`Move ${n.title} up`} className="px-1 transition-colors hover:text-ink">↑</button>
                        <button onClick={() => move("main", n.id, 1)} aria-label={`Move ${n.title} down`} className="px-1 transition-colors hover:text-ink">↓</button>
                        {i !== 0 && i !== nodes.length - 1 ? (
                          <button onClick={() => remove("main", n.id)} aria-label={`Delete ${n.title}`} className="px-1 text-red-700 transition-colors hover:text-red-800">✕</button>
                        ) : null}
                        <button onClick={() => { setEditing({ branch: "main", id: n.id }); }} className="px-1 text-grey transition-colors hover:text-ink">EDIT</button>
                      </span>
                    </div>
                    <dl className="mt-2.5 grid grid-cols-2 gap-x-6 gap-y-1 md:grid-cols-4">
                      {Object.entries(n.config).slice(0, 4).map(([k, v]) => (
                        <div key={k} className="min-w-0">
                          <dt className="meta text-grey-2">{k.toUpperCase()}</dt>
                          <dd className="truncate font-mono text-[0.74rem] text-grey">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </li>
              );
            })}
          </ol>

          {addKind ? (
            <div className="mt-4 rounded-sm border border-dashed border-line-2 bg-paper-2/60 p-4">
              <p className="meta mb-2.5 text-grey-2">ADD NODE — PICK KIND</p>
              <div className="flex flex-wrap gap-1.5">
                {ADDABLE.map((k) => (
                  <button key={k} onClick={() => add(k)} className="meta rounded-sm border border-line-2 px-3 py-1.5 text-grey transition-colors hover:border-ink hover:text-ink">
                    + {KIND_META[k].label}
                  </button>
                ))}
                <button onClick={() => setAddKind(null)} className="meta ml-auto rounded-sm px-3 py-1.5 text-grey-2 hover:text-ink">Cancel</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddKind("ai")}
              className="meta mt-4 w-full rounded-sm border border-dashed border-line-2 py-3 text-grey-2 transition-colors hover:border-ink hover:text-ink"
            >
              + INSERT NODE ABOVE END
            </button>
          )}
        </Panel>

        {/* else branch */}
        <Panel title="'Otherwise' branch — callbacks" kicker="HIS-INTENT ELSE PATH · INDEPENDENT RAIL" pad>
          <ol role="list" className="relative flex flex-col">
            <span aria-hidden="true" className="absolute bottom-6 left-[21px] top-6 w-px bg-line-2" />
            {callback.map((n, i) => {
              const m = KIND_META[n.kind];
              return (
                <li key={n.id} className="relative flex gap-4 py-2">
                  <span className={cn("relative z-10 flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full border border-dashed border-line-2 bg-paper font-mono text-[0.55rem] text-grey")}>
                    {`E${i + 1}`}
                  </span>
                  <div className="flex-1 rounded-sm border border-dashed border-line-2 px-4 py-3 transition-colors hover:border-ink">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="flex items-baseline gap-2.5">
                        <Chip tone="neutral">{m.label}</Chip>
                        <span className="font-mono text-[0.8rem] text-grey">{n.title}</span>
                      </p>
                      <button onClick={() => { setEditing({ branch: "else", id: n.id }); }} className="meta text-grey-2 transition-colors hover:text-ink">EDIT</button>
                    </div>
                    <dl className="mt-2 grid gap-x-5 gap-y-1">
                      {Object.entries(n.config).slice(0, 3).map(([k, v]) => (
                        <div key={k} className="min-w-0">
                          <dt className="meta text-grey-2">{k.toUpperCase()}</dt>
                          <dd className="truncate font-mono text-[0.72rem] text-grey">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="mt-4 rounded-sm border border-line bg-paper-2/60 px-4 py-3">
            <p className="meta text-grey-2">WHY TWO RAILS</p>
            <p className="mt-1.5 text-[0.84rem] leading-relaxed text-grey">
              Callbacks are elegant by design: the same employee, the same ledger, a quieter path. Outcomes are recorded
              with attempt 2 — the funnel explains why 126 confirmed can differ from 94 convinced.
            </p>
          </div>
        </Panel>
      </div>

      {/* node editor drawer */}
      <Drawer
        open={Boolean(editingNode)}
        onClose={() => setEditing(null)}
        kicker={editingNode ? `${editingNode.kind.toUpperCase()} · ${editingNode.id} · main` : ""}
        title={editingNode?.title || ""}
      >
        {editingNode && editing ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2">
              <Chip tone="neutral">{KIND_META[editingNode.kind].label}</Chip>
              <Chip tone="blue">EDITABLE CONFIG</Chip>
            </div>
            <div className="flex flex-col gap-3">
              {Object.keys(editingNode.config).map((k) => (
                <label key={k} className="block">
                  <span className="meta text-grey-2">{k.toUpperCase()}</span>
                  <input
                    key={`${editingNode.id}-${k}`}
                    defaultValue={editingNode.config[k]}
                    onChange={(ev) => {
                      const v = ev.target.value;
                      const branch = editing.branch;
                      setBranch(branch, (ns) => ns.map((n) => (
                        n.id === editingNode.id ? { ...n, config: { ...n.config, [k]: v } } : n
                      )));
                      setDirty(true); setSaved(false);
                    }}
                    className="field mt-1.5 w-full font-mono text-[0.82rem]"
                  />
                </label>
              ))}
            </div>
            <p className="meta text-grey-2">CHANGES APPLY TO THIS DRAFT — THE RAIL RE-RENDERS LIVE. VALIDATION: REQUIRED KEYS UNCHANGED.</p>
            <button
              onClick={() => { setEditing(null); save(); }}
              className="meta self-start rounded-sm bg-ink px-4 py-3 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift"
            >
              Apply + save workflow
            </button>
          </div>
        ) : null}
      </Drawer>
    </>
  );
}
