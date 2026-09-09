# 🚀 Panduan Lengkap Upload & Deployment Sistem BCM ke Server Hosting

Panduan ini memuat langkah-langkah praktis untuk mengupload dan menjalankan sistem BCM (Business Continuity Management) Navigator beserta database SQLite bawaannya ke server hosting / VPS / Cloud.

---

## 📋 1. Ringkasan Arsitektur & Berkas Database

- **Framework**: Next.js 15 (App Router) + React 19 + Tailwind CSS
- **ORM & Database**: Prisma ORM dengan **SQLite**
- **Lokasi File Database**: `prisma/bcm_navigator.db`
- **Kondisi Database**: Sudah terisi konfigurasi sistem, parameter ISO 22301, template kerja, kredensial pengguna (admin/konsultan), dan data proses bisnis dalam keadaan bersih (siap pakai).

> ⚠️ **PENTING**: File database `prisma/bcm_navigator.db` harus **selalu disertakan** saat mengupload ke server hosting agar seluruh konfigurasi akun dan data tetap terjaga.

---

## 📦 2. Berkas yang Perlu Diupload

### Yang WAJIB Di-upload:
```
├── src/                      (Seluruh source code aplikasi)
├── public/                   (Aset publik)
├── prisma/
│   ├── schema.prisma         (Skema database Prisma)
│   ├── bcm_navigator.db      (FILE DATABASE SQLITE UTAMA)
│   └── seed.js
├── package.json              (Daftar dependensi & script build)
├── package-lock.json
├── next.config.mjs           (Konfigurasi Next.js)
├── tsconfig.json             (Konfigurasi TypeScript)
├── tailwind.config.ts        (Konfigurasi Tailwind)
├── postcss.config.mjs
├── ecosystem.config.js       (Konfigurasi PM2 untuk VPS)
├── Dockerfile                (Konfigurasi Docker)
├── docker-compose.yml        (Konfigurasi Docker Compose)
├── .env.example
└── .env                      (Konfigurasi environment produksi)
```

### Yang TIDAK Perlu Diupload (Kecualikan saat ZIP):
- ❌ `node_modules/` (Akan di-install otomatis di server via `npm install`)
- ❌ `.next/` (Akan di-generate ulang di server via `npm run build`)
- ❌ `.git/`

---

## 🌐 3. Pilihan Metode Deployment

Pilih salah satu metode di bawah ini yang sesuai dengan jenis server hosting Anda:

---

### METODE A: VPS Ubuntu / Debian (Direkomendasikan)
Metode ini adalah standar industri terbaik untuk performa tinggi, stabilitas 24/7, dan custom domain dengan HTTPS SSL gratis.

#### Langkah 1: Persiapan Server (SSH)
Masuk ke terminal server VPS Anda:
```bash
ssh root@IP_SERVER_ANDA
```

Update sistem & install Node.js 20 LTS:
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
npm install -g pm2
```

#### Langkah 2: Upload File ke Server
Buat direktori proyek di server:
```bash
mkdir -p /var/www/bcm-system
cd /var/www/bcm-system
```
Upload berkas proyek ke folder tersebut (bisa menggunakan `git clone`, `scp`, `rsync`, atau ekstrak berkas `.zip` via FileZilla/SFTP).

Pastikan file `prisma/bcm_navigator.db` berada di lokasi `/var/www/bcm-system/prisma/bcm_navigator.db`.

#### Langkah 3: Install Dependensi & Build
```bash
cd /var/www/bcm-system

# Install seluruh paket dependensi
npm install

# Build aplikasi Next.js untuk produksi
npm run build
```

#### Langkah 4: Jalankan Service Menggunakan PM2
Aplikasi akan berjalan otomatis di background dan otomatis hidup kembali jika server restart:
```bash
# Jalankan menggunakan file konfigurasi ekosistem yang sudah disediakan
pm2 start ecosystem.config.js

