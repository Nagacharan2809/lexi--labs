"use client";

/* Auth v2 — verify / forgot / reset / invite forms on the shared field language. */

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/controls";
import { cn } from "@/lib/utils";

const inputClass =
  "field w-full rounded-xs border-b border-line bg-transparent py-2.5 text-[0.98rem] text-ink outline-none placeholder:text-grey-2";

function Meta({ children }: { children: React.ReactNode }) {
  return <span className="text-[0.6875rem] leading-relaxed text-grey">{children}</span>;
}

function GhostLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="link-underline text-ink transition-colors hover:text-orange-deep">
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ verify */

export function VerifyEmailForm({ email }: { email: string }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(38);
  const [state, setState] = useState<"idle" | "checking" | "done">("idle");

  const code = digits.join("");

  const setDigit = (i: number, v: string) => {
    const ch = v.replace(/\D/g, "").slice(-1);
    setDigits((d) => {
      const next = [...d];
      next[i] = ch;
      return next;
    });
    if (ch && i < 5) {
      const el = document.getElementById(`digit-${i + 1}`) as HTMLInputElement | null;
      el?.focus();
    }
  };

  const confirm = () => {
    if (code.length < 6 || state !== "idle") return;
    setState("checking");
    window.setTimeout(() => setState("done"), 1400);
  };

  const resend = () => {
    if (seconds > 0) return;
    setSeconds(38);
    const t = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) window.clearInterval(t);
        return s - 1;
      });
    }, 1000);
  };

  if (state === "done") {
    return (
      <div className="flex flex-col gap-7">
        <div className="relative h-12 w-12" aria-hidden="true">
          <span className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 210deg, #1d4790, #2b5aa7, #7ea6d8, #f0a05a, #e8763a, #d95f2b, #1d4790)" }} />
          <span className="absolute inset-[3px] rounded-full bg-paper" />
          <span className="absolute inset-0 m-auto h-1.5 w-4 rounded-[1px]" style={{ background: "linear-gradient(100deg, #2b5aa7, #e8763a)" }} />
        </div>
        <div>
          <p className="meta text-grey">Email verified</p>
          <h2 className="display-md mt-3 text-[clamp(2rem,4.4vw,2.6rem)] uppercase text-ink">Verified. Now the workspace.</h2>
          <p className="mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-grey">
            One more step — name the organisation your employees will serve, then pick your first hire.
          </p>
        </div>
        <Link href="/create-workspace" className="group meta inline-flex items-center justify-center gap-3 rounded-sm bg-ink px-7 py-4 text-paper transition-all duration-300 ease-brand hover:-translate-y-px hover:shadow-lift">
          Create workspace <ArrowRight className="group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-7" noValidate onSubmit={(e: FormEvent) => { e.preventDefault(); confirm(); }}>
      <div>
        <p className="meta text-grey">Verification code — sent to</p>
        <p className="mt-1 font-mono text-[0.95rem] text-ink">{email}</p>
      </div>

      <div className="flex gap-2" role="group" aria-label="Six digit verification code">
        {digits.map((d, i) => (
          <input
            key={i}
            id={`digit-${i}`}
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            aria-label={`Digit ${i + 1}`}
            className={cn(
              "field h-14 w-full rounded-xs border border-line bg-transparent text-center font-mono text-[1.2rem] text-ink outline-none focus:border-ink",
            )}
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={state !== "idle" || code.length < 6}
        className="group/cta meta inline-flex items-center justify-between rounded-sm bg-ink px-7 py-4 text-paper transition-all duration-300 ease-brand hover:-translate-y-px hover:shadow-lift disabled:pointer-events-none disabled:opacity-60"
      >
        {state === "checking" ? "Checking the code…" : "Verify & continue"}
        {state === "idle" ? <ArrowRight className="group-hover/cta:translate-x-1" /> : null}
      </button>

      <div className="flex items-center justify-between gap-4">
        <button type="button" onClick={resend} disabled={seconds > 0} className="meta text-grey transition-colors hover:text-ink disabled:text-grey-2">
          {seconds > 0 ? `Resend in ${seconds}s` : "Resend code"}
        </button>
        <Meta>
          Wrong address? <GhostLink href="/sign-up">Change email</GhostLink>
        </Meta>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ forgot */

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const invalid = touched && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (invalid || !email.trim()) { setTouched(true); return; }
    setState("sending");
    window.setTimeout(() => setState("sent"), 1300);
  };

  if (state === "sent") {
    return (
      <div className="flex flex-col gap-7">
        <div>
          <p className="meta text-grey">Reset link sent</p>
          <h2 className="display-md mt-3 text-[clamp(2rem,4.4vw,2.6rem)] uppercase text-ink">Check your inbox.</h2>
          <p className="mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-grey">
            The reset link is single-use and expires in 30 minutes. Nothing clipboard-accessible in this preview —
            the production console sends the real thing.
          </p>
        </div>
        <Meta>
          Didn&apos;t receive it? Wait a minute, check spam, then <GhostLink href="/forgot-password">retry with a different address</GhostLink>.
        </Meta>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-7" noValidate onSubmit={submit}>
      <label className="group/field relative block">
        <span className="meta block text-grey transition-colors group-focus-within:text-ink">
          Work email
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="you@company.com"
          aria-invalid={invalid || undefined}
          className={cn(inputClass, invalid && "border-b-orange-deep")}
        />
        {invalid ? <span role="alert" className="meta absolute right-0 top-0 text-[0.65rem] text-orange-deep">Use a valid work email.</span> : null}
      </label>

      <button
        type="submit"
        disabled={state === "sending"}
        className="group/cta meta inline-flex items-center justify-between rounded-sm bg-ink px-7 py-4 text-paper transition-all duration-300 ease-brand hover:-translate-y-px hover:shadow-lift disabled:pointer-events-none"
      >
        {state === "sending" ? "Sending reset link…" : "Send reset link"}
        {state === "idle" ? <ArrowRight className="group-hover/cta:translate-x-1" /> : null}
      </button>

      <Meta>
        Remembered it after all? <GhostLink href="/sign-in">Back to sign in</GhostLink>
      </Meta>
    </form>
  );
}

/* ------------------------------------------------------------------- reset */

export function ResetForm() {
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [touched, setTouched] = useState<{ p: boolean; c: boolean }>({ p: false, c: false });
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [show, setShow] = useState(false);

  const weak = pass.length < 8;
  const mismatch = confirmPass.length > 0 && confirmPass !== pass;
  const invalid = weak || mismatch;
  const touchedAny = touched.p || touched.c;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ p: true, c: true });
    if (invalid) return;
    setState("saving");
    window.setTimeout(() => setState("saved"), 1200);
  };

  if (state === "saved") {
    return (
      <div className="flex flex-col gap-7">
        <div>
          <p className="meta text-grey">Password updated</p>
          <h2 className="display-md mt-3 text-[clamp(2rem,4.4vw,2.6rem)] uppercase text-ink">New key, new session.</h2>
          <p className="mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-grey">
            The next sign-in uses the new password. Every prior session is revoked.
          </p>
        </div>
        <Link href="/sign-in" className="group meta inline-flex items-center justify-between rounded-sm bg-ink px-7 py-4 text-paper transition-all duration-300 ease-brand hover:-translate-y-px hover:shadow-lift">
          Sign in <ArrowRight className="group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-7" noValidate onSubmit={submit}>
      <p className="text-[0.9rem] leading-relaxed text-grey">Your reset link is valid for this session — set a strong replacement.</p>

      <label className="group/field relative block">
        <span className="meta block text-grey transition-colors group-focus-within:text-ink">
          New password <span className="text-grey-2">— 8+ characters minimum</span>
        </span>
        <input
          type={show ? "text" : "password"}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, p: true }))}
          autoComplete="new-password"
          className={cn(inputClass, "pr-14", touched.p && weak && "border-b-orange-deep")}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-pressed={show}
          aria-label={show ? "Hide password" : "Show password"}
          className="meta absolute bottom-2.5 right-0 px-1 text-grey transition-colors hover:text-ink"
        >
          {show ? "HIDE" : "SHOW"}
        </button>
        {touched.p && weak ? <span role="alert" className="meta absolute right-0 top-0 text-[0.65rem] text-orange-deep">Eight characters minimum.</span> : null}
      </label>

      <label className="group/field relative block">
        <span className="meta block text-grey transition-colors group-focus-within:text-ink">
          Confirm new password
        </span>
        <input
          type={show ? "text" : "password"}
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, c: true }))}
          autoComplete="new-password"
          className={cn(inputClass, touched.c && mismatch && "border-b-orange-deep")}
        />
        {touched.c && mismatch ? <span role="alert" className="meta absolute right-0 top-0 text-[0.65rem] text-orange-deep">Passwords don&apos;t match.</span> : null}
      </label>

      {touchedAny && !invalid ? (
        <div className="flex items-baseline gap-2">
          {[pass.length >= 8, /[0-9]/.test(pass), /[^A-Za-z0-9]/.test(pass)].map((ok, i) => (
            <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors", ok ? "grad-rule" : "bg-line-2")} />
          ))}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={state === "saving"}
        className="group/cta meta inline-flex items-center justify-between rounded-sm bg-ink px-7 py-4 text-paper transition-all duration-300 ease-brand hover:-translate-y-px hover:shadow-lift disabled:pointer-events-none"
      >
        {state === "saving" ? "Updating password…" : "Set new password"}
        {state === "idle" ? <ArrowRight className="group-hover/cta:translate-x-1" /> : null}
      </button>
    </form>
  );
}

