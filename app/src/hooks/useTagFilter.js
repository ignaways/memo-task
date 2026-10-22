import { useEffect, useMemo, useState } from "react";

export default function useTagFilter(items, allTags) {
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    setSelectedTags((prev) => {
      const next = prev.filter((tag) => allTags.includes(tag));
      return next.length === prev.length ? prev : next;
    });
  }, [allTags]);

  const isAllSelected = selectedTags.length === 0;

  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      const next = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];
      return next.length === allTags.length ? [] : next;
    });
  };

  const selectAll = () => setSelectedTags([]);

  const filteredItems = useMemo(() => {
    if (isAllSelected) return items;
    return items.filter((item) => item.tags.some((tag) => selectedTags.includes(tag)));
  }, [items, selectedTags, isAllSelected]);

  const tagCounts = useMemo(
    () =>
      items.reduce((acc, item) => {
        item.tags.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {}),
    [items]
  );

  return { selectedTags, isAllSelected, toggleTag, selectAll, filteredItems, tagCounts };
}
