"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Button } from "@/components/ui/controls";
import { cn } from "@/lib/utils";

export type AuthMode = "signin" | "signup";

/* --------------------------------------------------------------------- */
/* field model — same shape as the demo-request flow                      */

type FieldKey = "name" | "email" | "company" | "password";

interface FieldState {
  value: string;
  touched: boolean;
  error: string | null;
}

type Fields = Record<FieldKey, FieldState>;

const EMPTY: Fields = {
  name: { value: "", touched: false, error: null },
  email: { value: "", touched: false, error: null },
  company: { value: "", touched: false, error: null },
  password: { value: "", touched: false, error: null },
};

/* the fields each mode renders, in tab order */
const ORDER: Record<AuthMode, FieldKey[]> = {
  signin: ["email", "password"],
  signup: ["name", "email", "company", "password"],
};

const LABELS: Record<FieldKey, string> = {
  name: "Full name",
  email: "Work email",
  company: "Company",
  password: "Password",
};

const PLACEHOLDERS: Record<FieldKey, string> = {
  name: "Aarav Mehta",
  email: "you@company.com",
  company: "Nova Realty",
  password: "————",
};

const AUTOCOMPLETE: Record<FieldKey, Record<AuthMode, string>> = {
  name: { signin: "name", signup: "name" },
  email: { signin: "email", signup: "email" },
  company: { signin: "organization", signup: "organization" },
  password: { signin: "current-password", signup: "new-password" },
};

/* field order is walk-driven, so fill order follows the natural keyboard flow */

const HINTS: Partial<Record<FieldKey, string>> = {
  password: "8+ characters — a passphrase is ideal",
};

function validate(key: FieldKey, value: string): string | null {
  switch (key) {
    case "name":
      return value.trim().length < 2 ? "Add your name." : null;
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
        ? null
        : "Use a valid work email.";
    case "company":
      return value.trim().length < 2 ? "Add your company name." : null;
    case "password":
      return value.length >= 8 ? null : "Eight characters minimum.";
  }
}

const inputClass =
  "field w-full rounded-xs border-b border-line bg-transparent py-2.5 text-[0.98rem] text-ink outline-none placeholder:text-grey-2";

/* --------------------------------------------------------------------- */

