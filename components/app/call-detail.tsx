"use client";

/* CallDetail — shared call record view (recording bar, summary, transcript, trace).
   Used by the Calls page and the Proof-of-Work ledger. */

import { useState } from "react";
import { clock } from "@/lib/app/format";
import { getTrace, type Call } from "@/lib/app/data";
import { Panel, Chip } from "@/components/app/ui";
import { ExecutionTrace } from "@/components/app/trace";
import { ScopeList } from "@/components/app/lead-bits";

export function CallDetail({ call }: { call: Call }) {
  const [playing, setPlaying] = useState(false);
  const connected = call.lead.duration > 0;
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2">
        <Chip tone={connected ? "green" : "neutral"}>{call.connection.toUpperCase()}</Chip>
        <Chip tone="neutral">ATTEMPT {call.attempt}</Chip>
        <Chip tone="blue">{clock(call.lead.duration)} DURATION</Chip>
      </div>

      {/* recording bar */}
      <Panel title="Call recording" kicker={connected ? "SOURCE · FLEEN VOICE GATEWAY" : "NOT AVAILABLE"} pad>
        <div className="flex items-center gap-4">
          <button
            onClick={() => connected && setPlaying((v) => !v)}
            disabled={!connected}
            aria-pressed={playing}
            className={connected
              ? "meta inline-flex min-w-[104px] items-center justify-center gap-2 rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift"
              : "meta inline-flex min-w-[104px] cursor-not-allowed items-center justify-center gap-2 rounded-sm border border-line-2 px-4 py-2.5 text-grey-2"}
          >
            {connected ? (playing ? "STOP" : "▶ PLAY") : "NO AUDIO"}
          </button>
          <div className="flex-1">
            <div className="flex h-8 items-center gap-1 overflow-hidden rounded-sm bg-paper-2 px-3" aria-hidden="true">
              {Array.from({ length: 44 }).map((_, i) => (
                <span key={i}
                  className="w-[3px] rounded-full grad-rule"
                  style={{
                    height: `${4 + ((i * 7) % 20)}px`,
                    opacity: playing ? 0.35 + (i / 44) * 0.65 : i < 14 ? 0.55 : 0.18,
                    transition: "opacity .4s ease",
                  }} />
              ))}
            </div>
            <p className="meta mt-2 text-grey-2">
              {connected
                ? playing ? `PLAYING · ${clock(call.lead.duration)} SEGMENT` : `READY · ${clock(call.lead.duration)} SEGMENT`
                : "This record has no conversation to replay."}
            </p>
          </div>
        </div>
      </Panel>

      {connected ? (
        <>
          <Panel title="AI summary + dispatcher view" kicker={call.model}>
            <p className="text-[0.92rem] leading-relaxed text-ink">{call.summary}</p>
            <div className="mt-4 grid gap-x-10 gap-y-2 border-t border-line pt-4 md:grid-cols-2">
              <div>
                <p className="meta text-grey-2">Customer intent</p>
                <ScopeList items={[`Interest: ${call.lead.interest}`, `Budget: ${call.lead.budget}`, `Requirement: ${call.lead.requirement}`]} />
              </div>
              <div>
                <p className="meta text-grey-2">Objections</p>
                <ScopeList items={call.objections.length ? call.objections : ["None detected"]} />
              </div>
              <div>
                <p className="meta text-grey-2">CRM changes</p>
                <ScopeList items={call.crm} />
              </div>
              <div>
                <p className="meta text-grey-2">Tools used</p>
                <ScopeList items={call.tools} />
              </div>
            </div>
            {call.nextAction ? (
              <div className="meta mt-4 rounded-sm border border-orange/40 bg-orange-tint px-3.5 py-2.5 text-orange-deep">
                NEXT ACTION · {call.nextAction.toUpperCase()}
              </div>
            ) : null}
          </Panel>

          <div>
            <p className="meta mb-3 text-grey-2">Transcript · {call.transcript.length} turns</p>
            <Panel>
              <div className="flex flex-col gap-3">
                {call.transcript.map((t, i) => (
                  <div key={i} className={t.who === "AI" ? "pr-6" : "pl-6"}>
                    <p className="meta text-grey-2" style={{ textAlign: t.who === "AI" ? "left" : "right" }}>
                      {t.who === "AI" ? "LEXI" : call.lead.name.toUpperCase()} · {clock(t.t)}
                    </p>
                    <div className={t.who === "AI" ? "mt-1 max-w-[92%] rounded-sm bg-paper-2 px-3.5 py-2.5 text-[0.87rem] leading-relaxed text-ink"
                      : "ml-auto mt-1 max-w-[88%] rounded-sm bg-ink px-3.5 py-2.5 text-[0.87rem] leading-relaxed text-paper"}
                      style={t.who === "AI" ? {} : { textAlign: "left" }}>
                      {t.text}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </>
      ) : (
        <Panel title="Attempt record" kicker="NO TRANSCRIPT">
          <p className="text-[0.9rem] text-ink">Gateway returned <strong>{call.connection}</strong> after {call.attempt} attempt{call.attempt > 1 ? "s" : ""} of {clock(call.lead.duration) || "—"}.</p>
          <p className="meta mt-2 text-grey">Retry decision made by the router within policy caps.</p>
        </Panel>
      )}

      <div>
        <p className="meta mb-3 text-grey-2">Execution trace</p>
        <Panel title="Auditable action trail" kicker="INPUT · DECISION · TOOL · RESULT · VALIDATION">
          <ExecutionTrace nodes={getTrace(call.lead)} />
        </Panel>
      </div>
    </div>
  );
}
