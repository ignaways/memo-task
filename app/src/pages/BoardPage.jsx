import { useParams } from "react-router-dom";
import CategoryBoard from "../components/board/CategoryBoard";
import BoardSkeleton from "../components/board/BoardSkeleton";
import ErrorState from "../components/ui/ErrorState";
import NotFoundPage from "./NotFoundPage";
import { LOAD_STATUS } from "../constants/loadStatus";
import useMemoStore from "../hooks/useMemoStore";

export default function BoardPage() {
  const { categoryId } = useParams();
  const { getCategory, categoriesStatus, categoriesError, loadCategories } = useMemoStore();
  const category = getCategory(categoryId);

  if (!category && categoriesStatus === LOAD_STATUS.ERROR) {
    return <ErrorState message={categoriesError} onRetry={loadCategories} />;
  }

  if (!category && categoriesStatus !== LOAD_STATUS.READY) {
    return (
      <div aria-busy="true">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <BoardSkeleton />
      </div>
    );
  }

  if (!category) return <NotFoundPage message="Kategori yang kamu cari tidak ditemukan." />;

  return <CategoryBoard key={category.id} category={category} />;
}