function Field({
  label,
  hint,
  htmlFor,
  error,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="group/field relative pt-2">
      <label
        htmlFor={htmlFor}
        className="meta block cursor-text text-grey transition-colors group-focus-within/field:text-ink"
      >
        {label}
        {hint ? <span className="ml-2 text-grey-2">— {hint}</span> : null}
      </label>
      <div className="mt-1">{children}</div>
      <AnimatePresence>
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            aria-live="polite"
            className="meta absolute right-0 top-1 text-[0.65rem] text-orange-deep"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* --------------------------------------------------------------------- */

/**
 * Sign in / create account — mirrors the demo-request form's language
 * (validated underline fields, designed confirmation state). No backend
 * in this build: the flow resolves locally like the demo conversation.
 */
export function AuthForm({ mode }: { mode: AuthMode }) {
  const keys = ORDER[mode];
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const reduced = useReducedMotion();
  const uid = useId();

  const blurField = (key: FieldKey) => {
    setFields((prev) => {
      const error = validate(key, prev[key].value);
      if (prev[key].touched && prev[key].error === error) return prev;
      return { ...prev, [key]: { ...prev[key], touched: true, error } };
    });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    let hasError = false;
    let firstError: FieldKey | null = null;
    const next = { ...fields };
    keys.forEach((key) => {
      const error = validate(key, next[key].value);
      next[key] = { ...next[key], touched: true, error };
      if (error) {
        hasError = true;
        if (!firstError) firstError = key;
      }
    });
    setFields(next);

    if (hasError) {
      if (firstError) {
        formRef.current
          ?.querySelector<HTMLElement>(`[data-key="${firstError}"]`)
          ?.focus();
      }
      return;
    }

    setStatus("submitting");
    /* No backend in this build — resolve the account state locally with
       a realistic delay, matching the demo-request flow. */
    window.setTimeout(() => setStatus("done"), 1200);
  };

  const transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "done" ? (
        <motion.div
          key="done"
          role="status"
          className="flex flex-col gap-8"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -12 }}
          transition={transition}
        >
          {/* spectral medallion */}
          <div className="relative h-12 w-12" aria-hidden="true">
            <span
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 210deg, #1d4790, #2b5aa7, #7ea6d8, #f0a05a, #e8763a, #d95f2b, #1d4790)",
              }}
            />
            <span className="absolute inset-[3px] rounded-full bg-paper" />
            <span
              className="absolute inset-0 m-auto h-1.5 w-4 rounded-[1px]"
              style={{ background: "linear-gradient(100deg, #2b5aa7, #e8763a)" }}
            />
          </div>

          <div className="space-y-3">
            <p className="meta text-grey">
              {mode === "signin" ? "Session ready" : "Account created"}
            </p>
            <h2 className="display-md text-[clamp(2rem,4.4vw,2.9rem)] uppercase text-ink">
              {mode === "signin" ? "Welcome back." : "You're in."}
            </h2>
            <p className="max-w-[46ch] text-[0.95rem] leading-relaxed text-grey">
              {mode === "signin"
                ? `Signed in as ${fields.email.value.trim()}. The workforce console ships with your first deployment — this preview runs without a backend.`
                : `Account created for ${fields.email.value.trim()}. Meet the workforce and pick your first AI employee, or book a guided demo.`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {mode === "signin" ? (
              <Button href="/" arrow>
                Back to lexilabs.ai
              </Button>
            ) : (
              <>
                <Button href="/#employees" arrow>
                  Meet the workforce
                </Button>
                <Button href="/#contact" variant="ghost">
                  Book a demo
                </Button>
              </>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          ref={formRef}
          onSubmit={submit}
          noValidate
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -12 }}
          transition={transition}
          className="flex flex-col gap-6"
        >
          {keys.map((key) => {
            const field = fields[key];
            const invalid = Boolean(field.touched && field.error);
            return (
              <Field
                key={key}
                label={LABELS[key]}
                hint={HINTS[key]}
                htmlFor={`${uid}-${key}`}
                error={field.error}
              >
                <div className="relative">
                  <input
                    id={`${uid}-${key}`}
                    name={key}
                    type={
                      key === "password"
                        ? showPassword
                          ? "text"
                          : "password"
                        : key === "email"
                          ? "email"
                          : "text"
                    }
                    autoComplete={AUTOCOMPLETE[key][mode]}
                    placeholder={PLACEHOLDERS[key]}
                    data-key={key}
                    onBlur={() => blurField(key)}
                    aria-invalid={invalid || undefined}
                    inputMode={key === "email" ? "email" : undefined}
                    autoCapitalize={key === "name" || key === "company" ? "words" : "off"}
                    spellCheck={key !== "email" && key !== "password"}
                    className={cn(
                      inputClass,
                      key === "password" && "pr-16",
                      invalid && "border-orange-deep",
                    )}
                  />
                  {key === "password" ? (
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-pressed={showPassword}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="meta absolute bottom-2.5 right-0 px-1 text-grey transition-colors hover:text-ink"
                    >
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  ) : null}
                </div>
              </Field>
            );
          })}

          <div className="mt-2 flex flex-col gap-5">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="group/cta meta relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-sm bg-ink px-7 py-4 text-paper transition-all duration-300 ease-brand hover:-translate-y-px hover:shadow-lift active:translate-y-0 disabled:pointer-events-none"
            >
              {/* colour sweep — fills the button on hover */}
              <span aria-hidden="true" className="absolute inset-0">
                <span className="absolute inset-0 translate-y-[101%] bg-gradient-to-tr from-orange-deep via-orange to-ember transition-transform duration-[420ms] ease-brand group-hover/cta:translate-y-0" />
              </span>
              <span aria-busy={status === "submitting" || undefined} className="relative z-10 flex items-center gap-2.5">
                {status === "submitting" ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-paper/70 border-t-transparent"
                    />
                    {mode === "signin" ? "Signing in" : "Creating account"}
                  </>
                ) : mode === "signin" ? (
                  "Sign in"
                ) : (
                  "Create account"
                )}
              </span>
              {status === "submitting" ? null : (
                <ArrowRight className="relative z-10 group-hover/cta:translate-x-1" />
              )}
            </button>

            <p className="text-[0.6875rem] leading-relaxed text-grey">
              By continuing you agree to Lexi Labs&apos; terms and privacy policy.
              {mode === "signup"
                ? " Trial accounts start at the ₹24,999 Starter tier."
                : ""}
            </p>
          </div>

          <p className="meta border-t border-line pt-5 text-grey">
            {mode === "signin" ? (
              <>
                New to Lexi Labs?{" "}
                <Link href="/signup" className="link-underline text-ink transition-colors hover:text-orange-deep">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/signin" className="link-underline text-ink transition-colors hover:text-orange-deep">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
