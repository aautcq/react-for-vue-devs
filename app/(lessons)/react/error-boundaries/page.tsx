import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { TodoDemo } from "./TodoDemo";

export default function Page() {
  return (
    <Lesson track="react" slug="error-boundaries" title="Error Boundaries">
      <p>
        Here&apos;s the honest surprise, even as of React 19: there is still no hooks-based API
        for catching a rendering error thrown by a descendant component. Catching an error that
        happens <em>during rendering</em> requires two class-only lifecycle methods —{" "}
        <code>static getDerivedStateFromError</code> and <code>componentDidCatch</code> — that
        have no function-component equivalent. This is the one place in modern React where you
        still reach for a class.
      </p>
      <CodeBlock
        filename="the minimal error boundary"
        code={`
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    // runs during rendering, after a child throws — return new state
    // so the next render shows a fallback instead of the crashed tree
    return { hasError: true }
  }

  componentDidCatch(error: unknown, info: unknown) {
    // runs after the error is caught — log/report it here
    console.error(error, info)
  }

  render() {
    if (this.state.hasError) return <p>Something went wrong.</p>
    return this.props.children
  }
}
`}
      />
      <p>
        Wrap any part of the tree you want isolated in <code>{"<ErrorBoundary>...</ErrorBoundary>"}</code>.
        If a descendant throws during rendering, React unmounts that subtree and the boundary
        renders its fallback instead — crucially, the crash is contained to that subtree rather
        than taking down the whole page. Note that error boundaries only catch errors thrown{" "}
        <em>during rendering</em> (and in lifecycle methods/constructors) — they do{" "}
        <strong>not</strong> catch errors in event handlers, async code, or server-side rendering;
        those still need a plain <code>try/catch</code>.
      </p>
      <p>
        The Running Example wraps the todo list in an <code>ErrorBoundary</code>. Type{" "}
        <code>💥</code> as a new todo&apos;s text: <code>TodoItem</code> deliberately throws when
        it renders that exact text, and the boundary catches it, replacing just the list with a
        fallback message instead of crashing the whole demo.
      </p>
      <Demo title="a broken TodoItem caught by an ErrorBoundary">
        <TodoDemo />
      </Demo>
      <CodeBlock
        filename="app/(lessons)/react/error-boundaries/TodoDemo.tsx (abridged)"
        code={`
function TodoItem({ todo }: { todo: Todo }) {
  if (todo.text === "💥") throw new Error("Boom!")
  return <li>{todo.text}</li>
}

<ErrorBoundary>
  <ul>
    {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
  </ul>
</ErrorBoundary>
`}
      />
      <VueComparison>
        Vue&apos;s equivalent is the <code>onErrorCaptured</code> lifecycle hook (usable in{" "}
        <code>setup()</code>, so it <em>is</em> hooks-compatible there — no class required), which
        receives the error and can return <code>false</code> to stop it propagating further up the
        tree. React&apos;s class-only requirement here is a genuine, currently-permanent wart:
        function components and hooks simply have no lifecycle hook for
        &quot;a descendant threw during render,&quot; so this remains the one spot where React
        asks you to drop back to <code>class extends Component</code>.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            A todo item&apos;s <code>onClick</code> handler calls an API and the request rejects,
            throwing inside an <code>async</code> function. Will the surrounding{" "}
            <code>ErrorBoundary</code> catch that error? If not, what should you do instead?
          </p>
        }
        solution={
          <p>
            No — error boundaries only catch errors thrown synchronously during rendering (and in
            class lifecycle methods), not errors from event handlers or async code, since those run
            outside of React&apos;s render pass entirely. That rejection needs its own{" "}
            <code>try/catch</code> around the <code>await</code> (or a <code>.catch()</code> on the
            promise) inside the handler itself, updating some local state to show an error message
            in the UI.
          </p>
        }
      />
    </Lesson>
  );
}
