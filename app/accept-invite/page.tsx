import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata = {
  title: "Accept invite — Lexi Labs",
  description: "Join a Lexi Labs workspace from your invite.",
};

export default function AcceptInvitePage() {
  return <AuthScreen mode="invite" />;
}
