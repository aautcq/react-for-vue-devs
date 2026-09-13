"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { lessonPath, lessons, trackTitles, type Track } from "@/lib/lessons";

const tracks: Track[] = ["react", "next"];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-64 shrink-0 overflow-y-auto border-r border-black/[.08] px-4 py-8 dark:border-white/[.145]">
      <Link href="/" className="mb-8 block px-2 text-sm font-semibold">
        ← React Course
      </Link>
      {tracks.map((track) => (
        <div key={track} className="mb-6">
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {trackTitles[track]}
          </div>
          <ul className="space-y-0.5">
            {lessons[track].map((lesson) => {
              const href = lessonPath(track, lesson.slug);
              const active = pathname === href;
              return (
                <li key={lesson.slug}>
                  <Link
                    href={href}
                    className={`block rounded-md px-2 py-1.5 text-sm ${
                      active
                        ? "bg-black/[.06] font-medium text-black dark:bg-white/[.08] dark:text-white"
                        : "text-zinc-600 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.04]"
                    }`}
                  >
                    {lesson.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
