import type { ReactNode } from "react";
import { Sidebar } from "@/components/lesson/Sidebar";

// Shared across every Lesson route (/react/* and /next/*). Not typed with
// LayoutProps<T> since it spans many distinct routes with no single literal path.
export default function LessonsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1">
      <Sidebar />
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
