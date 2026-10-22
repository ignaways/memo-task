const PALETTE = [
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
  "bg-lime-100 text-lime-800",
  "bg-orange-100 text-orange-700",
  "bg-fuchsia-100 text-fuchsia-700",
  "bg-teal-100 text-teal-700",
  "bg-blue-100 text-blue-700",
];

export const normalizeTag = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/^#/, "")
    .replace(/\s+/g, "-");

export const getTagColor = (tag) => {
  const hash = [...tag].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PALETTE[hash % PALETTE.length];
};
