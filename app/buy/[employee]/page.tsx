import Link from "next/link";
import { getEmployee } from "@/lib/app/data";
import { notFound } from "next/navigation";
import { BuyFlow } from "@/components/app/buy-flow";
import { EmployeeMark } from "@/components/app/ui";

const NEW_ROLES: Record<string, { role: string; blurb: string }> = {
  "legal-contracts": { role: "Contract analyst", blurb: "Drafts, reviews and redlines vendor paperwork inside templates." },
  "hr-onboarding": { role: "People ops assistant", blurb: "Runs day-1 checklists, policy Q&A and document collection." },
  "bookkeeping": { role: "Finance clerk", blurb: "Reconciles invoices, tracks receivables, prepares GST filings." },
};

/** resolve any buyable slug — hired employees or blueprint-only roles */
function resolve(slug: string) {
  const hired = getEmployee(slug);
  if (hired) {
    return {
      name: hired.name,
      role: hired.role,
      blurb: hired.short,
      isNew: false,
      id: hired.slug,
      another: true,
    };
  }
  const tpl = NEW_ROLES[slug];
  if (tpl) {
    const name = slug.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");
    return { name: `Lexi ${name}`, role: tpl.role, blurb: tpl.blurb, isNew: true, id: slug, another: false };
  }
  return null;
}

export default async function BuyPage({ params }: {
  params: Promise<{ employee: string }>;
}) {
  const { employee } = await params;
  const id = resolve(employee);
  if (!id) notFound();

  return (
    <main id="main" className="gutter flex-1">
      <div className="mx-auto max-w-5xl pb-24 pt-14">
        <Link href="/app/templates" className="meta text-grey transition-colors hover:text-ink">
          ← All templates
        </Link>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <EmployeeMark name={id.name} className="h-14 w-14" />
            <div>
              <p className="meta text-grey">{id.isNew ? "NEW BLUEPRINT" : "ANOTHER HIRE OF A DEPLOYED ROLE"} · HIRE FLOW</p>
              <h1 className="display mt-1.5 text-[clamp(1.7rem,3.4vw,2.4rem)] uppercase leading-none text-ink">{id.name}</h1>
              <p className="meta mt-1.5 text-grey-2">{id.role.toUpperCase()}</p>
            </div>
          </div>
        </div>

        <p className="mt-5 max-w-[64ch] text-[0.95rem] leading-relaxed text-grey">
          {id.blurb} Configure the workload below — the bill updates live from the measured cost drivers, and the
          confirmation names every component before any money moves.
        </p>

        <div className="mt-9">
          <BuyFlow identity={{ slug: id.id, name: id.name, role: id.role, blurb: id.blurb, isNew: id.isNew }} />
        </div>
      </div>
    </main>
  );
}
