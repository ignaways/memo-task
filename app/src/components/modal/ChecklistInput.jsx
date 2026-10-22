import { useState } from "react";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import { CloseIcon } from "../ui/Icons";
import { createId } from "../../utils/id";

export default function ChecklistInput({ id, items, onChange }) {
  const [value, setValue] = useState("");

  const addItem = () => {
    const text = value.trim();
    if (!text) return;
    onChange([...items, { id: createId(), text, done: false }]);
    setValue("");
  };

  const updateItem = (itemId, changes) =>
    onChange(items.map((item) => (item.id === itemId ? { ...item, ...changes } : item)));

  const removeItem = (itemId) => onChange(items.filter((item) => item.id !== itemId));

  return (
    <div>
      {items.length > 0 && (
        <ul className="mb-2 space-y-1.5">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => updateItem(item.id, { done: !item.done })}
                aria-label={`Tandai ${item.text}`}
                className="h-4 w-4 shrink-0 accent-primary-700"
              />
              <input
                value={item.text}
                onChange={(event) => updateItem(item.id, { text: event.target.value })}
                aria-label="Teks checklist"
                className={`min-w-0 flex-1 bg-transparent text-sm outline-none ${
                  item.done ? "text-slate-400 line-through" : "text-slate-800"
                }`}
              />
              <IconButton tone="danger" onClick={() => removeItem(item.id)} aria-label={`Hapus ${item.text}`}>
                <CloseIcon />
              </IconButton>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          id={id}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
            }
          }}
          placeholder="Tambah item to do"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
        />
        <Button variant="outline" onClick={addItem} disabled={!value.trim()}>
          Tambah
        </Button>
      </div>
    </div>
  );
}
