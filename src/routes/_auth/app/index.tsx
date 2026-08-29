import { noop, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FlameIcon, LoaderCircleIcon } from "lucide-react";

import { QuestionStatusIcon } from "#/components/question-status-icon.tsx";
import { useAuthSuspense } from "#/lib/auth/hooks.ts";
import type {
  DashboardActivityItem,
  DashboardStats,
  DashboardTopicProgress,
} from "#/lib/dashboard/functions.ts";
import { dashboardStatsQueryOptions } from "#/lib/dashboard/queries.ts";
import { formatRelativeTime } from "#/lib/format-relative-time.ts";
import { getTopicIcon } from "#/lib/topic-icons.ts";
import { cn } from "#/lib/utils.ts";

export const Route = createFileRoute("/_auth/app/")({
  component: DashboardPage,
  loader: ({ context }) => {
    // Dashboard is the primary, most-frequently-revisited authenticated
    // view, so it's worth warming without blocking navigation.
    void context.queryClient.query(dashboardStatsQueryOptions()).catch(noop);
  },
});

function DashboardPage() {
  const { user } = useAuthSuspense();
  const statsQuery = useQuery(dashboardStatsQueryOptions());

  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {firstName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s where your practice stands today.
          </p>
        </div>
        {!!statsQuery.data?.streakDays && (
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold/15 px-4 py-2 text-sm font-semibold text-gold">
            <FlameIcon className="size-4 fill-current" aria-hidden="true" />
            {statsQuery.data.streakDays} day streak
          </span>
        )}
      </div>

      {statsQuery.isPending && (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <LoaderCircleIcon className="size-5 animate-spin" aria-hidden="true" />
        </div>
      )}

      {statsQuery.isError && (
        <p className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          Couldn&apos;t load your dashboard. Try refreshing the page.
        </p>
      )}

      {statsQuery.data && <DashboardContent stats={statsQuery.data} />}
    </div>
  );
}

function DashboardContent({ stats }: { readonly stats: DashboardStats }) {
  const solvedPercent =
    stats.totalQuestions > 0 ? Math.round((stats.totalSolved / stats.totalQuestions) * 100) : 0;
  const topicsPercent =
    stats.topicsCount > 0 ? Math.round((stats.topicsActiveCount / stats.topicsCount) * 100) : 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Solved"
          value={String(stats.totalSolved)}
          sublabel={`/ ${stats.totalQuestions}`}
          percent={solvedPercent}
          barClassName="bg-primary"
        />
        <StatCard label="Attempted" value={String(stats.totalAttempted)} sublabel="in progress" />
        <StatCard label="This week" value={String(stats.weekSolvedCount)} sublabel="solved" />
        <StatCard
          label="Topics active"
          value={String(stats.topicsActiveCount)}
          sublabel={`/ ${stats.topicsCount}`}
          percent={topicsPercent}
          barClassName="bg-primary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-2 text-base font-semibold">Progress by topic</h2>
          <div className="flex flex-col">
            {stats.topics.map((topic) => (
              <TopicProgressRow key={topic.id} topic={topic} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <ContinueCard item={stats.continueItem} />
          <RecentActivityCard items={stats.recentActivity} />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sublabel,
  percent,
  barClassName = "bg-primary",
}: {
  readonly label: string;
  readonly value: string;
  readonly sublabel: string;
  readonly percent?: number;
  readonly barClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <span className="text-sm font-semibold text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-3xl font-bold">{value}</span>
        <span className="font-mono text-sm text-muted-foreground">{sublabel}</span>
      </div>
      {percent !== undefined && (
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full", barClassName)}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}

/** Buckets a topic's completion into a visual "how healthy is this" tier. */
function topicProgressTone(percent: number): { iconClassName: string; barClassName: string } {
  if (percent === 0)
    return { iconClassName: "bg-muted text-muted-foreground", barClassName: "bg-muted-foreground" };
  if (percent >= 70)
    return { iconClassName: "bg-success/15 text-success", barClassName: "bg-success" };
  return { iconClassName: "bg-primary/15 text-primary", barClassName: "bg-primary" };
}

function TopicProgressRow({ topic }: { readonly topic: DashboardTopicProgress }) {
  // Resolving a stable icon component by name here, not defining a new one.
  const Icon = getTopicIcon(topic.icon);
  const percent = topic.total > 0 ? Math.round((topic.solved / topic.total) * 100) : 0;
  const tone = topicProgressTone(percent);

  return (
    <Link
      to="/app/topics/$topicSlug"
      params={{ topicSlug: topic.slug }}
      className="flex items-center gap-3.5 border-b border-border py-3 transition-colors last:border-b-0 hover:bg-accent/40"
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          tone.iconClassName,
        )}
      >
        {/* oxlint-disable-next-line react/static-components */}
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold">{topic.name}</div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full", tone.barClassName)}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <span className="font-mono text-xs whitespace-nowrap text-muted-foreground">
        {topic.solved}/{topic.total}
      </span>
    </Link>
  );
}

function ContinueCard({ item }: { readonly item: DashboardActivityItem | null }) {
  if (!item) {
    return (
      <div className="rounded-2xl border border-border bg-linear-to-br from-accent/40 to-card p-5">
        <div className="mb-2 text-xs font-semibold tracking-wide text-primary uppercase">
          Continue where you left off
        </div>
        <p className="text-sm text-muted-foreground">
          You haven&apos;t started practicing yet — pick a topic to get going.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-linear-to-br from-accent/40 to-card p-5">
      <div className="mb-2 text-xs font-semibold tracking-wide text-primary uppercase">
        Continue where you left off
      </div>
      <div className="mb-1 text-sm font-semibold">
        {item.topicName} · {item.title}
      </div>
      <div className="mb-4 text-xs text-muted-foreground">
        {item.subtopicSolved} of {item.subtopicTotal} questions solved
      </div>
      <Link
        to="/app/topics/$topicSlug/$subtopicSlug/$questionSlug"
        params={{
          topicSlug: item.topicSlug,
          subtopicSlug: item.subtopicSlug,
          questionSlug: item.questionSlug,
        }}
        className="block w-full rounded-lg bg-primary py-2 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/80"
      >
        Resume
      </Link>
    </div>
  );
}

function RecentActivityCard({ items }: { readonly items: DashboardActivityItem[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-3 text-sm font-semibold">Recent activity</h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No activity yet — solve your first question to see it here.
        </p>
      ) : (
        <div className="flex flex-col">
          {items.map((item) => (
            <Link
              key={item.questionId}
              to="/app/topics/$topicSlug/$subtopicSlug/$questionSlug"
              params={{
                topicSlug: item.topicSlug,
                subtopicSlug: item.subtopicSlug,
                questionSlug: item.questionSlug,
              }}
              className="flex items-start gap-3 border-b border-border py-2.5 transition-colors last:border-b-0 hover:bg-accent/40"
            >
              <QuestionStatusIcon status={item.status} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground">
                  {item.topicName} · {item.subtopicName}
                </div>
              </div>
              <span className="shrink-0 text-xs whitespace-nowrap text-muted-foreground">
                {formatRelativeTime(new Date(item.practicedAt))}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
