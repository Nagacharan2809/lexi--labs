import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata = {
  title: "New password — Lexi Labs",
  description: "Set a new password for your Lexi Labs account.",
};

export default function ResetPasswordPage() {
  return <AuthScreen mode="reset" />;
}
