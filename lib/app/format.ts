/* Formatting helpers — the app never re-implements these. */

const inrFmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const inrFmt2 = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const numFmt = new Intl.NumberFormat("en-IN");

export const inr = (n: number) => inrFmt.format(n);
export const inr2 = (n: number) => inrFmt2.format(n);
export const num = (n: number) => numFmt.format(n);
export const pct = (n: number, digits = 1) => `${n.toFixed(digits)}%`;

/** ₹18,46,000 → "₹18.46 L" ; keeps the ledger’s Indian magnitude style */
export function inrShort(n: number) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  if (n >= 1e3) return `₹${(n / 1e3).toFixed(1)}k`;
  return inr(n);
}

export function clock(s: number) {
  const m = Math.floor(s / 60);
  const ss = Math.round(s % 60);
  return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export function dur(ms: number) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return clock(ms / 1000);
}

export function tod(date: Date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function day(date: Date) {
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export function maskPhone(p: string) {
  return `${p.slice(0, 4)}••••${p.slice(-2)}`;
}
