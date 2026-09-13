"use client";

import { useEffect, useReducer } from "react";
import type { Todo } from "@/lib/todo-app/types";
import { initialTodos } from "@/lib/todo-app/types";

const STORAGE_KEY = "custom-hooks-lesson-todos";

type Action =
  | { type: "add"; text: string }
  | { type: "toggle"; id: string }
  | { type: "remove"; id: string };

function todosReducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case "add":
      if (!action.text.trim()) return state;
      return [...state, { id: crypto.randomUUID(), text: action.text, done: false }];
    case "toggle":
      return state.map((todo) => (todo.id === action.id ? { ...todo, done: !todo.done } : todo));
    case "remove":
      return state.filter((todo) => todo.id !== action.id);
    default:
      return state;
  }
}

function loadInitialTodos(): Todo[] {
  if (typeof window === "undefined") return initialTodos;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored ? (JSON.parse(stored) as Todo[]) : initialTodos;
}

/**
 * A custom hook: extracts the reducer + persistence logic so any component
 * can get a fully working todo list with one function call. It's just a
 * function that calls other hooks — the "use" prefix is what tells React
 * (and the linter) it's allowed to.
 */
function useTodos() {
  const [todos, dispatch] = useReducer(todosReducer, undefined, loadInitialTodos);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  return {
    todos,
    addTodo: (text: string) => dispatch({ type: "add", text }),
    toggleTodo: (id: string) => dispatch({ type: "toggle", id }),
    removeTodo: (id: string) => dispatch({ type: "remove", id }),
  };
}

export function TodoDemo() {
  const { todos, addTodo, toggleTodo, removeTodo } = useTodos();

  function handleAdd(form: HTMLFormElement) {
    const input = form.elements.namedItem("text") as HTMLInputElement;
    addTodo(input.value);
    input.value = "";
  }

  return (
    <div className="space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd(e.currentTarget);
        }}
        className="flex gap-2"
      >
        <input
          name="text"
          placeholder="New todo"
          className="flex-1 rounded-md border border-black/[.15] bg-transparent px-3 py-1.5 text-sm dark:border-white/[.2]"
        />
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
        >
          Add
        </button>
      </form>
      <ul className="space-y-1 text-sm">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2">
            <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
            <span className={todo.done ? "line-through opacity-50" : ""}>{todo.text}</span>
            <button
              type="button"
              onClick={() => removeTodo(todo.id)}
              className="ml-auto text-xs text-zinc-500 hover:underline dark:text-zinc-400"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
