"use client";

import { useReducer, useState } from "react";
import type { Todo } from "@/lib/todo-app/types";
import { initialTodos } from "@/lib/todo-app/types";

type Filter = "all" | "active" | "completed";

type State = {
  todos: Todo[];
  filter: Filter;
};

type Action =
  | { type: "add"; text: string }
  | { type: "toggle"; id: string }
  | { type: "remove"; id: string }
  | { type: "set-filter"; filter: Filter };

// One function owns every transition. Each case returns a brand-new state
// object rather than mutating `state` — reducers must stay pure.
function todosReducer(state: State, action: Action): State {
  switch (action.type) {
    case "add":
      if (!action.text.trim()) return state;
      return {
        ...state,
        todos: [...state.todos, { id: crypto.randomUUID(), text: action.text, done: false }],
      };
    case "toggle":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.id ? { ...todo, done: !todo.done } : todo
        ),
      };
    case "remove":
      return { ...state, todos: state.todos.filter((todo) => todo.id !== action.id) };
    case "set-filter":
      return { ...state, filter: action.filter };
    default:
      return state;
  }
}

export function TodoDemo() {
  const [state, dispatch] = useReducer(todosReducer, { todos: initialTodos, filter: "all" });
  const [text, setText] = useState("");

  const visible = state.todos.filter((todo) => {
    if (state.filter === "active") return !todo.done;
    if (state.filter === "completed") return todo.done;
    return true;
  });

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              dispatch({ type: "add", text });
              setText("");
            }
          }}
          placeholder="New todo"
          className="flex-1 rounded-md border border-black/[.15] bg-transparent px-3 py-1.5 text-sm dark:border-white/[.2]"
        />
        <button
          type="button"
          onClick={() => {
            dispatch({ type: "add", text });
            setText("");
          }}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
        >
          Add
        </button>
      </div>
      <div className="flex gap-2">
        {(["all", "active", "completed"] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => dispatch({ type: "set-filter", filter })}
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
              state.filter === filter
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                : "border-black/[.15] dark:border-white/[.2]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      <ul className="space-y-1 text-sm">
        {visible.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => dispatch({ type: "toggle", id: todo.id })}
            />
            <span className={todo.done ? "line-through opacity-50" : ""}>{todo.text}</span>
            <button
              type="button"
              onClick={() => dispatch({ type: "remove", id: todo.id })}
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
