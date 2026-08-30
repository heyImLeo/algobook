import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "#/components/ui/button.tsx";
import { useSecretCode } from "#/hooks/use-secret-code.ts";

/**
 * Nothing links here. Whoever finds this earned it — either by reading the
 * source, or by opening devtools and following the console hint below.
 */
export function SecretEasterEgg() {
  const [isOpen, setIsOpen] = useState(false);
  useSecretCode(() => setIsOpen(true));

  useEffect(() => {
    console.log("Curious, huh? Some things on this page respond to the right sequence of keys.");
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100">
      <button
        type="button"
        aria-label="Close"
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-background/90 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="You found it"
        className="pointer-events-none absolute inset-0 flex items-center justify-center p-4"
      >
        <div className="pointer-events-auto relative w-full max-w-lg rounded-2xl border border-border bg-card p-4 shadow-2xl">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute -top-3 -right-3 rounded-full border border-border bg-card shadow-md"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            <XIcon />
          </Button>
          <p className="mb-3 text-center text-sm font-semibold text-muted-foreground">
            Never gonna give you up.
          </p>
          <div className="aspect-video overflow-hidden rounded-xl">
            <iframe
              className="size-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="You know the rules"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}
