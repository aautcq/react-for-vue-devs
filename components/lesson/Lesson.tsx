import Link from "next/link";
import type { ReactNode } from "react";
import { adjacentLessons, lessonPath, trackTitles, type Track } from "@/lib/lessons";

/**
 * Top-level shell for a single Lesson page: title, prose/demo/exercise
 * children, and prev/next navigation across the whole curriculum.
 * See CONTEXT.md: "Lesson".
 */
export function Lesson({
  track,
  slug,
  title,
  children,
}: {
  track: Track;
  slug: string;
  title: string;
  children: ReactNode;
}) {
  const { previous, next } = adjacentLessons(track, slug);

  return (
    <article className="mx-auto w-full max-w-2xl px-6 py-10">
      <div className="mb-6 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {trackTitles[track]} Track
      </div>
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">{title}</h1>
      <div className="prose-lesson space-y-4 text-[15px] leading-7 text-zinc-700 dark:text-zinc-300">
        {children}
      </div>
      <nav className="mt-12 flex items-center justify-between border-t border-black/[.08] pt-6 text-sm dark:border-white/[.145]">
        {previous ? (
          <Link href={lessonPath(previous.track, previous.slug)} className="font-medium hover:underline">
            ← {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={lessonPath(next.track, next.slug)} className="font-medium hover:underline">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
