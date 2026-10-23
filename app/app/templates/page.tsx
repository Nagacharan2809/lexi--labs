import Link from "next/link";
import { EMPLOYEES, employeeId } from "@/lib/app/data";
import { PageHead, Panel, Tile, Chip } from "@/components/app/ui";

/* blueprints beyond the current workforce — the hireable lineup */
const EXTRA = [
  { slug: "legal-contracts", name: "Legal Contracts", role: "Contract analyst", blurb: "Drafts, reviews and redlines vendor paperwork inside templates.", to: 0 },
  { slug: "hr-onboarding", name: "HR Onboarding", role: "People ops assistant", blurb: "Runs day-1 checklists, policy Q&A and document collection.", to: 0 },
  { slug: "bookkeeping", name: "Bookkeeping", role: "Finance clerk", blurb: "Reconciles invoices, tracks receivables, prepares GST filings.", to: 0 },
];

const BUNDLE = [
  "Knowledge pack curated for the role",
  "Tool scopes + permissions preset",
  "Workflow blueprint with escalation rail",
  "12-test evaluation gate pre-attached",
  "Draft onboarding checklist",
];

export default function TemplatesPage() {
  return (
    <>
      <PageHead
        kicker="Templates"
        title="Hire from a blueprint."
        sub="Roles, not chatbots: every template is a working employee candidate — knowledge, tools, workflows and a verification gate already configured."
      />

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Blueprints" value={EMPLOYEES.length + EXTRA.length} sub="9 proven · 3 new arrivals" />
        <Tile label="Deployed roles" value={EMPLOYEES.filter((e) => e.status !== "draft").length} sub="Currently in this workspace" />
        <Tile label="Fastest hire" value="1 day" sub="Voice Sales — template + gate" tone="blue" />
        <Tile label="Everything ships with" value="Gate 12/12" sub="Knowledge · tools · workflow" />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {EMPLOYEES.map((e) => (
          <article key={e.slug} className="group relative flex flex-col overflow-hidden rounded-md border border-line bg-paper p-5 transition-all duration-300 ease-brand hover:-translate-y-px hover:shadow-lift">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 grad-rule transition-transform duration-500 ease-brand group-hover:scale-x-100" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="display text-[1.02rem] uppercase text-ink">{e.name}</h2>
                <p className="meta mt-1 text-grey">{e.role}</p>
              </div>
              <Chip tone="green">DEPLOYED</Chip>
            </div>
            <p className="mt-3.5 flex-1 text-[0.86rem] leading-relaxed text-grey">{e.short}</p>
            <div className="meta mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3.5 text-grey-2">
              <span>REF · <span className="font-mono text-grey">{employeeId(e)}</span></span>
              <span>SCHEDULE · <span className="text-grey line-clamp-1">{e.hours}</span></span>
              <span>PLAN · <span className="text-grey">GROWTH</span></span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Link href={`/app/workforce/${e.slug}`} className="meta rounded-sm border border-line-2 px-3.5 py-2 text-grey transition-colors hover:border-ink hover:text-ink">
                View live employee
              </Link>
              <Link href={`/buy/${e.slug}`} className="meta text-blue-deep transition-colors hover:text-ink">
                Hire another →
              </Link>
            </div>
          </article>
        ))}

        {EXTRA.map((t) => (
          <article key={t.slug} className="group relative flex flex-col overflow-hidden rounded-md border border-dashed border-line-2 bg-paper p-5 transition-all duration-300 ease-brand hover:border-ink hover:shadow-lift">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="display text-[1.02rem] uppercase text-ink">{t.name}</h2>
                <p className="meta mt-1 text-grey">{t.role}</p>
              </div>
              <Chip tone="neutral">NEW</Chip>
            </div>
            <p className="mt-3.5 flex-1 text-[0.86rem] leading-relaxed text-grey">{t.blurb}</p>
            <p className="meta mt-4 border-t border-line pt-3.5 text-grey-2">BLUEPRINT ONLY — HIRE TO START ONBOARDING</p>
            <div className="mt-4 flex items-center gap-3">
              <Link href={`/buy/${t.slug}`} className="meta rounded-sm bg-ink px-3.5 py-2 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
                Configure hire
              </Link>
              <Link href="/app/build" className="meta text-grey transition-colors hover:text-ink">
                Build custom →
              </Link>
            </div>
          </article>
        ))}
      </div>

      <Panel title="What ships inside every template" kicker="NO BLANK CANVAS HIRES">
        <ul role="list" className="grid gap-x-8 gap-y-2.5 text-[0.88rem] md:grid-cols-2">
          {BUNDLE.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-ink">
              <span aria-hidden="true" className="meta mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-tint text-[0.6rem] text-blue-deep">✓</span>
              {b}
            </li>
          ))}
        </ul>
        <p className="meta mt-4 text-grey-2">
          TEMPLATES ARE THE FAST PATH — <Link href="/app/build" className="link-underline text-ink">BUILD FROM SCRATCH →</Link> FOR FULL CONTROL.
        </p>
      </Panel>
    </>
  );
}
