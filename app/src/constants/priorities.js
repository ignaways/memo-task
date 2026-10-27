export const PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export const PRIORITIES = [
  {
    id: PRIORITY.LOW,
    label: "Low",
    level: 1,
    color: "bg-emerald-500",
    activeClass: "border-emerald-500 bg-emerald-50 text-emerald-700",
    idleClass: "text-emerald-600 hover:border-emerald-300",
  },
  {
    id: PRIORITY.MEDIUM,
    label: "Medium",
    level: 2,
    color: "bg-amber-500",
    activeClass: "border-amber-500 bg-amber-50 text-amber-700",
    idleClass: "text-amber-600 hover:border-amber-300",
  },
  {
    id: PRIORITY.HIGH,
    label: "High",
    level: 3,
    color: "bg-red-500",
    activeClass: "border-red-500 bg-red-50 text-red-700",
    idleClass: "text-red-600 hover:border-red-300",
  },
];

export const getPriority = (id) => PRIORITIES.find((priority) => priority.id === id) ?? PRIORITIES[0];
