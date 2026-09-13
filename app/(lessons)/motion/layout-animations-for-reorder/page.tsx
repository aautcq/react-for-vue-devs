import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { ReorderingTodoList } from "./ReorderingTodoList";

export default function Page() {
  return (
    <Lesson
      track="motion"
      slug="layout-animations-for-reorder"
      title="Layout Animations for Reorder"
    >
      <p>
        Checking off a todo in this lesson&apos;s demo doesn&apos;t just toggle a class — the
        list is re-sorted so done items sink to the bottom. Ordinarily that&apos;s a jarring
        instant jump: React re-renders the <code>&lt;li&gt;</code> elements in their new DOM
        order, and the browser just... snaps them there. Animating that kind of layout change
        with plain CSS means the classic FLIP technique (First, Last, Invert, Play) — measure
        positions before and after the DOM change, then animate a compensating transform. It works,
        but it&apos;s fiddly to hand-roll and easy to get wrong.
      </p>
      <p>
        Add a single <code>layout</code> prop to a <code>motion.*</code> element and Motion does
        exactly that FLIP measurement for you, automatically, on every render where that
        element&apos;s position or size changed for any reason (reordering, a sibling being
        added/removed, a parent resizing, ...).
      </p>
      <CodeBlock filename="the whole trick" code={`<motion.li layout>{todo.text}</motion.li>`} />
      <p>
        No before/after measuring code, no manual transform math — Motion snapshots each
        element&apos;s bounding box before the render commits, compares it to the box after, and
        plays a smooth animation from the old position to the new one. Combine{" "}
        <code>layout</code> with a <code>transition</code> to control the feel (a spring, as
        below, tends to read better for reordering than a fixed-duration ease).
      </p>
      <Demo title="checking off a todo animates it sinking to the bottom of the list">
        <ReorderingTodoList />
      </Demo>
      <CodeBlock
        filename="app/(lessons)/motion/layout-animations-for-reorder/ReorderingTodoList.tsx (excerpt)"
        code={`
function toggleTodo(id: string) {
  setTodos((prev) =>
    [...prev]
      .map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
      .sort((a, b) => Number(a.done) - Number(b.done))
  )
}

<motion.li
  key={todo.id}
  layout
  transition={{ type: "spring", stiffness: 400, damping: 30 }}
>
  {todo.text}
</motion.li>
`}
      />
      <p>
        Note this is entirely orthogonal to <code>AnimatePresence</code>/<code>exit</code> from
        the previous lesson: <code>layout</code> handles items that stay mounted but move,{" "}
        <code>exit</code> handles items that leave. The two compose fine on the same element.
      </p>
      <VueComparison>
        <code>&lt;TransitionGroup&gt;</code> again gets you partway there via its{" "}
        <code>move</code> class — Vue also implements FLIP under the hood, applying a CSS{" "}
        <code>transition</code> on the <code>move</code> class when it detects an element&apos;s
        position changed between renders. The difference is who does the measuring: Vue&apos;s
        FLIP is wired through CSS transition classes and requires the element to already be using{" "}
        <code>&lt;TransitionGroup&gt;</code> for enter/leave, whereas Motion&apos;s{" "}
        <code>layout</code> prop is a standalone opt-in on any single element (no wrapping
        component required) that drives the whole measure-and-animate cycle itself via JS,
        independent of whether that element is also entering/leaving.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            If you added a <code>layout</code> prop to a <code>motion.div</code> that also has a{" "}
            transform-based <code>animate</code> prop (say, <code>animate={"{{ x: 100 }}"}</code>)
            for an unrelated hover effect, would you expect any interaction between the two, and
            why might Motion warn you to be careful here?
          </p>
        }
        solution={
          <p>
            Yes — both <code>layout</code> and a transform-based <code>animate</code> ultimately
            drive the same CSS <code>transform</code> property under the hood (Motion uses
            transforms for layout animations for performance, to avoid triggering browser
            reflow/repaint). Mixing manual transform animations with <code>layout</code> on the
            same element can fight over that one property, producing visual glitches. Motion&apos;s
            docs recommend using a wrapping element for one of the two responsibilities (e.g. put{" "}
            <code>layout</code> on an outer element and the hover transform on an inner one) when
            you need both on what&apos;s conceptually &quot;the same&quot; box.
          </p>
        }
      />
    </Lesson>
  );
}
