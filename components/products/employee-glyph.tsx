import type { Employee } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * EmployeeGlyph — the workforce identity mark, echoing the fluted slats
 * of the hero: one vertical-bar signature per role, derived
 * deterministically from the role slug so every employee owns its own
 * bar pattern, tinted with its spectral accent.
 *
 * When `grow` is true the bars stand up in a staggered wave — the plate
 * that is "working" visibly powers on.
 */
export function EmployeeGlyph({
  employee,
  className,
  grow = true,
}: {
  employee: Employee;
  className?: string;
  grow?: boolean;
}) {
  let seed = 7;
  for (let i = 0; i < employee.slug.length; i++) {
    seed = (seed * 31 + employee.slug.charCodeAt(i)) % 997;
  }

  const bars = 13;
  const heights: number[] = [];
  for (let i = 0; i < bars; i++) {
    let h = seed;
    const step = i * 16807;
    h = (h * 31 + step) % 997;
    h = 46 + (h % 154);
    heights.push(h);
  }
  const activeBar = seed % bars;
  const gradId = `glyph-grad-${employee.slug}`;

  const w = 204;
  const h = 264;
  const barW = 8;
  const gap = (w - 32 - bars * barW) / (bars - 1);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("overflow-clip rounded-[3px]", className)}
      role="img"
      aria-label={`${employee.role} identity glyph`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={employee.accent} stopOpacity="0.85" />
          <stop offset="1" stopColor={employee.accent} stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={w} height={h} rx="3" fill={employee.tint} />
      {heights.map((bh, i) => {
        const x = 16 + i * (barW + gap);
        const y = (h - 40 - bh) / 2 + 8;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barW}
            height={bh}
            rx={1.5}
            fill={i === activeBar ? employee.accent : `url(#${gradId})`}
            className="origin-bottom transition-transform duration-700"
            style={{
              transformBox: "fill-box",
              transformOrigin: "bottom",
              transform: grow ? "scaleY(1)" : "scaleY(0.18)",
              transitionDelay: grow ? `${i * 40}ms` : "0ms",
              transitionTimingFunction: "cubic-bezier(0.34, 1.4, 0.44, 1)",
            }}
          />
        );
      })}
      <rect
        x="16"
        y={h - 26}
        width={w - 32}
        height="1.5"
        rx="0.75"
        fill={employee.accent}
        opacity="0.35"
      />
    </svg>
  );
}
