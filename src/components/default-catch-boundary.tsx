import { type ErrorComponentProps, Link, useRouter, useRouterState } from "@tanstack/react-router";
import { TriangleAlertIcon } from "lucide-react";

import { Logo } from "#/components/logo.tsx";
import { Button } from "#/components/ui/button.tsx";

export function DefaultCatchBoundary({ error }: Readonly<ErrorComponentProps>) {
  const router = useRouter();
  // The app registers one global error boundary (no route defines its own),
  // so this always renders at the root regardless of where the error actually
  // happened — "Home" has to be computed from the URL, not from boundary
  // nesting, or it always sends app-context errors to the public homepage.
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const homeHref = pathname.startsWith("/app") ? "/app" : "/";

  console.error(error);

  const message = error instanceof Error ? error.message : String(error);

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <Link to="/" aria-label="Algobook home" className="absolute top-6 left-6">
        <Logo />
      </Link>

      <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <TriangleAlertIcon className="size-7" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          An unexpected error occurred. You can try again, or head back to safety.
        </p>
      </div>

      {message && (
        <pre className="max-w-md overflow-x-auto rounded-2xl border border-border bg-muted p-4 text-left font-mono text-xs text-muted-foreground">
          {message}
        </pre>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          onClick={() => {
            router.invalidate();
          }}
        >
          Try again
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Go back
        </Button>
        <Button render={<Link to={homeHref} />} variant="outline" nativeButton={false}>
          Home
        </Button>
      </div>
    </div>
  );
}
