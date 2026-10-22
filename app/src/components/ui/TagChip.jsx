import { getTagColor } from "../../utils/tags";

export default function TagChip({ tag, onRemove }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${getTagColor(tag)}`}>
      #{tag}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(tag)}
          aria-label={`Hapus tag ${tag}`}
          className="rounded leading-none opacity-60 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          &times;
        </button>
      )}
    </span>
  );
}
