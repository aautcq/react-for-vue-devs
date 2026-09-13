import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { TodoFilterDemo } from "./TodoFilterDemo";

export default function Page() {
  return (
    <Lesson track="redux" slug="todo-filter-slice" title="A Filter Slice for the Todo List">
      <p>
        Time to wire up the real slice this repo ships for the Running Example:{" "}
        <code>lib/redux/todoUiSlice.ts</code>. It holds exactly two things — which filter is
        active, and which todo IDs currently have a mutation in flight — and deliberately nothing
        else:
      </p>
      <CodeBlock
        filename="lib/redux/todoUiSlice.ts (already in this repo)"
        code={`
export type TodoFilter = "all" | "active" | "done"

type TodoUiState = {
  filter: TodoFilter
  pendingIds: string[]
}

const todoUiSlice = createSlice({
  name: "todoUi",
  initialState: { filter: "all", pendingIds: [] } satisfies TodoUiState,
  reducers: {
    filterChanged(state, action: PayloadAction<TodoFilter>) {
      state.filter = action.payload
    },
    pendingStarted(state, action: PayloadAction<string>) {
      if (!state.pendingIds.includes(action.payload)) state.pendingIds.push(action.payload)
    },
    pendingEnded(state, action: PayloadAction<string>) {
      state.pendingIds = state.pendingIds.filter((id) => id !== action.payload)
    },
  },
})
`}
      />
      <p>
        Notice what&apos;s missing: there is no <code>todos</code> array in this state, and no
        <code>added</code>/<code>toggled</code>/<code>deleted</code> reducers for them. The todos
        already have a single source of truth elsewhere (Server Actions in this Track&apos;s
        Running Example so far), and duplicating them into Redux would mean two copies to keep in
        sync. This slice only models the two things that are genuinely{" "}
        <strong>Client State</strong>: which filter tab is selected, and which specific todo IDs
        are mid-request right now.
      </p>
      <p>
        The Demo below uses a plain local array of todos (seeded from{" "}
        <code>initialTodos</code>) purely as stand-in data — that array lives in ordinary{" "}
        <code>useState</code>, not Redux. Only the filter buttons and the pending flag while
        toggling a todo go through the store:
      </p>
      <Demo title="filter buttons + a simulated pending toggle, both via Redux">
        <TodoFilterDemo />
      </Demo>
      <CodeBlock
        filename="app/(lessons)/redux/todo-filter-slice/TodoFilterDemo.tsx (abridged)"
        code={`
const [todos, setTodos] = useState<Todo[]>(initialTodos) // local demo data, NOT Redux
const filter = useAppSelector((state) => state.todoUi.filter)
const pendingIds = useAppSelector((state) => state.todoUi.pendingIds)
const dispatch = useAppDispatch()

async function handleToggle(id: string) {
  dispatch(pendingStarted(id))
  await simulateLatency() // stands in for the real mutation
  setTodos((current) => current.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  dispatch(pendingEnded(id))
}
`}
      />
      <p>
        Toggle a todo and notice the checkbox disables itself and shows &quot;saving…&quot; for
        the simulated delay — that&apos;s <code>pendingIds</code> at work, entirely independent of
        which filter is selected or what the todos themselves contain. In the real Running Example
        (once it&apos;s wired to Server Actions/TanStack Query/tRPC), <code>pendingStarted</code>{" "}
        would fire right before the real mutation call and <code>pendingEnded</code> right after
        it resolves — the slice doesn&apos;t care what kind of request is in flight.
      </p>
      <VueComparison>
        A Pinia store for this exact concern would look almost identical: <code>state</code>{" "}
        holding <code>filter</code> and <code>pendingIds</code>, plus actions{" "}
        <code>setFilter(filter)</code> and <code>startPending(id)</code>/<code>endPending(id)</code>{" "}
        that mutate them directly. The scope discipline is the same lesson in either framework:
        keep the store to genuinely client-only concerns, and let whichever data-fetching layer
        you&apos;re using (Nuxt&apos;s <code>useAsyncData</code>, this Track&apos;s later
        TanStack Query lessons) own anything that has a server-side source of truth.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            A teammate wants to add a <code>search</code> text field to <code>todoUiSlice</code>{" "}
            for filtering the todo list by substring, alongside the existing <code>filter</code>.
            Is that a good fit for this slice? What about adding a <code>todos</code> array to it
            so the whole list lives in Redux too?
          </p>
        }
        solution={
          <p>
            <code>search</code> fits perfectly — it&apos;s pure Client State with no server-side
            counterpart, exactly like <code>filter</code>, so a <code>searchChanged</code> reducer
            alongside <code>filterChanged</code> is the right move. A <code>todos</code> array does
            not fit: the todos already have a server-owned source of truth, and storing them in
            Redux too would create a second copy that can drift out of sync with the server —
            that&apos;s exactly the distinction the next lesson, &quot;Where Redux Stops,&quot;
            makes explicit.
          </p>
        }
      />
    </Lesson>
  );
}
