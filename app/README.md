# Memo Board

Aplikasi task management berbasis kategori dengan papan kanban **New**, **On Progress**, dan **Complete**. Data disimpan di server melalui REST API, sehingga tersinkron di semua perangkat.

Backend berada di repository terpisah: **memo-board-api**.

## Fitur

- Register, login, dan logout. Setiap user memiliki kategori dan task sendiri
- Halaman kategori: buat kategori dan pilih kategori untuk membuka board
- Tambah dan edit task melalui modal
- Priority task: Low, Medium, High
- Deadline dengan penanda terlambat, hari ini, dan mendekati deadline
- Checklist to do (opsional) yang bisa di-check dan uncheck langsung dari kartu
- Tag pada task dan filter berdasarkan tag
- Drag and drop antar kolom (kiri-kanan) dan antar urutan (atas-bawah) dengan animasi, mendukung mouse, layar sentuh, dan keyboard
- Optimistic update: drag and drop, centang checklist, dan hapus task langsung terlihat tanpa menunggu server. Jika server gagal, muncul notifikasi dan data dimuat ulang
- Loading skeleton, pesan error dengan tombol coba lagi, dan petunjuk saat server sedang aktif dari mode tidur
- Tombol login demo (opsional, diatur lewat environment variable)

## Tech Stack

- React 18
- React Router 7
- dnd-kit
- Vite
- Tailwind CSS v4
- Docker + Nginx (opsional)

## Menjalankan Project

Pastikan **memo-board-api** sudah berjalan di `http://localhost:4000`. Lihat README di repository API.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Buka `http://localhost:5173`.

### Environment Variable

| Variable | Keterangan |
| --- | --- |
| `VITE_API_URL` | URL API tanpa `/api`. Default `http://localhost:4000` |
| `VITE_DEMO_EMAIL` | Opsional. Jika diisi bersama `VITE_DEMO_PASSWORD`, halaman login menampilkan tombol "Masuk dengan akun demo" |
| `VITE_DEMO_PASSWORD` | Opsional |

Akun demo dibuat dengan perintah seed di API (`demo@memoboard.dev` / `demo12345`).

Variable `VITE_*` dimasukkan ke dalam bundle saat build. Jangan isi dengan data rahasia.

## Menjalankan dengan Docker

Frontend di-build dengan Node, lalu hasilnya disajikan oleh Nginx.

```bash
docker compose up -d --build
```

Buka `http://localhost:8080`. Nilai `VITE_API_URL` dan akun demo bisa diatur lewat file `.env` di folder ini, atau langsung:

```bash
VITE_API_URL=http://localhost:4000 docker compose up -d --build
```

Pastikan `CLIENT_ORIGIN` di API juga memuat `http://localhost:8080`. Nilai default di `.env.example` API sudah mencakup port 5173 dan 8080.

## Deploy

File `render.yaml` membuat Render Static Site lengkap dengan aturan rewrite untuk React Router. Panduan lengkapnya, termasuk menghubungkan CORS dengan API, ada di `docs/DEPLOYMENT.md` di repository **memo-board-api**.

## Struktur Folder

```
src/
├── components/
│   ├── auth/          AuthCard, PasswordInput, ProtectedRoute, GuestRoute
│   ├── board/         Board, Column, TaskCard, skeleton, dan lainnya
│   ├── category/      CategoryCard, CategoryList, CategoryModal
│   ├── filter/        TagFilter
│   ├── layout/        Header, Footer, Layout, FullPageLoader
│   ├── modal/         Modal, TaskModal, input checklist, tag, dan priority
│   └── ui/            Komponen dasar: Button, FormField, Spinner, Alert, dan lainnya
├── constants/
├── context/           AuthProvider, MemoProvider, ToastProvider
├── hooks/
├── pages/             CategoryPage, BoardPage, LoginPage, RegisterPage
├── services/          apiClient dan service per resource
├── utils/
├── App.jsx
├── index.css
└── main.jsx
```

### Alur Data

```
Komponen ──► hooks (useMemoStore, useAuth) ──► context provider ──► services ──► apiClient ──► API
```

- **`services/apiClient.js`** adalah satu-satunya tempat yang memanggil `fetch`. Di sini token ditambahkan ke header, response dibuka dari `{ data }`, dan error diubah menjadi `ApiError` yang membawa `code` serta error per field.
- **`AuthProvider`** memeriksa token yang tersimpan saat aplikasi dibuka, dan otomatis logout jika server mengembalikan 401.
- **`MemoProvider`** memegang state kategori dan task. Provider ini dipasang ulang setiap kali user berganti, sehingga data user sebelumnya tidak pernah tampil ke user berikutnya.
- Komponen UI tidak mengetahui dari mana data berasal. Mengganti backend hanya perlu mengubah folder `services/`.
