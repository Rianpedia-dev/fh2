Berikut versi yang **lebih rapi, terstruktur, dan mudah diikuti** untuk deploy **Next.js + MySQL** di **Hostinger hPanel (Business Web Hosting – Node.js Web App)** agar stabil seperti di local. 🚀

---

# Panduan Deploy Next.js + MySQL di Business Web Hosting (Hostinger)

## 0️⃣ Cek Prasyarat Project (di Local)

Sebelum deploy, pastikan project berjalan normal di local.

**Node.js Version**

* Gunakan salah satu versi berikut: **Node 18 / 20 / 22**
* Sesuaikan dengan dependency project.

**Script di `package.json`**
Pastikan terdapat script berikut:

```json
"scripts": {
  "build": "next build",
  "start": "next start -p $PORT"
}
```

> Atau cukup `next start`, tetapi aplikasi **harus mengikuti port dari `process.env.PORT`**.

**Hal yang perlu dicek**

* Tidak ada koneksi database yang **hardcode `localhost`**.
* Semua konfigurasi menggunakan **environment variables**.

**Jika menggunakan ORM**

**Prisma**

* Pastikan `prisma generate` sudah dijalankan.
* Migrasi database siap dijalankan.

**Sequelize / Knex**

* Pastikan migrasi database sudah tersedia (CLI / manual).

---

# 1️⃣ Membuat Database MySQL di Hostinger

Masuk ke **hPanel → Databases → MySQL Databases → Create Database**

Catat informasi berikut:

* **Database Name**
* **Database User**
* **Database Password**
* **Database Host**
* **Database Port** (biasanya `3306`)

💡 Tips:
Gunakan password **tanpa karakter aneh** untuk menghindari error URL encoding.

---

# 2️⃣ Format Koneksi Database (Paling Sering Menyebabkan Error)

Gunakan format berikut:

```
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DBNAME
```

Contoh:

```
DATABASE_URL=mysql://user123:password123@mysql.hostinger.com:3306/db_app
```

---

### Jika Password Mengandung Karakter Khusus

Password harus di **URL encode**.

Contoh:

Password asli:

```
pa:ss@word#1
```

Harus menjadi:

```
pa%3Ass%40word%231
```

Karakter yang harus di-encode:

```
@  :  /  ?  #  [  ]  &  %  +  (spasi)
```

---

# 3️⃣ Deploy Next.js melalui Node.js Web App

Masuk ke:

```
hPanel → Websites → Domain Anda → Node.js Apps
```

Klik **Create App**

### Metode Deploy

Disarankan:

**Import Git Repository**

Alternatif:

**Upload ZIP**

* Jangan sertakan folder `node_modules`

---

### Konfigurasi Build

Isi seperti ini:

| Setting         | Value           |
| --------------- | --------------- |
| Node Version    | 20 / 22         |
| Install Command | `npm ci`        |
| Build Command   | `npm run build` |
| Start Command   | `npm start`     |

⚠️ Pastikan aplikasi menggunakan:

```
process.env.PORT
```

---

# 4️⃣ Environment Variables (WAJIB)

Masuk ke **Environment Variables** pada Node.js App.

Minimal isi:

```
NODE_ENV=production
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DBNAME
```

Jika menggunakan variabel frontend:

```
NEXT_PUBLIC_API_URL=...
NEXT_PUBLIC_APP_NAME=...
```

Jika menggunakan **Prisma** (opsional):

```
SHADOW_DATABASE_URL=...
```

---

# 5️⃣ Migrasi Database (Sering Terlewat)

Shared hosting **tidak otomatis menjalankan migrasi**.

### Opsi A (Paling Aman)

Migrasi dari local ke database hosting.

Langkah:

1. Ubah `DATABASE_URL` di local ke database Hostinger
2. Jalankan migrasi

Contoh Prisma:

```
npx prisma migrate deploy
```

3. Setelah selesai, kembalikan `DATABASE_URL` local seperti semula.

---

### Opsi B (Migrasi Saat Deploy)

Tambahkan migrasi pada script start.

Namun ini **tidak direkomendasikan** karena bisa menyebabkan:

* race condition
* error deploy

---

# 6️⃣ Pastikan Domain Mengarah ke Node.js App

Di **Node.js Apps**, cek:

**Domain Mapping**

Domain harus diarahkan ke aplikasi Node.js.

Jika salah mapping, biasanya:

* domain mengarah ke `public_html`
* muncul **503 error**
* halaman kosong

---

# 7️⃣ Build Ulang dan Restart

Setelah semua konfigurasi selesai:

1️⃣ Klik **Deploy / Redeploy**
2️⃣ Klik **Restart App**

Kemudian cek:

* Homepage
* Endpoint API
* Koneksi database

---

# 8️⃣ Checklist Troubleshooting Cepat

### ❌ Error 503

Biasanya karena:

* aplikasi crash
* start command salah
* domain mapping salah
* koneksi database gagal

---

### ❌ Database Tidak Bisa Connect

90% penyebabnya:

* Host salah
* User salah
* DB name salah
* Password belum di encode

---

### ❌ Next.js Jalan Tapi API Error

Biasanya karena:

* Environment variables belum di set
* Nama variabel berbeda dengan yang dipakai di code

---

### ❌ Port Error

Jangan hardcode:

```
3000
```

Gunakan:

```js
process.env.PORT
```

---

# 📩 Informasi yang Dibutuhkan untuk Mengecek Konfigurasi

Agar saya bisa membantu memastikan konfigurasi Anda **benar 100%**, kirimkan:

1️⃣ Domain aplikasi
(contoh: `fhunpal.id`)

2️⃣ Isi `scripts` di `package.json`

3️⃣ Format `DATABASE_URL`
(sensor password, tapi beri tahu jika ada karakter seperti `@ : # %`)

Dengan itu saya bisa menunjukkan **setting build + start + env yang paling aman untuk project Anda**. 🔧

---

✅ Jika Anda mau, saya juga bisa buatkan **versi panduan yang jauh lebih simpel (hanya 5 langkah deploy Next.js di Hostinger)** yang biasanya dipakai developer supaya **deploy hanya 10 menit selesai**.
