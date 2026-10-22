import { z } from "zod";

export const STATUSES = ["new", "progress", "complete"];
export const PRIORITIES = ["low", "medium", "high"];

const title = z.string({ error: "Title wajib diisi." }).trim().min(1, "Title wajib diisi.").max(150, "Title maksimal 150 karakter.");
const description = z.string().trim().max(2000, "Deskripsi maksimal 2000 karakter.");
const priority = z.enum(PRIORITIES, { error: "Priority harus low, medium, atau high." });
const deadline = z.iso.date("Format deadline harus YYYY-MM-DD.").nullable();

const tag = z
  .string()
  .trim()
  .toLowerCase()
  .transform((value) => value.replace(/^#/, "").replace(/\s+/g, "-"))
  .pipe(z.string().min(1, "Tag tidak boleh kosong.").max(30, "Tag maksimal 30 karakter."));

const tags = z
  .array(tag)
  .max(10, "Maksimal 10 tag per task.")
  .transform((values) => [...new Set(values)]);

const checklistItem = z.object({
  id: z.uuid().optional(),
  text: z.string().trim().min(1, "Teks checklist tidak boleh kosong.").max(200, "Teks checklist maksimal 200 karakter."),
  done: z.boolean().default(false),
});

const checklist = z.array(checklistItem).max(50, "Maksimal 50 item checklist per task.");

export const taskParamsSchema = z.object({
  taskId: z.uuid("ID task tidak valid."),
});

export const checklistItemParamsSchema = taskParamsSchema.extend({
  itemId: z.uuid("ID checklist tidak valid."),
});

export const createTaskSchema = z.object({
  title,
  description: description.default(""),
  priority: priority.default("medium"),
  deadline: deadline.default(null),
  tags: tags.default([]),
  checklist: checklist.default([]),
});

export const updateTaskSchema = z
  .object({
    title: title.optional(),
    description: description.optional(),
    priority: priority.optional(),
    deadline: deadline.optional(),
    tags: tags.optional(),
    checklist: checklist.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, "Tidak ada data yang diubah.");

export const moveTaskSchema = z.object({
  status: z.enum(STATUSES, { error: "Status harus new, progress, atau complete." }),
  beforeId: z.uuid("ID task tujuan tidak valid.").nullable().default(null),
});

export const toggleChecklistSchema = z.object({
  done: z.boolean({ error: "Field done harus boolean." }),
});
