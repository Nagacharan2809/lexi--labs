import Link from "next/link";
import { notFound } from "next/navigation";
import { getEmployee } from "@/lib/app/data";
import { EmployeeMark, Chip } from "@/components/app/ui";

/** hired confirmation — the receipt, then the eight-step onboarding lane */
export default async function HiredPage({ params }: {
  params: Promise<{ employee: string }>;
}) {
  const { employee } = await params;
  const e = getEmployee(employee);
  if (!e) notFound();

  return (
    <main id="main" className="gutter flex-1">
      <div className="mx-auto max-w-2xl pb-24 pt-16">
        <Chip tone="green" pulse>HIRED — PENDING GATE</Chip>

        <div className="mt-5 flex items-center gap-4">
          <EmployeeMark name={e.name} className="h-14 w-14" />
          <div>
            <p className="meta text-grey">WELCOME TO NOVA REALTY</p>
            <h1 className="display mt-1.5 text-[clamp(1.8rem,3.6vw,2.6rem)] uppercase leading-none text-ink">{e.name}.</h1>
          </div>
        </div>

        <p className="mt-6 text-[0.98rem] leading-relaxed text-grey">
          {e.name} ({e.role.toLowerCase()}) has been hired onto the workspace. Nothing ships until the release gate
          clears — every employee walks the same path: knowledge, tools, permissions, workflow, verification.
        </p>

        <div className="mt-9 rounded-md border border-line bg-paper p-6">
          <p className="meta text-grey-2">THE HIRE RECEIPT</p>
          <dl className="mt-3 flex flex-col gap-2.5 text-[0.88rem]">
            {[
              ["Employee", `${e.name} — ${e.role}`],
              ["Employee ID", `${e.code}-${e.seq}`],
              ["Version", `v${e.version} (draft state until verified)`],
              ["Manager", e.owner],
              ["Plan", "Starter — 1 seat ₹24,999/mo, upgradeable"],
              ["Next step", "Eight-step onboarding — about one working day"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-b border-line pb-2.5 last:border-none">
                <dt className="meta text-grey-2">{k}</dt>
                <dd className="text-right text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-9 flex flex-wrap gap-2.5">
          <Link href={`/onboarding/${e.slug}`} className="meta rounded-sm bg-ink px-5 py-3.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
            Begin onboarding →
          </Link>
          <Link href="/app/workforce" className="meta rounded-sm border border-line-2 px-5 py-3.5 text-grey transition-colors hover:border-ink hover:text-ink">
            See the live workforce
          </Link>
        </div>

        <p className="meta mt-9 text-grey-2">
          THE GATE IS THE HIRING CONTRACT — {e.name.toUpperCase()} WORKS ONLY AFTER 12/12 SCENARIO TESTS RUN CLEAN.
        </p>
      </div>
    </main>
  );
}
