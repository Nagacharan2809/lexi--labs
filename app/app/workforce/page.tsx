import Link from "next/link";
import { EMPLOYEES } from "@/lib/app/data";
import { PageHead, Tile } from "@/components/app/ui";
import { WorkforceGrid } from "@/components/app/employee-cards";

export default function WorkforcePage() {
  return (
    <>
      <PageHead
        kicker="Workforce"
        title="Your AI employees."
        sub={
          <>
            <span className="block text-ink">People have roles.</span>
            Your AI workforce does too. Every employee below is a hired specialist with
            knowledge, tools, permissions and a work schedule — not a chat widget.
          </>
        }
      />

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile big label="Active employees" value={emp((e) => e.status === "working").length} sub={`${emp((e) => e.status !== "working").length} in setup lanes`} />
        <Tile label="Onboarding" value={emp((e) => e.status === "training").length} sub="Operations — night shift" />
        <Tile label="In verification" value={emp((e) => e.status === "verification").length} sub="Collections — gate at 90+" />
        <Tile label="Tasks today" value="3,214" sub="96.4% successful" />
        <Tile label="Successful executions" value="3,102" sub="Human interventions: 23" />
        <Tile label="Hours saved" value="412h" sub="vs manual baseline" />
        <Tile label="Estimated value" value="₹2.11 Cr" sub="ESTIMATE · 126 site visits influenced — not booked revenue" />
        <Tile label="Cost today" value="₹1.0k" sub="Voice + LLM + tools" />
      </div>

      <WorkforceGrid />

      {/* onboarding prompt */}
      <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-md border border-line bg-paper p-6 md:flex-row md:items-center">
        <div>
          <p className="meta text-grey-2">NEXT STEP OF THE WORKFORCE</p>
          <h2 className="display mt-2 max-w-[46ch] text-[1.4rem] uppercase text-ink">
            Lexi Operations is onboarding — assign knowledge and workflows to reach production.
          </h2>
        </div>
        <Link href="/app/workforce/operations" className="meta shrink-0 rounded-sm bg-ink px-5 py-3.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
          Continue onboarding →
        </Link>
      </div>
    </>
  );
}

const emp = (p: (e: (typeof EMPLOYEES)[number]) => boolean) => EMPLOYEES.filter(p);
