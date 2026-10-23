"use client";

import { useState } from "react";
import { maskPhone } from "@/lib/app/format";

/* Phone numbers are masked by default — reveal is explicit, per spec. */
export function PhoneCell({ phone }: { phone: string }) {
  const [shown, setShown] = useState(false);
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span className={shown ? "" : "tracking-wider"}>{shown ? phone : maskPhone(phone)}</span>
      <button
        aria-label={shown ? "Mask phone number" : "Reveal phone number"}
        aria-pressed={shown}
        onClick={() => setShown((v) => !v)}
        className="meta rounded-xs px-1.5 py-0.5 text-[0.6rem] text-grey-2 transition-colors hover:text-ink"
      >
        {shown ? "HIDE" : "👁"}
      </button>
    </span>
  );
}
