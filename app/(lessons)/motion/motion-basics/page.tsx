import { Lesson } from "@/components/lesson/Lesson";
import { Demo } from "@/components/lesson/Demo";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { VueComparison } from "@/components/lesson/VueComparison";
import { Exercise } from "@/components/lesson/Exercise";
import { ToggleBoxDemo } from "./ToggleBoxDemo";

export default function Page() {
  return (
    <Lesson track="motion" slug="motion-basics" title="motion.div & the Framer Motion → Motion Rename">
      <p>
        If you searched for &quot;Framer Motion,&quot; you&apos;re in the right place — the
        library was rebranded from <code>framer-motion</code> to plain <code>motion</code>{" "}
        somewhere around v11/v12. The API you already know is almost entirely unchanged; what
        changed is the package name and the import path. This repo installs the{" "}
        <code>motion</code> package, and every React import in this Track (and in all Motion Track
        code you&apos;ll write) goes through the framework-specific entry point:
      </p>
      <CodeBlock
        filename="the rename, concretely"
        code={`
// ❌ old package, no longer what you install
import { motion } from "framer-motion"

// ✅ this repo: the "motion" package's React entry point
import { motion, AnimatePresence } from "motion/react"
`}
      />
      <p>
        Why a dedicated <code>motion/react</code> subpath instead of just <code>motion</code>?
        The <code>motion</code> package is now framework-agnostic at its core (there&apos;s also a
        vanilla-JS &quot;mini&quot; animation engine and a Vue-flavored build under the hood) —{" "}
        <code>motion/react</code> is the entry point that wires that engine up to React&apos;s
        component model, hooks, and lifecycle. Everywhere else in this Track, assume{" "}
        <code>from &quot;motion/react&quot;</code>.
      </p>
      <p>
        With the naming out of the way: <code>motion.div</code> (and <code>motion.span</code>,{" "}
        <code>motion.li</code>, <code>motion.svg</code>, ...) is a drop-in replacement for the
        plain HTML tag that additionally understands a handful of animation props. Instead of
        toggling a CSS class and letting a <code>transition:</code> rule interpolate the change,
        you hand Motion a target style object directly, and its own JS-driven animation engine
        (spring physics by default, not CSS keyframes) tweens every render towards it.
      </p>
      <CodeBlock
        filename="the three props that matter"
        code={`
<motion.div
  initial={{ opacity: 0 }}       // style on first mount
  animate={{ opacity: 1 }}       // style to animate towards, any time it changes
  transition={{ duration: 0.3 }} // how to get there (or a spring config)
/>
`}
      />
      <p>
        Critically, <code>animate</code> isn&apos;t a one-shot mount effect — it&apos;s value
        that Motion diffs on every render. Change the object you pass (by changing state, as
        below), and Motion smoothly interpolates from wherever the element currently is to the new
        target, cancelling any in-flight animation and re-starting from the current values. No
        manual <code>useEffect</code>, no imperative <code>.animate()</code> calls, no CSS
        transition classes to keep in sync with component state.
      </p>
      <Demo title="a motion.div animating scale, rotation, and color off state">
        <ToggleBoxDemo />
      </Demo>
      <CodeBlock
        filename="app/(lessons)/motion/motion-basics/ToggleBoxDemo.tsx (excerpt)"
        code={`
import { motion } from "motion/react"

const [active, setActive] = useState(false)

<motion.div
  animate={{
    scale: active ? 1.2 : 1,
    rotate: active ? 45 : 0,
    backgroundColor: active ? "#059669" : "#3b82f6",
  }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
/>
`}
      />
      <VueComparison>
        Vue&apos;s built-in answer is the <code>&lt;Transition&gt;</code> component plus CSS
        transition/animation classes (<code>*-enter-active</code>, <code>*-leave-to</code>, etc.)
        — you toggle a class, CSS does the interpolation. <code>@vueuse/motion</code> gets closer
        to Motion&apos;s declarative feel, letting you bind a <code>v-motion</code> directive to
        named states. But the deeper difference isn&apos;t syntax: Vue&apos;s default approach is{" "}
        <strong>CSS-class-driven</strong> (the browser&apos;s CSS engine owns the interpolation),
        while Motion&apos;s <code>animate</code> prop is <strong>JS-driven</strong> — an actual
        spring-physics simulation runs on every frame, which is why properties like{" "}
        <code>stiffness</code>/<code>damping</code> exist at all and why Motion can smoothly
        redirect mid-animation when the target changes again before the first animation finishes.
      </VueComparison>
      <Exercise
        prompt={
          <p>
            The demo&apos;s <code>transition</code> uses <code>type: &quot;spring&quot;</code>{" "}
            with <code>stiffness</code>/<code>damping</code> instead of a CSS-style{" "}
            <code>duration</code>. Why might a spring, rather than a fixed duration, be the better
            default for something the user can click repeatedly (like this toggle button)?
          </p>
        }
        solution={
          <p>
            A duration-based tween always plays out over its full fixed time, even if it&apos;s
            interrupted mid-flight by another click — it either snaps or restarts awkwardly. A
            spring instead models real velocity: if you click again before the box settles, Motion
            retargets the spring from its <em>current</em> position and velocity, so the motion
            stays continuous and feels physically responsive no matter how fast you click, rather
            than visibly jumping or resetting.
          </p>
        }
      />
    </Lesson>
  );
}
