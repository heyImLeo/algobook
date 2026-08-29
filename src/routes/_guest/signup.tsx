import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
import { authQueryOptions } from "#/lib/auth/queries.ts";

export const Route = createFileRoute("/_guest/signup")({
  component: SignupForm,
});

function SignupForm() {
  const { redirectUrl } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: signupMutate, isPending } = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      await authClient.signUp.email(
        {
          ...data,
          callbackURL: redirectUrl,
        },
        {
          onError: ({ error }) => {
            toast.add({
              type: "error",
              description: error.message || "An error occurred while signing up.",
            });
          },
          onSuccess: () => {
            queryClient.removeQueries({ queryKey: authQueryOptions().queryKey });
            navigate({ to: redirectUrl });
          },
        },
      );
    },
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm_password");

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof confirmPassword !== "string" ||
      !name ||
      !email ||
      !password ||
      !confirmPassword
    )
      return;

    if (password !== confirmPassword) {
      toast.add({ type: "error", description: "Passwords do not match." });
      return;
    }

    signupMutate({ name, email, password });
  };

  return (
    <div className="relative flex min-h-svh flex-col-reverse lg:flex-row">
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="flex w-full max-w-sm flex-col gap-7">
          <Link to="/" aria-label="Algobook home" className="lg:hidden">
            <Logo />
          </Link>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="text-sm text-muted-foreground">Join and start logging your practice.</p>
          </div>
          <form onSubmit={handleSubmit} aria-busy={isPending}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    size="lg"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    readOnly={isPending}
                    required
                  />
                </div>
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
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    readOnly={isPending}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm_password">Confirm password</Label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    size="lg"
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    readOnly={isPending}
                    required
                  />
                </div>
                <Button type="submit" className="mt-2 w-full" size="lg" disabled={isPending}>
                  {isPending && <LoaderCircleIcon className="animate-spin" aria-hidden="true" />}
                  {isPending ? "Creating account..." : "Create account"}
                </Button>
              </div>
              <SocialSignInButtons callbackURL={redirectUrl} disabled={isPending} />
            </div>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-foreground hover:text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <AuthBrandPanel
        side="right"
        quote="Track the problems you actually need to revisit."
        subtext="Mixed recall keeps every subtopic honest, all in one place."
      />
    </div>
  );
}
