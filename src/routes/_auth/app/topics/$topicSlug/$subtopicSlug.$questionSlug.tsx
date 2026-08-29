import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRightIcon, ExternalLinkIcon, PencilIcon } from "lucide-react";
import { useState } from "react";

import { QuestionStatusIcon } from "#/components/question-status-icon.tsx";
import { Button } from "#/components/ui/button.tsx";
import { toast } from "#/components/ui/toast.tsx";
import type { Difficulty, QuestionStatus } from "#/lib/db/schema/types.ts";
import type { UpdateQuestionProgressInput } from "#/lib/questions/functions.ts";
import { $updateQuestionProgress } from "#/lib/questions/functions.ts";
import { questionDetailQueryOptions } from "#/lib/questions/queries.ts";
import { cn } from "#/lib/utils.ts";

export const Route = createFileRoute("/_auth/app/topics/$topicSlug/$subtopicSlug/$questionSlug")({
  component: QuestionDetailPage,
  loader: async ({ context, params }) => {
    const question = await context.queryClient.query(
      questionDetailQueryOptions(params.topicSlug, params.subtopicSlug, params.questionSlug),
    );
    if (!question) throw notFound();
  },
});

const STATUS_LABELS: Record<QuestionStatus, string> = {
  todo: "Todo",
  attempted: "Attempted",
  solved: "Solved",
};

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  easy: "bg-success/15 text-success",
  medium: "bg-warning/15 text-warning",
  hard: "bg-destructive/15 text-destructive",
};

function useQuestionMutation(topicSlug: string, subtopicSlug: string, questionSlug: string) {
  const queryClient = useQueryClient();
  const queryOptions = questionDetailQueryOptions(topicSlug, subtopicSlug, questionSlug);

  return useMutation({
    mutationFn: (data: UpdateQuestionProgressInput) => $updateQuestionProgress({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryOptions.queryKey }),
    onError: () => toast.add({ type: "error", description: "Couldn't save your changes." }),
  });
}

