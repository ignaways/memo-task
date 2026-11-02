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
import useTranslation from "../../hooks/useTranslation";

const emptyForm = { name: "", description: "", icon: DEFAULT_CATEGORY_ICON, color: DEFAULT_CATEGORY_COLOR };

export default function CategoryModal({ open, category = null, onClose, onSubmit }) {
  const { t } = useTranslation();
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
      setErrors({ name: t("category.modal.nameRequired") });
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
      title={isEdit ? t("category.modal.editTitle") : t("category.modal.newTitle")}
      subtitle={isEdit ? t("category.modal.editSubtitle") : t("category.modal.newSubtitle")}
    >
      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <Alert>{message}</Alert>

        <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-3">
          <CategoryIconTile icon={form.icon} color={form.color} size="lg" />
          <div className="min-w-0">
            <p className="truncate font-bold text-stone-900">{form.name.trim() || t("category.modal.previewName")}</p>
            <p className="truncate text-sm text-stone-500">{form.description.trim() || t("category.modal.previewDescription")}</p>
          </div>
        </div>

        <FormField id="category-name" label={t("category.modal.name")} error={errors.name}>
          <input
            id="category-name"
            ref={nameRef}
            value={form.name}
            maxLength={80}
            onChange={(event) => setField("name")(event.target.value)}
            placeholder={t("category.modal.namePlaceholder")}
            aria-invalid={Boolean(errors.name)}
            className={`${inputClass} ${errors.name ? "border-rose-400" : ""}`}
          />
        </FormField>

        <FormField id="category-description" label={t("category.modal.description")} hint={t("common.optional")} error={errors.description}>
          <input
            id="category-description"
            value={form.description}
            maxLength={200}
            onChange={(event) => setField("description")(event.target.value)}
            placeholder={t("category.modal.descriptionPlaceholder")}
            className={inputClass}
          />
        </FormField>

        <FormField id="category-icon" label={t("category.modal.icon")} error={errors.icon}>
          <CategoryIconSelect id="category-icon" value={form.icon} onChange={setField("icon")} />
        </FormField>

        <FormField id="category-color" label={t("category.modal.color")} error={errors.color}>
          <CategoryColorSelect id="category-color" value={form.color} onChange={setField("color")} />
        </FormField>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Spinner size={16} />}
            {saving ? t("common.saving") : isEdit ? t("common.saveChanges") : t("category.modal.save")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
