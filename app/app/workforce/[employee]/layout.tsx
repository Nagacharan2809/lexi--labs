import { getEmployee } from "@/lib/app/data";
import { notFound } from "next/navigation";
import { EmployeeHeader } from "@/components/app/employee-header";
import { EmployeeNav } from "@/components/app/employee-nav";

export default async function EmployeeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ employee: string }>;
}) {
  const { employee } = await params;
  if (!getEmployee(employee)) notFound();

  return (
    <div>
      <div className="mb-4">
        <EmployeeHeader slug={employee} />
      </div>
      <div className="sticky top-[57px] z-20 -mx-4 border-b border-line bg-paper/95 px-4 backdrop-blur md:-mx-8 md:px-8">
        <EmployeeNav slug={employee} />
      </div>
      <div className="pt-8">{children}</div>
    </div>
  );
}