function QuestionDetailPage() {
  const { topicSlug, subtopicSlug, questionSlug } = Route.useParams();
  const { data: question } = useSuspenseQuery(
    questionDetailQueryOptions(topicSlug, subtopicSlug, questionSlug),
  );
  const mutation = useQuestionMutation(topicSlug, subtopicSlug, questionSlug);
  const [isEditing, setIsEditing] = useState(false);

  if (!question) return null;

  const setStatus = (status: QuestionStatus) =>
    mutation.mutate({ questionId: question.id, status });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/app" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRightIcon className="size-3.5" aria-hidden="true" />
        <Link to="/app/topics/$topicSlug" params={{ topicSlug }} className="hover:text-foreground">
          {question.topic.name}
        </Link>
        <ChevronRightIcon className="size-3.5" aria-hidden="true" />
        <Link
          to="/app/topics/$topicSlug/$subtopicSlug"
          params={{ topicSlug, subtopicSlug }}
          className="hover:text-foreground"
        >
          {question.subtopic.name}
        </Link>
        <ChevronRightIcon className="size-3.5" aria-hidden="true" />
        <span className="font-medium text-foreground">{question.title}</span>
      </nav>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{question.title}</h1>
            {question.url && (
              <a
                href={question.url}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={`Open ${question.title} on LeetCode`}
              >
                <ExternalLinkIcon className="size-4" aria-hidden="true" />
              </a>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {question.leetcodeNumber !== null && (
              <span className="font-mono text-xs text-muted-foreground">
                LC #{question.leetcodeNumber}
              </span>
            )}
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-bold capitalize",
                DIFFICULTY_STYLES[question.difficulty],
              )}
            >
              {question.difficulty}
            </span>
            {question.groupName && (
              <span className="rounded-lg bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                {question.groupName}
              </span>
            )}
            {question.timeTakenMinutes !== null && (
              <span className="rounded-lg bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground">
                Solved in {question.timeTakenMinutes}min
              </span>
            )}
          </div>
        </div>
        <QuestionStatusIcon status={question.status} className="mt-1 shrink-0" />
      </div>

      <div className="mb-6 flex gap-1 rounded-full border border-border p-1">
        {(["todo", "attempted", "solved"] as const).map((status) => (
          <button
            key={status}
            type="button"
            disabled={mutation.isPending}
            onClick={() => setStatus(status)}
            className={cn(
              "flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
              question.status === status
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      <ConfidenceChecklist question={question} mutation={mutation} />

      {question.status === "solved" && !question.resolvableIn2Weeks && (
        <div className="mb-6 flex items-center gap-4 rounded-2xl border border-gold/30 bg-linear-to-br from-gold/15 to-card p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M12 7v5l3 3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Not confirmed re-solvable in 2 weeks</div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              This is why it&apos;s in the Mixed Recall rotation for {question.topic.name}.
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={mutation.isPending}
            onClick={() => setStatus("attempted")}
            className="shrink-0"
          >
            Attempt again
          </Button>
        </div>
      )}

      <NotesSection
        question={question}
        mutation={mutation}
        isEditing={isEditing}
        onEditingChange={setIsEditing}
      />

      <div className="flex gap-3">
        <Button
          variant="outline"
          render={
            <Link to="/app/topics/$topicSlug/$subtopicSlug" params={{ topicSlug, subtopicSlug }} />
          }
        >
          ← Back to {question.subtopic.name}
        </Button>
        {!isEditing && (
          <Button className="ml-auto" onClick={() => setIsEditing(true)}>
            <PencilIcon />
            Edit Approach &amp; Notes
          </Button>
        )}
      </div>
    </div>
  );
}

interface QuestionMutation {
  readonly mutate: (input: UpdateQuestionProgressInput) => void;
  readonly isPending: boolean;
}

function ConfidenceChecklist({
  question,
  mutation,
}: {
  readonly question: {
    id: string;
    solvedWithoutHint: boolean;
    understoodFully: boolean;
    resolvableIn2Weeks: boolean;
  };
  readonly mutation: QuestionMutation;
}) {
  const items: {
    key: "solvedWithoutHint" | "understoodFully" | "resolvableIn2Weeks";
    label: string;
    checked: boolean;
  }[] = [
    {
      key: "solvedWithoutHint",
      label: "Solved without hint",
      checked: question.solvedWithoutHint,
    },
    {
      key: "understoodFully",
      label: "Understood the solution fully",
      checked: question.understoodFully,
    },
    {
      key: "resolvableIn2Weeks",
      label: "Could re-solve cleanly in 2 weeks",
      checked: question.resolvableIn2Weeks,
    },
  ];

  return (
    <div className="mb-6 rounded-2xl border border-border bg-card px-4">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate({ questionId: question.id, [item.key]: !item.checked })}
          className="flex w-full items-center gap-3 border-b border-border py-3 text-left last:border-b-0 disabled:opacity-50"
        >
          <QuestionStatusIcon status={item.checked ? "solved" : "todo"} className="shrink-0" />
          <span className={cn("text-sm", !item.checked && "text-muted-foreground")}>
            {item.label}
          </span>
          {item.key === "resolvableIn2Weeks" && !item.checked && (
            <span className="ml-auto shrink-0 rounded-full bg-gold/15 px-2.5 py-0.5 text-[10.5px] font-bold whitespace-nowrap text-gold">
              due for review
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function NotesSection({
  question,
  mutation,
  isEditing,
  onEditingChange,
}: {
  readonly question: {
    id: string;
    approachNotes: string | null;
    solutionCode: string | null;
    timeTakenMinutes: number | null;
  };
  readonly mutation: QuestionMutation;
  readonly isEditing: boolean;
  readonly onEditingChange: (editing: boolean) => void;
}) {
  const [approachNotes, setApproachNotes] = useState(question.approachNotes ?? "");
  const [solutionCode, setSolutionCode] = useState(question.solutionCode ?? "");
  const [timeTakenMinutes, setTimeTakenMinutes] = useState(
    question.timeTakenMinutes?.toString() ?? "",
  );

  const approachSteps = (question.approachNotes ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (isEditing) {
    return (
      <div className="mb-6 flex flex-col gap-4">
        <div>
          <label htmlFor="approach-notes" className="mb-1.5 block text-sm font-semibold">
            Approach (one step per line)
          </label>
          <textarea
            id="approach-notes"
            rows={5}
            value={approachNotes}
            onChange={(event) => setApproachNotes(event.target.value)}
            className="w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </div>
        <div>
          <label htmlFor="solution-code" className="mb-1.5 block text-sm font-semibold">
            Solution code
          </label>
          <textarea
            id="solution-code"
            rows={10}
            value={solutionCode}
            onChange={(event) => setSolutionCode(event.target.value)}
            className="w-full rounded-xl border border-border bg-card p-3 font-mono text-xs outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </div>
        <div>
          <label htmlFor="time-taken" className="mb-1.5 block text-sm font-semibold">
            Time taken (minutes)
          </label>
          <input
            id="time-taken"
            type="number"
            min={1}
            value={timeTakenMinutes}
            onChange={(event) => setTimeTakenMinutes(event.target.value)}
            className="w-32 rounded-xl border border-border bg-card p-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </div>
        <div className="flex gap-3">
          <Button
            disabled={mutation.isPending}
            onClick={() => {
              mutation.mutate({
                questionId: question.id,
                approachNotes: approachNotes.trim() || null,
                solutionCode: solutionCode.trim() || null,
                timeTakenMinutes: timeTakenMinutes ? Number(timeTakenMinutes) : null,
              });
              onEditingChange(false);
            }}
          >
            Save
          </Button>
          <Button variant="outline" onClick={() => onEditingChange(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {approachSteps.length > 0 && (
        <>
          <h2 className="mb-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Approach
          </h2>
          <div className="mb-6 rounded-2xl border border-border bg-card p-5">
            <ol className="ml-4.5 flex list-decimal flex-col gap-2.5">
              {approachSteps.map((step) => (
                <li key={step} className="text-sm leading-relaxed text-muted-foreground">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </>
      )}

      {question.solutionCode && (
        <>
          <h2 className="mb-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Solution
          </h2>
          <pre className="mb-6 overflow-x-auto rounded-2xl border border-border bg-muted p-4 font-mono text-xs leading-relaxed">
            {question.solutionCode}
          </pre>
        </>
      )}

      {approachSteps.length === 0 && !question.solutionCode && (
        <p className="mb-6 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No approach or solution notes yet.
        </p>
      )}
    </>
  );
}
