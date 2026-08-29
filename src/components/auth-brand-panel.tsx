import { Logo } from "#/components/logo.tsx";
import { cn } from "#/lib/utils.ts";

function GraphBackdrop() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
      viewBox="0 0 400 600"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="70" cy="100" r="3.5" className="fill-primary" />
      <circle cx="180" cy="70" r="3.5" className="fill-primary" />
      <circle cx="300" cy="150" r="3.5" className="fill-gold" />
      <circle cx="110" cy="230" r="3.5" className="fill-primary" />
      <circle cx="260" cy="280" r="3.5" className="fill-primary" />
      <circle cx="55" cy="360" r="3.5" className="fill-gold" />
      <circle cx="205" cy="400" r="3.5" className="fill-primary" />
      <circle cx="335" cy="350" r="3.5" className="fill-primary" />
      <circle cx="145" cy="480" r="3.5" className="fill-primary" />
      <path
        d="M70 100L180 70M180 70L300 150M70 100L110 230M180 70L260 280M110 230L260 280M260 280L55 360M260 280L335 350M110 230L205 400M55 360L145 480M205 400L145 480M205 400L335 350"
        className="stroke-border"
        strokeWidth="1.2"
      />
    </svg>
  );
}

interface AuthBrandPanelProps {
  quote: string;
  subtext: string;
  side: "left" | "right";
}

export function AuthBrandPanel({ quote, subtext, side }: AuthBrandPanelProps) {
  return (
    <div
      className={cn(
        "relative hidden w-[45%] flex-col justify-between overflow-hidden bg-sidebar p-10 lg:flex",
        side === "left" ? "border-r border-border" : "border-l border-border",
      )}
    >
      <GraphBackdrop />
      <Logo className="relative z-10" />
      <div className="relative z-10 max-w-sm">
        <p className="font-heading text-2xl leading-snug font-semibold text-balance">"{quote}"</p>
        <p className="mt-3 text-sm text-muted-foreground">{subtext}</p>
      </div>
    </div>
  );
}
