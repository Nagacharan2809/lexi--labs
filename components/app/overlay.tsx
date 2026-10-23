"use client";

/* Overlays — Drawer (right sheet) + Modal, brand-toned. */

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Drawer({ open, onClose, kicker, title, children, wide }: {
  open: boolean; onClose: () => void; kicker?: string; title: ReactNode; children?: ReactNode; wide?: boolean;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
          <motion.button
            aria-label="Close panel"
            className="absolute inset-0 cursor-default bg-ink/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute inset-y-0 right-0 flex w-full flex-col border-l border-line bg-paper shadow-lift",
              wide ? "max-w-[46rem] lg:max-w-[52rem]" : "max-w-[32rem]",
            )}
          >
            <div className="flex items-start justify-between gap-6 border-b border-line px-6 py-5">
              <div className="min-w-0">
                {kicker ? <p className="meta text-grey-2">{kicker}</p> : null}
                <h2 className="display truncate text-[1.35rem] uppercase text-ink">{title}</h2>
              </div>
              <button ref={closeRef} onClick={onClose} aria-label="Close" className="meta rounded-xs border border-line-2 px-2.5 py-1.5 text-grey transition-colors hover:border-ink hover:text-ink">
                CLOSE ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

export function Modal({ open, onClose, kicker, title, children, footer }: {
  open: boolean; onClose: () => void; kicker?: string; title: string;
  children?: ReactNode; footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-5" role="dialog" aria-modal="true" aria-label={title}>
          <motion.button
            aria-label="Close dialog"
            className="absolute inset-0 cursor-default bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg rounded-md border border-line bg-paper shadow-lift"
          >
            <div className="border-b border-line px-6 py-5">
              {kicker ? <p className="meta text-grey-2">{kicker}</p> : null}
              <h2 className="display text-[1.3rem] uppercase text-ink">{title}</h2>
            </div>
            <div className="px-6 py-5">{children}</div>
            {footer ? <div className="flex items-center justify-end gap-3 border-t border-line px-6 py-4">{footer}</div> : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