# Simpan state PM2 agar auto-start saat reboot
pm2 save
pm2 startup
```

Untuk memantau status aplikasi:
```bash
pm2 status
pm2 logs bcm-system
```

#### Langkah 5: Konfigurasi Nginx & Domain SSL (HTTPS)
Buat konfigurasi virtual host Nginx:
```bash
sudo nano /etc/nginx/sites-available/bcm.domainanda.com
```

Isi dengan konfigurasi berikut:
```nginx
server {
    listen 80;
    server_name bcm.domainanda.com; # Ganti dengan domain/subdomain Anda

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktifkan konfigurasi & restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/bcm.domainanda.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Pasang SSL HTTPS Gratis (Certbot):
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d bcm.domainanda.com
```

---

### METODE B: Menggunakan Docker & Docker Compose (Sangat Cepat)
Jika server Anda sudah terpasang Docker & Docker Compose:

1. Upload seluruh folder proyek ke server.
2. Jalankan perintah berikut di folder proyek:
   ```bash
   docker compose up -d --build
   ```
3. Sistem akan otomatis melakukan *multi-stage build*, mempersiapkan database, dan berjalan di port `3000`.
4. Volume database `./prisma` dipetakan secara persisten sehingga data tidak akan hilang saat container di-restart atau di-update.

---

### METODE C: cPanel / CloudPanel (Shared Hosting / Managed Cloud)

1. **Kompresi File**:
   Kompres seluruh isi folder proyek menjadi `bcm-system.zip` (**pastikan folder `node_modules` dan `.next` tidak ikut di-zip**, namun `prisma/bcm_navigator.db` **wajib ikut**).
2. **Upload di cPanel**:
   Buka **cPanel > File Manager**, buat folder misalnya `public_html/bcm` atau folder di luar root, lalu ekstrak `bcm-system.zip`.
3. **Setup Node.js App**:
   - Masuk ke menu **Setup Node.js App** di cPanel.
   - Klik **Create Application**.
   - **Node.js Version**: Pilih `20.x` (atau minimal `18.x`).
   - **Application Mode**: `Production`.
   - **Application Root**: Lokasi folder tempat file diekstrak.
   - **Application Startup File**: `node_modules/next/dist/bin/next` dengan argumen `start` (atau buat file entrypoint `server.js`).
4. **Install & Build**:
   - Klik tombol **Run NPM Install**.
   - Masuk ke terminal SSH cPanel (atau Run Script):
     ```bash
     npm run build
     ```
5. **Restart App**:
   Klik tombol **Restart** pada halaman Node.js App di cPanel.

---

## 🔑 4. Informasi Akun Default & Kredensial

Sistem dilengkapi beberapa profil pengguna bawaan:

| Peran (Role) | Nama / Akun | Hak Akses |
|---|---|---|
| **BCM Lead Consultant** | Sarah Wijaya, MBCI | Akses penuh modul BCM, BIA Wizard, asesmen risiko, & review dokumen |
| **System Administrator** | Hendra Gunawan | Konfigurasi sistem, manajemen user, log keamanan & audit trail |
| **Client / Process Owner** | Budi Santoso | Pengisian BIA proses bisnis & monitoring status |

---

## 💾 5. Cara Backup Database

Karena database menggunakan **SQLite**, proses pencadangan (backup) sangat sederhana:
1. Cukup salin berkas `prisma/bcm_navigator.db`.
2. Contoh perintah backup manual via terminal server:
   ```bash
   cp /var/www/bcm-system/prisma/bcm_navigator.db /var/backups/bcm_navigator_$(date +%Y%m%d).db
   ```
3. Anda juga dapat mendownload file `.db` tersebut langsung ke komputer lokal melalui SFTP.

---

## ✅ 6. Checklist Verifikasi Pasca Deploy

- [ ] Aplikasi dapat diakses melalui browser (contoh: `http://IP_SERVER:3000` atau `https://domainanda.com`).
- [ ] Halaman login dan perpindahan modul (Dashboard, DRL, Stakeholder, BIA, Reports) berjalan lancar.
- [ ] Menambahkan proses bisnis baru atau mengubah parameter berhasil tersimpan ke database.
- [ ] Grafik di Dashboard menampilkan data dinamis dari database tanpa error.
