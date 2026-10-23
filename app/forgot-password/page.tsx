import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata = {
  title: "Reset password — Lexi Labs",
  description: "Request a single-use password reset link.",
};

export default function ForgotPasswordPage() {
  return <AuthScreen mode="forgot" />;
}
