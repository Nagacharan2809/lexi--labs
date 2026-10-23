import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata = {
  title: "Create account — Lexi Labs",
  description: "Create your Lexi Labs account and hire your first AI employee.",
};

export default function SignUpPage() {
  return <AuthScreen mode="signup" />;
}
