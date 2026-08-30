import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRightIcon, ShuffleIcon } from "lucide-react";

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

      <MixedPracticeCard
        topicSlug={topic.slug}
        topicName={topic.name}
        todoCount={topic.mixedPractice.todoCount}
      />

      <h2 className="mt-8 mb-4 text-base font-semibold">Subtopics</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topic.subtopics.map((subtopic) => (
          <SubtopicCard key={subtopic.id} topicSlug={topic.slug} subtopic={subtopic} />
        ))}
      </div>

      <ComplexityCheatSheet subtopics={topic.subtopics} />
    </div>
  );
}

function MixedPracticeCard({
  topicSlug,
  topicName,
  todoCount,
}: {
  readonly topicSlug: string;
  readonly topicName: string;
  readonly todoCount: number;
}) {
  return (
    <div className="rounded-2xl border border-gold/30 bg-linear-to-br from-gold/15 to-card p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
          <ShuffleIcon className="size-6" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-base font-bold">Mixed Practice — {topicName}</h2>
            {todoCount > 0 && (
              <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-bold text-gold">
                {todoCount} available
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {todoCount > 0
              ? "A standalone pool of problems for this topic that don't appear in any subtopic above — no pattern label to give it away, closer to how it shows up in a real interview."
              : "Every question in this topic's mixed practice pool has been solved — nothing left to mix in."}
          </p>
        </div>
        {todoCount > 0 && (
          <Link
            to="/app/topics/$topicSlug/mixed-practice"
            params={{ topicSlug }}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-gold-foreground hover:bg-gold/90"
          >
            Start Mixed Practice
          </Link>
        )}
      </div>
    </div>
  );
}

function ComplexityCheatSheet({ subtopics }: { readonly subtopics: TopicSubtopicSummary[] }) {
  const hasComplexityData = subtopics.some(
    (subtopic) => subtopic.timeComplexity || subtopic.spaceComplexity || subtopic.bestFor,
  );
  if (!hasComplexityData) return null;

  return (
    <>
      <h2 className="mt-8 mb-4 text-base font-semibold">Complexity Cheat Sheet</h2>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-150 text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <th className="px-4 py-3 text-left">Algorithm</th>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Space</th>
              <th className="px-4 py-3 text-left">Best for</th>
            </tr>
          </thead>
          <tbody>
            {subtopics.map((subtopic) => (
              <tr key={subtopic.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 font-medium whitespace-nowrap">{subtopic.name}</td>
                <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-muted-foreground">
                  {subtopic.timeComplexity ?? "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-muted-foreground">
                  {subtopic.spaceComplexity ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{subtopic.bestFor ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
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
