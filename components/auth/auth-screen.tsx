import Link from "next/link";
import SpectralFieldBackground from "@/components/hero/spectral-field";
import { AuthForm } from "@/components/auth/auth-form";
import { ForgotForm, InviteForm, ResetForm, VerifyEmailForm, WorkspaceForm } from "@/components/auth/auth-v2";

export type AuthScreenMode =
  | "signin"
  | "signup"
  | "verify"
  | "forgot"
  | "reset"
  | "invite"
  | "workspace";

interface ModeCopy {
  headline: string;
  sub: string;
  kicker: string;
  heading: string;
  lead: string;
  mobile: string;
}

const COPY: Record<AuthScreenMode, ModeCopy> = {
  signin: {
    headline: "Your workforce never clocked out.",
    sub: "Nine AI employees, one Fleen runtime. Sign in to review what they got done — every call, every workflow, logged and ready.",
    kicker: "Sign in — Lexi Labs",
    heading: "Sign in.",
    lead: "Pick up where your AI employees left off.",
    mobile: "Welcome back.",
  },
  signup: {
    headline: "Hire your first AI employee.",
    sub: "Sales, marketing, support, operations — specialists deployed in days, not quarters. Powered by Fleen.",
    kicker: "Create account — Lexi Labs",
    heading: "Create your account.",
    lead: "Your workforce assembles here.",
    mobile: "Start hiring.",
  },
  verify: {
    headline: "Proof of person, one code.",
    sub: "Email verification keeps the audit chain attached to real humans — every signed action on the floor traces to one.",
    kicker: "Verify email — Lexi Labs",
    heading: "Verify your email.",
    lead: "Six digits and the floor is yours.",
    mobile: "One code.",
  },
  forgot: {
    headline: "Nothing lost, everything keyed.",
    sub: "Reset links are single-use and expire fast — the same discipline the runtime applies to credentials.",
    kicker: "Reset password — Lexi Labs",
    heading: "Forgot password.",
    lead: "A key, not a puzzle. We emailed a link.",
    mobile: "Reset.",
  },
  reset: {
    headline: "New key, new session.",
    sub: "Every prior session revokes on change. The ledger remembers, the sessions don't.",
    kicker: "New password — Lexi Labs",
    heading: "Set a new password.",
    lead: "Stronger than the last one — your employees work with sharp tools, so should your account.",
    mobile: "New key.",
  },
  invite: {
    headline: "The humans go first.",
    sub: "You were invited to a live workforce — approvals, escalations and supervision run on real names, signed and audited.",
    kicker: "Accept invite — Lexi Labs",
    heading: "Accept your invite.",
    lead: "Join the floor. Your scopes are already waiting.",
    mobile: "You're invited.",
  },
  workspace: {
    headline: "One workspace, many employees.",
    sub: "Name the org your employees will serve — region, currency and metering follow. The first hire comes next.",
    kicker: "Create workspace — Lexi Labs",
    heading: "Name your workspace.",
    lead: "Where your employees will live.",
    mobile: "One floor.",
  },
};

const LIVE_ROLES = ["Sales", "Support", "Operations"] as const;

/**
 * Full-screen authentication screen — the brand panel carries the
 * Spectral Field (the hero's WebGL gradient) on the left; the right
 * column is a quiet paper sheet for the form. Server component; the
 * form itself is a client island.
 */
export function AuthScreen({
  mode,
  email = "aarav@novarealty.in",
  workspace = "Nova Realty",
}: {
  mode: AuthScreenMode;
  email?: string;
  workspace?: string;
}) {
  const copy = COPY[mode];

  return (
    <main
      id="main"
      className="grid min-h-svh flex-1 bg-paper lg:grid-cols-[1.05fr_1fr]"
    >
      {/* brand panel — spectral field, desktop only */}
      <aside className="relative hidden overflow-hidden bg-ink text-paper lg:block">
        <SpectralFieldBackground className="absolute inset-0" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          {/* brand */}
          <p className="meta edge-readable flex items-center gap-3 text-white">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-4 rounded-[1px]"
              style={{ background: "linear-gradient(100deg, #2b5aa7 0%, #e8763a 100%)" }}
            />
            LEXI LABS
          </p>

          {/* headline — optical signature, borrowed from the hero */}
          <div className="flex flex-col gap-6">
            <span aria-hidden="true" className="grad-rule-live h-px w-24" />
            <p className="display edge-readable max-w-[16ch] text-[clamp(2.3rem,3.6vw,3.8rem)] uppercase text-white">
              {copy.headline}
            </p>
            <p className="edge-readable max-w-[46ch] text-[1.02rem] leading-relaxed text-white/85">
              {copy.sub}
            </p>
          </div>

          {/* live roster */}
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
            <ul
              className="flex flex-wrap items-center gap-x-6 gap-y-3"
              role="list"
              aria-label="Live employee roster"
            >
              {LIVE_ROLES.map((role) => (
                <li
                  key={role}
                  className="meta edge-readable flex items-center gap-2.5 text-white/85"
                >
                  <span aria-hidden="true" className="chip-live text-ember" />
                  {role} · ONLINE
                </li>
              ))}
            </ul>
            <p className="meta edge-readable text-white/70">POWERED BY FLEEN</p>
          </div>
        </div>
      </aside>

      {/* form column */}
      <div className="flex flex-col">
        <header className="flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
          <Link
            href="/"
            className="meta text-grey transition-colors hover:text-ink"
          >
            ← Lexilabs.ai
          </Link>
          <a
            href="mailto:workforce@lexilabs.ai"
            className="meta hidden text-grey transition-colors hover:text-ink sm:block"
          >
            Need help?
          </a>
        </header>

        {/* compact brand band for mobile — the desktop panel is out of view */}
        <div className="mx-6 mt-6 overflow-hidden bg-ink text-paper lg:hidden">
          <p className="meta edge-readable flex items-center gap-2.5 pt-6">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-4 rounded-[1px]"
              style={{ background: "linear-gradient(100deg, #2b5aa7 0%, #e8763a 100%)" }}
            />
            LEXI LABS
          </p>
          <p className="display edge-readable mt-4 text-[1.75rem] uppercase text-white">
            {copy.mobile}
          </p>
          <p className="edge-readable mt-2 pb-6 text-[0.95rem] leading-relaxed text-white/80">
            {copy.lead}
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[27rem] flex-1 flex-col justify-center px-6 py-12 md:px-10 md:py-16">
          <div className="mb-9">
            <p className="meta text-grey">{copy.kicker}</p>
            <h1 className="display-md mt-4 text-[clamp(2.25rem,5vw,3rem)] uppercase text-ink">
              {copy.heading}
            </h1>
            <p className="mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-grey">
              {copy.lead}
            </p>
          </div>

          {mode === "signin" ? (
            <AuthForm mode="signin" />
          ) : mode === "signup" ? (
            <AuthForm mode="signup" />
          ) : mode === "verify" ? (
            <VerifyEmailForm email={email} />
          ) : mode === "forgot" ? (
            <ForgotForm />
          ) : mode === "reset" ? (
            <ResetForm />
          ) : mode === "workspace" ? (
            <WorkspaceForm />
          ) : (
            <InviteForm email={email} workspace={workspace} />
          )}
        </div>
      </div>
    </main>
  );
}
