# BCM Navigator — Enterprise Business Continuity Management System

Aplikasi Sistem Informasi Manajemen Kelangsungan Usaha (**Business Continuity Management**) komprehensif berbasis standar internasional **ISO 22301:2019**, pedoman BIA **ISO 22317**, serta regulasi ketahanan operasional OJK (**POJK 11/POJK.03/2022**).

Dikembangkan untuk pendampingan konsultan dan operasional klien (**Asuransi JMA Syariah** & sektor finansial).

---

## 🚀 Fitur & Modul Utama

1. **Enterprise Security & RBAC Guard (ISO 27001)**
   - Autentikasi korporat bertingkat: Kredensial Pengguna & Verifikasi Dua Faktor (MFA - TOTP / Hardware FIDO2 WebAuthn / SMS OTP).
   - *Brute-force protection* otomatis dengan sistem lockout akun setelah 5 kali gagal.
   - Hak akses berlapis (*Role-Based Access Control*) untuk 7 peran: Super Administrator, Konsultan BCM, Direktur Konsultan, Koordinator Klien, Unit Head, Process Owner, dan Auditor/Dewan Komisaris.
   - **Super Admin Security Center**: Manajemen akun pengguna, penyetelan izin otorisasi, dan jejak audit keamanan (*Security Event Logs*).

2. **Modul Inti BCM (Lifecycle ISO 22301)**
   - **Project Setup Wizard**: Inisiasi proyek, piagam, ruang lingkup metodologi.
   - **Organization Master**: Struktur direktorat, divisi, dan pemetaan unit kerja.
   - **Document Collection (DRL)**: Permintaan bukti dokumen, review kelengkapan, dan temuan gap.
   - **Stakeholder Matrix**: Pemetaan matriks kekuasaan vs minat (2x2 Power-Interest Grid).
   - **Business Process Register**: Inventarisasi proses bisnis, keterkaitan unit, dan klasifikasi kekritisan.
   - **BIA Assessment & Wizard**: Penilaian dampak kualitatif & kuantitatif, kalkulasi MTPD, target RTO, dan RPO.
   - **Validation Workshop Board**: Sidang validasi bersama stakeholder dan penetapan notulensi kesepakatan.
   - **Working Papers & Interviews**: Kertas kerja konsultasi dan lembar wawancara mendalam.
   - **Advanced BIA Worksheets**: Lembar kerja BIA detail dengan revision history and digital lock.
   - **Dependency & SPOF Radar**: Identifikasi titik kegagalan tunggal (*Single Point of Failure*) pada IT, vendor, dan SDM kunci.
   - **BCP Activation & Incident**: Prosedur aktivasi kelangsungan usaha dan penanganan insiden darurat.
   - **System Configuration Center (17 Parameter)**: Konfigurasi metodologi, bobot dampak, batas finansial IDR, skala waktu, dan rule sandbox interaktif tanpa coding.

---

## 🛠️ Stack Teknologi

- **Frontend / Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Mobile-first responsive design)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Visuals**: [Recharts](https://recharts.org/)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) dengan SQLite (cm_navigator.db)
- **PDF Engine**: [jsPDF](https://github.com/parallax/jsPDF) & [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- **CI / Quality Control**: GitHub Actions Workflow (TypeScript static analysis & Next.js production build)

---

## 💻 Memulai Pengembangan (Local Development)

### 1. Prasyarat
- Node.js versi 18.x atau 20.x+
- npm atau pnpm

### 2. Instalasi Dependensi
`ash
npm install
`

### 3. Inisialisasi Database
`ash
npx prisma generate
npx prisma db push
`

### 4. Menjalankan Server Pengembang
`ash
npm run dev
`
Akses aplikasi melalui peramban: http://localhost:3000

### 5. Pengujian Build & Validasi Tipe
`ash
npx tsc --noEmit
npm run build
`

---

## 🔐 Kredensial Pengguna Awal (Development Persona)

| Peran | Username / Email | Password Standar | MFA Token |
|---|---|---|---|
| **Super Admin (Security Ops)** | superadmin_sec | BCM@SECURE2025! | 123456 *(atau FIDO2)* |
| **Director / Principal Advisor** | hendra_director | BCM@SECURE2025! | 123456 |
| **Lead BCM Consultant** | sarah_lead_bcm | BCM@SECURE2025! | 123456 |
| **Client BCM Coordinator** | ian_coord | BCM@SECURE2025! | 123456 |
| **Director of Ops & IT (Unit Head)**| ambang_unithead | BCM@SECURE2025! | 123456 |
| **Payment Process Owner** | udi_processowner | BCM@SECURE2025! | *(Tanpa MFA)* |
| **Executive Board & Audit Comm** | executive_board | BCM@SECURE2025! | 123456 *(atau FIDO2)* |

---

## 📄 Lisensi & Kepatuhan
Sistem ini mematuhi standar ISO 22301:2019, ISO 27001:2022, dan regulasi ketahanan operasional POJK 11/2022. Seluruh hak cipta dilindungi undang-undang.
