import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableTaskCard from "./SortableTaskCard";
import EmptyColumn from "./EmptyColumn";
import { toColumnId } from "../../constants/dnd";

export default function Column({
  column,
  taskIds,
  taskMap,
  isHighlighted,
  isFiltering,
  onMove,
  onEdit,
  onDelete,
  onToggleChecklist,
}) {
  const { setNodeRef } = useDroppable({ id: toColumnId(column.id) });
  const tasks = taskIds.map((id) => taskMap.get(id)).filter(Boolean);

  return (
    <section
      aria-label={column.title}
      className={`flex min-h-96 flex-col rounded-2xl p-3 transition duration-200 ${
        isHighlighted ? `${column.soft} ring-2 ${column.ring}` : "bg-slate-100"
      }`}
    >
      <header className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${column.dot}`} />
          <h2 className="text-sm font-semibold text-slate-800">{column.title}</h2>
        </div>
        <span
          key={tasks.length}
          className="animate-pop-in rounded-md bg-white px-2 py-0.5 text-xs font-medium text-slate-500"
        >
          {tasks.length}
        </span>
      </header>

      <SortableContext id={column.id} items={taskIds} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex min-h-24 flex-1 flex-col gap-3">
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onMove={onMove}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleChecklist={onToggleChecklist}
            />
          ))}
          {tasks.length === 0 && <EmptyColumn isFiltering={isFiltering} />}
        </div>
      </SortableContext>
    </section>
  );
}
