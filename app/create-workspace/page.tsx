import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata = {
  title: "Create workspace — Lexi Labs",
  description: "Name the workspace your AI employees will serve.",
};

/* between verify-email and the console — the workspace is born here */
export default function CreateWorkspacePage() {
  return <AuthScreen mode="workspace" />;
}
