import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useRouter } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";

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
import { authClient } from "#/lib/auth/auth-client.ts";
import { useAuthSuspense } from "#/lib/auth/hooks.ts";
import { authQueryOptions } from "#/lib/auth/queries.ts";

export const Route = createFileRoute("/_auth/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur-sm">
        <Link to="/app" aria-label="Algobook dashboard">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
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
      <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/30">
        {initials}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
