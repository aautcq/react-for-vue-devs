"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { lessonPath, lessons, trackTitles, type Track } from "@/lib/lessons";

const tracks: Track[] = ["react", "next", "tanstack-query", "redux", "trpc", "motion"];

/** Which Track (if any) the current pathname belongs to. */
function activeTrack(pathname: string): Track | undefined {
  return tracks.find((track) => lessons[track].some((lesson) => pathname === lessonPath(track, lesson.slug)));
}

export function Sidebar() {
  const pathname = usePathname();
  const [openTracks, setOpenTracks] = useState<Set<Track>>(() => {
    const active = activeTrack(pathname);
    return new Set(active ? [active] : []);
  });
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);

  // Whenever navigation lands on a lesson whose track accordion is closed (e.g. via the
  // command palette, prev/next links, or browser back/forward), open it so the active
  // link is revealed. Adjusted during render (React's recommended pattern for syncing
  // state to a prop change) rather than in an effect, adding to the existing open set
  // rather than replacing it, and never fighting a manual collapse of the same track on
  // the same route.
  const [syncedPathname, setSyncedPathname] = useState(pathname);
  if (pathname !== syncedPathname) {
    setSyncedPathname(pathname);
    const active = activeTrack(pathname);
    if (active) {
      setOpenTracks((prev) => (prev.has(active) ? prev : new Set(prev).add(active)));
    }
  }

  // Only re-runs on navigation, not on manual accordion toggles: by the time this effect
  // fires, the render-phase adjustment above has already opened the active track (if
  // needed), so scrolling here would otherwise fight a user manually collapsing/expanding
  // an unrelated track.
  useEffect(() => {
    const link = activeLinkRef.current;
    if (!link) return;
    const rect = link.getBoundingClientRect();
    const container = link.closest("[data-sidebar-scroll]");
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const isVisible = rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;
    if (!isVisible) {
      link.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [pathname]);

  function toggleTrack(track: Track) {
    setOpenTracks((prev) => {
      const next = new Set(prev);
      if (next.has(track)) {
        next.delete(track);
      } else {
        next.add(track);
      }
      return next;
    });
  }

  return (
    <nav className="flex h-full w-64 shrink-0 flex-col border-r border-black/[.08] dark:border-white/[.145]">
      <div className="shrink-0 px-4 pt-8">
        <Link href="/" className="mb-8 block px-2 text-sm font-semibold">
          ← React Course
        </Link>
      </div>
      <div data-sidebar-scroll className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
        {tracks.map((track) => {
          const expanded = openTracks.has(track);
          const listId = `track-lessons-${track}`;
          return (
            <div key={track} className="mb-6">
              <button
                type="button"
                onClick={() => toggleTrack(track)}
                aria-expanded={expanded}
                aria-controls={listId}
                className="mb-2 flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.04]"
              >
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className={`h-3 w-3 shrink-0 fill-current transition-transform ${expanded ? "rotate-90" : ""}`}
                >
                  <path d="M5 3l6 5-6 5V3z" />
                </svg>
                {trackTitles[track]}
              </button>
              {expanded && (
                <ul id={listId} className="space-y-0.5">
                  {lessons[track].map((lesson) => {
                    const href = lessonPath(track, lesson.slug);
                    const active = pathname === href;
                    return (
                      <li key={lesson.slug}>
                        <Link
                          href={href}
                          ref={active ? activeLinkRef : undefined}
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
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
