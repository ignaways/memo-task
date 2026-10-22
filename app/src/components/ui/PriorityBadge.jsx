import PriorityIcon from "./PriorityIcon";
import { getPriority } from "../../constants/priorities";

export default function PriorityBadge({ priority }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
      <PriorityIcon priority={priority} />
      {getPriority(priority).label}
    </span>
  );
}
