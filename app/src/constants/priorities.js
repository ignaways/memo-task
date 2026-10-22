export const PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export const PRIORITIES = [
  { id: PRIORITY.LOW, label: "Low", level: 1, color: "bg-emerald-500" },
  { id: PRIORITY.MEDIUM, label: "Medium", level: 2, color: "bg-amber-500" },
  { id: PRIORITY.HIGH, label: "High", level: 3, color: "bg-red-500" },
];

export const getPriority = (id) => PRIORITIES.find((priority) => priority.id === id) ?? PRIORITIES[0];
