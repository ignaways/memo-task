import { Link } from "react-router-dom";
import useTranslation from "../hooks/useTranslation";

export default function NotFoundPage({ message }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <p className="text-5xl font-bold text-primary-800">404</p>
      <p className="mt-3 text-stone-600">{message ?? t("notFound.page")}</p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-primary-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400 focus-visible:ring-offset-2"
      >
        {t("notFound.back")}
      </Link>
    </div>
  );
}
