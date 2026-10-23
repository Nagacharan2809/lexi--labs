"use client";

/* Pause / resume — meaningful state without a backend: journals the
   request locally and confirms it inline, exactly like the console
   would with an optimistic API. */

import { useState } from "react";
import { motion } from "framer-motion";

export function EmployeeActions() {
  const [paused, setPaused] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggle = () => {
    if (busy) return;
    setBusy(true);
    window.setTimeout(() => {
      setPaused((v) => !v);
      setBusy(false);
    }, 700);
  };

  return (
    <motion.button
      onClick={toggle}
      aria-pressed={paused}
      whileTap={{ scale: 0.985 }}
      disabled={busy}
      className={
        paused
          ? "meta min-w-[92px] rounded-sm bg-emerald-600 px-4 py-2.5 text-white transition-colors hover:bg-emerald-700"
          : "meta min-w-[92px] rounded-sm bg-paper px-4 py-2.5 text-ink transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift"
      }
    >
      {busy ? (
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-current border-t-transparent" />
          …

        </span>
      ) : paused ? "Resume" : "Pause"}
    </motion.button>
  );
}
