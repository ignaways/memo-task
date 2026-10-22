import IconButton from "../ui/IconButton";
import TagChip from "../ui/TagChip";
import PriorityBadge from "../ui/PriorityBadge";
import DeadlineBadge from "../ui/DeadlineBadge";
import TaskChecklist from "./TaskChecklist";
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon } from "../ui/Icons";
import { COLUMNS, STATUS, getColumnIndex } from "../../constants/columns";

const noop = () => {};

const getStateClass = ({ isOverlay, isPlaceholder, isRemoving, isEntering }) => {
  if (isOverlay) return "cursor-grabbing border-primary-200 shadow-2xl shadow-primary-900/20 animate-lift";
  if (isPlaceholder) return "border-dashed border-primary-300 bg-primary-50 shadow-none";
  if (isRemoving) return "pointer-events-none border-slate-200 animate-card-out";
  return `cursor-grab border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md ${isEntering ? "animate-card-in" : ""}`;
};

export default function TaskCard({
  task,
  nodeRef,
  style,
  dragProps,
  isOverlay = false,
  isPlaceholder = false,
  isEntering = false,
  isRemoving = false,
  onAnimationEnd,
  onMove = noop,
  onEdit = noop,
  onDelete = noop,
  onToggleChecklist = noop,
}) {
  const index = getColumnIndex(task.status);
  const prev = COLUMNS[index - 1];
  const next = COLUMNS[index + 1];
  const isComplete = task.status === STATUS.COMPLETE;

  return (
    <article
      ref={nodeRef}
      style={style}
      {...dragProps}
      onAnimationEnd={onAnimationEnd}
      className={`group relative touch-manipulation select-none rounded-xl border bg-white p-4 transition-[box-shadow,border-color] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${getStateClass(
        { isOverlay, isPlaceholder, isRemoving, isEntering }
      )}`}
    >
      <div className={isPlaceholder ? "opacity-0" : ""}>
        <div className="flex items-center justify-between gap-2">
          <PriorityBadge priority={task.priority} />
          <div className="flex gap-0.5 md:opacity-0 md:transition md:group-hover:opacity-100 md:focus-within:opacity-100">
            <IconButton tone="primary" onClick={() => onEdit(task)} aria-label={`Edit task ${task.title}`}>
              <PencilIcon />
            </IconButton>
            <IconButton tone="danger" onClick={() => onDelete(task.id)} aria-label={`Hapus task ${task.title}`}>
              <TrashIcon />
            </IconButton>
          </div>
        </div>

        <h3
          className={`mt-2 text-sm font-semibold leading-snug text-slate-900 ${
            isComplete ? "line-through decoration-slate-400" : ""
          }`}
        >
          {task.title}
        </h3>

        {task.description && (
          <p className="mt-1.5 line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
            {task.description}
          </p>
        )}

        {task.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {task.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
        )}

        {task.checklist.length > 0 && (
          <TaskChecklist items={task.checklist} onToggle={(itemId) => onToggleChecklist(task.id, itemId)} />
        )}

        <div className="mt-4 flex items-center justify-between gap-2">
          <DeadlineBadge deadline={task.deadline} isComplete={isComplete} />
          <div className="ml-auto flex gap-1">
            <IconButton
              disabled={!prev}
              onClick={() => prev && onMove(task.id, prev.id)}
              aria-label={prev ? `Pindah ke ${prev.title}` : "Sudah di kolom pertama"}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              disabled={!next}
              onClick={() => next && onMove(task.id, next.id)}
              aria-label={next ? `Pindah ke ${next.title}` : "Sudah di kolom terakhir"}
            >
              <ChevronRightIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </article>
  );
}
