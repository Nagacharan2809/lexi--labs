import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = {
  title: "Create an account — Lexi Labs",
  description:
    "Hire your first AI employee. Deploy specialists to sales, support and operations in days — not quarters. Powered by Fleen.",
};

export default function SignUpPage() {
  return <AuthScreen mode="signup" />;
}
