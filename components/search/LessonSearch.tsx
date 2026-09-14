"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { allLessonsInOrder, lessonPath, trackTitles, type Track } from "@/lib/lessons";

const trackOrder: Track[] = ["react", "next", "tanstack-query", "redux", "trpc", "motion"];

/**
 * Site-wide Lesson search, toggleable from the Header and via Cmd/Ctrl+K.
 * Navigates straight to a Lesson's dedicated page on selection.
 */
export function LessonSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const lessons = allLessonsInOrder();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const selectLesson = useCallback(
    (track: Track, slug: string) => {
      setOpen(false);
      router.push(lessonPath(track, slug));
    },
    [router],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-black/[.08] px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-400 dark:hover:bg-white/[.04]"
      >
        Search lessons…
        <kbd className="rounded border border-black/[.08] px-1.5 py-0.5 font-sans text-xs dark:border-white/[.145]">
          ⌘K
        </kbd>
      </button>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Search lessons"
        overlayClassName="fixed inset-0 z-50 bg-black/40"
        contentClassName="fixed left-1/2 top-24 z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-black/[.08] bg-white shadow-2xl dark:border-white/[.145] dark:bg-zinc-900"
      >
        <Command.Input
          autoFocus
          placeholder="Search lessons…"
          className="w-full border-b border-black/[.08] bg-transparent px-4 py-3 text-sm outline-none placeholder:text-zinc-400 dark:border-white/[.145] dark:placeholder:text-zinc-500"
        />
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No lessons found.
          </Command.Empty>
          {trackOrder.map((track) => {
            const trackLessons = lessons.filter((lesson) => lesson.track === track);
            return (
              <Command.Group
                key={track}
                heading={trackTitles[track]}
                className="px-2 py-1.5 [&_[cmdk-group-heading]]:px-1 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-zinc-500 dark:[&_[cmdk-group-heading]]:text-zinc-400"
              >
                {trackLessons.map((lesson) => (
                  <Command.Item
                    key={`${track}-${lesson.slug}`}
                    value={`${track}-${lesson.slug}`}
                    keywords={[lesson.title, lesson.blurb]}
                    onSelect={() => selectLesson(track, lesson.slug)}
                    className="cursor-pointer rounded-md px-2 py-2 aria-selected:bg-black/[.06] dark:aria-selected:bg-white/[.08]"
                  >
                    <div className="text-sm font-medium">{lesson.title}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{lesson.blurb}</div>
                  </Command.Item>
                ))}
              </Command.Group>
            );
          })}
        </Command.List>
      </Command.Dialog>
    </>
  );
}
