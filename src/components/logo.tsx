import { cn } from "#/lib/utils.ts";

export function Logo({ className }: { readonly className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-foreground", className)}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden="true"
        className="text-primary"
      >
        <circle cx="5" cy="16" r="3" fill="currentColor" />
        <circle cx="17" cy="16" r="3" fill="currentColor" />
        <circle cx="11" cy="5" r="3" fill="currentColor" />
        <path
          d="M7.5 14.5L9.5 7.5M14.5 14.5L12.5 7.5M8 16H14"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-heading text-lg font-bold tracking-tight">Algobook</span>
    </span>
  );
}
