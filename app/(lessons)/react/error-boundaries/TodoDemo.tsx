"use client";

import { Component, type ReactNode, useState } from "react";
import type { Todo } from "@/lib/todo-app/types";

const demoTodos: Todo[] = [
  { id: "1", text: "Learn error boundaries", done: false },
  { id: "2", text: "Type 💥 below to see one in action", done: false },
];

// The only place in modern React you still write a class component: there is
// still no hooks-based equivalent of getDerivedStateFromError/componentDidCatch
// as of React 19, because catching errors during rendering requires hooking
// into a lifecycle that function components + hooks don't expose.
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    // Called during rendering, after a descendant throws — updates state so
    // the next render shows the fallback UI instead of a blank/crashed tree.
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Called after the error has been caught — the place for logging/reporting.
    console.error("TodoList crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-md border border-red-600/30 bg-red-600/[.06] p-3 text-sm text-red-800 dark:border-red-400/30 dark:text-red-300">
          Something went wrong rendering the todo list.
        </div>
      );
    }
    return this.props.children;
  }
}

function TodoItem({ todo }: { todo: Todo }) {
  // Simulate a rendering crash for a specific piece of data, to demonstrate
  // the boundary catching it — a real bug would be unintentional, of course.
  if (todo.text === "💥") {
    throw new Error("Boom! This todo's text broke rendering.");
  }
  return <li className={todo.done ? "line-through opacity-50" : ""}>{todo.text}</li>;
}

export function TodoDemo() {
  const [todos, setTodos] = useState<Todo[]>(demoTodos);
  const [text, setText] = useState("");

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              setTodos((prev) => [...prev, { id: crypto.randomUUID(), text, done: false }]);
              setText("");
            }
          }}
          placeholder='Type "💥" and press Enter'
          className="flex-1 rounded-md border border-black/[.15] bg-transparent px-3 py-1.5 text-sm dark:border-white/[.2]"
        />
      </div>
      <ErrorBoundary>
        <ul className="space-y-1 text-sm">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      </ErrorBoundary>
    </div>
  );
}
