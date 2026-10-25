import CategoryCard from "./CategoryCard";

export default function CategoryList({ categories, taskCountByCategory, onEdit, onDelete }) {
  if (categories.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-stone-300 p-10 text-center">
        <p className="font-medium text-stone-700">Belum ada kategori</p>
        <p className="mt-1 text-sm text-stone-500">Buat kategori pertama untuk mulai menambahkan task.</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryCard
            category={category}
            taskCount={taskCountByCategory[category.id] || 0}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
