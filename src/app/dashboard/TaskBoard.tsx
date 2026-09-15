"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUrgency, URGENCY_META, Urgency } from "@/lib/urgency";
import { getTaskAvatar } from "@/lib/avatar";

type Task = {
  id: string;
  title: string;
  status: string;
  dueDate: string | null;
  notes: string | null;
};

const URGENCY_ORDER: Urgency[] = ["overdue", "today", "upcoming", "later", "none"];

export default function TaskBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTitle, setNewTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [filterUrgency, setFilterUrgency] = useState<Urgency | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  async function addTask() {
    if (!newTitle.trim()) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, dueDate: newDueDate || null }),
    });
    const task = await res.json();
    setTasks([task, ...tasks]);
    setNewTitle("");
    setNewDueDate("");
  }

  async function toggleDone(id: string, currentStatus: string) {
    const status = currentStatus === "done" ? "todo" : "done";
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function deleteTask(id: string) {
    setTasks(tasks.filter((t) => t.id !== id));
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  }

  async function saveNote(id: string) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, notes: noteDraft } : t)));
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: noteDraft }),
    });
    setExpandedId(null);
  }

  function openNote(task: Task) {
    if (expandedId === task.id) {
      setExpandedId(null);
    } else {
      setExpandedId(task.id);
      setNoteDraft(task.notes || "");
    }
  }

  const incomplete = useMemo(() => {
    return tasks
      .filter((t) => t.status !== "done")
      .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
      .filter((t) => filterUrgency === "all" || getUrgency(t.dueDate) === filterUrgency);
  }, [tasks, search, filterUrgency]);

  const grouped = URGENCY_ORDER.map((urgency) => ({
    urgency,
    items: incomplete.filter((t) => getUrgency(t.dueDate) === urgency),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task..."
          className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-neutral-200 outline-none focus:border-neutral-400 transition-colors shadow-sm text-sm"
        />
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-white border border-neutral-200 outline-none focus:border-neutral-400 transition-colors shadow-sm text-sm text-neutral-600"
        />
        <button
          onClick={addTask}
          className="px-5 py-2.5 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-700 transition text-sm shadow-sm"
        >
          Add
        </button>
      </div>

      <div className="flex gap-2 mb-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="flex-1 px-4 py-2 rounded-lg bg-white/70 border border-neutral-200 outline-none focus:border-neutral-400 transition-colors text-sm"
        />
        <select
          value={filterUrgency}
          onChange={(e) => setFilterUrgency(e.target.value as Urgency | "all")}
          className="px-3 py-2 rounded-lg bg-white/70 border border-neutral-200 outline-none focus:border-neutral-400 transition-colors text-sm text-neutral-600"
        >
          <option value="all">All</option>
          {URGENCY_ORDER.map((u) => (
            <option key={u} value={u}>
              {URGENCY_META[u].label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {incomplete.length === 0 && (
          <p className="text-neutral-400 text-sm p-8 text-center">
            {tasks.filter((t) => t.status !== "done").length === 0
              ? "Nothing pending. Add a task above to get started."
              : "No tasks match your search/filter."}
          </p>
        )}

        <AnimatePresence>
          {grouped.map((group) => (
            <motion.div
              key={group.urgency}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="px-5 py-2.5 bg-neutral-50 border-b border-neutral-200">
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  {URGENCY_META[group.urgency].label} · {group.items.length}
                </span>
              </div>

              <AnimatePresence initial={false}>
                {group.items.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-neutral-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 transition-colors group">
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => toggleDone(task.id, task.status)}
                        className="h-4 w-4 rounded border-neutral-300 accent-neutral-900 cursor-pointer"
                      />

                      <motion.span
                        whileHover={{ scale: 1.2, rotate: -8 }}
                        className="text-lg leading-none select-none"
                        title="Task avatar"
                      >
                        {getTaskAvatar(task.id)}
                      </motion.span>

                      <button
                        onClick={() => openNote(task)}
                        className="flex-1 text-left text-sm text-neutral-800 hover:underline decoration-neutral-300 underline-offset-2"
                      >
                        {task.title}
                        {task.notes && <span className="ml-2 text-neutral-300">📝</span>}
                      </button>

                      <span
                        className={`text-xs px-2.5 py-1 rounded-full ${URGENCY_META[group.urgency].badge}`}
                      >
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })
                          : "No date"}
                      </span>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-xs text-neutral-400 hover:text-red-500 transition"
                      >
                        Delete
                      </button>
                    </div>

                    <AnimatePresence>
                      {expandedId === task.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-neutral-50 px-5"
                        >
                          <div className="py-3">
                            <textarea
                              value={noteDraft}
                              onChange={(e) => setNoteDraft(e.target.value)}
                              placeholder="Add a note..."
                              rows={3}
                              className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm outline-none focus:border-neutral-400 resize-none"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                onClick={() => setExpandedId(null)}
                                className="text-xs text-neutral-500 hover:text-neutral-700 px-3 py-1.5"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => saveNote(task.id)}
                                className="text-xs bg-neutral-900 text-white px-3 py-1.5 rounded-lg hover:bg-neutral-700 transition"
                              >
                                Save note
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}