import { prisma } from "@/lib/prisma";
import TaskBoard from "./TaskBoard";
import DashboardHero from "@/components/DashboardHero";

export default async function DashboardPage() {
  const rawTasks = await prisma.task.findMany({ orderBy: { createdAt: "desc" } });
  const tasks = rawTasks.map((t) => ({
    ...t,
    dueDate: t.dueDate ? t.dueDate.toISOString() : null,
  }));

  return (
    <div className="relative min-h-screen text-neutral-900">
      {/* Background — wide countryside farm view, swap URL for your own photo later */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=90')",
        }}
      />
      {/* Fade to a solid page color as you scroll down so the task list stays easy to read */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-neutral-50/70 to-neutral-50" />

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-10">
        <DashboardHero name="Joseph" tasks={tasks} />
        <TaskBoard initialTasks={tasks} />
      </div>
    </div>
  );
}