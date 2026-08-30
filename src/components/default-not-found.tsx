import { Link } from "@tanstack/react-router";
import { CompassIcon } from "lucide-react";

import { Logo } from "#/components/logo.tsx";
import { Button } from "#/components/ui/button.tsx";

export function DefaultNotFound() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <Link to="/" aria-label="Algobook home" className="absolute top-6 left-6">
        <Logo />
      </Link>

      <div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <CompassIcon className="size-7" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <p className="font-mono text-xs font-medium tracking-wide text-muted-foreground uppercase">
          404
        </p>
        <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Go back
        </Button>
        <Button render={<Link to="/" />} nativeButton={false}>
          Home
        </Button>
      </div>
    </div>
  );
}
