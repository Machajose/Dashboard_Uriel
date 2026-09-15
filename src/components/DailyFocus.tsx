"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function todayKey() {
  return `daily-focus-${new Date().toDateString()}`;
}

export default function DailyFocus() {
  const [focus, setFocus] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(todayKey());
    setFocus(saved);
    setReady(true);
  }, []);

  function commit() {
    if (!draft.trim()) return;
    localStorage.setItem(todayKey(), draft);
    setFocus(draft);
  }

  if (!ready) return null;

  return (
    <div className="mb-8">
      <AnimatePresence mode="wait">
        {focus ? (
          <motion.div
            key="set"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-neutral-200 bg-white/80 px-5 py-3 flex items-center gap-3 shadow-sm"
          >
            <span className="text-lg">🎯</span>
            <p className="text-sm text-neutral-700">
              Today&apos;s focus: <span className="font-medium text-neutral-900">{focus}</span>
            </p>
            <button
              onClick={() => setFocus(null)}
              className="ml-auto text-xs text-neutral-400 hover:text-neutral-600"
            >
              Change
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-neutral-200 bg-white/80 px-5 py-3 flex items-center gap-3 shadow-sm"
          >
            <span className="text-lg">🎯</span>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commit()}
              placeholder="What's the one thing you want to get done today?"
              className="flex-1 text-sm outline-none bg-transparent placeholder:text-neutral-400"
              autoFocus
            />
            <button
              onClick={commit}
              className="text-xs bg-neutral-900 text-white px-3 py-1.5 rounded-lg hover:bg-neutral-700 transition"
            >
              Commit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}