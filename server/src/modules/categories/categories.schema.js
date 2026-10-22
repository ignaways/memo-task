import { z } from "zod";

const name = z.string({ error: "Nama kategori wajib diisi." }).trim().min(1, "Nama kategori wajib diisi.").max(80, "Nama kategori maksimal 80 karakter.");
const description = z.string().trim().max(200, "Deskripsi maksimal 200 karakter.");

export const categoryParamsSchema = z.object({
  categoryId: z.uuid("ID kategori tidak valid."),
});

export const createCategorySchema = z.object({
  name,
  description: description.default(""),
});

export const updateCategorySchema = z
  .object({ name: name.optional(), description: description.optional() })
  .refine((value) => Object.keys(value).length > 0, "Tidak ada data yang diubah.");
