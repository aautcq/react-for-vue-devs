"use client";

import { useState } from "react";
import { motion } from "motion/react";

/**
 * A single motion.div driven purely by declarative "animate" props — no
 * CSS transition classes, no imperative style wiring.
 */
export function ToggleBoxDemo() {
  const [active, setActive] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{
          scale: active ? 1.2 : 1,
          rotate: active ? 45 : 0,
          backgroundColor: active ? "#059669" : "#3b82f6",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="h-16 w-16 rounded-xl"
      />
      <button
        type="button"
        onClick={() => setActive((a) => !a)}
        className="rounded-lg border border-black/[.08] px-3 py-1.5 text-sm font-medium hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.04]"
      >
        Toggle
      </button>
    </div>
  );
}
