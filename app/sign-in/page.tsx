import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata = {
  title: "Sign in — Lexi Labs",
  description: "Sign in to the Lexi AI workforce console.",
};

export default function SignInPage() {
  return <AuthScreen mode="signin" />;
}
