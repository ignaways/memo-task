# Referensi API

Base URL lokal: `http://localhost:4000/api`

Semua request dan response memakai JSON. Endpoint selain `/health`, `/auth/register`, dan `/auth/login` membutuhkan header:

```
Authorization: Bearer <token>
```

## Format Response

Response sukses selalu dibungkus `data`:

```json
{ "data": { } }
```

Response error selalu memakai bentuk berikut. `details` hanya muncul untuk error validasi.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data yang dikirim tidak valid.",
    "details": [{ "field": "email", "message": "Format email tidak valid." }]
  }
}
```

Endpoint `DELETE` yang berhasil mengembalikan `204 No Content` tanpa body.

## Ringkasan Endpoint

| Method | Endpoint | Auth | Keterangan |
| --- | --- | --- | --- |
| GET | `/health` | Tidak | Status server dan database |
| POST | `/auth/register` | Tidak | Membuat akun baru |
| POST | `/auth/login` | Tidak | Login dan mendapatkan token |
| GET | `/auth/me` | Ya | Profil user yang sedang login |
| GET | `/categories` | Ya | Daftar kategori milik user |
| POST | `/categories` | Ya | Membuat kategori |
| GET | `/categories/:categoryId` | Ya | Detail kategori |
| PATCH | `/categories/:categoryId` | Ya | Mengubah kategori |
| DELETE | `/categories/:categoryId` | Ya | Menghapus kategori beserta seluruh task-nya |
| GET | `/categories/:categoryId/tasks` | Ya | Daftar task dalam kategori |
| POST | `/categories/:categoryId/tasks` | Ya | Membuat task di kolom New |
| PATCH | `/tasks/:taskId` | Ya | Mengubah detail task |
| PATCH | `/tasks/:taskId/move` | Ya | Memindahkan status dan/atau urutan task |
| PATCH | `/tasks/:taskId/checklist/:itemId` | Ya | Mengubah status centang item checklist |
| DELETE | `/tasks/:taskId` | Ya | Menghapus task |

## Objek Data

### User

```json
{
  "id": "6f1c2d6e-4b0a-4f57-9e0e-8d2f6f0a1b2c",
  "name": "Ignaway",
  "email": "demo@memoboard.dev",
  "createdAt": "2026-10-22T07:30:00.000Z"
}
```

### Category

```json
{
  "id": "b2a1f0c4-8d1e-4c9a-a6f2-3e4d5c6b7a81",
  "name": "Perkuliahan",
  "description": "Task perkuliahan semester ganjil 2026/2027",
  "taskCount": 4,
  "createdAt": "2026-10-22T07:30:00.000Z",
  "updatedAt": "2026-10-22T07:30:00.000Z"
}
```

### Task

```json
{
  "id": "0d9e8f7a-6b5c-4d3e-8f2a-1b0c9d8e7f6a",
  "categoryId": "b2a1f0c4-8d1e-4c9a-a6f2-3e4d5c6b7a81",
  "title": "Tugas makalah Basis Data",
  "description": "Membahas normalisasi database sampai bentuk BCNF.",
  "status": "new",
  "priority": "high",
  "deadline": "2026-10-24",
  "tags": ["basis-data", "makalah"],
  "checklist": [
    { "id": "5a4b3c2d-1e0f-4a9b-8c7d-6e5f4a3b2c1d", "text": "Cari referensi jurnal", "done": true }
  ],
  "position": 0,
  "createdAt": "2026-10-22T07:30:00.000Z",
  "updatedAt": "2026-10-22T07:30:00.000Z"
}
```

| Field | Tipe | Aturan |
| --- | --- | --- |
| `status` | string | `new`, `progress`, atau `complete` |
| `priority` | string | `low`, `medium`, atau `high` |
| `deadline` | string \| null | Tanggal `YYYY-MM-DD`, tanpa jam dan zona waktu |
| `tags` | string[] | Maksimal 10, masing-masing maksimal 30 karakter. Otomatis huruf kecil, `#` di depan dibuang, spasi menjadi `-`, dan duplikat dihapus |
| `checklist` | object[] | Maksimal 50 item, teks maksimal 200 karakter |
| `position` | number | Urutan task di dalam kolomnya, dimulai dari 0 |

## Health

### `GET /health`

```json
{ "status": "ok", "database": "up", "uptime": 120 }
```

Mengembalikan `503` dengan `"status": "degraded"` jika database tidak bisa dihubungi.

## Auth

### `POST /auth/register`

```json
{ "name": "Ignaway", "email": "demo@memoboard.dev", "password": "demo12345" }
```

| Field | Aturan |
| --- | --- |
| `name` | Wajib, 1 sampai 80 karakter |
| `email` | Wajib, format email valid. Disimpan dalam huruf kecil |
| `password` | Wajib, 8 sampai 72 karakter |

Response `201`:

```json
{ "data": { "token": "eyJhbGciOi...", "user": { "id": "...", "name": "Ignaway", "email": "demo@memoboard.dev", "createdAt": "..." } } }
```

Error: `400 VALIDATION_ERROR`, `409 EMAIL_TAKEN`.

### `POST /auth/login`

```json
{ "email": "demo@memoboard.dev", "password": "demo12345" }
```

Response `200` sama dengan register. Error: `400 VALIDATION_ERROR`, `401 INVALID_CREDENTIALS`.

Pesan error sengaja sama untuk email yang tidak terdaftar maupun password yang salah, supaya tidak bisa dipakai untuk menebak email yang terdaftar.

### `GET /auth/me`

Response `200` berisi objek User. Error: `401 UNAUTHORIZED`, `401 INVALID_TOKEN`, `401 USER_NOT_FOUND`.

## Categories

### `GET /categories`

Response `200` berisi array Category, diurutkan dari yang paling lama dibuat.

