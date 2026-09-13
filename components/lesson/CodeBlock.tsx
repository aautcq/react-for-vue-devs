import { codeToHtml } from "shiki";

/**
 * Server component: renders a syntax-highlighted source snippet.
 * Kept server-side since Shiki's highlighter is too heavy to ship to the client.
 */
export async function CodeBlock({
  code,
  lang = "tsx",
  filename,
}: {
  code: string;
  lang?: string;
  filename?: string;
}) {
  const html = await codeToHtml(code.trim(), {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
  });

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-black/[.08] dark:border-white/[.145]">
      {filename && (
        <div className="border-b border-black/[.08] bg-black/[.03] px-4 py-1.5 font-mono text-xs text-zinc-500 dark:border-white/[.145] dark:bg-white/[.03] dark:text-zinc-400">
          {filename}
        </div>
      )}
      <div
        className="overflow-x-auto text-sm [&_pre]:!bg-transparent [&_pre]:p-4 [&_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
