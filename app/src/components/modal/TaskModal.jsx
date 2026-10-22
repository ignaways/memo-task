import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import PrioritySelect from "./PrioritySelect";
import TagInput from "./TagInput";
import ChecklistInput from "./ChecklistInput";
import FormField, { inputClass } from "../ui/FormField";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { PRIORITY } from "../../constants/priorities";

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: PRIORITY.MEDIUM,
  deadline: "",
  tags: [],
  checklist: [],
};

const toForm = (task) =>
  task
    ? {
        title: task.title,
        description: task.description,
        priority: task.priority,
        deadline: task.deadline ?? "",
        tags: [...task.tags],
        checklist: task.checklist.map((item) => ({ ...item })),
      }
    : EMPTY_FORM;

export default function TaskModal({ open, task, onClose, onSubmit, tagSuggestions }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const titleRef = useRef(null);
  const isEdit = Boolean(task);

  useEffect(() => {
    if (!open) return undefined;
    setForm(toForm(task));
    setErrors({});
    setMessage("");
    setSaving(false);
    const timer = setTimeout(() => titleRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, [open, task]);

  const setField = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setErrors({ title: "Title wajib diisi." });
      titleRef.current?.focus();
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        checklist: form.checklist.map((item) => ({ ...item, text: item.text.trim() })).filter((item) => item.text),
      });
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
      title={isEdit ? "Edit task" : "Task baru"}
      subtitle={isEdit ? "Perbarui detail task." : "Task baru akan masuk ke kolom New."}
    >
      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <Alert>{message}</Alert>

        <FormField id="task-title" label="Title" error={errors.title}>
          <input
            id="task-title"
            ref={titleRef}
            value={form.title}
            maxLength={150}
            onChange={(event) => {
              setField("title")(event.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            placeholder="Contoh: Review pull request"
            aria-invalid={Boolean(errors.title)}
            className={`${inputClass} ${errors.title ? "border-rose-400" : ""}`}
          />
        </FormField>

        <FormField id="task-description" label="Description" hint="(opsional)" error={errors.description}>
          <textarea
            id="task-description"
            rows={3}
            maxLength={2000}
            value={form.description}
            onChange={(event) => setField("description")(event.target.value)}
            placeholder="Detail task"
            className={`${inputClass} resize-none`}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="task-priority" label="Priority" error={errors.priority}>
            <PrioritySelect id="task-priority" value={form.priority} onChange={setField("priority")} />
          </FormField>

          <FormField id="task-deadline" label="Deadline" hint="(opsional)" error={errors.deadline}>
            <input
              id="task-deadline"
              type="date"
              value={form.deadline}
              onChange={(event) => setField("deadline")(event.target.value)}
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField id="task-tags" label="Tags" hint="(opsional)" error={errors.tags}>
          <TagInput id="task-tags" tags={form.tags} onChange={setField("tags")} suggestions={tagSuggestions} />
        </FormField>

        <FormField id="task-checklist" label="Checklist to do" hint="(opsional)" error={errors.checklist}>
          <ChecklistInput id="task-checklist" items={form.checklist} onChange={setField("checklist")} />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Spinner size={16} />}
            {saving ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Simpan task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
