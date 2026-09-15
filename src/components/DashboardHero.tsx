"use client";

import { motion } from "framer-motion";
import { getUrgency, URGENCY_META } from "@/lib/urgency";

type Task = {
  id: string;
  title: string;
  status: string;
  dueDate: string | null;
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "GOOD MORNING";
  if (hour < 18) return "GOOD AFTERNOON";
  return "GOOD EVENING";
}

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  overdue: { label: "High", color: "bg-red-500 text-white" },
  today: { label: "High", color: "bg-orange-500 text-white" },
  upcoming: { label: "Medium", color: "bg-amber-400 text-neutral-900" },
  later: { label: "Low", color: "bg-blue-400 text-white" },
  none: { label: "Low", color: "bg-neutral-300 text-neutral-800" },
};

export default function DashboardHero({ name, tasks }: { name: string; tasks: Task[] }) {
  const incomplete = tasks.filter((t) => t.status !== "done");
  const featured = incomplete.slice(0, 2);

  return (
    <div className="relative mb-12">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-end justify-between flex-wrap gap-6"
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400 mb-2">
            {getGreeting()}
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 leading-[0.95]">
            {name},<br />focus in.
          </h1>
        </div>

        <div className="rounded-2xl bg-neutral-900 text-white px-6 py-4 shadow-lg">
          <p className="text-3xl font-bold">{incomplete.length}</p>
          <p className="text-xs text-neutral-400 mt-0.5">
            task{incomplete.length === 1 ? "" : "s"} left
          </p>
        </div>
      </motion.div>

      {featured.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {featured.map((task) => {
            const urgency = getUrgency(task.dueDate);
            const priority = PRIORITY_MAP[urgency];
            return (
              <div
                key={task.id}
                className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priority.color}`}
                  >
                    {priority.label}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${URGENCY_META[urgency].badge}`}>
                    {URGENCY_META[urgency].label}
                  </span>
                </div>
                <p className="text-sm font-medium text-neutral-800">{task.title}</p>
                {task.dueDate && (
                  <p className="text-xs text-neutral-400 mt-1">
                    Due {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </p>
                )}
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}