import Link from "next/link";
import { allLessonsInOrder, lessonPath, lessons, trackTitles, type Track } from "@/lib/lessons";

const tracks: Track[] = ["react", "next", "tanstack-query", "redux", "trpc", "motion"];

export default function Home() {
  const totalLessons = allLessonsInOrder().length;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        A personalized course
      </div>
      <h1 className="mb-4 text-4xl font-semibold tracking-tight">
        The React ecosystem, for a Vue/Nuxt developer
      </h1>
      <p className="mb-10 max-w-xl text-lg leading-7 text-zinc-600 dark:text-zinc-400">
        {totalLessons} lessons across six Tracks. Every lesson pairs a live demo with its source,
        calls out the closest Vue/Nuxt equivalent, and ends with a short exercise. One small Todo
        app is built up incrementally across every Track to tie concepts together.
      </p>

      <div className="space-y-10">
        {tracks.map((track) => (
          <section key={track}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {trackTitles[track]} Track
            </h2>
            <ol className="space-y-3">
              {lessons[track].map((lesson, i) => (
                <li key={lesson.slug}>
                  <Link href={lessonPath(track, lesson.slug)} className="group block">
                    <span className="font-medium group-hover:underline">
                      {i + 1}. {lesson.title}
                    </span>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{lesson.blurb}</p>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </main>
  );
}
