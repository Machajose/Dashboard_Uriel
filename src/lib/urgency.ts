export type Urgency = "overdue" | "today" | "upcoming" | "later" | "none";

export function getUrgency(dueDate: string | null): Urgency {
  if (!dueDate) return "none";
  const due = new Date(dueDate);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDue = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffDays = Math.round((startOfDue.getTime() - startOfToday.getTime()) / 86400000);

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays <= 3) return "upcoming";
  return "later";
}

export const URGENCY_META: Record<Urgency, { label: string; badge: string; dot: string }> = {
  overdue: { label: "Overdue", badge: "bg-red-50 text-red-600 border border-red-200", dot: "bg-red-500" },
  today: { label: "Due Today", badge: "bg-orange-50 text-orange-600 border border-orange-200", dot: "bg-orange-500" },
  upcoming: { label: "Coming Up", badge: "bg-amber-50 text-amber-600 border border-amber-200", dot: "bg-amber-400" },
  later: { label: "Later", badge: "bg-blue-50 text-blue-600 border border-blue-200", dot: "bg-blue-400" },
  none: { label: "No Due Date", badge: "bg-neutral-100 text-neutral-500 border border-neutral-200", dot: "bg-neutral-300" },
};