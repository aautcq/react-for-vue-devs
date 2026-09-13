/**
 * A tiny in-memory "server-side data source" for the Running Example. Stands
 * in for a real database/API — module-level state that only ever lives on
 * the server, read and written by async functions with an artificial delay
 * to simulate real I/O. See the Fetching Data and Mutating Data lessons.
 */
import type { Todo } from "./types";
import { initialTodos } from "./types";

let todos: Todo[] = [...initialTodos];

function simulateLatency() {
  return new Promise((resolve) => setTimeout(resolve, 50));
}

export async function getTodos(): Promise<Todo[]> {
  await simulateLatency();
  return todos;
}

export async function getTodo(id: string): Promise<Todo | undefined> {
  await simulateLatency();
  return todos.find((todo) => todo.id === id);
}

export async function addTodo(text: string): Promise<Todo> {
  await simulateLatency();
  const todo: Todo = { id: crypto.randomUUID(), text, done: false };
  todos = [...todos, todo];
  return todo;
}

export async function toggleTodo(id: string): Promise<void> {
  await simulateLatency();
  todos = todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo));
}

export async function deleteTodo(id: string): Promise<void> {
  await simulateLatency();
  todos = todos.filter((todo) => todo.id !== id);
}
