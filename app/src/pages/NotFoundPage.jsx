import { Link } from "react-router-dom";

export default function NotFoundPage({ message = "Halaman yang kamu cari tidak ditemukan." }) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <p className="text-5xl font-bold text-primary-800">404</p>
      <p className="mt-3 text-slate-600">{message}</p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-primary-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
      >
        Kembali ke Category
      </Link>
    </div>
  );
}
