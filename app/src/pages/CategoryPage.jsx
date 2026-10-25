import { useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import CategoryList from "../components/category/CategoryList";
import CategoryListSkeleton from "../components/category/CategoryListSkeleton";
import CategoryModal from "../components/category/CategoryModal";
import ConfirmDialog from "../components/modal/ConfirmDialog";
import Button from "../components/ui/Button";
import ErrorState from "../components/ui/ErrorState";
import ServerWakeHint from "../components/ui/ServerWakeHint";
import { PlusIcon } from "../components/ui/Icons";
import { LOAD_STATUS } from "../constants/loadStatus";
import useMemoStore from "../hooks/useMemoStore";

export default function CategoryPage() {
  const {
    categories,
    categoriesStatus,
    categoriesError,
    taskCountByCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    loadCategories,
  } = useMemoStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const isLoading = categoriesStatus === LOAD_STATUS.IDLE || categoriesStatus === LOAD_STATUS.LOADING;

  const openCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setIsModalOpen(true);
  };

  const handleSubmit = (data) => (editing ? updateCategory(editing.id, data) : addCategory(data));

  const deletingCount = deleting ? taskCountByCategory[deleting.id] || 0 : 0;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <CategoryListSkeleton />
          <ServerWakeHint active />
        </div>
      );
    }
    if (categoriesStatus === LOAD_STATUS.ERROR) {
      return <ErrorState message={categoriesError} onRetry={loadCategories} />;
    }
    return (
      <CategoryList
        categories={categories}
        taskCountByCategory={taskCountByCategory}
        onEdit={openEdit}
        onDelete={setDeleting}
      />
    );
  };

  return (
    <>
      <PageHeader
        title="Category"
        subtitle="Create or select category"
        action={
          <Button size="sm" onClick={openCreate} disabled={isLoading}>
            <PlusIcon size={14} />
            Add Category
          </Button>
        }
      />

      <div className="mt-6">{renderContent()}</div>

      <CategoryModal
        open={isModalOpen}
        category={editing}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleteCategory(deleting.id)}
        title="Hapus kategori?"
        message={
          deletingCount > 0
            ? `Kategori "${deleting?.name}" beserta ${deletingCount} task di dalamnya akan dihapus permanen.`
            : `Kategori "${deleting?.name}" akan dihapus permanen.`
        }
      />
    </>
  );
}
