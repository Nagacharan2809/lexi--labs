import { notFound } from "next/navigation";
import Link from "next/link";
import { getEmployee, employeeId, STATUS_LABEL } from "@/lib/app/data";
import { EmployeeActions } from "@/components/app/employee-actions";
import { EmployeeMark } from "@/components/app/ui";

/**
 * Employee identity band — reads like a personnel profile header,
 * not a settings screen. Sits at the top of every employee route
 * via the [employee] layout.
 */
export async function EmployeeHeader({ slug }: { slug: string }) {
  const e = getEmployee(slug);
  if (!e) notFound();
  const working = e.status === "working";
  return (
    <header className="overflow-hidden rounded-md border border-ink bg-ink text-paper">
      <div className="flex flex-col gap-5 p-6 md:flex-row md:items-start md:justify-between md:p-8">
        <div className="flex items-start gap-5">
          <EmployeeMark name={e.name} className="h-16 w-16 shrink-0 md:h-[4.4rem] md:w-[4.4rem]" />
          <div>
            <h1 className="display text-[clamp(1.7rem,3.4vw,2.5rem)] uppercase leading-none text-white">{e.name}</h1>
            <p className="meta mt-2.5 text-white/70">{e.role}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
              <span className="meta inline-flex items-center gap-2 text-white">
                <span aria-hidden="true" className={working ? "relative inline-flex h-2 w-2" : "inline-block h-2 w-2 rounded-full bg-amber-400"}>
                  {working ? (
                    <>
                      <span className="absolute inset-0 animate-pulse rounded-full bg-emerald-400 opacity-45" style={{ animationDuration: "2.4s" }} />
                      <span className="absolute inset-0 rounded-full bg-emerald-400" />
                    </>
                  ) : null}
                </span>
                {STATUS_LABEL[e.status].toUpperCase()}
              </span>
              <span className="meta text-white/55">ID · <span className="font-mono text-white/85">{employeeId(e)}</span></span>
              <span className="meta text-white/55">VER · <span className="font-mono text-white/85">{e.version}</span></span>
              <span className="meta text-white/55">MANAGER · <span className="text-white/85">{e.owner}</span></span>
              <span className="meta text-white/55">JOINED · <span className="text-white/85">{e.joined}</span></span>
              <span className="meta text-white/55">LAST ACTIVE · <span className="text-white/85">{e.lastActive}</span></span>
            </div>
            <p className="meta mt-2.5 text-white/45">{e.hours}</p>
          </div>
        </div>
        <div className="flex flex-wrap shrink-0 items-center gap-2">
          <Link href={`/app/workforce/${e.slug}/evaluations`} className="meta rounded-sm border border-white/30 px-4 py-2.5 text-white transition-colors hover:border-white">Test</Link>
          <Link href={`/app/workforce/${e.slug}/deployment`} className="meta rounded-sm border border-white/30 px-4 py-2.5 text-white transition-colors hover:border-white">Deploy</Link>
          <Link href={`/app/workforce/${e.slug}/permissions`} className="meta rounded-sm border border-white/30 px-4 py-2.5 text-white transition-colors hover:border-white">Settings</Link>
          <EmployeeActions />
        </div>
      </div>
    </header>
  );
}
