"use server";

/**
 * Server Actions for the Running Example's Todo app. Every export here runs
 * only on the server — colocated mutations that replace what would
 * otherwise be a hand-written API route plus client-side fetch. See the
 * Mutating Data / Server Actions lesson.
 */
import { revalidatePath } from "next/cache";
import { addTodo, deleteTodo, toggleTodo } from "./server-store";

export type AddTodoState = { error?: string } | null;

export async function addTodoAction(
  _prevState: AddTodoState,
  formData: FormData
): Promise<AddTodoState> {
  const text = String(formData.get("text") ?? "").trim();
  if (!text) {
    return { error: "Todo text can't be empty." };
  }
  await addTodo(text);
  revalidatePath("/todos");
  return null;
}

export async function toggleTodoAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await toggleTodo(id);
  revalidatePath("/todos");
}

export async function deleteTodoAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await deleteTodo(id);
  revalidatePath("/todos");
}
