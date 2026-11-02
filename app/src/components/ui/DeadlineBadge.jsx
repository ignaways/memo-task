import { CalendarIcon } from "./Icons";
import { formatDeadline, getDeadlineState } from "../../utils/date";
import useTranslation from "../../hooks/useTranslation";

const STYLES = {
  overdue: "bg-red-50 text-red-700",
  today: "bg-amber-50 text-amber-700",
  soon: "bg-amber-50 text-amber-700",
  upcoming: "bg-stone-100 text-stone-600",
  done: "bg-emerald-50 text-emerald-700",
};

const LABELED_STATES = ["overdue", "today"];

export default function DeadlineBadge({ deadline, isComplete }) {
  const { t, locale } = useTranslation();
  const state = getDeadlineState(deadline, isComplete);
  if (!state) return null;

  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${STYLES[state]}`}>
      <CalendarIcon />
      {formatDeadline(deadline, locale)}
      {LABELED_STATES.includes(state) && <span className="font-semibold">&middot; {t(`deadline.${state}`)}</span>}
    </span>
  );
}
