import CategoryCard from "./CategoryCard";

export default function CategoryList({ categories, taskCountByCategory }) {
  if (categories.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-300 p-10 text-center">
        <p className="font-medium text-slate-700">Belum ada kategori</p>
        <p className="mt-1 text-sm text-slate-500">Buat kategori pertama untuk mulai menambahkan task.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryCard category={category} taskCount={taskCountByCategory[category.id] || 0} />
        </li>
      ))}
    </ul>
  );
}
