import Link from "next/link";
import { Lesson } from "@/components/lesson/Lesson";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";

export default function Page() {
  return (
    <Lesson track="next" slug="mutating-data-server-actions" title="Mutating Data / Server Actions">
      <p>
        A <strong>Server Function</strong> is an <code>async</code> function that runs on the
        server but can be invoked from the client — from a <code>{"<form>"}</code>&apos;s{" "}
        <code>action</code> prop, a <code>{"<button>"}</code>&apos;s <code>formAction</code> prop,
        or an event handler in a Client Component. When used to handle a mutation this way,
        it&apos;s specifically called a <strong>Server Action</strong>. You mark one with the{" "}
        <code>&quot;use server&quot;</code> directive, either at the top of an individual function
        or at the top of a whole file (which marks every export):
      </p>
      <CodeBlock
        filename="app/lib/actions.ts"
        code={`
"use server"

export async function createPost(formData: FormData) {
  const title = formData.get("title")
  // mutate data, then revalidate the cache
}
`}
      />
      <p>
        Pass it straight to a form&apos;s <code>action</code> — React automatically hands the
        function a <code>FormData</code> object built from the form&apos;s inputs, no{" "}
        <code>onSubmit</code>/<code>preventDefault</code>/manual serialization required:
      </p>
      <CodeBlock
        filename="app/ui/form.tsx"
        code={`
import { createPost } from "@/app/lib/actions"

export function Form() {
  return (
    <form action={createPost}>
      <input type="text" name="title" />
      <button type="submit">Create</button>
    </form>
  )
}
`}
      />
      <p>
        This replaces what used to be two separate pieces: a hand-written API <code>route.ts</code>{" "}
        endpoint, plus client code to <code>fetch()</code> it and handle the response. A Server
        Action folds both into one function, called directly — and because it&apos;s driven by a
        real <code>{"<form>"}</code>, it also works with JavaScript disabled or not yet loaded
        (progressive enhancement), something a hand-rolled <code>fetch</code> call can&apos;t do.
      </p>
      <p>
        <strong>Extending the Running Example:</strong> <code>lib/todo-app/actions.ts</code> adds
        Server Actions that call the <code>server-store.ts</code> functions from the previous
        lesson, then revalidate the <code>/todos</code> route so it re-renders with fresh data:
      </p>
      <CodeBlock
        filename="lib/todo-app/actions.ts (abridged)"
        code={`
"use server"

import { revalidatePath } from "next/cache"
import { addTodo, toggleTodo, deleteTodo } from "./server-store"

export async function addTodoAction(_prevState: unknown, formData: FormData) {
  const text = String(formData.get("text") ?? "").trim()
  if (!text) return { error: "Todo text can't be empty." }
  await addTodo(text)
  revalidatePath("/todos")
  return null
}

export async function toggleTodoAction(formData: FormData) {
  await toggleTodo(String(formData.get("id")))
  revalidatePath("/todos")
}
`}
      />
      <p>
        <code>app/todos/page.tsx</code> wires <code>toggleTodoAction</code> and{" "}
        <code>deleteTodoAction</code> straight onto per-row <code>{"<form>"}</code>s with a hidden{" "}
        <code>id</code> field — no client component needed for these two, since a plain server-
        rendered form can invoke a Server Action on its own:
      </p>
      <CodeBlock
        filename="app/todos/page.tsx (per-row actions)"
        code={`
<form action={toggleTodoAction}>
  <input type="hidden" name="id" value={todo.id} />
  <button type="submit">{todo.done ? "Undo" : "Done"}</button>
</form>
`}
      />
      <p>
        <code>AddTodoForm.tsx</code> — the Client Component from the previous lesson — gets rewired
        too. It keeps <code>&quot;use client&quot;</code>, but now for a genuinely good reason:{" "}
        <code>useActionState</code> gives it a pending flag to disable the button and surface
        validation errors from <code>addTodoAction</code> while the request is in flight:
      </p>
      <CodeBlock
        filename="app/todos/AddTodoForm.tsx (abridged)"
        code={`
"use client"

import { useActionState } from "react"
import { addTodoAction } from "@/lib/todo-app/actions"

export function AddTodoForm() {
  const [state, formAction, pending] = useActionState(addTodoAction, null)

  return (
    <form action={formAction}>
      <input type="text" name="text" />
      {state?.error && <p>{state.error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Adding…" : "Add"}</button>
    </form>
  )
}
`}
      />
      <p>
        Try it on{" "}
        <Link href="/todos" className="font-medium underline">
          /todos
        </Link>{" "}
        — add, toggle, and delete all round-trip through Server Actions now, and{" "}
        <code>revalidatePath</code> is what makes the list refresh with the new data afterward
        (covered in depth in the next lesson).
      </p>
      <VueComparison>
        Server Actions replace what Nuxt does with a <code>server/api/*.ts</code> route (Nitro)
        plus a client-side <code>$fetch</code> call. Nuxt still requires you to define an endpoint
        and call it explicitly; a Server Action collapses that round trip into one function you
        import and pass directly to a form or event handler — no separate URL, no manual{" "}
        <code>fetch</code>, and the framework handles serializing the request for you.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            You have a <code>likePost(postId: string)</code> Server Function called from a{" "}
            <code>{"<LikeButton onClick={...}>"}</code> Client Component (not a form). Why must{" "}
            <code>likePost</code> still be defined in a file with{" "}
            <code>&quot;use server&quot;</code>, even though it&apos;s never used as a form{" "}
            <code>action</code>?
          </p>
        }
        solution={
          <p>
            <code>&quot;use server&quot;</code> is what makes the function callable from the
            client at all — it tells Next.js to generate a network endpoint for it and replace the
            function body on the client with a stub that performs a <code>POST</code> request.
            Without the directive, <code>likePost</code> would just be a normal server-only
            function: importing and calling it from a Client Component would either fail to bundle
            or silently try (and fail) to run database/server-only code in the browser.
          </p>
        }
      />
    </Lesson>
  );
}
