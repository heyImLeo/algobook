import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRightIcon, LayersIcon } from "lucide-react";

import { getTopicIcon } from "#/lib/topic-icons.ts";
import type { TopicSubtopicSummary } from "#/lib/topics/functions.ts";
import { topicDetailQueryOptions } from "#/lib/topics/queries.ts";

export const Route = createFileRoute("/_auth/app/topics/$topicSlug/")({
  component: TopicPage,
  loader: async ({ context, params }) => {
    const topic = await context.queryClient.query(topicDetailQueryOptions(params.topicSlug));
    if (!topic) throw notFound();
  },
});

function TopicPage() {
  const { topicSlug } = Route.useParams();
  const { data: topic } = useSuspenseQuery(topicDetailQueryOptions(topicSlug));

  if (!topic) return null;

  const Icon = getTopicIcon(topic.icon);
  const percent = topic.total > 0 ? Math.round((topic.solved / topic.total) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/app" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRightIcon className="size-3.5" aria-hidden="true" />
        <span className="font-medium text-foreground">{topic.name}</span>
      </nav>

      <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            {/* oxlint-disable-next-line react/static-components */}
            <Icon className="size-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{topic.name}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{topic.description}</p>
            {(topic.timeComplexityRange || topic.spaceComplexityRange) && (
              <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs text-muted-foreground">
                {topic.timeComplexityRange && (
                  <span className="rounded-full bg-muted px-2.5 py-1">
                    Time {topic.timeComplexityRange}
                  </span>
                )}
                {topic.spaceComplexityRange && (
                  <span className="rounded-full bg-muted px-2.5 py-1">
                    Space {topic.spaceComplexityRange}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-bold">{topic.solved}</span>
            <span className="font-mono text-sm text-muted-foreground">/ {topic.total} solved</span>
          </div>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>

      <MixedRecallCard
        totalQuestions={topic.mixedRecall.totalQuestions}
        dueForReviewCount={topic.mixedRecall.dueForReviewCount}
      />

      <h2 className="mt-8 mb-4 text-base font-semibold">Subtopics</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topic.subtopics.map((subtopic) => (
          <SubtopicCard key={subtopic.id} topicSlug={topic.slug} subtopic={subtopic} />
        ))}
      </div>
    </div>
  );
}

function MixedRecallCard({
  totalQuestions,
  dueForReviewCount,
}: {
  readonly totalQuestions: number;
  readonly dueForReviewCount: number;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-linear-to-br from-accent/40 to-card p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <LayersIcon className="size-5" aria-hidden="true" />
        </div>
        <div>
          <div className="text-sm font-semibold">Mixed recall</div>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalQuestions} unique questions across this topic
            {dueForReviewCount > 0 && (
              <>
                {" "}
                ·{" "}
                <span className="font-medium text-warning">{dueForReviewCount} due for review</span>
              </>
            )}
          </p>
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
        Coming soon
      </span>
    </div>
  );
}

function SubtopicCard({
  topicSlug,
  subtopic,
}: {
  readonly topicSlug: string;
  readonly subtopic: TopicSubtopicSummary;
}) {
  const percent = subtopic.total > 0 ? Math.round((subtopic.solved / subtopic.total) * 100) : 0;

  return (
    <Link
      to="/app/topics/$topicSlug/$subtopicSlug"
      params={{ topicSlug, subtopicSlug: subtopic.slug }}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold">{subtopic.name}</h3>
        <span className="shrink-0 font-mono text-xs whitespace-nowrap text-muted-foreground">
          {subtopic.solved}/{subtopic.total}
        </span>
      </div>
      <p className="line-clamp-2 text-sm text-muted-foreground">{subtopic.description}</p>
      {(subtopic.timeComplexity || subtopic.spaceComplexity) && (
        <div className="flex flex-wrap gap-1.5 font-mono text-xs text-muted-foreground">
          {subtopic.timeComplexity && (
            <span className="rounded-full bg-muted px-2 py-0.5">{subtopic.timeComplexity}</span>
          )}
          {subtopic.spaceComplexity && (
            <span className="rounded-full bg-muted px-2 py-0.5">{subtopic.spaceComplexity}</span>
          )}
        </div>
      )}
      <div className="mt-auto h-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
    </Link>
  );
}
