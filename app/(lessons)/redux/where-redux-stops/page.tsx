import { Lesson } from "@/components/lesson/Lesson";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";

export default function Page() {
  return (
    <Lesson track="redux" slug="where-redux-stops" title="Where Redux Stops">
      <p>
        Every lesson in this Track so far has pointedly kept the todos themselves out of Redux.
        That wasn&apos;t an oversight — it&apos;s the single most important design decision in how
        this Running Example uses Redux at all, so it&apos;s worth stating outright: <strong>the
        todos are Server State, and Server State does not belong in Redux.</strong>
      </p>
      <p>
        CONTEXT.md draws this line precisely. Server State is &quot;data whose source of truth
        lives on the server&quot; — owned, in this course, by Server Actions, a REST Route
        Handler, or a typed tRPC router, depending on which Track is fetching or mutating it.
        Client State is &quot;data that only ever exists in the browser and has no server-side
        source of truth&quot; — which todo filter is active, or whether a mutation is in flight.
        The <code>todoUi</code> slice you wired up last lesson only ever modeled the second
        category. That wasn&apos;t a simplification for the Demo&apos;s sake — it&apos;s the
        correct scope for a Redux store, full stop.
      </p>
      <p>Here&apos;s the shape of the mistake this Track deliberately avoided:</p>
      <CodeBlock
        filename="wrong: todos duplicated into Redux"
        code={`
// ❌ Now there are two sources of truth for "what are the todos":
// the server (via Server Actions) AND this slice. Every add/toggle/delete
// has to update both, and they can drift out of sync — a failed request,
// a second browser tab, or a stale cache can all leave them disagreeing.
const todosSlice = createSlice({
  name: "todos",
  initialState: { items: [] as Todo[] },
  reducers: {
    added(state, action: PayloadAction<Todo>) {
      state.items.push(action.payload)
    },
    toggled(state, action: PayloadAction<string>) {
      const todo = state.items.find((t) => t.id === action.payload)
      if (todo) todo.done = !todo.done
    },
  },
})
`}
      />
      <CodeBlock
        filename="right: todos stay server state, Redux only holds client state"
        code={`
// ✅ One source of truth for the todos: the server. Redux never
// duplicates them — it only tracks state that has no server-side
// counterpart at all.
const todoUiSlice = createSlice({
  name: "todoUi",
  initialState: { filter: "all", pendingIds: [] as string[] },
  reducers: {
    filterChanged(state, action: PayloadAction<TodoFilter>) {
      state.filter = action.payload
    },
    // ...pendingStarted / pendingEnded, wrapping the real server call...
  },
})
`}
      />
      <p>
        Once the todos live in exactly one place, every other concern gets simpler by
        subtraction: no cache invalidation between &quot;the Redux copy&quot; and &quot;the real
        data&quot;, no risk of a stale Redux todo surviving a server-side delete, and no need to
        keep two mutation paths (a Redux action <em>and</em> a Server Action) in sync for the same
        operation. The upcoming TanStack Query Track exists specifically to manage Server State
        well — caching, refetching, invalidation — and it will do that job for the todos instead
        of Redux, precisely because that&apos;s a different problem than what Redux solves.
      </p>
      <p>
        The rule of thumb this Track leaves you with: before adding anything to a Redux slice, ask
        whether it has a server-side source of truth. If yes, it&apos;s Server State — model it
        with Server Actions/Route Handlers/tRPC and a data-fetching layer, never a Redux slice. If
        no — a filter, a modal&apos;s open/closed flag, which IDs are mid-mutation — it&apos;s
        Client State, and a slice like <code>todoUi</code> is exactly the right tool.
      </p>
      <VueComparison>
        This is a common Nuxt pitfall too, worth naming explicitly: it&apos;s tempting to fetch an
        API response inside a Pinia action and stash it in <code>state</code> so every component
        can read it without refetching. That works, but now the Pinia store owns caching,
        invalidation, and staleness for data it doesn&apos;t actually source — problems Nuxt&apos;s
        own <code>useAsyncData</code>/<code>useFetch</code> already solve, with SSR-aware caching,
        request deduplication, and refetch-on-navigation built in. The mapping is exact: Pinia is
        for Nuxt&apos;s Client State the same way Redux is for this course&apos;s, and{" "}
        <code>useAsyncData</code>/<code>useFetch</code> are to Nuxt what the TanStack Query Track
        is to this one.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            The Running Example later adds a &quot;recently viewed todo IDs&quot; feature: the
            last five todo IDs a user clicked into, kept only in the browser, never sent to the
            server. Does this belong in the <code>todoUi</code> Redux slice, or does it need a
            server-side source of truth like the todos themselves?
          </p>
        }
        solution={
          <p>
            It belongs in Redux (or a slice very much like <code>todoUi</code>). &quot;Recently
            viewed IDs, browser-only, never persisted server-side&quot; is the textbook definition
            of Client State from CONTEXT.md — there is no server source of truth to duplicate, so
            there&apos;s no drift risk, and a slice with a <code>viewed</code> array plus a{" "}
            <code>todoViewed</code> reducer is a perfectly appropriately-scoped use of Redux, in
            contrast to the todos themselves.
          </p>
        }
      />
    </Lesson>
  );
}
