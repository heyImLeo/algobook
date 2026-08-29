import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRightIcon, ExternalLinkIcon } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";

import { QuestionStatusIcon } from "#/components/question-status-icon.tsx";
import type { Difficulty, QuestionStatus } from "#/lib/db/schema/types.ts";
import { getTopicIcon } from "#/lib/topic-icons.ts";
import type {
  RelatedSubtopic,
  SubtopicContinueItem,
  SubtopicQuestion,
  SubtopicQuestionGroup,
} from "#/lib/topics/functions.ts";
import { subtopicDetailQueryOptions } from "#/lib/topics/queries.ts";
import { cn } from "#/lib/utils.ts";

export const Route = createFileRoute("/_auth/app/topics/$topicSlug/$subtopicSlug")({
  component: SubtopicPage,
  loader: async ({ context, params }) => {
    const subtopic = await context.queryClient.query(
      subtopicDetailQueryOptions(params.topicSlug, params.subtopicSlug),
    );
    if (!subtopic) throw notFound();
  },
});

type StatusFilter = "all" | QuestionStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "todo", label: "Todo" },
  { value: "attempted", label: "Attempted" },
  { value: "solved", label: "Solved" },
];

function SubtopicPage() {
  const { topicSlug, subtopicSlug } = Route.useParams();
  const { data: subtopic } = useSuspenseQuery(subtopicDetailQueryOptions(topicSlug, subtopicSlug));
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  if (!subtopic) return null;

  const matchesFilter = (question: SubtopicQuestion) =>
    statusFilter === "all" || question.status === statusFilter;

  const filteredGroups = subtopic.groups
    .map((group) => ({ ...group, questions: group.questions.filter(matchesFilter) }))
    .filter((group) => group.questions.length > 0);
  const filteredQuestions = subtopic.questions.filter(matchesFilter);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/app" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRightIcon className="size-3.5" aria-hidden="true" />
        <Link to="/app/topics/$topicSlug" params={{ topicSlug }} className="hover:text-foreground">
          {subtopic.topic.name}
        </Link>
        <ChevronRightIcon className="size-3.5" aria-hidden="true" />
        <span className="font-medium text-foreground">{subtopic.name}</span>
      </nav>

      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{subtopic.name}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtopic.description}</p>
          </div>
          <div className="flex items-baseline gap-1.5 font-mono text-sm text-muted-foreground">
            <span className="text-lg font-bold text-foreground">{subtopic.solved}</span>/
            {subtopic.total} solved
          </div>
        </div>
        {(subtopic.timeComplexity || subtopic.spaceComplexity || subtopic.bestFor) && (
          <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs text-muted-foreground">
            {subtopic.timeComplexity && (
              <span className="rounded-full bg-muted px-2.5 py-1">
                Time {subtopic.timeComplexity}
              </span>
            )}
            {subtopic.spaceComplexity && (
              <span className="rounded-full bg-muted px-2.5 py-1">
                Space {subtopic.spaceComplexity}
              </span>
            )}
            {subtopic.bestFor && (
              <span className="rounded-full bg-muted px-2.5 py-1">Best for {subtopic.bestFor}</span>
            )}
          </div>
        )}
      </div>

      {subtopic.referenceContent && (
        <div className="mb-8 rounded-2xl border border-border bg-card p-6">
          <MarkdownContent content={subtopic.referenceContent} />
        </div>
      )}

      <RelatedSubtopics
        topicSlug={topicSlug}
        subtopics={subtopic.relatedSubtopics}
        icon={subtopic.topic.icon}
      />

      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold">Practice questions</h2>
        <div className="flex gap-1 rounded-full border border-border p-1">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                statusFilter === filter.value
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <ContinueCard item={subtopic.continueItem} />

      <div className="flex flex-col gap-6">
        {filteredGroups.map((group) => (
          <QuestionGroupCard key={group.id} group={group} />
        ))}
        {filteredQuestions.length > 0 && <QuestionListCard questions={filteredQuestions} />}
        {filteredGroups.length === 0 && filteredQuestions.length === 0 && (
          <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No questions match this filter.
          </p>
        )}
      </div>
    </div>
  );
}

