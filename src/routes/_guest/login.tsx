import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LoaderCircleIcon } from "lucide-react";

import { AuthBrandPanel } from "#/components/auth-brand-panel.tsx";
import { Logo } from "#/components/logo.tsx";
import { SocialSignInButtons } from "#/components/sign-in-social-buttons.tsx";
import { ThemeToggle } from "#/components/theme-toggle.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Label } from "#/components/ui/label.tsx";
import { toast } from "#/components/ui/toast.tsx";
import { authClient } from "#/lib/auth/auth-client.ts";

export const Route = createFileRoute("/_guest/login")({
  component: LoginForm,
});

function LoginForm() {
  const { redirectUrl } = Route.useRouteContext();

  const { mutate: emailLoginMutate, isPending } = useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      await authClient.signIn.email(
        {
          ...data,
          callbackURL: redirectUrl,
        },
        {
          onError: ({ error }) => {
            toast.add({
              type: "error",
              description: error.message || "An error occurred while signing in.",
            });
          },
          // better-auth seems to trigger a hard navigation on login,
          // so we don't have to revalidate & navigate ourselves
          // onSuccess: () => {
          //   queryClient.removeQueries({ queryKey: authQueryOptions().queryKey });
          //   navigate({ to: redirectUrl });
          // },
        },
      ),
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) return;

    emailLoginMutate({ email, password });
  };

  return (
    <div className="relative flex min-h-svh">
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      <AuthBrandPanel
        side="left"
        quote="Consistency beats intensity."
        subtext="Pick up your topics and subtopics right where you left off."
      />
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="flex w-full max-w-sm flex-col gap-7">
          <Link to="/" aria-label="Algobook home" className="lg:hidden">
            <Logo />
          </Link>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to pick up your practice where you left off.
            </p>
          </div>
          <form onSubmit={handleSubmit} aria-busy={isPending}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    size="lg"
                    placeholder="hello@example.com"
                    autoComplete="email"
                    readOnly={isPending}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    size="lg"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    readOnly={isPending}
                    required
                  />
                </div>
                <Button type="submit" className="mt-2 w-full" size="lg" disabled={isPending}>
                  {isPending && <LoaderCircleIcon className="animate-spin" aria-hidden="true" />}
                  {isPending ? "Signing in..." : "Sign in"}
                </Button>
              </div>
              <SocialSignInButtons callbackURL={redirectUrl} disabled={isPending} />
            </div>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-medium text-foreground hover:text-primary">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
