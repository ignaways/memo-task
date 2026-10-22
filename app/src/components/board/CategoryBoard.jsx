import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../layout/PageHeader";
import ProgressBar from "./ProgressBar";
import Board from "./Board";
import BoardSkeleton from "./BoardSkeleton";
import TagFilter from "../filter/TagFilter";
import TaskModal from "../modal/TaskModal";
import Button from "../ui/Button";
import ErrorState from "../ui/ErrorState";
import ServerWakeHint from "../ui/ServerWakeHint";
import { ArrowLeftIcon, PlusIcon } from "../ui/Icons";
import { LOAD_STATUS } from "../../constants/loadStatus";
import useMemoStore from "../../hooks/useMemoStore";
import useCategoryTasks from "../../hooks/useCategoryTasks";
import useTagFilter from "../../hooks/useTagFilter";

const CLOSED_MODAL = { open: false, task: null };

export default function CategoryBoard({ category }) {
  const { addTask, updateTask, deleteTask, moveTask, toggleChecklistItem } = useMemoStore();
  const { tasks, allTags, stats, status, error, reload } = useCategoryTasks(category.id);
  const filter = useTagFilter(tasks, allTags);
  const [modal, setModal] = useState(CLOSED_MODAL);

  const isLoading = status === LOAD_STATUS.LOADING;
  const openCreate = () => setModal({ open: true, task: null });
  const openEdit = (task) => setModal({ open: true, task });
  const closeModal = () => setModal(CLOSED_MODAL);

  const handleSubmit = (data) => (modal.task ? updateTask(modal.task.id, data) : addTask(category.id, data));

  const renderBoard = () => {
    if (isLoading) {
      return (
        <>
          <BoardSkeleton />
          <div className="mt-6">
            <ServerWakeHint active />
          </div>
        </>
      );
    }

    if (status === LOAD_STATUS.ERROR) {
      return (
        <div className="mt-8">
          <ErrorState message={error} onRetry={reload} />
        </div>
      );
    }

    return (
      <>
        <ProgressBar done={stats.done} total={stats.total} percent={stats.percent} />

        <TagFilter
          tags={allTags}
          tagCounts={filter.tagCounts}
          selectedTags={filter.selectedTags}
          isAllSelected={filter.isAllSelected}
          onToggle={filter.toggleTag}
          onSelectAll={filter.selectAll}
          total={tasks.length}
          shown={filter.filteredItems.length}
        />

        <Board
          tasks={filter.filteredItems}
          isFiltering={!filter.isAllSelected}
          onMove={moveTask}
          onEdit={openEdit}
          onDelete={deleteTask}
          onToggleChecklist={toggleChecklistItem}
        />
      </>
    );
  };

  return (
    <>
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1.5 rounded text-sm font-medium text-slate-500 transition hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
      >
        <ArrowLeftIcon />
        Kembali ke Category
      </Link>

      <PageHeader
        title={category.name}
        subtitle={category.description}
        action={
          <Button onClick={openCreate} disabled={isLoading || status === LOAD_STATUS.ERROR}>
            <PlusIcon />
            Add Task
          </Button>
        }
      />

      {renderBoard()}

      <TaskModal
        open={modal.open}
        task={modal.task}
        onClose={closeModal}
        onSubmit={handleSubmit}
        tagSuggestions={allTags}
      />
    </>
  );
}
