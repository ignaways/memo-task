import { useEffect, useMemo } from "react";
import useMemoStore from "./useMemoStore";
import { STATUS } from "../constants/columns";
import { LOAD_STATUS } from "../constants/loadStatus";

export default function useCategoryTasks(categoryId) {
  const { tasks, taskLoad, loadTasks } = useMemoStore();

  useEffect(() => {
    loadTasks(categoryId);
  }, [categoryId, loadTasks]);

  const categoryTasks = useMemo(() => tasks.filter((task) => task.categoryId === categoryId), [tasks, categoryId]);

  const allTags = useMemo(
    () => [...new Set(categoryTasks.flatMap((task) => task.tags))].sort((a, b) => a.localeCompare(b)),
    [categoryTasks]
  );

  const stats = useMemo(() => {
    const total = categoryTasks.length;
    const done = categoryTasks.filter((task) => task.status === STATUS.COMPLETE).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    return { total, done, percent };
  }, [categoryTasks]);

  const load = taskLoad[categoryId] ?? { status: LOAD_STATUS.LOADING, error: "" };

  return {
    tasks: categoryTasks,
    allTags,
    stats,
    status: load.status,
    error: load.error,
    reload: () => loadTasks(categoryId),
  };
}
