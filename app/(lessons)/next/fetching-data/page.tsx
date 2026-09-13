import Link from "next/link";
import { Lesson } from "@/components/lesson/Lesson";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";

export default function Page() {
  return (
    <Lesson track="next" slug="fetching-data" title="Fetching Data">
      <p>
        Because Server Components can be <code>async</code>, fetching data in a page is just...{" "}
        <code>await</code>. No <code>useEffect</code>, no loading/error state variables, no
        client-side waterfall — the component doesn&apos;t render until the data is ready, and the
        server sends the finished HTML down.
      </p>
      <CodeBlock
        filename="app/blog/page.tsx"
        code={`
export default async function Page() {
  const data = await fetch("https://api.vercel.app/blog")
  const posts = await data.json()

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
`}
      />
      <p>
        This works identically for a database/ORM call instead of <code>fetch</code> — since the
        component only ever runs on the server, credentials and query logic never reach the client
        bundle:
      </p>
      <CodeBlock
        filename="app/blog/page.tsx (ORM instead of fetch)"
        code={`
import { db, posts } from "@/lib/db"

export default async function Page() {
  const allPosts = await db.select().from(posts)
  return <ul>{allPosts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
}
`}
      />
      <p>
        Compare that to the pattern you&apos;d reach for without Server Components: a Client
        Component with <code>useState</code> for the data, <code>useState</code> for a loading
        flag, and a <code>useEffect</code> that fires the request on mount — or Nuxt&apos;s{" "}
        <code>useFetch</code>/<code>useAsyncData</code> composables, which exist specifically to
        paper over that same boilerplate. Here, there&apos;s no boilerplate to paper over: the
        &quot;composable&quot; is just <code>async</code>/<code>await</code>.
      </p>
      <p>
        <strong>Extending the Running Example:</strong> the Todo app graduates from a static array
        to a small simulated backend — <code>lib/todo-app/server-store.ts</code>, a module-level
        array behind <code>async</code> functions with an artificial delay standing in for real
        I/O:
      </p>
      <CodeBlock
        filename="lib/todo-app/server-store.ts (abridged)"
        code={`
import type { Todo } from "./types"
import { initialTodos } from "./types"

let todos: Todo[] = [...initialTodos]

function simulateLatency() {
  return new Promise((resolve) => setTimeout(resolve, 50))
}

export async function getTodos(): Promise<Todo[]> {
  await simulateLatency()
  return todos
}
`}
      />
      <p>
        <code>app/todos/page.tsx</code> becomes <code>async</code> and calls it directly — no
        change to the rendering logic below, just how the data arrives:
      </p>
      <CodeBlock
        filename="app/todos/page.tsx (data fetching, updated)"
        code={`
import { getTodos } from "@/lib/todo-app/server-store"

export default async function TodosPage() {
  const todos = await getTodos()
  return <ul>{todos.map((todo) => <li key={todo.id}>{todo.text}</li>)}</ul>
}
`}
      />
      <p>
        Reload{" "}
        <Link href="/todos" className="font-medium underline">
          /todos
        </Link>{" "}
        and you&apos;ll notice a small, deliberate delay before the list appears — that&apos;s the
        simulated 50ms of I/O in <code>getTodos()</code>, proving the data really does round-trip
        through an <code>async</code> function on the server before the page renders.
      </p>
      <VueComparison>
        This directly replaces <code>useFetch</code>/<code>useAsyncData</code>: those composables
        exist in Nuxt because Vue components render on both server and client and need one API that
        works in both places without duplicating fetch calls or causing hydration mismatches. A
        Next.js Server Component sidesteps the problem entirely — it renders exactly once, on the
        server, so a plain <code>await</code> is enough. (Client Components fetching data — via
        React&apos;s <code>use()</code> API or a library like SWR — is closer to what Nuxt&apos;s
        composables do, but that&apos;s the exception here, not the default.)
      </VueComparison>
      <Exercise
        prompt={
          <p>
            A page needs both <code>getArtist(username)</code> and{" "}
            <code>getAlbums(username)</code>, and the two calls don&apos;t depend on each other.
            Written as <code>const artist = await getArtist(username)</code> followed by{" "}
            <code>const albums = await getAlbums(username)</code>, are these requests sequential or
            parallel — and how would you fix it if that&apos;s not what you want?
          </p>
        }
        solution={
          <p>
            Sequential — the second <code>await</code> doesn&apos;t start until the first one
            resolves, even though nothing in <code>getAlbums</code> depends on <code>artist</code>.
            To run them in parallel, call both functions first (without <code>await</code>) to kick
            off both requests immediately, then await them together:{" "}
            <code>
              const [artist, albums] = await Promise.all([getArtist(username), getAlbums(username)])
            </code>
            .
          </p>
        }
      />
    </Lesson>
  );
}
