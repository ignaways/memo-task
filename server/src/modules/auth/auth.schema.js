import { z } from "zod";

const email = z
  .string({ error: "Email wajib diisi." })
  .trim()
  .toLowerCase()
  .max(254, "Email terlalu panjang.")
  .pipe(z.email("Format email tidak valid."));

export const registerSchema = z.object({
  name: z.string({ error: "Nama wajib diisi." }).trim().min(1, "Nama wajib diisi.").max(80, "Nama maksimal 80 karakter."),
  email,
  password: z
    .string({ error: "Password wajib diisi." })
    .min(8, "Password minimal 8 karakter.")
    .max(72, "Password maksimal 72 karakter."),
});

export const loginSchema = z.object({
  email,
  password: z.string({ error: "Password wajib diisi." }).min(1, "Password wajib diisi."),
});
