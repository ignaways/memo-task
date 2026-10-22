# Memo Board API

REST API untuk aplikasi **Memo Board**, task management berbasis kategori dengan papan kanban (New, On Progress, Complete). API ini menangani autentikasi, kategori, task, checklist, serta pengurutan kartu hasil drag and drop.

Frontend berada di repository terpisah: **memo-board**.

## Fitur

- Register dan login dengan email & password (password di-hash dengan bcrypt, sesi memakai JWT)
- Setiap user hanya bisa mengakses datanya sendiri
- CRUD kategori, lengkap dengan jumlah task per kategori
- CRUD task: title, description, priority, deadline, tags, dan checklist
- Pindah status dan urutan task (drag and drop kiri-kanan dan atas-bawah) secara atomik dalam transaksi
- Toggle item checklist
- Validasi input dengan Zod dan format error yang konsisten
- Rate limiting, Helmet, dan CORS yang dibatasi ke origin frontend
- Migrasi database otomatis saat container start
- Health check endpoint untuk Docker dan Render
- Tes integrasi dengan PostgreSQL sungguhan

## Tech Stack

| Bagian | Teknologi |
| --- | --- |
| Runtime | Node.js 22 |
| Framework | Express 5 |
| Database | PostgreSQL 17 (driver `pg`, SQL murni tanpa ORM) |
| Validasi | Zod 4 |
| Autentikasi | JWT (`jsonwebtoken`) + `bcryptjs` |
| Keamanan | Helmet, CORS, express-rate-limit |
| Testing | `node:test` + Supertest |
| Container | Docker, Docker Compose |
| Deploy | Render (Docker web service + Render Postgres) |

## Struktur Folder

```
memo-board-api/
├── docker/
│   └── init-test-db.sql        Membuat database tes saat container Postgres pertama kali jalan
├── docs/
│   ├── API.md                  Referensi endpoint
│   ├── DATABASE.md             Skema dan desain database
│   └── DEPLOYMENT.md           Panduan deploy ke Render
├── scripts/
│   └── seed.js                 Membuat akun demo beserta data contoh
├── src/
│   ├── config/env.js           Validasi environment variable
│   ├── db/
│   │   ├── migrations/         File migrasi SQL berurutan
│   │   ├── migrate.js          Runner migrasi (dengan advisory lock)
│   │   └── pool.js             Koneksi pool dan helper transaksi
│   ├── middlewares/            authenticate, validate, rate limiter, error handler
│   ├── modules/
│   │   ├── auth/               routes, controller, service, schema
│   │   ├── categories/
│   │   └── tasks/
│   ├── utils/                  AppError, token JWT
│   ├── app.js                  Konfigurasi Express
│   ├── routes.js               Registrasi route /api
│   └── server.js               Entry point dan graceful shutdown
├── tests/                      Tes integrasi
├── Dockerfile
├── docker-compose.yml
└── render.yaml                 Blueprint Render
```

Setiap modul memakai pola **routes → controller → service**. Route hanya mengatur middleware dan validasi, controller membentuk response HTTP, dan service berisi logika bisnis serta query database.

## Menjalankan dengan Docker (disarankan)

Yang dibutuhkan hanya Docker Desktop atau Docker Engine dengan Compose v2.

```bash
cp .env.example .env
```

Buka `.env`, lalu isi `JWT_SECRET` dengan string acak minimal 32 karakter. Salah satu cara membuatnya:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Jalankan API dan database:

```bash
docker compose up -d --build
```

API tersedia di `http://localhost:4000`. Migrasi dijalankan otomatis setiap container API start. Cek dengan:

```bash
curl http://localhost:4000/api/health
```

Isi data contoh (opsional):

```bash
docker compose exec api node scripts/seed.js
```

Setelah itu kamu bisa login dengan `demo@memoboard.dev` / `demo12345`.

### Perintah Docker yang sering dipakai