### `POST /categories`

```json
{ "name": "Perkuliahan", "description": "Semester ganjil" }
```

| Field | Aturan |
| --- | --- |
| `name` | Wajib, 1 sampai 80 karakter |
| `description` | Opsional, maksimal 200 karakter |

Response `201` berisi Category.

### `GET /categories/:categoryId`

Response `200` berisi Category. Error: `400 VALIDATION_ERROR` jika ID bukan UUID, `404 CATEGORY_NOT_FOUND`.

### `PATCH /categories/:categoryId`

Kirim satu atau kedua field `name` dan `description`. Response `200` berisi Category terbaru.

### `DELETE /categories/:categoryId`

Response `204`. Seluruh task dan checklist di dalamnya ikut terhapus.

## Tasks

### `GET /categories/:categoryId/tasks`

Response `200` berisi array Task milik kategori tersebut, diurutkan berdasarkan `position`. Frontend mengelompokkan task per `status`, dan urutan array sudah sesuai urutan kartu di setiap kolom.

### `POST /categories/:categoryId/tasks`

```json
{
  "title": "Tugas makalah Basis Data",
  "description": "Normalisasi sampai BCNF",
  "priority": "high",
  "deadline": "2026-10-24",
  "tags": ["Basis Data", "#makalah"],
  "checklist": [{ "text": "Cari referensi" }, { "text": "Susun kerangka", "done": false }]
}
```

Hanya `title` yang wajib. Default: `priority` = `medium`, `deadline` = `null`, `tags` dan `checklist` = `[]`. Task baru selalu masuk ke kolom `new` di posisi paling bawah.

Response `201` berisi Task.

### `PATCH /tasks/:taskId`

Kirim hanya field yang ingin diubah: `title`, `description`, `priority`, `deadline` (`null` untuk menghapus), `tags`, `checklist`.

Jika `checklist` dikirim, isinya **menggantikan** seluruh checklist lama. Sertakan `id` pada item yang sudah ada agar ID-nya tetap sama, dan kirim item baru tanpa `id`.

```json
{
  "title": "Makalah final",
  "checklist": [
    { "id": "5a4b3c2d-1e0f-4a9b-8c7d-6e5f4a3b2c1d", "text": "Cari referensi jurnal", "done": true },
    { "text": "Item baru" }
  ]
}
```

Status tidak bisa diubah lewat endpoint ini. Gunakan endpoint move.

Response `200` berisi Task terbaru.

### `PATCH /tasks/:taskId/move`

Memindahkan task ke kolom dan posisi tertentu. Endpoint ini dipanggil setiap kali kartu di-drag and drop atau dipindah lewat tombol panah.

```json
{ "status": "progress", "beforeId": "id-task-yang-berada-tepat-di-bawahnya" }
```

| Field | Keterangan |
| --- | --- |
| `status` | Kolom tujuan |
| `beforeId` | ID task yang akan berada tepat di **bawah** task yang dipindah. Isi `null` atau jangan dikirim untuk menaruh task di paling bawah kolom |

Posisi ditentukan relatif terhadap task lain, bukan berdasarkan index. Dengan begitu hasilnya tetap benar walaupun frontend sedang menampilkan board yang difilter tag. Jika `beforeId` tidak ditemukan di kolom tujuan, task ditaruh di paling bawah.

Response `200` berisi Task yang dipindah. Error: `400 INVALID_POSITION` jika `beforeId` sama dengan `taskId`.

### `PATCH /tasks/:taskId/checklist/:itemId`

```json
{ "done": true }
```

Response `200`:

```json
{ "data": { "id": "5a4b3c2d-...", "text": "Cari referensi jurnal", "done": true } }
```

Error: `404 CHECKLIST_ITEM_NOT_FOUND`.

### `DELETE /tasks/:taskId`

Response `204`. Error: `404 TASK_NOT_FOUND`.

## Kode Error

| HTTP | Code | Arti |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Body, parameter, atau query tidak lolos validasi. Lihat `details` |
| 400 | `INVALID_JSON` | Body bukan JSON yang valid |
| 400 | `INVALID_POSITION` | Parameter move tidak masuk akal |
| 401 | `UNAUTHORIZED` | Header Authorization tidak ada |
| 401 | `INVALID_TOKEN` | Token salah atau kedaluwarsa |
| 401 | `INVALID_CREDENTIALS` | Email atau password salah |
| 401 | `USER_NOT_FOUND` | Token valid tetapi akunnya sudah tidak ada |
| 404 | `CATEGORY_NOT_FOUND`, `TASK_NOT_FOUND`, `CHECKLIST_ITEM_NOT_FOUND` | Data tidak ada atau bukan milik user |
| 404 | `ROUTE_NOT_FOUND` | Endpoint tidak ada |
| 409 | `EMAIL_TAKEN` | Email sudah terdaftar |
| 413 | `PAYLOAD_TOO_LARGE` | Body lebih dari 100 KB |
| 429 | `TOO_MANY_REQUESTS` | Melebihi rate limit |
| 500 | `INTERNAL_ERROR` | Kesalahan tak terduga di server |

Data milik user lain selalu dibalas `404`, bukan `403`, supaya keberadaan data tersebut tidak terungkap.

## Rate Limit

| Cakupan | Batas |
| --- | --- |
| Semua endpoint `/api` | 300 request per menit per IP |
| `POST /auth/register` dan `POST /auth/login` | 20 request per 15 menit per IP |

Informasi sisa kuota dikirim lewat header `RateLimit` dan `RateLimit-Policy`.

## Contoh dengan curl

```bash
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@memoboard.dev","password":"demo12345"}' | jq -r .data.token)

curl -s http://localhost:4000/api/categories -H "Authorization: Bearer $TOKEN" | jq
```
