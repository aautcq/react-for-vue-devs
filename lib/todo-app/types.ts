/**
 * Shared types for the Running Example: a small Todo app built up
 * progressively across both Tracks. See CONTEXT.md: "Running Example".
 */
export type Todo = {
  id: string;
  text: string;
  done: boolean;
};

export const initialTodos: Todo[] = [
  { id: "1", text: "Learn JSX", done: true },
  { id: "2", text: "Learn useState", done: false },
  { id: "3", text: "Build something with Next.js", done: false },
];
