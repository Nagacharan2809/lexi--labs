import Link from "next/link";
import {
  EMPLOYEES, STATUS_LABEL, ACTIVITY, APPROVALS, USAGE, COSTS_MONTH, REPORT_SERIES,
} from "@/lib/app/data";
import { inr, inrShort, num } from "@/lib/app/format";
import { PageHead, Panel, Tile, Chip, Dot, EmployeeMark } from "@/components/app/ui";
import { Spark, StackBar } from "@/components/app/charts";
import { AnimatedNumber } from "@/components/app/live";

export default function OverviewPage() {
  const active = EMPLOYEES.filter((e) => e.status === "working").length;
  const onboarding = EMPLOYEES.filter((e) => e.status === "training").length;
  const verifying = EMPLOYEES.filter((e) => e.status === "verification" || e.status === "ready").length;
  const costMonth = COSTS_MONTH.reduce((a, c) => a + c.value, 0);
  const last14 = REPORT_SERIES.map((r) => r.calls);

  return (
    <>
      <PageHead
        kicker="Workspace · Nova Realty"
        title="Overview."
        sub="Everything your AI workforce did today — one layer above nine employees, one layer below the receipts."
        actions={
          <>
            <Link href="/app/build" className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
              Hire employee
            </Link>
            <Link href="/app/reports" className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">
              Generate report
            </Link>
          </>
        }
      />

      {/* live operations band */}
      <Panel className="mb-6" title="Live operations" kicker="NOW · Refreshes with the ledger" actions={<Chip tone="green" pulse>ALL SYSTEMS NOMINAL</Chip>}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <LiveOp label="Employees working" value={String(active)} sub="Voice Sales · Support · Sales · Lead Gen" />
          <LiveOp label="Calls in session" value="2" sub="Avg session 03:42" />
          <LiveOp label="Tasks queued" value="312" sub="Dialing window 09:00–21:00" />
          <LiveOp label="Awaiting approval" value={String(APPROVALS.length)} sub="2 sensitive · 3 routine" href="/app/approvals" />
        </div>
      </Panel>

      {/* workspace stats */}
      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Employees" value={<AnimatedNumber value={EMPLOYEES.length} />} sub={`${num(active)} active · ${onboarding} onboarding · ${verifying} pre-deploy`} />
        <Tile label="Tasks today" value={<AnimatedNumber value={3214} />} sub="Across every employee" />
        <Tile label="Successful executions" value="96.4%" sub="3,102 of 3,214 runs" tone="blue" />
        <Tile label="Human interventions" value="23" sub="6 escalated · 17 approvals" />
        <Tile label="Hours saved" value="412h" sub="Measured against manual baseline" />
        <Tile label="AI cost — month" value={inrShort(costMonth)} sub="₹1.0k avg / working day" />
        <Tile label="Estimated value (est.)" value={inrShort(21150000)} sub="126 site visits × avg ₹16.5L deal — ESTIMATE, not revenue" />
        <Tile label="Plan" value={USAGE.plan} sub={`${USAGE.period} · ${USAGE.employees} employees live`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        {/* leaderboard */}
        <Panel title="Employee leaderboard" kicker="TODAY — click a name to open its workspace" pad>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-line">
                  {["Employee", "Status", "Work", "Success", "Outcomes", "Cost"].map((h) => (
                    <th key={h} className="meta px-3 py-2.5 first:pl-0 text-grey-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EMPLOYEES.map((e) => {
                  const workToday = e.slug === "voice-sales" ? 1200 : e.slug === "sales" ? 486 : e.slug === "support" ? 312 : e.slug === "lead-generator" ? 2013 : e.capabilities.length * 4;
                  const stroke = e.slug === "analyst" ? "—" : `${e.performance.execution || 0}%`;
                  return (
                    <tr key={e.slug} className="border-b border-line/70 text-[0.86rem] last:border-b-0">
                      <td className="py-3 pl-0 pr-3">
                        <Link href={`/app/workforce/${e.slug}`} className="group flex items-center gap-3">
                          <EmployeeMark name={e.name} className="h-7 w-7 shrink-0 text-[0.55rem]" />
                          <span className="font-medium text-ink transition-colors group-hover:text-orange-deep">{e.name}</span>
                        </Link>
                      </td>
                      <td className="px-3 py-3">
                        <span className="meta inline-flex items-center gap-2 text-grey">
                          {e.status === "working" ? <Dot tone="green" /> : null}
                          {STATUS_LABEL[e.status].toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-mono text-[0.8rem] tabular-nums text-ink">
                        {workToday ? num(workToday) : "—"}
                      </td>
                      <td className="px-3 py-3 font-mono text-[0.8rem] tabular-nums text-ink">{stroke}</td>
                      <td className="px-3 py-3 font-mono text-[0.8rem] tabular-nums text-ink">
                        {e.slug === "voice-sales" ? "126" : e.slug === "support" ? "288" : e.slug === "sales" ? "61" : e.slug === "lead-generator" ? "2,013 rec" : "—"}
                      </td>
                      <td className="px-3 py-3 font-mono text-[0.8rem] tabular-nums text-ink">
                        {e.slug === "voice-sales" ? inr(156292) : e.slug === "sales" ? inr(4210) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="meta mt-4 text-grey-2">TODAY&apos;S NUMBERS ARE DERIVED FROM THE SAME RECORDS YOU CAN OPEN — START AT <Link className="link-underline text-ink" href="/app/outcomes">OUTCOMES</Link>.</p>
        </Panel>

        <div className="flex flex-col gap-6">
          {/* activity feed */}
          <Panel title="Workspace activity" kicker="AUDIT TRAIL" actions={<Link href="/app/activity" className="meta link-underline text-ink">FULL LOG →</Link>}>
            <ol className="relative flex flex-col">
              <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-line-2" />
              {ACTIVITY.slice(0, 7).map((ev, i) => (
                <li key={i} className="relative flex flex-col gap-1 py-2.5 pl-8">
                  <span aria-hidden="true" className="absolute left-0 top-3.5 h-[15px] w-[15px] rounded-full border-[1.5px] border-line-2 bg-paper" />
                  <div className="meta flex items-baseline justify-between gap-3">
                    <span className="text-ink">{ev.who} · {ev.kind}</span>
                    <span className="font-mono text-grey-2">{ev.at}</span>
                  </div>
                  <p className="text-[0.84rem] leading-snug text-grey">{ev.text}</p>
                </li>
              ))}
            </ol>
          </Panel>

          {/* cost composition */}
          <Panel title="Cost composition" kicker="OCTOBER — FIXED + VARIABLE">
            <StackBar parts={[
              { label: "Platform (fixed)", value: 59999, tone: "#101114" },
              { label: "Voice", value: 121050, tone: "#2b5aa7" },
              { label: "LLM", value: 21030, tone: "#7ea6d8" },
              { label: "Tools + API", value: 6742, tone: "#f0a05a" },
              { label: "Infra", value: 3260, tone: "#9a9da2" },
            ]} />
            <div className="mt-5 border-t border-line pt-4">
              <p className="meta mb-2 text-grey-2">DAILY CALL VOLUME — LAST 14 DAYS</p>
              <Spark points={last14} height={52} />
            </div>
          </Panel>
        </div>
      </div>

      {/* next up */}
      <div className="mt-10 grid gap-3 md:grid-cols-3">
        <NextCard href="/app/build" title="Hire your next employee" body="Start from a template — Voice Sales takes one working day." />
        <NextCard href="/app/workforce/voice-sales/evaluations" title="Run evaluations" body="120-case regression against knowledge v4 is due this week." />
        <NextCard href="/app/proof" title="Review proof of work" body="Every completed action, with inputs, validations and outputs." />
      </div>
    </>
  );
}

function LiveOp({ label, value, sub, href }: { label: string; value: string; sub: string; href?: string }) {
  const inner = (
    <div className={href ? "group cursor-pointer" : ""}>
      <p className="meta text-grey-2">{label}</p>
      <p className="display mt-2 flex items-center gap-2.5 tabular-nums text-[1.7rem] text-ink">
        {label === "Employees working" || label === "Calls in session" ? <PulseInline /> : null}
        {value}
      </p>
      <p className="meta mt-1.5 text-grey">{sub}</p>
    </div>
  );
  return href ? (
    <Link href={href} className="block">
      <div className="group relative rounded-sm p-3 transition-colors hover:bg-paper-2">
        {inner}
        <span aria-hidden="true" className="meta absolute right-3 top-3 text-grey-2 opacity-0 transition-opacity group-hover:opacity-100">→</span>
      </div>
    </Link>
  ) : (
    <div className="relative rounded-sm p-3">{inner}</div>
  );
}

function PulseInline() {
  return (
    <span aria-hidden="true" className="relative inline-flex h-2 w-2">
      <span className="absolute inset-0 animate-pulse rounded-full bg-emerald-500 opacity-40" style={{ animationDuration: "2.4s" }} />
      <span className="absolute inset-0 rounded-full bg-emerald-500" />
    </span>
  );
}

function NextCard({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link href={href} className="group relative overflow-hidden rounded-md border border-line bg-paper p-6 transition-all duration-300 ease-brand hover:-translate-y-px hover:shadow-lift">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 grad-rule transition-transform duration-500 ease-brand group-hover:scale-x-100" />
      <p className="display text-[1.05rem] uppercase text-ink">{title}</p>
      <p className="mt-2 text-[0.88rem] leading-relaxed text-grey">{body}</p>
      <p className="meta mt-4 text-ink transition-transform duration-300 ease-brand group-hover:translate-x-1.5">OPEN →</p>
    </Link>
  );
}

