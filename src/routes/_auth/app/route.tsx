import { noop, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useRouter } from "@tanstack/react-router";
import {
  CalendarIcon,
  Code2Icon,
  LayoutGridIcon,
  LogOutIcon,
  SearchIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";
import { useState } from "react";

import { Logo } from "#/components/logo.tsx";
import { ThemeToggle } from "#/components/theme-toggle.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "#/components/ui/sidebar.tsx";
import { authClient } from "#/lib/auth/auth-client.ts";
import { useAuthSuspense } from "#/lib/auth/hooks.ts";
import { authQueryOptions } from "#/lib/auth/queries.ts";
import { getTopicIcon } from "#/lib/topic-icons.ts";
import type { SidebarTopic } from "#/lib/topics/functions.ts";
import { sidebarTopicsQueryOptions } from "#/lib/topics/queries.ts";

export const Route = createFileRoute("/_auth/app")({
  component: AppLayout,
  loader: ({ context }) => {
    // Sidebar topics appear on every authenticated page, so warm without
    // blocking navigation between them.
    void context.queryClient.query(sidebarTopicsQueryOptions()).catch(noop);
  },
});

function AppLayout() {
  return (
    <SidebarProvider>
      <TopicsSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex items-center justify-end border-b border-border bg-background/80 px-6 py-4 backdrop-blur-sm">
          <SidebarTrigger className="mr-auto md:hidden" />
          <ThemeToggle />
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

const RESOURCE_LINKS = [
  { icon: SparklesIcon, label: "Pattern Cheatsheet", to: "/app/pattern-cheatsheet" as const },
  { icon: ZapIcon, label: "Complexity Reference", to: "/app/complexity-reference" as const },
  { icon: CalendarIcon, label: "Study Plan", to: "/app/study-plan" as const },
  { icon: Code2Icon, label: "Python Reference", to: "/app/python-reference" as const },
];

function TopicsSidebar() {
  const topicsQuery = useQuery(sidebarTopicsQueryOptions());
  const [search, setSearch] = useState("");

  const topics = topicsQuery.data?.filter((topic) =>
    topic.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/app" aria-label="Algobook dashboard" className="px-2 py-1.5">
          <Logo />
        </Link>
        <div className="relative px-1">
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <SidebarInput
            placeholder="Search topics..."
            className="pl-8"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="[&.active]:bg-sidebar-accent [&.active]:font-medium [&.active]:text-sidebar-accent-foreground"
                  render={<Link to="/app" />}
                >
                  <LayoutGridIcon aria-hidden="true" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Topics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {topics?.map((topic) => (
                <SidebarTopicMenuItem key={topic.id} topic={topic} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {RESOURCE_LINKS.map(({ icon: Icon, label, to }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton
                    disabled={!to}
                    title={to ? undefined : "Coming soon"}
                    className="[&.active]:bg-sidebar-accent [&.active]:font-medium [&.active]:text-sidebar-accent-foreground"
                    render={to ? <Link to={to} /> : undefined}
                  >
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

function SidebarTopicMenuItem({ topic }: { readonly topic: SidebarTopic }) {
  const Icon = getTopicIcon(topic.icon);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="[&.active]:bg-sidebar-accent [&.active]:font-medium [&.active]:text-sidebar-accent-foreground"
        render={
          <Link
            to="/app/topics/$topicSlug"
            params={{ topicSlug: topic.slug }}
            activeOptions={{ exact: false }}
          />
        }
      >
        {/* oxlint-disable-next-line react/static-components */}
        <Icon aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{topic.name}</span>
        <span className="shrink-0 font-mono text-xs text-sidebar-foreground/60">
          {topic.solved}/{topic.total}
        </span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function UserMenu() {
  const { user } = useAuthSuspense();
  const queryClient = useQueryClient();
  const router = useRouter();

  if (!user) return null;

  const initials =
    user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left outline-none hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-sidebar-ring">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{user.name}</span>
          <span className="block truncate text-xs text-sidebar-foreground/60">{user.email}</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            void authClient.signOut({
              fetchOptions: {
                onResponse: async () => {
                  queryClient.setQueryData(authQueryOptions().queryKey, null);
                  await router.invalidate();
                },
              },
            });
          }}
        >
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
