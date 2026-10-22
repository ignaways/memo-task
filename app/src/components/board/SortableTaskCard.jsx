import { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";
import { REMOVE_DURATION, SORTABLE_TRANSITION } from "../../constants/dnd";

export default function SortableTaskCard({ task, onDelete, ...props }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    transition: SORTABLE_TRANSITION,
    attributes: { roleDescription: "task" },
  });

  const [isEntering, setIsEntering] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const removeTimer = useRef(null);

  useEffect(() => () => clearTimeout(removeTimer.current), []);

  const handleDelete = (id) => {
    setIsRemoving(true);
    removeTimer.current = setTimeout(() => onDelete(id), REMOVE_DURATION);
  };

  const { onKeyDown, ...pointerListeners } = listeners ?? {};

  const dragProps = {
    ...attributes,
    ...pointerListeners,
    onKeyDown: (event) => {
      if (event.target === event.currentTarget) onKeyDown?.(event);
    },
  };

  return (
    <TaskCard
      task={task}
      nodeRef={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      dragProps={dragProps}
      isPlaceholder={isDragging}
      isEntering={isEntering}
      isRemoving={isRemoving}
      onAnimationEnd={() => setIsEntering(false)}
      onDelete={handleDelete}
      {...props}
    />
  );
}
