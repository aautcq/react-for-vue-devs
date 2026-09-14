import Link from "next/link";
import { LessonSearch } from "@/components/search/LessonSearch";

/**
 * Site-wide header shown above the Home page and every Lesson page.
 * Hosts the LessonSearch trigger (also toggleable with Cmd/Ctrl+K).
 */
export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-black/[.08] px-6 py-4 dark:border-white/[.145]">
      <Link href="/" className="text-sm font-semibold">
        React Course
      </Link>
      <LessonSearch />
    </header>
  );
}
