"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { employees, PREFILL_EVENT, type Employee } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/section-header";

/* --------------------------------------------------------------------- */

interface FieldState {
  value: string;
  touched: boolean;
  error: string | null;
}

type Fields = {
  name: FieldState;
  email: FieldState;
  company: FieldState;
  role: FieldState;
  size: FieldState;
  employee: FieldState;
  automate: FieldState;
};

const INITIAL: Fields = {
  name: { value: "", touched: false, error: null },
  email: { value: "", touched: false, error: null },
  company: { value: "", touched: false, error: null },
  role: { value: "", touched: false, error: null },
  size: { value: "", touched: false, error: null },
  employee: { value: "", touched: false, error: null },
  automate: { value: "", touched: false, error: null },
};

function validate(name: keyof Fields, value: string): string | null {
  switch (name) {
    case "name":
      return value.trim().length < 2 ? "Add your name." : null;
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
        ? null
        : "Use a valid work email.";
    case "company":
      return value.trim().length < 2 ? "Add your company name." : null;
    case "automate":
      return value.trim().length < 10
        ? "One or two sentences is enough."
        : null;
    default:
      return null;
  }
}

const SIZE_OPTIONS = ["1–10", "11–50", "51–200", "201–1000", "1000+"];
const COMPANY_SIZES = SIZE_OPTIONS;

/* --------------------------------------------------------------------- */

