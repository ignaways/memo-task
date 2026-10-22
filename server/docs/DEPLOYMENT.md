# Deploy ke Render

Arsitektur production:

```
Browser ──► memo-board (Render Static Site)
   │
   └──── fetch + Bearer token ──► memo-board-api (Render Web Service, Docker)
                                          │
                                          └──► memo-board-db (Render Postgres)
```

Frontend dan API ada di dua repository terpisah, jadi masing-masing di-deploy sendiri. API dan database dibuat sekaligus lewat file `render.yaml` (Render Blueprint) di repository ini.

## Hal yang Perlu Diketahui tentang Paket Gratis Render

Ketentuan ini bisa berubah, jadi cek [render.com/docs/free](https://render.com/docs/free) sebelum deploy.

- **Web service tertidur** setelah sekitar 15 menit tanpa request. Request pertama setelahnya memakan waktu sekitar satu menit sampai server aktif lagi. Frontend Memo Board sudah menampilkan pesan khusus saat menunggu kondisi ini.
- Kuota gratis adalah 750 jam instance per bulan per workspace, cukup untuk satu web service menyala sebulan penuh.
- **Render Postgres gratis kedaluwarsa 30 hari setelah dibuat.** Ada masa tenggang untuk upgrade, setelah itu database dan isinya dihapus permanen. Database gratis juga tidak memiliki backup, dan hanya boleh ada satu per workspace.
- Static site (frontend) gratis dan tidak tertidur.

Untuk portofolio yang ingin terus online tanpa biaya, gunakan database eksternal yang paket gratisnya tidak kedaluwarsa, misalnya Neon. Lihat bagian [Memakai Neon sebagai database](#memakai-neon-sebagai-database).

## 1. Deploy API dan Database

1. Push repository `memo-board-api` ke GitHub atau GitLab.
2. Buka [dashboard.render.com](https://dashboard.render.com), pilih **New → Blueprint**, lalu pilih repository tersebut.
3. Render membaca `render.yaml` dan menampilkan dua resource yang akan dibuat:
   - `memo-board-db`: PostgreSQL gratis di region Singapore
   - `memo-board-api`: web service dari `Dockerfile`
4. Render meminta nilai `CLIENT_ORIGIN`. Kalau URL frontend belum ada, isi sementara dengan `http://localhost:5173`. Nilai ini diganti di langkah 3.
5. Klik **Deploy Blueprint**.

Yang dikonfigurasi otomatis oleh Blueprint:

| Variable | Sumber |
| --- | --- |
| `DATABASE_URL` | Internal connection string dari `memo-board-db` (lewat jaringan privat Render, tanpa SSL) |
| `JWT_SECRET` | Dibuat acak oleh Render (`generateValue: true`) |
| `NODE_ENV` | `production` |
| `PORT` | Disediakan Render, dan sudah dibaca oleh server |

Saat container start, migrasi database dijalankan otomatis sebelum server menerima request. Setelah deploy selesai, buka:

```
https://<nama-service-api>.onrender.com/api/health
```

Response yang diharapkan: `{"status":"ok","database":"up",...}`. Catat URL ini untuk frontend.

## 2. Isi Data Demo (Opsional)

Paket gratis tidak menyediakan shell di dalam service, jadi seed dijalankan dari komputer kamu langsung ke database Render.

1. Buka `memo-board-db` di dashboard Render, lalu salin **External Database URL**.
2. Jalankan dari folder project:

```bash
docker compose run --rm --no-deps \
  -e DATABASE_URL="<external-database-url>" \
  -e DATABASE_SSL=true \
  api node scripts/seed.js
```

Perintah ini memakai image API yang sama, dan `JWT_SECRET` diambil dari file `.env` lokal (seed tidak membuat token, tapi variable itu tetap divalidasi saat start). Untuk mengganti kredensial akun demo, tambahkan `-e SEED_USER_EMAIL=...` dan `-e SEED_USER_PASSWORD=...`.

Akun demo dipakai bersama oleh siapa saja yang menekan tombol "Masuk dengan akun demo", sehingga datanya bisa diubah oleh pengunjung lain. Jalankan ulang seed setelah menghapus akun itu jika ingin mengembalikan data contohnya.

## 3. Deploy Frontend

1. Push repository `memo-board` (frontend).
2. Di Render, pilih **New → Blueprint** dan pilih repository frontend. File `render.yaml` di sana membuat static site lengkap dengan aturan rewrite untuk React Router.
3. Isi variable yang diminta:

| Variable | Nilai |
| --- | --- |
| `VITE_API_URL` | URL API dari langkah 1, **tanpa** `/api` dan tanpa garis miring di akhir. Contoh: `https://memo-board-api.onrender.com` |
| `VITE_DEMO_EMAIL` | Opsional. Isi jika ingin menampilkan tombol login demo |
| `VITE_DEMO_PASSWORD` | Opsional, pasangan dari `VITE_DEMO_EMAIL` |

Variable `VITE_*` dibaca saat **build**. Setiap kali nilainya diubah, frontend perlu di-deploy ulang.

## 4. Hubungkan CORS

Kembali ke service `memo-board-api` → **Environment**, ubah `CLIENT_ORIGIN` menjadi URL frontend, misalnya:

```
https://memo-board.onrender.com
```

Jika ada lebih dari satu origin (misalnya custom domain), pisahkan dengan koma. Simpan, lalu deploy ulang API. Sekarang buka URL frontend dan coba register.

## Memakai Neon sebagai Database

1. Buat project di [neon.tech](https://neon.tech) dan salin connection string-nya.
2. Ubah `render.yaml`:

```yaml
services:
  - type: web
    name: memo-board-api
    runtime: docker
    plan: free
    region: singapore
    dockerfilePath: ./Dockerfile
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: DATABASE_SSL
        value: "true"
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_EXPIRES_IN
        value: 7d
      - key: CLIENT_ORIGIN
        sync: false
```

Blok `databases` dihapus. Saat membuat Blueprint, isi `DATABASE_URL` dengan connection string dari Neon. Pilih region Neon yang dekat dengan region Render (Singapore) supaya latensi query rendah.

Jika Blueprint sudah terlanjur dibuat dengan Render Postgres, cukup ubah `DATABASE_URL` dan `DATABASE_SSL=true` di tab Environment service API, lalu deploy ulang. Migrasi akan membuat tabel di database baru secara otomatis.

## Troubleshooting

| Gejala | Penyebab dan solusi |
| --- | --- |
| Browser menampilkan error CORS | `CLIENT_ORIGIN` di API tidak sama persis dengan URL frontend. Perhatikan `https`, subdomain, dan jangan ada garis miring di akhir |
| Frontend memanggil `localhost:4000` di production | `VITE_API_URL` belum diisi atau frontend belum di-deploy ulang setelah variable diubah |
| Request pertama sangat lama | Service sedang bangun dari mode tidur. Ini normal di paket gratis |
| `/api/health` mengembalikan `database: down` | Database kedaluwarsa, dihapus, atau `DATABASE_URL` salah. Untuk database eksternal, pastikan `DATABASE_SSL=true` |
| Deploy gagal dengan pesan `Konfigurasi environment tidak valid` | Log menyebutkan variable mana yang salah, misalnya `JWT_SECRET` kurang dari 32 karakter |
| Semua user tiba-tiba ter-logout | `JWT_SECRET` berubah, sehingga token lama tidak valid lagi. Ini perilaku yang diharapkan |

## Catatan Keamanan

- Token JWT disimpan di `localStorage` frontend dan dikirim lewat header `Authorization`. Cara ini dipilih karena frontend dan API berada di domain yang berbeda, dan cookie lintas situs sering diblokir browser. Konsekuensinya, aplikasi harus bebas dari celah XSS. React sudah melakukan escaping pada semua teks yang ditampilkan, dan tidak ada penggunaan `dangerouslySetInnerHTML`.
- Jika nanti frontend dan API dipasang di domain yang sama (misalnya `app.domain.com` dan `api.domain.com`), sesi bisa dipindah ke cookie `HttpOnly` dengan `SameSite=Lax`.
- Container berjalan sebagai user non-root (`node`).
- Rate limit membatasi percobaan login untuk mengurangi serangan brute force.
