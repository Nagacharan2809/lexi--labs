"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const SETUP_STEPS = [
  {
    index: "01",
    name: "Connect",
    line: "Connect your business systems.",
    detail:
      "CRM, email, WhatsApp, telephony and internal tools join the employee's environment.",
  },
  {
    index: "02",
    name: "Configure",
    line: "Define the role.",
    detail: "Knowledge, tools and permissions are granted explicitly. Nothing is assumed.",
  },
  {
    index: "03",
    name: "Reason",
    line: "The employee decides the next action.",
    detail: "It reads context, weighs options and chooses — within the rules you set.",
  },
  {
    index: "04",
    name: "Execute",
    line: "Work is performed through connected tools.",
    detail: "Messages sent, records updated, bookings made — real actions, not suggestions.",
  },
  {
    index: "05",
    name: "Verify",
    line: "Actions are checked against rules.",
    detail: "Every output is validated before it reaches a customer or a system.",
  },
  {
    index: "06",
    name: "Escalate",
    line: "Humans stay in control.",
    detail:
      "Approval is requested whenever the rules demand it. Nothing moves without a path to review.",
  },
];

/* runtime flow drawn along the execution path (y is monotonically increasing) */
const FLOW_NODES = [
  { label: "INPUT", x: 120, y: 60 },
  { label: "CONTEXT", x: 520, y: 148 },
  { label: "REASON", x: 120, y: 236 },
  { label: "TOOL", x: 520, y: 324 },
  { label: "ACTION", x: 120, y: 412 },
  { label: "VERIFY", x: 520, y: 486 },
  { label: "RESULT", x: 320, y: 575 },
];

const TRACE_LINES = [
  { time: "09:41:02", text: "New lead received" },
  { time: "09:41:03", text: "Sales employee activated" },
  { time: "09:41:34", text: "Customer qualified" },
  { time: "09:41:36", text: "WhatsApp follow-up sent" },
  { time: "09:46:12", text: "Appointment booked" },
];

function flowPath(): string {
  const nodes = FLOW_NODES;
  let d = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i++) {
    const prev = nodes[i - 1];
    const node = nodes[i];
    const dy = (node.y - prev.y) / 2;
    d += ` C ${prev.x} ${prev.y + dy}, ${node.x} ${node.y - dy}, ${node.x} ${node.y}`;
  }
  return d;
}

/**
 * Section 03 — how a Lexi employee actually runs. The setup sequence
 * sits left while the runtime path draws itself on the right; a pulse
 * travels the drawn portion and lights nodes as it passes. One scroll
 * source drives path, pulse and nodes so they never drift apart.
 */
