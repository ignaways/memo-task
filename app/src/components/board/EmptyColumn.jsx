import useTranslation from "../../hooks/useTranslation";

export default function EmptyColumn({ isFiltering }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-stone-300 p-6 text-center text-sm text-stone-400">
      {isFiltering ? t("board.emptyFiltered") : t("board.emptyColumn")}
    </div>
  );
}