function FieldShell({
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

const inputClass =
  "field w-full rounded-xs border-b bg-transparent py-2.5 text-[0.98rem] text-ink outline-none placeholder:text-grey-2";

/* --------------------------------------------------------------------- */

/**
 * Section 08 — book a demo. The form reads like the start of a
 * deployment conversation: validated fields, typed selection of an
 * employee role, and a designed confirmation state.
 */
export function DemoForm() {
  const [fields, setFields] = useState<Fields>(INITIAL);
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [prefillNote, setPrefillNote] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const reduced = useReducedMotion();
  const uid = useId();

  /* employees elsewhere on the page pre-select a role */
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail;
      const employee = employees.find((emp) => emp.slug === slug);
      if (!employee) return;
      setFields((f) => ({
        ...f,
        employee: { value: employee.slug, touched: true, error: null },
      }));
      setPrefillNote(employee.role);
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const setValue = useCallback((name: keyof Fields, value: string) => {
    setFields((prev) => ({
      ...prev,
      [name]: { ...prev[name], value },
    }));
    if (submitError) setSubmitError(null);
  }, [submitError]);

  const blurField = (name: keyof Fields) => {
    setFields((prev) => {
      const field = prev[name];
      const error = validate(name, field.value);
      return {
        ...prev,
        [name]: { ...field, touched: true, error },
      };
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    let firstError: keyof Fields | null = null;
    const next = { ...fields };
    (Object.keys(next) as (keyof Fields)[]).forEach((key) => {
      const error = validate(key, next[key].value);
      next[key] = { ...next[key], touched: true, error };
      if (error && !firstError) firstError = key;
      if (error) hasError = true;
    });
    if (!hasError) {
      setFields(next);
      setStatus("submitting");
      /* No backend in this build — resolve the deployment conversation
         state locally with a realistic delay. */
      window.setTimeout(() => setStatus("done"), 1400);
    } else {
      setFields(next);
      if (firstError) {
        formRef.current
          ?.querySelector<HTMLElement>(`[data-key="${firstError}"]`)
          ?.focus();
      }
    }
  };

  const clearError = (name: keyof Fields) =>
    setFields((prev) => {
      if (!prev[name].error) return prev;
      return {
        ...prev,
        [name]: { ...prev[name], error: null },
      };
    });

  const selectedEmployee: Employee | undefined = employees.find(
    (emp) => emp.slug === fields.employee.value,
  );

  return (
    <section
      id="contact"
      aria-label="Book a demo"
      className="scroll-mt-24 bg-ink text-paper"
    >
      <div className="gutter mx-auto max-w-[1440px] py-28 md:py-36">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-24">
          {/* pitch column */}
          <div>
            <Reveal>
              <h2 className="display-md text-[clamp(2.4rem,5.4vw,4.75rem)] uppercase">
                Ready to build
                <br />
                your{" "}
                <span
                  className="grad-spectral"
                  style={{
                    backgroundImage:
                      "linear-gradient(100deg, #9ec2ee 0%, #7ea6d8 30%, #f0a05a 78%, #e8763a 100%)",
                  }}
                >
                  AI workforce?
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-8 max-w-[44ch] text-[1.02rem] leading-relaxed text-white/65">
                Tell us what work you want your AI employee to handle. We map
                the workflow, define the role and show it running — live, on
                your systems, in one working session.
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <dl className="mt-12 grid gap-6 border-t border-white/15 pt-8 sm:grid-cols-2">
                <div>
                  <dd>
                    <a
                      href="mailto:workforce@lexilabs.ai"
                      className="link-underline text-[0.98rem] text-paper"
                    >
                      workforce@lexilabs.ai
                    </a>
                  </dd>
                </div>
                <div>
                  <dd className="text-[0.98rem] text-white/65">
                    We reply within one business day
                  </dd>
                </div>
                <div>
                  <dd>
                    <a
                      href="mailto:workforce@lexilabs.ai?subject=Contact%20Lexi%20Labs"
                      className="link-underline text-[0.98rem] text-paper"
                    >
                      Contact Lexi Labs →
                    </a>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          {/* form column */}
          <div className="relative">
            <div className="rounded-md border border-white/15 bg-white/[0.04] p-6 backdrop-blur-sm md:p-10">
              <AnimatePresence mode="wait">
                {status === "done" ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="flex min-h-[540px] flex-col items-start justify-center"
                    role="status"
                    aria-live="polite"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block h-10 w-10 rounded-full"
                      style={{
                        background:
                          "conic-gradient(from 120deg, #2b5aa7, #e8763a, #2b5aa7)",
                      }}
                    />
                    <p className="display-md mt-8 text-[clamp(1.5rem,2.6vw,2.2rem)] uppercase">
                      {prefillNote ? "Your " + prefillNote.toLowerCase() + " is queued." : "Your brief is queued."}
                    </p>
                    <p className="mt-4 max-w-[46ch] text-[0.98rem] leading-relaxed text-white/65">
                      We&apos;ll reach out at{" "}
                      <span className="text-paper">{fields.email.value}</span>{" "}
                      within one business day with a demo slot and a first
                      workflow map for{" "}
                      <span className="text-paper">
                        {fields.company.value || "your company"}
                      </span>
                      .
                    </p>
                    <button
                      onClick={() => {
                        setStatus("idle");
                        setFields(INITIAL);
                        setPrefillNote(null);
                      }}
                      className="meta mt-10 rounded-xs border border-white/25 px-5 py-3 transition-colors hover:border-white hover:bg-white/10"
                    >
                      SUBMIT ANOTHER BRIEF
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    ref={formRef}
                    noValidate
                    onSubmit={submit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid gap-7 sm:grid-cols-2"
                  >
                    <div className="sm:col-span-2">
                      {prefillNote ? (
                        <p className="meta mt-3 inline-flex items-center gap-2 rounded-full border border-orange/40 bg-orange/10 px-3 py-1.5 text-orange">
                          {prefillNote.toUpperCase()} PRESELECTED
                          <button
                            type="button"
                            onClick={() => {
                              setPrefillNote(null);
                              setValue("employee", "");
                            }}
                            aria-label="Clear preselected employee"
                            className="text-current"
                          >
                            ×
                          </button>
                        </p>
                      ) : null}
                    </div>

                    <FieldShell label="Name" htmlFor={`${uid}-name`} error={fields.name.touched ? fields.name.error : null}>
                      <input
                        id={`${uid}-name`}
                        data-key="name"
                        name="name"
                        autoComplete="name"
                        placeholder="Aarav Mehta"
                        className={`${inputClass} border-white/20 focus:border-paper`}
                        value={fields.name.value}
                        onChange={(e) => setValue("name", e.target.value)}
                        onBlur={() => blurField("name")}
                        onFocus={() => clearError("name")}
                        aria-invalid={Boolean(fields.name.touched && fields.name.error)}
                      />
                    </FieldShell>

                    <FieldShell label="Work Email" htmlFor={`${uid}-email`} error={fields.email.touched ? fields.email.error : null}>
                      <input
                        id={`${uid}-email`}
                        data-key="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="aarav@company.com"
                        className={`${inputClass} border-white/20 focus:border-paper`}
                        value={fields.email.value}
                        onChange={(e) => setValue("email", e.target.value)}
                        onBlur={() => blurField("email")}
                        onFocus={() => clearError("email")}
                        aria-invalid={Boolean(fields.email.touched && fields.email.error)}
                      />
                    </FieldShell>

                    <FieldShell label="Company" htmlFor={`${uid}-company`} error={fields.company.touched ? fields.company.error : null}>
                      <input
                        id={`${uid}-company`}
                        data-key="company"
                        name="company"
                        autoComplete="organization"
                        placeholder="Nova Realty"
                        className={`${inputClass} border-white/20 focus:border-paper`}
                        value={fields.company.value}
                        onChange={(e) => setValue("company", e.target.value)}
                        onBlur={() => blurField("company")}
                        onFocus={() => clearError("company")}
                        aria-invalid={Boolean(fields.company.touched && fields.company.error)}
                      />
                    </FieldShell>

                    <FieldShell label="Role" htmlFor={`${uid}-role`}>
                      <input
                        id={`${uid}-role`}
                        data-key="role"
                        name="role"
                        autoComplete="organization-title"
                        placeholder="Head of Sales"
                        className={`${inputClass} border-white/20 focus:border-paper`}
                        value={fields.role.value}
                        onChange={(e) => setValue("role", e.target.value)}
                      />
                    </FieldShell>

                    <FieldShell label="Company Size" htmlFor={`${uid}-size`}>
                      <div
                        role="radiogroup"
                        aria-label="Company size"
                        className="mt-1 flex flex-wrap gap-2"
                      >
                        {COMPANY_SIZES.map((size) => (
                          <button
                            key={size}
                            type="button"
                            role="radio"
                            aria-checked={fields.size.value === size}
                            onClick={() =>
                              setValue("size", fields.size.value === size ? "" : size)
                            }
                            className={cn(
                              "meta rounded-full border px-3.5 py-2 transition-colors duration-200",
                              fields.size.value === size
                                ? "border-orange bg-orange/15 text-orange"
                                : "border-white/20 text-white/60 hover:border-white/50 hover:text-paper",
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </FieldShell>

                    <FieldShell
                      label="Preferred AI Employee"
                      hint="pick a role"
                      htmlFor={`${uid}-employee`}
                    >
                      <select
                        id={`${uid}-employee`}
                        data-key="employee"
                        name="employee"
                        className={`${inputClass} border-white/20 focus:border-paper [&>option]:text-ink`}
                        value={fields.employee.value}
                        onChange={(e) => setValue("employee", e.target.value)}
                      >
                        <option value="">Not sure yet</option>
                        {employees.map((emp) => (
                          <option key={emp.slug} value={emp.slug}>
                            {emp.role}
                          </option>
                        ))}
                      </select>
                    </FieldShell>

                    <div className="sm:col-span-2">
                      <FieldShell
                        label="What do you want to automate?"
                        hint="the work, in your words"
                        htmlFor={`${uid}-automate`}
                        error={fields.automate.touched ? fields.automate.error : null}
                      >
                        <textarea
                          id={`${uid}-automate`}
                          data-key="automate"
                          name="automate"
                          rows={3}
                          placeholder="Lead follow-up for our sales team and order-status support on WhatsApp…"
                          className={`${inputClass} resize-none border-white/20 focus:border-paper`}
                          value={fields.automate.value}
                          onChange={(e) => setValue("automate", e.target.value)}
                          onBlur={() => blurField("automate")}
                          onFocus={() => clearError("automate")}
                          aria-invalid={Boolean(fields.automate.touched && fields.automate.error)}
                        />
                      </FieldShell>
                    </div>

                    {submitError ? (
                      <p className="meta sm:col-span-2 text-orange-deep">
                        {submitError}
                      </p>
                    ) : null}

                    <div className="sm:col-span-2 flex flex-wrap items-center gap-5">
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className={cn(
                          "group/cta meta relative inline-flex items-center gap-3 overflow-hidden rounded-sm px-7 py-4 transition-all duration-300 ease-brand",
                          status === "submitting"
                            ? "cursor-wait bg-white/20 text-white/70"
                            : "bg-paper text-ink hover:-translate-y-px hover:shadow-lift",
                        )}
                      >
                        {status !== "submitting" ? (
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 translate-y-[101%] bg-gradient-to-tr from-orange-deep via-orange to-ember transition-transform duration-[420ms] ease-brand group-hover/cta:translate-y-0"
                          />
                        ) : null}
                        <span className="relative z-10">
                          {status === "submitting"
                            ? "PROCESSING…"
                            : "BOOK A DEMO"}
                        </span>
                        {status !== "submitting" ? (
                          <span aria-hidden="true" className="relative z-10">
                            →
                          </span>
                        ) : null}
                      </button>
                    </div>

                    {/* form note for screen readers */}
                    <p className="sr-only">
                      This form starts a deployment conversation with Lexi
                      Labs. Fields reporting an error must be corrected before
                      submission.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
