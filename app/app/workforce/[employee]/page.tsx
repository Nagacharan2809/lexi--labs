import Link from "next/link";
import { notFound } from "next/navigation";
import {
  VOICE_TODAY, LIVE_FEED, ACTIVITY, getEmployee, VERIFY_SCORE, OUTCOMES,
} from "@/lib/app/data";
import { STATUS_LABEL } from "@/lib/app/data";
import { inr, num } from "@/lib/app/format";
import { Panel, Tile, Chip } from "@/components/app/ui";
import { Donut } from "@/components/app/charts";
import { AnimatedNumber } from "@/components/app/live";

export default async function EmployeeOverview({ params }: {
  params: Promise<{ employee: string }>;
}) {
  const { employee } = await params;
  const e = getEmployee(employee);
  if (!e) notFound();

  const flagship = e.slug === "voice-sales";
  const base = `/app/workforce/${e.slug}`;
  const working = e.status === "working";

  interface Metric { label: string; value: number; sub: string; href?: string; money?: boolean; hours?: boolean }
  const metrics: Metric[] = flagship
    ? [
        { label: "Leads assigned", value: VOICE_TODAY.leads, sub: "Meta + Website + Referral", href: `${base}/leads` },
        { label: "Calls", value: VOICE_TODAY.calls, sub: "1186 completed · 14 failed", href: `${base}/calls` },
        { label: "Connected", value: VOICE_TODAY.connected, sub: "82.2% connection rate", href: `${base}/calls` },
        { label: "Interested", value: VOICE_TODAY.interested, sub: "Intent: high + medium", href: `${base}/outcomes` },
        { label: "Callbacks", value: VOICE_TODAY.callbacks, sub: "Scheduled for tonight", href: `${base}/outcomes` },
        { label: "Convinced", value: VOICE_TODAY.convinced, sub: "Sales outcome", href: `${base}/outcomes` },
        { label: "Confirmed", value: VOICE_TODAY.confirmed, sub: "Fortnight confirmed", href: `${base}/outcomes` },
        { label: "Appointments", value: VOICE_TODAY.appointments, sub: "61 scheduled visits", href: `${base}/outcomes` },
        { label: "Escalations", value: VOICE_TODAY.escalated, sub: "Warm-transferred", href: `${base}/outcomes` },
      ]
    : [
        { label: "Tasks handled", value: 312, sub: "Since last Monday" },
        { label: "Queued", value: 48, sub: "Dialing window respected" },
        { label: "Successful", value: 298, sub: `${e.performance.execution || 96}% execution` },
        { label: "Escalations", value: 2, sub: "To human queue" },
        { label: "Interventions", value: 1, sub: "1 approval pending" },
        { label: "Cost today", value: 84, sub: "LLM + tools (₹)", money: true },
        { label: "Hours saved", value: 19, sub: "Measured baseline", hours: true },
        { label: "Runs", value: 214, sub: "Total executions today" },
        { label: "Retries", value: 7, sub: "Auto-recovered" },
      ];

  const statusLine = working
    ? flagship
      ? "Your sales employee is working."
      : `${e.name} is working.`
    : e.status === "training"
      ? `${e.name} is onboarding — knowledge and workflows are next.`
      : e.status === "verification"
        ? `${e.name} is waiting at the deployment gate.`
        : e.status === "ready"
          ? `${e.name} is verified and ready — not scheduled to start work yet.`
          : `${STATUS_LABEL[e.status]} — the workspace stays visible while the employee is idle.`;

  const feed: { t: string; text: string; lead?: string }[] = flagship
    ? LIVE_FEED
    : (ACTIVITY.filter((a) => a.who === e.name).concat(ACTIVITY.filter((a) => a.who !== e.name).slice(0, 2))
        .map((a) => ({ t: a.at, text: a.text, lead: undefined as string | undefined })));

  return (
    <>
      {/* greeting strip */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="meta text-grey">{e.name.toUpperCase()} · TODAY</p>
          <h2 className="display mt-2 text-[1.6rem] uppercase text-ink">{statusLine}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone={working ? "green" : "amber"} pulse={working}>LEDGER LIVE</Chip>
          <Link href={`${base}/work`} className="meta rounded-sm border border-line-2 px-3.5 py-2 text-grey transition-colors hover:border-ink hover:text-ink">OPEN WORK QUEUE →</Link>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {metrics.map((m) => (
          <Tile
            key={m.label}
            label={m.label}
            value={m.money ? inr(m.value) : m.hours ? `${m.value}h` : <AnimatedNumber value={m.value} />}
            sub={m.sub}
            href={m.href}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Panel title="Live work" kicker={working ? "STREAMING · NEWEST FIRST" : "RECENT ACTIVITY"} actions={
          <Link href={`${base}/activity`} className="meta link-underline text-ink">FULL AUDIT →</Link>
        }>
          <ol className="relative flex flex-col">
            <span aria-hidden="true" className="absolute bottom-3 left-[62px] top-3 w-px bg-line-2" />
            {feed.slice(0, 8).map((ev, i) => (
              <li key={i} className="relative flex items-start gap-5 py-2.5 pl-0">
                <span className="pt-0.5 font-mono text-[0.72rem] tabular-nums text-grey-2">{ev.t}</span>
                <span aria-hidden="true" className={
                  working === true && i === 0
                    ? "absolute left-[55px] top-[13px] h-[15px] w-[15px] rounded-full bg-blue-deep"
                    : "absolute left-[55px] top-[13px] h-[15px] w-[15px] rounded-full border-[1.5px] border-line-2 bg-paper"
                } />
                <p className="flex-1 text-[0.88rem] text-ink">
                  {ev.text}
                  {ev.lead ? (
                    <Link href={`${base}/leads`} className="ml-2 font-mono text-[0.74rem] text-blue-deep underline decoration-blue/30 hover:decoration-blue">({ev.lead})</Link>
                  ) : null}
                </p>
              </li>
            ))}
          </ol>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="Performance" kicker="PERIOD · OCTOBER">
            <div className="flex items-center gap-6">
              <Donut value={flagship ? VERIFY_SCORE : (e.performance.verification || 88)} size={92} sub="VER SCORE" />
              <div className="flex-1">
                <p className="meta text-grey-2">EXECUTION SUCCESS — LIVE</p>
                <p className="display mt-2 tabular-nums text-[1.9rem] text-ink">{flagship ? "96.4%" : `${e.performance.execution || 95}%`}</p>
                <p className="meta mt-1.5 text-grey">{num(VOICE_TODAY.calls)} runs sampled · ledger-derived</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
              <Link href={`${base}/evaluations`} className="meta rounded-sm border border-line-2 px-3 py-2 text-grey transition-colors hover:border-ink hover:text-ink">Run test</Link>
              <Link href={`${base}/deployment`} className="meta rounded-sm border border-line-2 px-3 py-2 text-grey transition-colors hover:border-ink hover:text-ink">Deployment centre</Link>
              <Link href={`${base}/instructions`} className="meta rounded-sm border border-line-2 px-3 py-2 text-grey transition-colors hover:border-ink hover:text-ink">Edit instructions</Link>
            </div>
          </Panel>

          <Panel title="The evidence chain" kicker="PHILOSOPHY">
            <p className="text-[0.9rem] leading-relaxed text-grey">
              You don&apos;t have to believe that your employee works — you can read it.
              Every number above is a <Link className="link-underline text-ink" href={`${base}/outcomes`}>records drill-down</Link>,
              every record an execution, every execution a signed trace.
            </p>
            <div className="meta mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-grey-2">
              <span className="rounded-full bg-ink px-3 py-1.5 text-paper">NUMBER</span>→
              <span className="rounded-full border border-line-2 px-3 py-1.5 text-grey">RECORDS</span>→
              <span className="rounded-full border border-line-2 px-3 py-1.5 text-grey">EXECUTION</span>→
              <span className="rounded-full border border-orange/40 bg-orange-tint px-3 py-1.5 text-orange-deep">EVIDENCE</span>
            </div>
          </Panel>
        </div>
      </div>

      {flagship ? (
        <p className="meta mt-8 text-grey-2">
          TODAY&apos;S FUNNEL: {num(VOICE_TODAY.leads)} LEADS → {num(VOICE_TODAY.calls)} CALLS → {num(VOICE_TODAY.connected)} CONNECTED → {num(VOICE_TODAY.interested)} INTERESTED → {num(VOICE_TODAY.confirmed)} CONFIRMED · {OUTCOMES.appointment} APPOINTMENTS ON THE CALENDAR · TRACE SAMPLE: LD-1000 “CHARAN”.
        </p>
      ) : null}
    </>
  );
}
