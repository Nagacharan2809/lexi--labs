/**
 * Marquee — an infinite ticker. Two copies slide by half a track so the
 * loop is seamless. Decorative only (aria-hidden); pauses on hover.
 * Speed and direction are controlled per instance; the global
 * reduced-motion rule freezes it for users who opt out.
 */
export function Marquee({
  items,
  className,
  itemClassName,
  speed = 34,
  reverse = false,
}: {
  items: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  speed?: number;
  reverse?: boolean;
}) {
  return (
    <div className={`marquee ${className ?? ""}`} aria-hidden="true">
      <div
        className="marquee-track"
        style={
          {
            "--marquee-speed": `${speed}s`,
            animationDirection: reverse ? "reverse" : undefined,
          } as React.CSSProperties
        }
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            role="list"
            className="flex shrink-0 items-center"
          >
            {items.map((item, i) => (
              <li
                key={i}
                className={`flex shrink-0 items-center ${itemClassName ?? ""}`}
              >
                {item}
                <span
                  className="mx-7 block h-[5px] w-[5px] shrink-0 rounded-[1.5px]"
                  style={{
                    background:
                      i % 2 === 0
                        ? "linear-gradient(135deg, #2b5aa7, #7ea6d8)"
                        : "linear-gradient(135deg, #f0a05a, #e8763a)",
                  }}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
