import { useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import CategoryList from "../components/category/CategoryList";
import CategoryListSkeleton from "../components/category/CategoryListSkeleton";
import CategoryModal from "../components/category/CategoryModal";
import Button from "../components/ui/Button";
import ErrorState from "../components/ui/ErrorState";
import ServerWakeHint from "../components/ui/ServerWakeHint";
import { PlusIcon } from "../components/ui/Icons";
import { LOAD_STATUS } from "../constants/loadStatus";
import useMemoStore from "../hooks/useMemoStore";

export default function CategoryPage() {
  const { categories, categoriesStatus, categoriesError, taskCountByCategory, addCategory, loadCategories } =
    useMemoStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoading = categoriesStatus === LOAD_STATUS.IDLE || categoriesStatus === LOAD_STATUS.LOADING;

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
    return <CategoryList categories={categories} taskCountByCategory={taskCountByCategory} />;
  };

  return (
    <>
      <PageHeader
        title="Category"
        subtitle="Create or select category"
        action={
          <Button size="sm" onClick={() => setIsModalOpen(true)} disabled={isLoading}>
            <PlusIcon size={14} />
            Add Category
          </Button>
        }
      />

      <div className="mt-6">{renderContent()}</div>

      <CategoryModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={addCategory} />
    </>
  );
}
