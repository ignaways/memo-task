import { z } from "zod";

export const CATEGORY_ICONS = [
  "book", "graduation", "briefcase", "code", "home", "heart", "cart", "star",
  "calendar", "clock", "checklist", "bookmark", "folder", "pencil", "lightbulb", "target",
  "flag", "bell", "rocket", "chart", "wallet", "gift", "music", "film",
  "gamepad", "camera", "plane", "car", "dumbbell", "utensils", "coffee", "leaf",
  "paw", "user", "users", "globe", "mail", "phone", "wrench",
];

const graphemes = new Intl.Segmenter();
const isSingleEmoji = (value) =>
  /^\p{Extended_Pictographic}/u.test(value) && [...graphemes.segment(value)].length === 1;

const name = z.string({ error: "Nama kategori wajib diisi." }).trim().min(1, "Nama kategori wajib diisi.").max(80, "Nama kategori maksimal 80 karakter.");
const description = z.string().trim().max(200, "Deskripsi maksimal 200 karakter.");
const icon = z
  .string({ error: "Ikon kategori tidak valid." })
  .trim()
  .max(30, "Ikon kategori tidak valid.")
  .refine((value) => CATEGORY_ICONS.includes(value) || isSingleEmoji(value), "Ikon harus dari daftar atau satu emoji.");
const color = z
  .string({ error: "Warna kategori tidak valid." })
  .regex(/^#[0-9a-f]{6}$/i, "Warna harus berformat hex, contoh #f59e0b.")
  .transform((value) => value.toLowerCase());

export const categoryParamsSchema = z.object({
  categoryId: z.uuid("ID kategori tidak valid."),
});

export const createCategorySchema = z.object({
  name,
  description: description.default(""),
  icon: icon.default("book"),
  color: color.default("#f59e0b"),
});

export const updateCategorySchema = z
  .object({ name: name.optional(), description: description.optional(), icon: icon.optional(), color: color.optional() })
  .refine((value) => Object.keys(value).length > 0, "Tidak ada data yang diubah.");
