export const STATUS = {
  NEW: "new",
  PROGRESS: "progress",
  COMPLETE: "complete",
};

export const COLUMNS = [
  { id: STATUS.NEW, title: "New", dot: "bg-sky-500", ring: "ring-sky-400", soft: "bg-sky-50" },
  { id: STATUS.PROGRESS, title: "On Progress", dot: "bg-amber-500", ring: "ring-amber-400", soft: "bg-amber-50" },
  { id: STATUS.COMPLETE, title: "Complete", dot: "bg-emerald-500", ring: "ring-emerald-400", soft: "bg-emerald-50" },
];

export const getColumnIndex = (status) => COLUMNS.findIndex((column) => column.id === status);
