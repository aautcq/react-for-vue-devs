"use client";

import { memo, useCallback, useMemo, useState } from "react";
import type { Todo } from "@/lib/todo-app/types";
import { initialTodos } from "@/lib/todo-app/types";

// React.memo skips re-rendering this component when its props are
// referentially equal to last time — but that only helps if `onToggle`
// itself has a stable identity across parent re-renders (see useCallback below).
const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
}) {
  return (
    <li className="flex items-center gap-2">
      <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
      <span className={todo.done ? "line-through opacity-50" : ""}>{todo.text}</span>
    </li>
  );
});

export function TodoDemo() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [unrelatedCount, setUnrelatedCount] = useState(0);

  // useCallback keeps this function's identity stable across re-renders
  // (as long as its dependencies don't change), so memo(TodoItem) can
  // actually tell "same props" apart from "new inline function every render".
  const handleToggle = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
    );
  }, []);

  // useMemo avoids recomputing this on every render of TodoDemo — cheap
  // here, but the same pattern matters for genuinely expensive derivations.
  const completedCount = useMemo(
    () => todos.filter((todo) => todo.done).length,
    [todos]
  );

  return (
    <div className="space-y-3">
      <p className="text-sm">
        {completedCount} / {todos.length} completed
      </p>
      <ul className="space-y-1 text-sm">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setUnrelatedCount((c) => c + 1)}
        className="rounded-md border border-black/[.15] px-3 py-1.5 text-xs dark:border-white/[.2]"
      >
        Re-render parent for an unrelated reason ({unrelatedCount})
      </button>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Click the button above — thanks to <code>memo</code> + <code>useCallback</code>, no{" "}
        <code>TodoItem</code> re-renders (check React DevTools&apos; highlight-renders option to
        confirm). Toggling a checkbox still re-renders only that item.
      </p>
    </div>
  );
}
