import PriorityIcon from "./PriorityIcon";
import { getPriority } from "../../constants/priorities";
import useTranslation from "../../hooks/useTranslation";

export default function PriorityBadge({ priority }) {
  const { t } = useTranslation();
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700">
      <PriorityIcon priority={priority} />
      {t(`priorities.${getPriority(priority).id}`)}
    </span>
  );
}