function RelatedSubtopics({
  topicSlug,
  subtopics,
  icon,
}: {
  readonly topicSlug: string;
  readonly subtopics: RelatedSubtopic[];
  readonly icon: string;
}) {
  if (subtopics.length === 0) return null;
  const Icon = getTopicIcon(icon);

  return (
    <>
      <h2 className="mb-4 text-base font-semibold">Related Subtopics</h2>
      <div className="mb-8 grid gap-3.5 sm:grid-cols-2">
        {subtopics.map((subtopic) => (
          <Link
            key={subtopic.slug}
            to="/app/topics/$topicSlug/$subtopicSlug"
            params={{ topicSlug, subtopicSlug: subtopic.slug }}
            className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              {/* oxlint-disable-next-line react/static-components */}
              <Icon className="size-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold">{subtopic.name}</div>
              <div className="truncate text-xs text-muted-foreground">{subtopic.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

function ContinueCard({ item }: { readonly item: SubtopicContinueItem | null }) {
  if (!item) return null;

  return (
    <div className="mb-6 flex items-center gap-4 rounded-2xl border border-gold/30 bg-linear-to-br from-gold/15 to-card p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold tracking-wide text-gold uppercase">
          Continue where you left off
        </div>
        <div className="mt-0.5 truncate text-sm font-semibold">
          {item.title}
          {item.groupName && (
            <span className="font-normal text-muted-foreground">
              {" "}
              · {item.groupName} · Attempted
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        disabled
        title="Coming soon"
        className="shrink-0 rounded-lg bg-gold px-3.5 py-1.5 text-xs font-semibold text-gold-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        Resume
      </button>
    </div>
  );
}

function QuestionGroupCard({ group }: { readonly group: SubtopicQuestionGroup }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold">{group.name}</h3>
      {group.description && (
        <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
      )}
      <div className="mt-3 flex flex-col">
        {group.questions.map((question) => (
          <QuestionRow key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
}

function QuestionListCard({ questions }: { readonly questions: SubtopicQuestion[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-col">
        {questions.map((question) => (
          <QuestionRow key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
}

function QuestionRow({ question }: { readonly question: SubtopicQuestion }) {
  return (
    <div className="flex items-center gap-3 border-b border-border py-3 last:border-b-0">
      <QuestionStatusIcon status={question.status} className="shrink-0" />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-sm font-medium">{question.title}</span>
        {question.leetcodeNumber !== null && (
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            #{question.leetcodeNumber}
          </span>
        )}
      </div>
      {question.dueForReview && (
        <span className="shrink-0 rounded-full bg-gold/15 px-2 py-0.5 text-[10.5px] font-bold whitespace-nowrap text-gold">
          due for review
        </span>
      )}
      <DifficultyBadge difficulty={question.difficulty} />
      <span className="w-16 shrink-0 text-right font-mono text-xs text-muted-foreground">
        {STATUS_LABELS[question.status]}
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

const STATUS_LABELS: Record<QuestionStatus, string> = {
  todo: "Todo",
  attempted: "Attempted",
  solved: "Solved",
};

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  easy: "text-success",
  medium: "text-warning",
  hard: "text-destructive",
};

function DifficultyBadge({ difficulty }: { readonly difficulty: Difficulty }) {
  return (
    <span
      className={cn("w-14 shrink-0 text-xs font-medium capitalize", DIFFICULTY_STYLES[difficulty])}
    >
      {difficulty}
    </span>
  );
}

const CALLOUT_MATCHERS: { prefix: string; className: string; iconClassName: string }[] = [
  {
    prefix: "Key Insight",
    className: "border-primary/25 bg-primary/10",
    iconClassName: "bg-primary/15 text-primary",
  },
  {
    prefix: "Common Mistakes",
    className: "border-warning/25 bg-warning/10",
    iconClassName: "bg-warning/15 text-warning",
  },
];

function headingText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(headingText).join("");
  return "";
}

function MarkdownContent({ content }: { readonly content: string }) {
  return (
    <div className="flex flex-col gap-4 text-sm text-foreground [&_ol]:list-decimal [&_ul]:list-disc">
      <Markdown
        components={{
          h1: ({ children, ...props }) => (
            <h2 className="text-lg font-bold" {...props}>
              {children}
            </h2>
          ),
          h2: ({ children, ...props }) => {
            const callout = CALLOUT_MATCHERS.find((matcher) =>
              headingText(children).startsWith(matcher.prefix),
            );
            if (callout) {
              return (
                <div
                  className={cn(
                    "-mb-2 flex items-center gap-2.5 rounded-t-lg border p-3",
                    callout.className,
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                      callout.iconClassName,
                    )}
                  >
                    !
                  </span>
                  <h2 className="text-sm font-bold" {...props}>
                    {children}
                  </h2>
                </div>
              );
            }
            return (
              <h2 className="mt-2 text-lg font-bold" {...props}>
                {children}
              </h2>
            );
          },
          h3: ({ children, ...props }) => (
            <h3 className="mt-2 text-base font-semibold" {...props}>
              {children}
            </h3>
          ),
          p: (props) => <p className="leading-relaxed text-muted-foreground" {...props} />,
          ul: (props) => (
            <ul className="ml-5 flex flex-col gap-1 text-muted-foreground" {...props} />
          ),
          ol: (props) => (
            <ol className="ml-5 flex flex-col gap-1 text-muted-foreground" {...props} />
          ),
          li: (props) => <li className="leading-relaxed" {...props} />,
          strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
          code: (props) => (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs" {...props} />
          ),
          pre: (props) => (
            <pre
              className="overflow-x-auto rounded-xl bg-muted p-4 font-mono text-xs [&_code]:bg-transparent [&_code]:p-0"
              {...props}
            />
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
