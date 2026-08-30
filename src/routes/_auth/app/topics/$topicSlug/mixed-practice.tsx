import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRightIcon, ExternalLinkIcon } from "lucide-react";

import { QuestionStatusIcon } from "#/components/question-status-icon.tsx";
import { toast } from "#/components/ui/toast.tsx";
import type { Difficulty, QuestionStatus } from "#/lib/db/schema/types.ts";
import { $updateQuestionProgress } from "#/lib/questions/functions.ts";
import type { MixedPracticeQuestion } from "#/lib/topics/functions.ts";
import { mixedPracticeQueueQueryOptions } from "#/lib/topics/queries.ts";
import { cn } from "#/lib/utils.ts";

export const Route = createFileRoute("/_auth/app/topics/$topicSlug/mixed-practice")({
  component: MixedPracticePage,
  loader: async ({ context, params }) => {
    const queue = await context.queryClient.query(mixedPracticeQueueQueryOptions(params.topicSlug));
    if (!queue) throw notFound();
  },
});

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  easy: "text-success",
  medium: "text-warning",
  hard: "text-destructive",
};

// Clicking a question's status icon advances it one step further — the pool
// itself is permanent, so a solved question stays in the list marked solved
// rather than dropping out.
const NEXT_STATUS: Record<QuestionStatus, QuestionStatus> = {
  todo: "attempted",
  attempted: "solved",
  solved: "solved",
};

function MixedPracticePage() {
  const { topicSlug } = Route.useParams();
  const queue = useQuery(mixedPracticeQueueQueryOptions(topicSlug)).data;

  if (!queue) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/app" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRightIcon className="size-3.5" aria-hidden="true" />
        <Link to="/app/topics/$topicSlug" params={{ topicSlug }} className="hover:text-foreground">
          {queue.topic.name}
        </Link>
        <ChevronRightIcon className="size-3.5" aria-hidden="true" />
        <span className="font-medium text-foreground">Mixed Practice</span>
      </nav>

      <h1 className="mb-2 text-2xl font-bold tracking-tight">
        Mixed Practice — {queue.topic.name}
      </h1>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
        A standalone pool of {queue.topic.name} problems that don&apos;t appear in any subtopic
        above — no pattern label attached, closer to how a problem shows up in a real interview.
        Unsolved questions come first, sorted easiest to hardest.
      </p>

      {queue.questions.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="mb-2 text-lg font-bold">No mixed practice pool yet</h2>
          <p className="text-sm text-muted-foreground">
            {queue.topic.name} doesn&apos;t have any mixed practice questions yet.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
              Practice questions
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {queue.solved}/{queue.total} solved
            </span>
          </div>
          <div className="flex flex-col">
            {queue.questions.map((question) => (
              <MixedPracticeRow key={question.id} topicSlug={topicSlug} question={question} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MixedPracticeRow({
  topicSlug,
  question,
}: {
  readonly topicSlug: string;
  readonly question: MixedPracticeQuestion;
}) {
  const queryClient = useQueryClient();
  const queryKey = mixedPracticeQueueQueryOptions(topicSlug).queryKey;

  const mutation = useMutation({
    mutationFn: (status: QuestionStatus) =>
      $updateQuestionProgress({ data: { questionId: question.id, status } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: () => toast.add({ type: "error", description: "Couldn't update the status." }),
  });

  const nextStatus = NEXT_STATUS[question.status];

  return (
    <div className="flex items-center gap-3 border-b border-border py-3 last:border-b-0">
      <button
        type="button"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate(nextStatus)}
        aria-label={`Mark ${question.title} as ${nextStatus}`}
        title={`Mark as ${nextStatus}`}
        className="shrink-0 rounded-full transition-opacity hover:opacity-70 disabled:opacity-50"
      >
        <QuestionStatusIcon status={question.status} className="shrink-0" />
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Link
          to="/app/topics/$topicSlug/$subtopicSlug/$questionSlug"
          params={{ topicSlug, subtopicSlug: question.subtopicSlug, questionSlug: question.slug }}
          className="truncate text-sm font-medium hover:text-primary"
        >
          {question.title}
        </Link>
        {question.leetcodeNumber !== null && (
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            #{question.leetcodeNumber}
          </span>
        )}
      </div>
      <span
        className={cn(
          "w-14 shrink-0 text-xs font-medium capitalize",
          DIFFICULTY_STYLES[question.difficulty],
        )}
      >
        {question.difficulty}
      </span>
      {question.url && (
        <a
          href={question.url}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={`Open ${question.title} on LeetCode`}
        >
          <ExternalLinkIcon className="size-4" aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