| Perintah | Fungsi |
| --- | --- |
| `docker compose watch` | Mode development: perubahan di `src/` langsung disinkronkan dan API di-restart |
| `docker compose logs -f api` | Melihat log API |
| `docker compose exec db psql -U memo -d memo_board` | Masuk ke database |
| `docker compose down` | Menghentikan container (data tetap tersimpan di volume) |
| `docker compose down -v` | Menghentikan container dan **menghapus** seluruh data database |

## Menjalankan tanpa Docker untuk API

Database tetap bisa memakai Docker, sementara API dijalankan langsung dengan Node.js 22 agar debugging lebih mudah.

```bash
docker compose up -d db
npm install
cp .env.example .env
npm run dev
```

Pastikan `DATABASE_URL` di `.env` mengarah ke `localhost:5432`. Jalankan `npm run migrate` sekali sebelum `npm run dev`, karena script `dev` tidak menjalankan migrasi.

## Environment Variable

| Variable | Wajib | Default | Keterangan |
| --- | --- | --- | --- |
| `NODE_ENV` | Tidak | `development` | `development`, `test`, atau `production` |
| `PORT` | Tidak | `4000` | Port HTTP |
| `DATABASE_URL` | Ya | | Connection string PostgreSQL |
| `DATABASE_SSL` | Tidak | `false` | Isi `true` untuk database eksternal yang mewajibkan SSL (misalnya Neon atau External URL Render) |
| `JWT_SECRET` | Ya | | Minimal 32 karakter |
| `JWT_EXPIRES_IN` | Tidak | `7d` | Masa berlaku token, format [vercel/ms](https://github.com/vercel/ms) |
| `BCRYPT_ROUNDS` | Tidak | `10` | Cost factor bcrypt (4 sampai 15) |
| `CLIENT_ORIGIN` | Tidak | `http://localhost:5173` | Origin frontend yang diizinkan CORS. Pisahkan dengan koma jika lebih dari satu |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Tidak | `memo`, `memo_password`, `memo_board` | Hanya dipakai container Postgres di Docker Compose |

Server menolak start dan menampilkan daftar variable yang salah jika konfigurasi tidak valid.

## Script npm

| Script | Fungsi |
| --- | --- |
| `npm start` | Menjalankan migrasi lalu server (dipakai di production) |
| `npm run dev` | Server dengan auto-reload (`node --watch`) |
| `npm run migrate` | Menjalankan migrasi yang belum diterapkan |
| `npm run seed` | Membuat akun demo dan data contoh (aman dijalankan berulang) |
| `npm test` | Menjalankan tes integrasi |

## Testing

Tes berjalan terhadap database PostgreSQL sungguhan supaya query, constraint, dan transaksi ikut teruji. Container Postgres dari Docker Compose otomatis membuat database `memo_board_test` saat pertama kali dibuat.

```bash
docker compose up -d db
cp .env.test.example .env.test
npm install
npm test
```

Demi keamanan, tes hanya mau berjalan jika nama database di `DATABASE_URL` mengandung kata `test`, karena seluruh tabel dikosongkan sebelum tes dimulai.

Cakupan tes saat ini (16 tes):

- Register, validasi input, email duplikat (tidak case sensitive), login, dan token tidak valid
- Isolasi data antar user (user lain mendapat 404, bukan 403, supaya keberadaan data tidak bocor)
- CRUD kategori dan task, normalisasi tag, serta penggantian checklist
- Pengurutan drag and drop: sisip di posisi tertentu, pindah kolom, dan tambah di akhir kolom
- Hapus kategori ikut menghapus task (cascade)

> Volume Postgres yang dibuat sebelum file `docker/init-test-db.sql` ada tidak akan menjalankan script itu. Buat database tes secara manual dengan `docker compose exec db createdb -U memo memo_board_test`.

## Dokumentasi Lanjutan

- [Referensi API](docs/API.md)
- [Desain Database](docs/DATABASE.md)
- [Deploy ke Render](docs/DEPLOYMENT.md)
