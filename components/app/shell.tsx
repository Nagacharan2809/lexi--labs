"use client";

/*
   The workspace shell — paper canvas, ink sidebar. Deep, quiet chrome:
   the same company as the public site, one level deeper.
*/

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EMPLOYEES, LEADS, APPROVALS } from "@/lib/app/data";
import { LiveClock } from "./live";

interface NavItem { href: string; label: string; badge?: string | number; hint?: string }
interface NavGroup { label: string; items: NavItem[] }

const NAV: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { href: "/app/overview", label: "Overview", hint: "workspace at a glance" },
    ],
  },
  {
    label: "Workforce",
    items: [
      { href: "/app/workforce", label: "All Employees", hint: "your AI employees" },
      { href: "/app/templates", label: "Templates", hint: "hire from a blueprint" },
    ],
  },
  {
    label: "Build",
    items: [
      { href: "/app/build", label: "Build Employee" },
      { href: "/app/knowledge", label: "Knowledge" },
      { href: "/app/tools", label: "Tools" },
      { href: "/app/integrations", label: "Integrations" },
      { href: "/app/workflows", label: "Workflows" },
    ],
  },
  {
    label: "Operate",
    items: [
      { href: "/app/runs", label: "Live Work" },
      { href: "/app/proof", label: "Proof of Work" },
      { href: "/app/approvals", label: "Approvals", badge: APPROVALS.length },
      { href: "/app/activity", label: "Activity" },
    ],
  },
  {
    label: "Measure",
    items: [
      { href: "/app/outcomes", label: "Outcomes" },
      { href: "/app/analytics", label: "Analytics" },
      { href: "/app/evaluations", label: "Evaluations" },
      { href: "/app/reports", label: "Reports" },
    ],
  },
  {
    label: "Developer",
    items: [{ href: "/app/api", label: "API & Webhooks" }],
  },
  {
    label: "Organization",
    items: [
      { href: "/app/team", label: "Team" },
      { href: "/app/billing", label: "Billing" },
      { href: "/app/settings", label: "Settings" },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/app/overview") return pathname === href;
  if (href === "/app/workforce") return pathname === href || (pathname.startsWith("/app/workforce") && !pathname.includes("/templates"));
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMobileOpen(false), 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* brand */}
      <Link href="/" className="edge-readable group flex items-center justify-between border-b border-white/10 px-6 py-5">
        <span className="meta flex items-center gap-3 text-white">
          <span aria-hidden="true" className="inline-block h-2.5 w-4 rounded-[1px]" style={{ background: "linear-gradient(100deg,#2b5aa7 0%,#e8763a 100%)" }} />
          LEXI LABS
        </span>
        <span className="meta text-white/40 transition-colors group-hover:text-white/80">CONSOLE</span>
      </Link>

      {/* workspace chip */}
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-white/10 font-mono text-[0.72rem] text-white">NR</span>
        <div>
          <p className="text-[0.82rem] font-medium text-white">Nova Realty</p>
          <p className="meta text-white/40">Workspace · 5 employees</p>
        </div>
      </div>

      {/* nav */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-5" aria-label="Console">
        {NAV.map((g) => (
          <div key={g.label} className="mb-5 last:mb-0">
            <p className="meta px-2.5 pb-2 text-white/35">{g.label}</p>
            <ul role="list">
              {g.items.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex items-center justify-between gap-3 rounded-sm px-2.5 py-2 text-[0.84rem] font-medium transition-colors duration-200",
                        active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <span className="relative">
                        {item.label}
                        {active ? (
                          <motion.span layoutId="nav-rule" aria-hidden="true"
                            className="absolute -left-2.5 top-1/2 h-[2px] w-1.5 -translate-y-1/2 rounded-full"
                            style={{ background: "linear-gradient(90deg,#2b5aa7,#e8763a)" }} />
                        ) : null}
                      </span>
                      {item.badge ? (
                        <span className="rounded-full bg-orange px-1.5 py-0.5 font-mono text-[0.62rem] text-ink">{item.badge}</span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-6 py-4">
        <p className="meta text-white/40">POWERED BY FLEEN</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-svh bg-paper-2/40">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-ink lg:block">
        {sidebar}
      </aside>

      {/* mobile sidebar */}
      <AnimatePresence>
        {mobileOpen ? (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <motion.button aria-label="Close menu" className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 w-[270px] bg-ink shadow-lift"
            >
              {sidebar}
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>

      {/* main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-paper/90 px-4 py-3 backdrop-blur md:px-8">
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="meta rounded-xs border border-line-2 px-2.5 py-1.5 text-grey lg:hidden">
            MENU
          </button>
          <button
            onClick={() => setPaletteOpen(true)}
            className="meta adj flex min-w-0 items-center gap-2.5 rounded-sm border border-line-2 px-3 py-2 text-grey transition-colors hover:border-ink hover:text-ink md:min-w-[300px]"
          >
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />
            </svg>
            <span className="truncate">Search or run a command…</span>
            <kbd className="ml-auto hidden rounded border border-line-2 bg-paper-3 px-1.5 py-0.5 font-mono text-[0.62rem] text-grey md:block">⌘K</kbd>
          </button>
          <span className="meta ml-auto hidden items-center gap-2 rounded-full border border-line-2 px-3 py-1.5 text-grey md:inline-flex">
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> PROD
          </span>
          <LiveClock />
          <Link
            href="/app/approvals"
            className="meta hidden items-center gap-2 rounded-sm px-2 py-1.5 text-grey transition-colors hover:text-ink md:inline-flex"
          >
            ALERTS
            <span className="rounded-full bg-orange px-1.5 py-0.5 font-mono text-[0.62rem] text-ink">{APPROVALS.length}</span>
          </Link>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink font-mono text-[0.66rem] text-paper" title="Nagacharan · Owner">NG</span>
        </header>
        <main id="main" className="mx-auto min-h-[calc(100svh-57px)] max-w-[1500px] px-4 py-8 md:px-8 md:py-10">
          {children}
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

interface Cmd { group: string; label: string; detail: string; href: string }

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);

  const commands = useMemo<Cmd[]>(() => {
    const nav: Cmd[] = NAV.flatMap((g) =>
      g.items.map((i) => ({ group: g.label, label: i.label, detail: i.href, href: i.href })));
    const employees: Cmd[] = EMPLOYEES.map((e) => ({
      group: "Employees", label: e.name, detail: `${e.role} · ${e.status}`, href: `/app/workforce/${e.slug}`,
    }));
    const leads: Cmd[] = LEADS.slice(0, 60).map((l) => ({
      group: "Leads", label: `${l.name} · ${l.id}`, detail: l.interest, href: `/app/workforce/voice-sales/leads`,
    }));
    const actions: Cmd[] = [
      { group: "Commands", label: "Create employee", detail: "build from a template", href: "/app/build" },
      { group: "Commands", label: "Hire Voice Sales", detail: "the flagship employee", href: "/buy/voice-sales" },
      { group: "Commands", label: "Run verification", detail: "12-test release gate", href: "/app/workforce/voice-sales/evaluations" },
      { group: "Commands", label: "View approvals", detail: "5 pending", href: "/app/approvals" },
      { group: "Commands", label: "View outcomes", detail: "today's ledger", href: "/app/outcomes" },
      { group: "Commands", label: "Generate report", detail: "daily / weekly / monthly", href: "/app/reports" },
    ];
    const all = [...nav, ...actions, ...employees, ...leads];
    if (!q.trim()) return all.slice(0, 9);
    const s = q.toLowerCase();
    return all.filter((c) => `${c.label} ${c.detail} ${c.group}`.toLowerCase().includes(s)).slice(0, 9);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      setQ("");
      setIdx(0);
    }, 0);
    return () => window.clearTimeout(id);
  }, [open]);
  useEffect(() => {
    const id = window.setTimeout(() => setIdx(0), 0);
    return () => window.clearTimeout(id);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(commands.length - 1, i + 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
      if (e.key === "Enter" && commands[idx]) {
        onClose();
        router.push(commands[idx].href);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, commands, idx, onClose, router]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[14vh]" role="dialog" aria-modal="true" aria-label="Command palette">
          <motion.button aria-label="Close palette" className="absolute inset-0 cursor-default bg-ink/40 backdrop-blur-[3px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-md border border-line bg-paper shadow-lift"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <span className="meta text-grey-2">⌘K</span>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search employees, leads, pages… or run a command"
                className="w-full bg-transparent font-mono text-[0.88rem] text-ink outline-none placeholder:text-grey-2"
              />
            </div>
            <ul role="listbox" aria-label="Results" className="max-h-[46vh] overflow-y-auto p-1.5">
              {commands.map((c, i) => (
                <li key={`${c.group}-${c.label}-${i}`}>
                  <button
                    role="option" aria-selected={i === idx}
                    onMouseEnter={() => setIdx(i)}
                    onClick={() => { onClose(); router.push(c.href); }}
                    className={cn("flex w-full items-baseline justify-between gap-4 rounded-sm px-3 py-2.5 text-left transition-colors",
                      i === idx ? "bg-paper-3" : "hover:bg-paper-2")}
                  >
                    <span className="flex min-w-0 items-baseline gap-3">
                      <span className="meta shrink-0 text-grey-2">{c.group}</span>
                      <span className="truncate text-[0.88rem] font-medium text-ink">{c.label}</span>
                    </span>
                    <span className="meta shrink-0 text-grey-2"><span className="hidden md:inline">{c.detail}</span> →</span>
                  </button>
                </li>
              ))}
              {commands.length === 0 ? (
                <li className="meta px-3 py-6 text-center text-grey-2">Nothing matches “{q}”.</li>
              ) : null}
            </ul>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
