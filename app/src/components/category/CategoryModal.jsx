import { useEffect, useRef, useState } from "react";
import Modal from "../modal/Modal";
import FormField, { inputClass } from "../ui/FormField";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import CategoryIconTile from "./CategoryIconTile";
import CategoryIconSelect from "./CategoryIconSelect";
import CategoryColorSelect from "./CategoryColorSelect";
import { DEFAULT_CATEGORY_COLOR, DEFAULT_CATEGORY_ICON } from "../../constants/categoryIcons";

const emptyForm = { name: "", description: "", icon: DEFAULT_CATEGORY_ICON, color: DEFAULT_CATEGORY_COLOR };

export default function CategoryModal({ open, category = null, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const nameRef = useRef(null);
  const isEdit = Boolean(category);

  useEffect(() => {
    if (!open) return undefined;
    setForm(
      category
        ? { name: category.name, description: category.description, icon: category.icon, color: category.color }
        : emptyForm
    );
    setErrors({});
    setMessage("");
    setSaving(false);
    const timer = setTimeout(() => nameRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, [open, category]);

  const setField = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setErrors({ name: "Nama kategori wajib diisi." });
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await onSubmit({ ...form, name: form.name.trim(), description: form.description.trim() });
      onClose();
    } catch (error) {
      setErrors(error.fieldErrors?.() ?? {});
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={isEdit ? "Edit kategori" : "Kategori baru"}
      subtitle={isEdit ? "Ubah nama, deskripsi, ikon, atau warna." : "Kelompokkan task berdasarkan kategori."}
    >
      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <Alert>{message}</Alert>

        <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-3">
          <CategoryIconTile icon={form.icon} color={form.color} size="lg" />
          <div className="min-w-0">
            <p className="truncate font-bold text-stone-900">{form.name.trim() || "Nama kategori"}</p>
            <p className="truncate text-sm text-stone-500">{form.description.trim() || "Preview tampilan kategori"}</p>
          </div>
        </div>

        <FormField id="category-name" label="Nama kategori" error={errors.name}>
          <input
            id="category-name"
            ref={nameRef}
            value={form.name}
            maxLength={80}
            onChange={(event) => setField("name")(event.target.value)}
            placeholder="Contoh: Perkuliahan"
            aria-invalid={Boolean(errors.name)}
            className={`${inputClass} ${errors.name ? "border-rose-400" : ""}`}
          />
        </FormField>

        <FormField id="category-description" label="Deskripsi" hint="(opsional)" error={errors.description}>
          <input
            id="category-description"
            value={form.description}
            maxLength={200}
            onChange={(event) => setField("description")(event.target.value)}
            placeholder="Contoh: Task semester ganjil 2026/2027"
            className={inputClass}
          />
        </FormField>

        <FormField id="category-icon" label="Ikon" error={errors.icon}>
          <CategoryIconSelect id="category-icon" value={form.icon} onChange={setField("icon")} />
        </FormField>

        <FormField id="category-color" label="Warna ikon" error={errors.color}>
          <CategoryColorSelect id="category-color" value={form.color} onChange={setField("color")} />
        </FormField>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Spinner size={16} />}
            {saving ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Simpan kategori"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
