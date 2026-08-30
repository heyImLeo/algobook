import Prism from "prismjs";
import "prismjs/components/prism-python";

import { cn } from "#/lib/utils.ts";

export function CodeBlock({
  code,
  language = "python",
  className,
}: {
  readonly code: string;
  readonly language?: string;
  readonly className?: string;
}) {
  const grammar = Prism.languages[language] ?? Prism.languages.python;
  const html = Prism.highlight(code, grammar, language);

  return (
    <pre
      className={cn(
        "prism-code overflow-x-auto rounded-2xl border border-border bg-muted p-4 font-mono text-xs leading-relaxed",
        className,
      )}
    >
      {/* Prism.highlight escapes HTML-significant characters in the source before tokenizing, so this is safe even for arbitrary user-entered code. */}
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
