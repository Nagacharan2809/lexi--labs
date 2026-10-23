import type { Metadata } from "next";
import { AppShell } from "@/components/app/shell";
import "../globals.css";

export const metadata: Metadata = {
  title: "Workforce console — Lexi Labs",
  description: "Hire, train, verify and operate your AI employees.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
