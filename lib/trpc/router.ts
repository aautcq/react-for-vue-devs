/**
 * The Running Example's typed API surface: the same job as the
 * /api/todos Route Handler (see the Next Track's Route Handlers lesson
 * and the TanStack Query Track), but with end-to-end types instead of a
 * hand-written JSON contract. Reads/writes the same server-store, so the
 * Todo list is consistent no matter which lesson's Demo touched it last.
 */
import { z } from "zod";
import { addTodo, deleteTodo, getTodos, toggleTodo } from "@/lib/todo-app/server-store";
import { publicProcedure, router } from "./init";

export const todoRouter = router({
  list: publicProcedure.query(() => getTodos()),
  add: publicProcedure
    .input(z.object({ text: z.string().min(1, "Todo text can't be empty.") }))
    .mutation(({ input }) => addTodo(input.text)),
  toggle: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => toggleTodo(input.id)),
  remove: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => deleteTodo(input.id)),
});

export type AppRouter = typeof todoRouter;
