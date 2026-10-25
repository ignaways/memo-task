import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MemoContext } from "./MemoContext";
import { categoryService } from "../services/categoryService";
import { taskService } from "../services/taskService";
import { LOAD_STATUS } from "../constants/loadStatus";
import useToast from "../hooks/useToast";

const reorder = (tasks, id, status, beforeId) => {
  const task = tasks.find((item) => item.id === id);
  if (!task) return tasks;

  const rest = tasks.filter((item) => item.id !== id);
  let index = beforeId ? rest.findIndex((item) => item.id === beforeId) : -1;

  if (index === -1) {
    const lastIndex = rest.findLastIndex((item) => item.categoryId === task.categoryId && item.status === status);
    index = lastIndex === -1 ? rest.length : lastIndex + 1;
  }

  rest.splice(index, 0, { ...task, status });
  return rest;
};

export default function MemoProvider({ children }) {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [categoriesStatus, setCategoriesStatus] = useState(LOAD_STATUS.IDLE);
  const [categoriesError, setCategoriesError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskLoad, setTaskLoad] = useState({});
  const tasksRef = useRef(tasks);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const loadCategories = useCallback(async () => {
    setCategoriesStatus(LOAD_STATUS.LOADING);
    setCategoriesError("");
    try {
      setCategories(await categoryService.list());
      setCategoriesStatus(LOAD_STATUS.READY);
    } catch (error) {
      setCategoriesError(error.message);
      setCategoriesStatus(LOAD_STATUS.ERROR);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const loadTasks = useCallback(async (categoryId) => {
    setTaskLoad((prev) => ({
      ...prev,
      [categoryId]: { status: prev[categoryId]?.status === LOAD_STATUS.READY ? LOAD_STATUS.READY : LOAD_STATUS.LOADING, error: "" },
    }));
    try {
      const data = await taskService.listByCategory(categoryId);
      setTasks((prev) => [...prev.filter((task) => task.categoryId !== categoryId), ...data]);
      setTaskLoad((prev) => ({ ...prev, [categoryId]: { status: LOAD_STATUS.READY, error: "" } }));
    } catch (error) {
      setTaskLoad((prev) => ({ ...prev, [categoryId]: { status: LOAD_STATUS.ERROR, error: error.message } }));
    }
  }, []);

  const resync = useCallback(
    (categoryId, error) => {
      toast.error(`${error.message} Data dimuat ulang dari server.`);
      loadTasks(categoryId);
    },
    [toast, loadTasks]
  );

  const getCategory = useCallback((id) => categories.find((category) => category.id === id), [categories]);

  const addCategory = useCallback(
    async (data) => {
      const category = await categoryService.create(data);
      setCategories((prev) => [...prev, category]);
      toast.success(`Kategori "${category.name}" dibuat.`);
      return category;
    },
    [toast]
  );

  const updateCategory = useCallback(
    async (id, data) => {
      const category = await categoryService.update(id, data);
      setCategories((prev) => prev.map((item) => (item.id === id ? category : item)));
      toast.success(`Kategori "${category.name}" diperbarui.`);
      return category;
    },
    [toast]
  );

  const deleteCategory = useCallback(
    async (id) => {
      const category = categories.find((item) => item.id === id);
      await categoryService.remove(id);
      setCategories((prev) => prev.filter((item) => item.id !== id));
      setTasks((prev) => prev.filter((task) => task.categoryId !== id));
      setTaskLoad((prev) => {
        const { [id]: _removed, ...rest } = prev;
        return rest;
      });
      toast.success(`Kategori "${category?.name ?? ""}" dihapus.`);
    },
    [categories, toast]
  );

  const addTask = useCallback(async (categoryId, data) => {
    const task = await taskService.create(categoryId, data);
    setTasks((prev) => [...prev, task]);
    return task;
  }, []);

  const updateTask = useCallback(async (id, data) => {
    const task = await taskService.update(id, data);
    setTasks((prev) => prev.map((item) => (item.id === id ? task : item)));
    return task;
  }, []);

  const deleteTask = useCallback(
    async (id) => {
      const task = tasksRef.current.find((item) => item.id === id);
      if (!task) return;
      setTasks((prev) => prev.filter((item) => item.id !== id));
      try {
        await taskService.remove(id);
      } catch (error) {
        resync(task.categoryId, error);
      }
    },
    [resync]
  );

  const moveTask = useCallback(
    async (id, status, beforeId = null) => {
      const task = tasksRef.current.find((item) => item.id === id);
      if (!task) return;
      setTasks((prev) => reorder(prev, id, status, beforeId));
      try {
        await taskService.move(id, status, beforeId);
      } catch (error) {
        resync(task.categoryId, error);
      }
    },
    [resync]
  );

  const toggleChecklistItem = useCallback(
    async (taskId, itemId) => {
      const task = tasksRef.current.find((item) => item.id === taskId);
      const item = task?.checklist.find((entry) => entry.id === itemId);
      if (!item) return;

      const done = !item.done;
      setTasks((prev) =>
        prev.map((entry) =>
          entry.id === taskId
            ? { ...entry, checklist: entry.checklist.map((check) => (check.id === itemId ? { ...check, done } : check)) }
            : entry
        )
      );
      try {
        await taskService.toggleChecklistItem(taskId, itemId, done);
      } catch (error) {
        resync(task.categoryId, error);
      }
    },
    [resync]
  );

  const taskCountByCategory = useMemo(() => {
    const loadedCounts = tasks.reduce((acc, task) => {
      acc[task.categoryId] = (acc[task.categoryId] || 0) + 1;
      return acc;
    }, {});

    return Object.fromEntries(
      categories.map((category) => [
        category.id,
        taskLoad[category.id]?.status === LOAD_STATUS.READY ? loadedCounts[category.id] || 0 : category.taskCount,
      ])
    );
  }, [categories, tasks, taskLoad]);

  const value = useMemo(
    () => ({
      categories,
      categoriesStatus,
      categoriesError,
      tasks,
      taskLoad,
      taskCountByCategory,
      loadCategories,
      loadTasks,
      getCategory,
      addCategory,
      updateCategory,
      deleteCategory,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      toggleChecklistItem,
    }),
    [
      categories,
      categoriesStatus,
      categoriesError,
      tasks,
      taskLoad,
      taskCountByCategory,
      loadCategories,
      loadTasks,
      getCategory,
      addCategory,
      updateCategory,
      deleteCategory,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      toggleChecklistItem,
    ]
  );

  return <MemoContext.Provider value={value}>{children}</MemoContext.Provider>;
}