/* ---------------------------------------------------------------- workspace */

export function WorkspaceForm() {
  const [name, setName] = useState("");
  const [first, setFirst] = useState("voice-sales");
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<"idle" | "creating" | "created">("idle");

  const invalid = touched && name.trim().length < 3;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (invalid || state !== "idle") return;
    setState("creating");
    window.setTimeout(() => setState("created"), 1400);
  };

  if (state === "created") {
    return (
      <div className="flex flex-col gap-7">
        <div>
          <p className="meta text-grey">Workspace live</p>
          <h2 className="display-md mt-3 text-[clamp(2rem,4.4vw,2.6rem)] uppercase text-ink">{name.trim()} is on the floor.</h2>
          <p className="mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-grey">
            Registered in ap-south-1 with INR metering. Your first employee is queued for the
            hiring flow — workload in, gate signed, then the first call goes out.
          </p>
        </div>
        <Link href={`/buy/${first}`} className="group meta inline-flex items-center justify-between rounded-sm bg-ink px-7 py-4 text-paper transition-all duration-300 ease-brand hover:-translate-y-px hover:shadow-lift">
          Hire your first employee <ArrowRight className="group-hover:translate-x-1" />
        </Link>
        <Meta>
          Bring a colleague in later — <GhostLink href="/accept-invite">the invite flow</GhostLink> assigns scopes without sharing keys.
        </Meta>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-7" noValidate onSubmit={submit}>
      <label className="group/field relative block">
        <span className="meta block text-grey transition-colors group-focus-within:text-ink">
          Workspace name
        </span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Nova Realty"
          autoComplete="organization"
          className={cn(inputClass, invalid && "border-b-orange-deep")}
        />
        {invalid ? <span role="alert" className="meta absolute right-0 top-0 text-[0.65rem] text-orange-deep">At least 3 characters.</span> : null}
      </label>

      <div>
        <span className="meta block text-grey">First hire — pick the template</span>
        <div className="mt-2.5 flex flex-col gap-2">
          {[
            { id: "voice-sales", label: "Voice Sales", note: "outbound + inbound calling · flagship" },
            { id: "support", label: "Support", note: "tickets, first-line answers, handovers" },
            { id: "operations", label: "Operations", note: "reconciliation, reports, records" },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setFirst(r.id)}
              aria-pressed={first === r.id}
              className={cn(
                "flex items-center justify-between gap-3 rounded-sm border px-4 py-3 text-left transition-all duration-200",
                first === r.id ? "border-ink bg-paper-2" : "border-line hover:border-ink",
              )}
            >
              <span>
                <span className="block text-[0.9rem] font-medium text-ink">{r.label}</span>
                <span className="meta block text-grey-2">{r.note.toUpperCase()}</span>
              </span>
              <span aria-hidden="true" className={cn("meta flex h-4 w-4 items-center justify-center rounded-full border text-[0.6rem]", first === r.id ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-line-2 text-grey-2")}>
                {first === r.id ? "✓" : ""}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={state === "creating"}
        className="group/cta meta inline-flex items-center justify-between rounded-sm bg-ink px-7 py-4 text-paper transition-all duration-300 ease-brand hover:-translate-y-px hover:shadow-lift disabled:pointer-events-none"
      >
        {state === "creating" ? "Provisioning the floor…" : "Create workspace"}
        {state === "idle" ? <ArrowRight className="group-hover/cta:translate-x-1" /> : null}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ invite */

export function InviteForm({ email, workspace }: { email: string; workspace: string }) {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [agree, setAgree] = useState(false);
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<"idle" | "joining" | "joined">("idle");
  const [show, setShow] = useState(false);

  const invalid = name.trim().length < 2 || pass.length < 8 || !agree;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (invalid) return;
    setState("joining");
    window.setTimeout(() => setState("joined"), 1300);
  };

  if (state === "joined") {
    return (
      <div className="flex flex-col gap-7">
        <div>
          <p className="meta text-grey">Invite accepted</p>
          <h2 className="display-md mt-3 text-[clamp(2rem,4.4vw,2.6rem)] uppercase text-ink">You&apos;re on the floor.</h2>
          <p className="mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-grey">
            {name.trim()}&apos;s account is live in {workspace}. Your role and scopes were assigned by the inviter.
          </p>
        </div>
        <Link href="/app/overview" className="group meta inline-flex items-center justify-between rounded-sm bg-ink px-7 py-4 text-paper transition-all duration-300 ease-brand hover:-translate-y-px hover:shadow-lift">
          Open the workforce console <ArrowRight className="group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-7" noValidate onSubmit={submit}>
      <p className="text-[0.9rem] leading-relaxed text-grey">
        Invited to <span className="text-ink">{workspace}</span> as <span className="font-mono text-ink">{email}</span>.
      </p>

      <label className="group/field relative block">
        <span className="meta block text-grey transition-colors group-focus-within:text-ink">
          Your full name
        </span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dev Raman"
          autoComplete="name"
          className={cn(inputClass, touched && name.trim().length < 2 && "border-b-orange-deep")}
        />
      </label>

      <label className="group/field relative block">
        <span className="meta block text-grey transition-colors group-focus-within:text-ink">
          Choose a password <span className="text-grey-2">— 8+ characters</span>
        </span>
        <input
          type={show ? "text" : "password"}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          autoComplete="new-password"
          className={cn(inputClass, "pr-14", touched && pass.length < 8 && "border-b-orange-deep")}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-pressed={show}
          aria-label={show ? "Hide password" : "Show password"}
          className="meta absolute bottom-2.5 right-0 px-1 text-grey transition-colors hover:text-ink"
        >
          {show ? "HIDE" : "SHOW"}
        </button>
      </label>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-black"
        />
        <span className="text-[0.6875rem] leading-relaxed text-grey">
          I accept the terms of service and privacy policy, and I understand the workspace audit trails my actions.
        </span>
      </label>

      <button
        type="submit"
        disabled={state === "joining"}
        className="group/cta meta inline-flex items-center justify-between rounded-sm bg-ink px-7 py-4 text-paper transition-all duration-300 ease-brand hover:-translate-y-px hover:shadow-lift disabled:pointer-events-none disabled:opacity-60"
      >
        {state === "joining" ? "Joining the workspace…" : "Accept & join"}
        {state === "idle" ? <ArrowRight className="group-hover/cta:translate-x-1" /> : null}
      </button>

      {touched && invalid ? (
        <p role="alert" className="meta text-orange-deep">✕ Resolve the fields above to continue.</p>
      ) : null}
    </form>
  );
}
