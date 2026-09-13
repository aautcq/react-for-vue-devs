import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { OptimisticTodoListDemo } from "./OptimisticTodoListDemo";

export default function Page() {
  return (
    <Lesson track="tanstack-query" slug="optimistic-updates" title="Optimistic Updates">
      <p>
        The previous lesson&apos;s toggle button waits for <code>PATCH /api/todos</code> to finish,
        then invalidates and refetches — correct, but the checkbox visibly lags behind the click by
        however long the server-store&apos;s simulated latency is. An{" "}
        <strong>optimistic update</strong> flips that order: update the cache immediately, as if the
        mutation had already succeeded, and only reconcile with the server afterwards.
      </p>
      <p>
        <code>useMutation</code>&apos;s <code>onMutate</code> callback runs before the request is
        even sent. It&apos;s the place to cancel any in-flight refetch for that query (so it
        can&apos;t overwrite your optimistic write), snapshot the current cache value for a possible
        rollback, and then write the new value directly with <code>setQueryData</code>:
      </p>
      <CodeBlock
        filename="the optimistic update contract"
        code={`
const toggleMutation = useMutation({
  mutationFn: patchTodo,
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ["todos"] })
    const previousTodos = queryClient.getQueryData<Todo[]>(["todos"])

    queryClient.setQueryData<Todo[]>(["todos"], (old) =>
      old?.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
    )

    return { previousTodos } // becomes "context" below
  },
  onError: (_err, _id, context) => {
    // roll back to the snapshot if the mutation actually failed
    if (context?.previousTodos) {
      queryClient.setQueryData(["todos"], context.previousTodos)
    }
  },
  onSettled: () => {
    // reconcile with the server either way, success or failure
    queryClient.invalidateQueries({ queryKey: ["todos"] })
  },
})
`}
      />
      <p>
        The value <code>onMutate</code> returns becomes the third argument to both{" "}
        <code>onError</code> and <code>onSettled</code> — that&apos;s how the rollback snapshot
        travels from &quot;before the request&quot; to &quot;the request failed.&quot; Click a
        checkbox below: it flips instantly, before <code>/api/todos</code> has even responded.
      </p>
      <Demo title="toggling a todo optimistically, before the PATCH resolves">
        <OptimisticTodoListDemo />
      </Demo>
      <VueComparison>
        The same three-phase shape — snapshot, write, roll back on failure — is exactly how you&apos;d
        hand-write an optimistic update against a Pinia store too: mutate the store&apos;s state
        immediately, keep a copy of the old value in a local variable, and restore it in a{" "}
        <code>catch</code> block if the request throws. TanStack Query just gives that pattern
        first-class callback names (<code>onMutate</code>/<code>onError</code>/<code>onSettled</code>)
        instead of it being hand-rolled try/catch every time.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            Why does <code>onMutate</code> call{" "}
            <code>queryClient.cancelQueries(&#123; queryKey: [&quot;todos&quot;] &#125;)</code> before
            writing the optimistic value? What could go wrong if it didn&apos;t?
          </p>
        }
        solution={
          <p>
            If a background refetch for <code>[&quot;todos&quot;]</code> was already in flight when
            the mutation started, it could resolve <em>after</em> the optimistic write and overwrite
            it with stale (pre-toggle) data — undoing the optimistic update before the mutation
            itself has even finished. Cancelling any in-flight query for that key first guarantees
            the optimistic write is the last thing to touch the cache until the mutation settles.
          </p>
        }
      />
    </Lesson>
  );
}
