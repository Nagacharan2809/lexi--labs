import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = {
  title: "Sign in — Lexi Labs",
  description:
    "Sign in to your Lexi Labs account. Nine AI employees, one Fleen runtime — your workforce never clocked out.",
};

export default function SignInPage() {
  return <AuthScreen mode="signin" />;
}
