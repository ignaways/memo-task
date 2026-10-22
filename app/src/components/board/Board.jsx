import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import Column from "./Column";
import TaskCard from "./TaskCard";
import { COLUMNS } from "../../constants/columns";
import { DROP_ANIMATION } from "../../constants/dnd";
import useBoardDnd from "../../hooks/useBoardDnd";

export default function Board({ tasks, isFiltering, onMove, onEdit, onDelete, onToggleChecklist }) {
  const { sensors, columns, taskMap, activeTask, activeStatus, accessibility, handlers } = useBoardDnd(tasks, onMove);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} accessibility={accessibility} {...handlers}>
      <div className="mt-8 grid grid-cols-1 items-start gap-4 md:grid-cols-3">
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            column={column}
            taskIds={columns[column.id]}
            taskMap={taskMap}
            isHighlighted={activeStatus === column.id}
            isFiltering={isFiltering}
            onMove={onMove}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleChecklist={onToggleChecklist}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={DROP_ANIMATION}>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
