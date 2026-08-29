import { createFileRoute, Link } from "@tanstack/react-router";
import {
  HeartIcon,
  LineChartIcon,
  LayersIcon,
  ListOrderedIcon,
  NetworkIcon,
  SearchIcon,
  ShuffleIcon,
  TreePineIcon,
  type LucideIcon,
} from "lucide-react";

import { Logo } from "#/components/logo.tsx";
import { ThemeToggle } from "#/components/theme-toggle.tsx";
import { Button } from "#/components/ui/button.tsx";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <SiteHeader />
      <Hero />
      <ProgressPreview />
      <Features />
      <TopicStrip />
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="flex items-center justify-between py-6">
      <Logo />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button render={<Link to="/login" />} variant="ghost" nativeButton={false}>
          Sign in
        </Button>
        <Button render={<Link to="/signup" />} nativeButton={false}>
          Create account
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 py-20 text-center md:py-28">
      <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground">
        A practice tracker for data structures &amp; algorithms
      </span>
      <h1 className="max-w-3xl text-4xl leading-tight font-bold text-balance md:text-6xl">
        Master DSA with a system, not sticky notes
      </h1>
      <p className="max-w-xl text-lg text-pretty text-muted-foreground">
        Algobook organizes every problem by topic and subtopic — Graphs, Trees, Search, Sort, and
        more — so you always know what's covered, what's next, and what needs another pass.
      </p>
      <div className="mt-2 flex gap-3">
        <Button render={<Link to="/signup" />} size="lg" nativeButton={false}>
          Get started
        </Button>
        <Button render={<Link to="/login" />} variant="outline" size="lg" nativeButton={false}>
          Sign in
        </Button>
      </div>
    </section>
  );
}

interface PreviewTopic {
  name: string;
  icon: LucideIcon;
  solved: number;
  total: number;
}

const PREVIEW_TOPICS: PreviewTopic[] = [
  { name: "Arrays", icon: ListOrderedIcon, solved: 61, total: 70 },
  { name: "Search", icon: SearchIcon, solved: 20, total: 25 },
  { name: "Graphs", icon: NetworkIcon, solved: 21, total: 72 },
  { name: "Trees", icon: TreePineIcon, solved: 10, total: 38 },
];

function ProgressPreview() {
  return (
    <section className="pb-20">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-7 md:grid-cols-4">
        {PREVIEW_TOPICS.map((topic) => {
          const percent = Math.round((topic.solved / topic.total) * 100);
          return (
            <div
              key={topic.name}
              className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{topic.name}</span>
                <topic.icon className="size-4 text-muted-foreground" aria-hidden="true" />
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {topic.solved} / {topic.total}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: LayersIcon,
    title: "Organized by topic & subtopic",
    description:
      "Every topic breaks down into the algorithms and variants that make it up — BFS/DFS, single vs. multi-source, Dijkstra, and more.",
  },
  {
    icon: ShuffleIcon,
    title: "Mixed recall, built in",
    description:
      "Each topic has a recall set of unique questions pulled from across its subtopics, so revision never repeats itself.",
  },
  {
    icon: LineChartIcon,
    title: "Know exactly where you stand",
    description:
      "Track streaks, solved counts, and momentum across every topic you're working through.",
  },
];

function Features() {
  return (
    <section className="grid gap-6 pb-20 md:grid-cols-3">
      {FEATURES.map((feature) => (
        <div
          key={feature.title}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-7"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <feature.icon className="size-5" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold">{feature.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </section>
  );
}

const TOPICS = [
  "Arrays",
  "Linked Lists",
  "Strings",
  "Stacks & Queues",
  "Heaps / Priority Queue",
  "Search",
  "Sort",
  "Greedy",
  "Backtracking",
  "Bit Manipulation",
  "Intervals",
  "Graphs",
  "Trees",
  "Dynamic Programming",
  "Tries",
];

function TopicStrip() {
  return (
    <section className="pb-24 text-center">
      <p className="mb-6 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Every topic you need to cover
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {TOPICS.map((topic) => (
          <span
            key={topic}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground"
          >
            {topic}
          </span>
        ))}
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="flex items-center justify-between border-t border-border py-7 text-sm text-muted-foreground">
      <span>© Algobook</span>
      <span className="inline-flex items-center gap-1.5">
        Made with{" "}
        <HeartIcon className="size-3.5 fill-current text-destructive" aria-hidden="true" />
        by{" "}
        <a
          href="https://github.com/heyImLeo"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground transition-colors hover:text-primary"
        >
          heyImLeo
        </a>
      </span>
    </footer>
  );
}
