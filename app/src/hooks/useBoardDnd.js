import { useMemo, useState } from "react";
import { KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { COLUMNS } from "../constants/columns";
import { SENSOR_OPTIONS, fromColumnId } from "../constants/dnd";
import useTranslation from "./useTranslation";

const groupByStatus = (tasks) =>
  Object.fromEntries(
    COLUMNS.map((column) => [column.id, tasks.filter((task) => task.status === column.id).map((task) => task.id)])
  );

const findStatus = (id, columns) =>
  fromColumnId(id) ?? Object.keys(columns).find((status) => columns[status].includes(id)) ?? null;

const isBelowOverItem = (active, over) => {
  const translated = active.rect.current.translated;
  return Boolean(translated) && translated.top > over.rect.top + over.rect.height / 2;
};

export default function useBoardDnd(tasks, onMove) {
  const { t } = useTranslation();
  const sensors = useSensors(
    useSensor(MouseSensor, SENSOR_OPTIONS.mouse),
    useSensor(TouchSensor, SENSOR_OPTIONS.touch),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [activeId, setActiveId] = useState(null);
  const [dragColumns, setDragColumns] = useState(null);

  const baseColumns = useMemo(() => groupByStatus(tasks), [tasks]);
  const taskMap = useMemo(() => new Map(tasks.map((task) => [task.id, task])), [tasks]);
  const columns = dragColumns ?? baseColumns;

  const reset = () => {
    setActiveId(null);
    setDragColumns(null);
  };

  const onDragStart = ({ active }) => {
    setActiveId(active.id);
    setDragColumns(baseColumns);
  };

  const onDragOver = ({ active, over }) => {
    if (!over) return;

    setDragColumns((prev) => {
      if (!prev) return prev;

      const from = findStatus(active.id, prev);
      const to = findStatus(over.id, prev);
      if (!from || !to || from === to) return prev;

      const toItems = [...prev[to]];
      const overIndex = toItems.indexOf(over.id);
      const insertAt = overIndex === -1 ? toItems.length : overIndex + (isBelowOverItem(active, over) ? 1 : 0);
      toItems.splice(insertAt, 0, active.id);

      return {
        ...prev,
        [from]: prev[from].filter((id) => id !== active.id),
        [to]: toItems,
      };
    });
  };

  const onDragEnd = ({ active, over }) => {
    const source = dragColumns;
    reset();
    if (!over || !source) return;

    const status = findStatus(active.id, source);
    const overStatus = findStatus(over.id, source);
    if (!status || !overStatus) return;

    if (status !== overStatus) {
      onMove(active.id, overStatus, fromColumnId(over.id) ? null : over.id);
      return;
    }

    let items = source[status];
    const oldIndex = items.indexOf(active.id);
    const newIndex = fromColumnId(over.id) ? items.length - 1 : items.indexOf(over.id);
    if (newIndex !== -1 && oldIndex !== newIndex) items = arrayMove(items, oldIndex, newIndex);

    const original = taskMap.get(active.id);
    const isUnchanged = original?.status === status && baseColumns[status].join() === items.join();
    if (isUnchanged) return;

    const index = items.indexOf(active.id);
    onMove(active.id, status, items[index + 1] ?? null);
  };

  const getTitle = (id) => taskMap.get(id)?.title ?? t("board.dnd.fallbackTitle");
  const getColumnTitle = (id) => {
    const column = COLUMNS.find((item) => item.id === findStatus(id, columns));
    return column ? t(`columns.${column.id}`) : "";
  };

  const accessibility = {
    screenReaderInstructions: {
      draggable: t("board.dnd.instructions"),
    },
    announcements: {
      onDragStart: ({ active }) => t("board.dnd.start", { title: getTitle(active.id) }),
      onDragOver: ({ active, over }) =>
        over
          ? t("board.dnd.over", { title: getTitle(active.id), column: getColumnTitle(over.id) })
          : t("board.dnd.outside", { title: getTitle(active.id) }),
      onDragEnd: ({ active, over }) =>
        over
          ? t("board.dnd.end", { title: getTitle(active.id), column: getColumnTitle(over.id) })
          : t("board.dnd.endOutside", { title: getTitle(active.id) }),
      onDragCancel: ({ active }) => t("board.dnd.cancel", { title: getTitle(active.id) }),
    },
  };

  return {
    sensors,
    columns,
    taskMap,
    activeTask: activeId ? taskMap.get(activeId) : null,
    activeStatus: activeId ? findStatus(activeId, columns) : null,
    accessibility,
    handlers: { onDragStart, onDragOver, onDragEnd, onDragCancel: reset },
  };
}