export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const [reached, setReached] = useState(0);
  const [traceKey, setTraceKey] = useState(0);
  const reduced = useReducedMotion();

  const pathD = flowPath();

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReached(FLOW_NODES.length - 1);
      return;
    }
    const path = pathRef.current;
    const pulse = pulseRef.current;
    const section = sectionRef.current;
    if (!path || !pulse || !section) return;

    const length = path.getTotalLength();
    path.setAttribute("stroke-dasharray", `${length} ${length}`);
    path.setAttribute("stroke-dashoffset", String(length));
    const setPulse = (attrs: { cx: string; cy: string }) => {
      pulse.setAttribute("cx", attrs.cx);
      pulse.setAttribute("cy", attrs.cy);
    };
    gsap.set(pulse, { opacity: 0 });

    const ctx = gsap.context(() => {
      const fade = gsap.quickTo(pulse, "opacity", { duration: 0.25 });
      gsap.fromTo(
        path,
        { attr: { "stroke-dashoffset": length } },
        {
          attr: { "stroke-dashoffset": 0 },
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 62%",
            end: "bottom 88%",
            scrub: 0.3,
            onUpdate: (self) => {
              const pt = path.getPointAtLength(self.progress * length);
              setPulse({ cx: String(pt.x), cy: String(pt.y) });
              /* the path is monotonic in y — a node is lit once the pulse
                 has passed its height */
              let k = 0;
              while (
                k + 1 < FLOW_NODES.length &&
                pt.y >= FLOW_NODES[k + 1].y - 2
              ) {
                k++;
              }
              setReached(k);
            },
            onEnter: () => {
              fade(1);
            },
            onEnterBack: () => fade(1),
            onLeave: () => fade(0),
            onLeaveBack: () => fade(0),
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const reachedNodes = reduced ? FLOW_NODES.length - 1 : reached;

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      aria-label="How Lexi AI employees operate"
      className="gutter mx-auto max-w-[1440px] scroll-mt-24 py-28 md:py-40"
    >
      <header>
        <h2 className="display-md text-[clamp(2.5rem,6vw,5.25rem)] uppercase text-ink">
          From intent
          <br />
          to execution.
        </h2>
        <p className="mt-6 max-w-[54ch] text-[1.02rem] leading-relaxed text-grey">
          Lexi AI employees are not prompts on a chat screen. They are
          configured roles on the Fleen execution engine — connected to your
          tools, bounded by your rules, verified on every action.
        </p>
      </header>

      <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        {/* setup sequence */}
        <div>
          <motion.ol
            className="m-0 border-t border-line"
            role="list"
            initial={reduced ? "show" : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-12% 0px" }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: reduced ? 0 : 0.12 } },
            }}
          >
            {SETUP_STEPS.map((step) => (
              <motion.li
                key={step.index}
                variants={{
                  hidden: { opacity: 0, x: -14 },
                  show: {
                    opacity: 1,
                    x: 6,
                    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="relative flex gap-6 border-b border-line py-7"
              >
                {/* activation wash — the row tints as it lands */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-x-6 inset-y-0 bg-gradient-to-r from-blue-tint/70 to-transparent"
                />
                <div className="relative">
                  <h3 className="display-md text-[1.35rem] uppercase text-ink md:text-[1.55rem]">
                    {step.name}
                  </h3>
                  <p className="mt-1.5 text-[0.95rem] font-medium text-ink-2">
                    {step.line}
                  </p>
                  <p className="mt-1 max-w-[46ch] text-[0.9rem] leading-relaxed text-grey">
                    {step.detail}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>

        {/* runtime flow */}
        <div className="lg:sticky lg:top-[9vh] lg:self-start">
          <div className="rounded-md border border-line bg-paper-2/60 p-4 md:p-8">
            <svg
              viewBox="0 0 640 620"
              className="h-auto w-full"
              role="img"
              aria-label="Execution flow: input, context, reason, tool, action, verify, result"
            >
              <defs>
                <linearGradient id="flow-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#2b5aa7" />
                  <stop offset="1" stopColor="#e8763a" />
                </linearGradient>
              </defs>
              {/* untravelled ghost */}
              <path d={pathD} fill="none" stroke="#101114" strokeOpacity="0.09" strokeWidth="1.6" />
              {/* drawn path */}
              <path
                ref={pathRef}
                d={pathD}
                fill="none"
                stroke="url(#flow-grad)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              {/* travelling pulse */}
              <circle ref={pulseRef} r="5.5" fill="#101114" />
              {FLOW_NODES.map((n, i) => {
                const active = i <= reachedNodes;
                const isResult = i === FLOW_NODES.length - 1;
                return (
                  <g key={n.label} opacity={active ? 1 : 0.32}>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={isResult && active ? 7 : 4.5}
                      fill={isResult && active ? "#e8763a" : "#101114"}
                    />
                    {isResult && active ? (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r="10"
                        fill="none"
                        stroke="#e8763a"
                        strokeWidth="1.2"
                        opacity="0.55"
                        style={{
                          transformBox: "fill-box",
                          transformOrigin: "center",
                        }}
                        className="[animation:lexi-pulse_2.2s_ease-in-out_infinite]"
                      />
                    ) : null}
                    <text
                      x={
                        isResult
                          ? n.x
                          : n.x > 320
                            ? n.x + 16
                            : n.x - 16
                      }
                      y={isResult ? n.y + 26 : n.y + 4}
                      textAnchor={
                        isResult ? "middle" : n.x > 320 ? "start" : "end"
                      }
                      fill={isResult && active ? "#d95f2b" : "#101114"}
                      fontSize="11.5"
                      style={{ letterSpacing: "0.16em" }}
                      fontFamily="var(--font-mono)"
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* worked trace */}
      <div className="mt-16 md:mt-24">
        <div className="flex justify-end border-t border-ink/15 pt-4">
          <button
            onClick={() => setTraceKey((k) => k + 1)}
            className="meta rounded-xs px-2 py-1 text-grey transition-colors hover:text-ink"
            aria-label="Replay example trace"
          >
            REPLAY ↻
          </button>
        </div>
        <motion.ol
          key={traceKey}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-18% 0px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.26 } },
          }}
          className="m-0"
          role="list"
          aria-label="Example employee trace"
        >
          {TRACE_LINES.map((line) => (
            <motion.li
              key={line.text}
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="flex items-baseline justify-between gap-4 border-b border-line py-4"
            >
              <span className="font-mono text-[0.75rem] text-grey-2">
                {line.time}
              </span>
              <span className="flex-1 text-[0.98rem] text-ink">{line.text}</span>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
