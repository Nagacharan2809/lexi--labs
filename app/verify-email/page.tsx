import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata = {
  title: "Verify email — Lexi Labs",
  description: "Verify your email to attach the audit chain to your account.",
};

export default function VerifyEmailPage() {
  return <AuthScreen mode="verify" />;
}
