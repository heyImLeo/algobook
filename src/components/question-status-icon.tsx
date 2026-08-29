import type { QuestionStatus } from "#/lib/db/schema/types.ts";

export function QuestionStatusIcon({
  status,
  className,
}: {
  readonly status: QuestionStatus;
  readonly className?: string;
}) {
  if (status === "solved") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" className={className} aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="10"
          className="fill-success/15 stroke-success"
          strokeWidth="1.6"
        />
        <path
          d="M8 12.5l2.5 2.5L16 9.5"
          className="stroke-success"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }

  if (status === "attempted") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="9.2" fill="none" className="stroke-border" strokeWidth="1.6" />
        <path d="M12 2.8a9.2 9.2 0 010 18.4z" className="fill-warning" />
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" fill="none" className="stroke-border" strokeWidth="1.6" />
    </svg>
  );
}
