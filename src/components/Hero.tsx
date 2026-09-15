"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { MouseEvent } from "react";

const PREVIEW_ROWS = [
  { label: "Finish client site revisions", tag: "Due Today", color: "bg-orange-50 text-orange-600 border-orange-200", dot: "bg-orange-500" },
  { label: "Prep MUTMLSA meeting notes", tag: "Coming Up", color: "bg-amber-50 text-amber-600 border-amber-200", dot: "bg-amber-400" },
  { label: "Draft Hakiki pitch deck", tag: "Later", color: "bg-blue-50 text-blue-600 border-blue-200", dot: "bg-blue-400" },
];

export default function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 15 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1920&q=90')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-4xl mx-auto text-center px-8 pt-20 pb-10"
      >
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 leading-tight drop-shadow-sm">
          Your work, tracked.
          <br />
          Your progress, visible.
        </h1>
        <p className="text-neutral-700 mt-5 max-w-xl mx-auto drop-shadow-sm">
          A personal space to track tasks, log progress, and showcase what
          I&apos;m building — all in one place.
        </p>
        <Link
          href="/dashboard"
          className="inline-block mt-8 px-6 py-3 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-700 transition shadow-lg"
        >
          Open My Dashboard
        </Link>
      </motion.div>

      {/* Tile: floating, tilts toward the cursor, like a physical card */}
      <div className="relative z-10 max-w-4xl mx-auto px-8 pt-8 pb-24" style={{ perspective: 1200 }}>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-2xl border border-neutral-200 bg-white shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 bg-neutral-50">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
              <span className="ml-3 text-xs text-neutral-400">my-dashboard</span>
            </div>
            <div className="p-6 space-y-3 text-left">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm font-medium text-neutral-800 mb-2"
              >
                Good afternoon, Joseph
              </motion.div>

              {PREVIEW_ROWS.map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.15, duration: 0.4, ease: "easeOut" }}
                  whileHover={{ scale: 1.02, backgroundColor: "#f5f5f5" }}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-neutral-100 bg-neutral-50 cursor-default"
                >
                  <span className="text-sm text-neutral-700">{row.label}</span>
                  <span
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${row.color}`}
                  >
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                      className={`h-1.5 w-1.5 rounded-full ${row.dot}`}
                    />
                    {row.tag}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}