import { CATEGORY_ICONS, DEFAULT_CATEGORY_COLOR } from "../../constants/categoryIcons";
import { getContrastText } from "../../utils/color";

const SIZES = {
  md: { box: "h-11 w-11 rounded-lg", icon: 22, emoji: "text-2xl" },
  lg: { box: "h-14 w-14 rounded-xl", icon: 28, emoji: "text-3xl" },
};

export default function CategoryIconTile({ icon, color = DEFAULT_CATEGORY_COLOR, size = "md" }) {
  const { box, icon: iconSize, emoji } = SIZES[size];
  const preset = CATEGORY_ICONS.find((item) => item.id === icon);
  const Icon = preset?.Icon;

  return (
    <span
      className={`flex shrink-0 items-center justify-center ${box}`}
      style={{ backgroundColor: color, color: getContrastText(color) }}
      aria-hidden="true"
    >
      {Icon ? <Icon size={iconSize} /> : <span className={`leading-none ${emoji}`}>{icon || "📁"}</span>}
    </span>
  );
}
