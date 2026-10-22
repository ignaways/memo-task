const DAY_IN_MS = 86400000;

export const toDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateInput = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const formatDeadline = (value) =>
  parseDateInput(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const getDeadlineState = (value, isComplete) => {
  if (!value) return null;
  if (isComplete) return "done";

  const today = parseDateInput(toDateInput(new Date()));
  const diff = Math.round((parseDateInput(value) - today) / DAY_IN_MS);

  if (diff < 0) return "overdue";
  if (diff === 0) return "today";
  if (diff <= 3) return "soon";
  return "upcoming";
};
