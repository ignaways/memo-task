import { useEffect, useRef, useState } from "react";
import Modal from "../modal/Modal";
import FormField, { inputClass } from "../ui/FormField";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

export default function CategoryModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    setName("");
    setDescription("");
    setErrors({});
    setMessage("");
    setSaving(false);
    const timer = setTimeout(() => nameRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setErrors({ name: "Nama kategori wajib diisi." });
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
      onClose();
    } catch (error) {
      setErrors(error.fieldErrors?.() ?? {});
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Kategori baru" subtitle="Kelompokkan task berdasarkan kategori.">
      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <Alert>{message}</Alert>

        <FormField id="category-name" label="Nama kategori" error={errors.name}>
          <input
            id="category-name"
            ref={nameRef}
            value={name}
            maxLength={80}
            onChange={(event) => {
              setName(event.target.value);
              if (errors.name) setErrors({});
            }}
            placeholder="Contoh: Perkuliahan"
            aria-invalid={Boolean(errors.name)}
            className={`${inputClass} ${errors.name ? "border-rose-400" : ""}`}
          />
        </FormField>

        <FormField id="category-description" label="Deskripsi" hint="(opsional)" error={errors.description}>
          <input
            id="category-description"
            value={description}
            maxLength={200}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Contoh: Task semester ganjil 2026/2027"
            className={inputClass}
          />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Spinner size={16} />}
            {saving ? "Menyimpan..." : "Simpan kategori"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
