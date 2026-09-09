// Reference content for the in-app User Manual & Guide (/manual).
// Derived from the BCM Navigator role model, permission map, and navigation.

export interface ManualModule {
  href: string;
  name: string;
  desc: string;
}

export const MANUAL_MODULES: Record<string, ManualModule> = {
  dashboard: { href: '/dashboard', name: 'Command Center (Dashboard)', desc: 'Ringkasan status proyek, progress BIA, KPI, dan heatmap eksekutif.' },
  projects: { href: '/projects', name: 'Project Setup Wizard', desc: 'Wizard 7 langkah untuk konfigurasi proyek, framework, scope, dan unit kerja.' },
  organization: { href: '/organization', name: 'Organization Master', desc: 'Master struktur organisasi (direktorat, divisi, unit) beserta hierarki dan koordinator BCM.' },
  documents: { href: '/documents', name: 'Document Collection (DRL)', desc: 'Document Request List: permintaan, unggah, dan review kelengkapan dokumen klien.' },
  stakeholders: { href: '/stakeholders', name: 'Stakeholder 2x2 Matrix', desc: 'Pemetaan pemangku kepentingan pada matriks Influence vs Interest dan strategi engagement.' },
  processes: { href: '/processes', name: 'Business Process Register', desc: 'Registrasi proses bisnis, pemilik proses, SLA, dan atribut operasional.' },
  bia: { href: '/bia', name: 'BIA Assessment & Wizard', desc: 'Wizard Business Impact Analysis: skor dampak, MTPD, RTO, RPO, dan deteksi SPOF.' },
  workshop: { href: '/workshop', name: 'Validation Workshop', desc: 'Sesi validasi hasil BIA bersama pemangku kepentingan dan persetujuan.' },
  workspace: { href: '/workspace', name: 'Consultant 3-Pane View', desc: 'Ruang kerja konsultan 3 panel untuk analisis paralel proses, BIA, dan dokumen.' },
  dependencies: { href: '/dependencies', name: 'Dependency & SPOF Radar', desc: 'Radar ketergantungan aplikasi/vendor dan deteksi Single Point of Failure.' },
  issues: { href: '/issues', name: 'Issue & Action Tracker', desc: 'Pelacakan temuan, rencana aksi, penanggung jawab, dan status penyelesaian.' },
  templates: { href: '/templates', name: 'Template Management', desc: 'Pustaka template kertas kerja (27 template) dengan versi, scope, dan status.' },
  workingpapers: { href: '/working-papers', name: 'Working Papers & Interviews', desc: 'Kertas kerja konsultan dan lembar wawancara narasumber.' },
  biaworksheets: { href: '/bia-worksheets', name: 'Advanced BIA Worksheets', desc: 'Lembar BIA lanjutan berbasis grid untuk penilaian mendetail dan revisi.' },
  reports: { href: '/reports', name: 'Reports & Consolidated BIA', desc: 'Laporan konsolidasi BIA, heatmap, dan output eksekutif.' },
  systemconfig: { href: '/system-config', name: 'System Configuration', desc: 'Konfigurasi parameter sistem: umum, proyek, metodologi BCM, dan workflow.' },
  admin: { href: '/admin', name: 'Parameters & Governance', desc: 'Tata kelola parameter, manajemen pengguna, kredensial, dan keamanan (RBAC).' },
  audit: { href: '/audit', name: 'Audit Trail & Compliance', desc: 'Jejak audit seluruh aktivitas sistem untuk kepatuhan dan ekspor.' },
};

export const MODULE_PERMISSION: Record<string, string> = {
  dashboard: 'ANY', projects: 'PROCESS_REGISTER_EDIT', organization: 'PROCESS_REGISTER_EDIT',
  documents: 'DRL_UPLOAD_RESPONSE', stakeholders: 'PROCESS_REGISTER_EDIT', processes: 'PROCESS_REGISTER_EDIT',
  bia: 'BIA_WORKSHEET_VIEW', workshop: 'BIA_APPROVE_FINAL', workspace: 'BIA_WORKSHEET_EDIT',
  dependencies: 'PROCESS_REGISTER_EDIT', issues: 'PROCESS_REGISTER_EDIT', templates: 'TEMPLATE_MANAGE',
  workingpapers: 'WORKING_PAPER_EDIT', biaworksheets: 'BIA_WORKSHEET_VIEW', reports: 'EXECUTIVE_HEATMAP_VIEW',
  systemconfig: 'SYSTEM_CONFIG_MANAGE', admin: 'USER_CREDENTIAL_MANAGE', audit: 'AUDIT_LOG_EXPORT',
};

export const PERMISSION_LABEL: Record<string, string> = {
  SYSTEM_CONFIG_MANAGE: 'Kelola Konfigurasi Sistem', USER_CREDENTIAL_MANAGE: 'Kelola Kredensial Pengguna',
  SECURITY_POLICY_MANAGE: 'Kelola Kebijakan Keamanan', AUDIT_LOG_EXPORT: 'Ekspor Jejak Audit',
  BIA_APPROVE_FINAL: 'Persetujuan Final BIA', BIA_WORKSHEET_EDIT: 'Edit Lembar Kerja BIA',
  BIA_WORKSHEET_VIEW: 'Lihat Lembar Kerja BIA', TEMPLATE_MANAGE: 'Kelola Template',
  WORKING_PAPER_EDIT: 'Edit Kertas Kerja', PROCESS_REGISTER_EDIT: 'Edit Register Proses',
  DRL_UPLOAD_RESPONSE: 'Unggah/Respon DRL', INTERVIEW_RESPONDENT: 'Narasumber Wawancara',
  EXECUTIVE_HEATMAP_VIEW: 'Lihat Heatmap Eksekutif',
};

export const ROLE_PERMS: Record<string, string[]> = {
  SUPER_ADMIN: ['SYSTEM_CONFIG_MANAGE', 'USER_CREDENTIAL_MANAGE', 'SECURITY_POLICY_MANAGE', 'AUDIT_LOG_EXPORT', 'BIA_APPROVE_FINAL', 'BIA_WORKSHEET_EDIT', 'BIA_WORKSHEET_VIEW', 'TEMPLATE_MANAGE', 'WORKING_PAPER_EDIT', 'PROCESS_REGISTER_EDIT', 'DRL_UPLOAD_RESPONSE', 'INTERVIEW_RESPONDENT', 'EXECUTIVE_HEATMAP_VIEW'],
  CONSULTANT_DIRECTOR: ['AUDIT_LOG_EXPORT', 'BIA_APPROVE_FINAL', 'BIA_WORKSHEET_EDIT', 'BIA_WORKSHEET_VIEW', 'TEMPLATE_MANAGE', 'WORKING_PAPER_EDIT', 'PROCESS_REGISTER_EDIT', 'EXECUTIVE_HEATMAP_VIEW'],
  PROJECT_MANAGER: ['AUDIT_LOG_EXPORT', 'BIA_WORKSHEET_VIEW', 'TEMPLATE_MANAGE', 'WORKING_PAPER_EDIT', 'PROCESS_REGISTER_EDIT', 'DRL_UPLOAD_RESPONSE', 'EXECUTIVE_HEATMAP_VIEW'],
  BCM_CONSULTANT: ['BIA_WORKSHEET_EDIT', 'BIA_WORKSHEET_VIEW', 'TEMPLATE_MANAGE', 'WORKING_PAPER_EDIT', 'PROCESS_REGISTER_EDIT', 'DRL_UPLOAD_RESPONSE', 'EXECUTIVE_HEATMAP_VIEW'],
  CLIENT_COORDINATOR: ['DRL_UPLOAD_RESPONSE', 'BIA_WORKSHEET_VIEW', 'EXECUTIVE_HEATMAP_VIEW'],
  UNIT_HEAD: ['BIA_WORKSHEET_VIEW', 'PROCESS_REGISTER_EDIT', 'INTERVIEW_RESPONDENT', 'EXECUTIVE_HEATMAP_VIEW'],
  PROCESS_OWNER: ['INTERVIEW_RESPONDENT', 'BIA_WORKSHEET_VIEW'],
  BIA_RESPONDENT: ['INTERVIEW_RESPONDENT', 'BIA_WORKSHEET_VIEW'],
  APPROVER: ['BIA_APPROVE_FINAL', 'BIA_WORKSHEET_VIEW', 'EXECUTIVE_HEATMAP_VIEW'],
  VIEWER: ['BIA_WORKSHEET_VIEW', 'EXECUTIVE_HEATMAP_VIEW'],
};

export interface ManualTask {
  t: string;
  s: string[];
}

export interface ManualRole {
  key: string;
  title: string;
  persona: string;
  badge: string;
  login: { username: string; mfa: string };
  org: string;
  tagline: string;
  responsibilities: string[];
  tasks: ManualTask[];
}

export const MANUAL_ROLES: ManualRole[] = [
  {
    key: 'SUPER_ADMIN', title: 'Super Admin', persona: 'Super Administrator (Security Ops)', badge: 'Admin',
    login: { username: 'superadmin_sec', mfa: 'Hardware FIDO2' }, org: 'PT JMA Solusi Konsultindo',
    tagline: 'Otoritas penuh atas konfigurasi sistem, kredensial pengguna, kebijakan keamanan, dan jejak audit.',
    responsibilities: ['Mengelola seluruh konfigurasi & parameter sistem (multi-klien).', 'Membuat, mengunci, dan mereset kredensial pengguna serta menerapkan RBAC.', 'Menetapkan kebijakan keamanan (MFA, lockout, kebijakan sandi).', 'Memantau & mengekspor jejak audit dan log keamanan untuk kepatuhan.'],
    tasks: [
      { t: 'Menambah pengguna baru', s: ['Buka Parameters & Governance (/admin).', 'Pilih tab Users / Security, klik "Register User".', 'Isi nama, email, role, dan aktifkan MFA.', 'Simpan — kredensial awal dibuat dan tercatat di jejak audit.'] },
      { t: 'Mengunci / membuka akun', s: ['Buka daftar pengguna di /admin.', 'Klik ikon kunci pada pengguna terkait untuk toggle Lock/Unlock.', 'Sistem mencatat security log dan mitigasi otomatis.'] },
      { t: 'Mengubah konfigurasi sistem', s: ['Buka System Configuration (/system-config).', 'Sesuaikan parameter Umum, Proyek, Metodologi BCM, atau Workflow.', 'Klik Simpan — perubahan tersimpan ke database & tercatat audit.'] },
      { t: 'Mengekspor jejak audit', s: ['Buka Audit Trail & Compliance (/audit).', 'Gunakan filter modul/aksi/tanggal.', 'Klik Export untuk mengunduh untuk keperluan kepatuhan.'] },
    ],
  },
  {
    key: 'CONSULTANT_DIRECTOR', title: 'Consultant Director', persona: 'Dr. Hendra Gunawan (Director)', badge: 'Consultant',
    login: { username: 'hendra_director', mfa: 'TOTP Authenticator' }, org: 'PT JMA Solusi Konsultindo',
    tagline: 'Direktur proyek, tata kelola metodologi, dan persetujuan eksekutif final.',
    responsibilities: ['Menyetujui hasil BIA secara final (executive sign-off).', 'Mengawasi metodologi dan kualitas kertas kerja & template.', 'Meninjau heatmap eksekutif dan laporan konsolidasi.', 'Mengekspor jejak audit untuk pelaporan tata kelola.'],
    tasks: [
      { t: 'Persetujuan final BIA', s: ['Buka BIA Assessment (/bia) atau Advanced BIA Worksheets.', 'Tinjau tier kritikalitas, RTO/RPO/MTPD, dan bukti.', 'Klik Approve/Lock untuk menandatangani secara final.', 'Status proses berubah menjadi Validated/Approved.'] },
      { t: 'Meninjau laporan konsolidasi', s: ['Buka Reports & Consolidated BIA (/reports).', 'Analisis heatmap dan ringkasan tier kritikalitas.', 'Ekspor laporan untuk rapat direksi.'] },
      { t: 'Mengelola template metodologi', s: ['Buka Template Management (/templates).', 'Tinjau atau setujui perubahan status template (Draft→Approved→Published).'] },
    ],
  },
  {
    key: 'PROJECT_MANAGER', title: 'Project Manager', persona: 'Project Manager (Advisory)', badge: 'Consultant',
    login: { username: 'project_manager', mfa: 'TOTP Authenticator' }, org: 'PT JMA Solusi Konsultindo',
    tagline: 'Mengoordinasi jalannya proyek, pengumpulan dokumen, dan pelacakan isu.',
    responsibilities: ['Memantau progres proyek dan penyelesaian BIA per unit.', 'Mengelola register proses & kertas kerja bersama tim.', 'Mengoordinasi permintaan/pengumpulan dokumen (DRL).', 'Melacak isu, rencana aksi, dan tenggat.'],
    tasks: [
      { t: 'Memantau progres proyek', s: ['Buka Command Center (/dashboard).', 'Tinjau persentase penyelesaian & KPI.', 'Identifikasi unit yang tertinggal.'] },
      { t: 'Mengelola DRL', s: ['Buka Document Collection (/documents).', 'Buat permintaan dokumen dan pantau statusnya.', 'Tindak lanjuti dokumen yang belum lengkap.'] },
      { t: 'Melacak isu & aksi', s: ['Buka Issue & Action Tracker (/issues).', 'Tambah/ubah isu, tetapkan owner & target date.', 'Perbarui status hingga selesai.'] },
    ],
  },
  {
    key: 'BCM_CONSULTANT', title: 'BCM Consultant', persona: 'Sarah Wijaya, MBCI (Senior Consultant)', badge: 'Consultant',
    login: { username: 'sarah_lead_bcm', mfa: 'TOTP Authenticator' }, org: 'PT JMA Solusi Konsultindo',
    tagline: 'Asesor utama BCM & BIA, penulis kertas kerja, dan pemodel proses.',
    responsibilities: ['Menjalankan asesmen BIA end-to-end (skor dampak, MTPD, RTO, RPO, SPOF).', 'Menyusun register proses bisnis dan memetakan stakeholder.', 'Membuat kertas kerja & lembar wawancara.', 'Meninjau kelengkapan dokumen (DRL) dari klien.'],
    tasks: [
      { t: 'Menjalankan BIA Wizard', s: ['Buka BIA Assessment & Wizard (/bia), pilih proses.', 'Isi kapasitas normal/minimum & periode puncak.', 'Isi skor dampak per kategori & timeframe.', 'Sistem menghitung MTPD/RTO/RPO dan mendeteksi SPOF.', 'Simpan — hasil tersimpan dan status proses diperbarui.'] },
      { t: 'Mendaftarkan proses bisnis', s: ['Buka Business Process Register (/processes).', 'Klik Tambah Proses, isi atribut & pemilik proses.', 'Simpan untuk dipakai pada BIA.'] },
      { t: 'Memetakan stakeholder', s: ['Buka Stakeholder 2x2 Matrix (/stakeholders).', 'Atur Influence & Interest; kuadran dihitung otomatis.', 'Simpan strategi engagement.'] },
      { t: 'Menggunakan ruang kerja 3 panel', s: ['Buka Consultant 3-Pane View (/workspace).', 'Analisis proses, BIA, dan dokumen secara paralel.'] },
    ],
  },
  {
    key: 'CLIENT_COORDINATOR', title: 'Client Coordinator', persona: 'Rian Pratama, CRISC', badge: 'Client',
    login: { username: 'rian_coord', mfa: 'SMS OTP' }, org: 'PT Bank Nusantara Sejahtera Tbk',
    tagline: 'Koordinator BCM klien, pemantau progres, dan penghubung DRL.',
    responsibilities: ['Merespon dan mengunggah dokumen yang diminta (DRL).', 'Memantau progres BIA dan heatmap eksekutif.', 'Menjadi penghubung antara tim konsultan dan unit internal.'],
    tasks: [
      { t: 'Mengunggah dokumen DRL', s: ['Buka Document Collection (/documents).', 'Temukan dokumen berstatus Requested.', 'Unggah berkas & isi versi/keterangan.', 'Status berubah menjadi Submitted untuk direview konsultan.'] },
      { t: 'Memantau progres', s: ['Buka Command Center (/dashboard).', 'Tinjau penyelesaian BIA dan heatmap.'] },
      { t: 'Melihat laporan eksekutif', s: ['Buka Reports & Consolidated BIA (/reports).', 'Tinjau ringkasan tier & rekomendasi.'] },
    ],
  },
  {
    key: 'UNIT_HEAD', title: 'Unit Head', persona: 'Bambang Soediro (Unit Head)', badge: 'Client',
    login: { username: 'bambang_unithead', mfa: 'TOTP Authenticator' }, org: 'PT Bank Nusantara Sejahtera Tbk',
    tagline: 'Kepala unit — penyetuju sumber daya unit dan narasumber proses.',
    responsibilities: ['Meninjau & memvalidasi proses bisnis di unitnya.', 'Menjadi narasumber wawancara BIA.', 'Menyetujui kebutuhan sumber daya pemulihan unit.', 'Meninjau heatmap eksekutif unit.'],
    tasks: [
      { t: 'Meninjau proses unit', s: ['Buka Business Process Register (/processes).', 'Filter proses pada unit Anda.', 'Perbaiki atribut bila perlu & simpan.'] },
      { t: 'Menjawab wawancara BIA', s: ['Buka Working Papers & Interviews (/working-papers).', 'Buka lembar wawancara yang ditugaskan.', 'Isi jawaban dan kirim.'] },
      { t: 'Meninjau heatmap', s: ['Buka Reports (/reports) untuk melihat posisi kritikalitas unit.'] },
    ],
  },
  {
    key: 'PROCESS_OWNER', title: 'Process Owner', persona: 'Budi Santoso (Process Owner)', badge: 'Client',
    login: { username: 'budi_processowner', mfa: 'Nonaktif (SMS OTP tersedia)' }, org: 'PT Bank Nusantara Sejahtera Tbk',
    tagline: 'Pemilik proses — narasumber wawancara dan subjek analisis workaround.',
    responsibilities: ['Memberikan informasi detail proses saat wawancara BIA.', 'Memvalidasi kapasitas, SLA, dan prosedur workaround.', 'Meninjau hasil BIA untuk prosesnya.'],
    tasks: [
      { t: 'Menjawab lembar wawancara', s: ['Buka Working Papers & Interviews (/working-papers).', 'Pilih lembar wawancara proses Anda.', 'Isi jawaban mengenai aktivitas, ketergantungan & workaround.', 'Kirim untuk ditinjau konsultan.'] },
      { t: 'Meninjau hasil BIA', s: ['Buka BIA Assessment (/bia) — mode lihat.', 'Periksa RTO/RPO/MTPD hasil analisis proses Anda.'] },
    ],
  },
  {
    key: 'BIA_RESPONDENT', title: 'BIA Respondent', persona: 'BIA Respondent (Narasumber)', badge: 'Client',
    login: { username: 'bia_respondent', mfa: 'SMS OTP' }, org: 'PT Bank Nusantara Sejahtera Tbk',
    tagline: 'Narasumber pengisian data BIA untuk proses yang ditugaskan.',
    responsibilities: ['Mengisi kuesioner/lembar wawancara BIA.', 'Menyediakan data dampak dan kebutuhan sumber daya.', 'Meninjau lembar BIA (mode lihat).'],
    tasks: [
      { t: 'Mengisi wawancara BIA', s: ['Buka Working Papers & Interviews (/working-papers).', 'Buka lembar yang ditugaskan & lengkapi jawaban.', 'Kirim untuk verifikasi.'] },
      { t: 'Meninjau lembar BIA', s: ['Buka BIA Assessment (/bia) untuk melihat hasil terkait.'] },
    ],
  },
  {
    key: 'APPROVER', title: 'Approver', persona: 'Approver (Penyetuju BIA)', badge: 'Management',
    login: { username: 'approver', mfa: 'TOTP Authenticator' }, org: 'PT Bank Nusantara Sejahtera Tbk',
    tagline: 'Pihak penyetuju hasil BIA dan peninjau heatmap eksekutif.',
    responsibilities: ['Menyetujui hasil BIA pada tahap validasi.', 'Meninjau heatmap & laporan eksekutif.'],
    tasks: [
      { t: 'Menyetujui BIA', s: ['Buka BIA Assessment (/bia) atau Validation Workshop (/workshop).', 'Tinjau tier & target pemulihan.', 'Klik Approve untuk menyetujui.'] },
      { t: 'Meninjau heatmap', s: ['Buka Reports & Consolidated BIA (/reports).'] },
    ],
  },
  {
    key: 'VIEWER', title: 'Viewer (Executive)', persona: 'Executive Management (Audit / BOC)', badge: 'Management',
    login: { username: 'executive_board', mfa: 'Hardware FIDO2' }, org: 'PT Bank Nusantara Sejahtera Tbk',
    tagline: 'Akses baca-saja untuk heatmap eksekutif, laporan kepatuhan, dan dashboard dewan.',
    responsibilities: ['Meninjau heatmap eksekutif & dashboard.', 'Membaca laporan konsolidasi BIA (tanpa mengubah data).'],
    tasks: [
      { t: 'Melihat dashboard eksekutif', s: ['Buka Command Center (/dashboard).', 'Tinjau KPI & heatmap kritikalitas.'] },
      { t: 'Membaca laporan', s: ['Buka Reports & Consolidated BIA (/reports).', 'Tinjau ringkasan; ekspor bila diizinkan.'] },
    ],
  },
];

export function accessibleModules(roleKey: string): string[] {
  const perms = ROLE_PERMS[roleKey] ?? [];
  const isSuper = roleKey === 'SUPER_ADMIN';
  return Object.keys(MANUAL_MODULES).filter((m) => {
    const req = MODULE_PERMISSION[m];
    if (req === 'ANY') return true;
    if (isSuper) return true;
    return perms.includes(req);
  });
}

export const BCM_LIFECYCLE: string[] = [
  'Setup Proyek — Project Setup Wizard & Organization Master.',
  'Pengumpulan Dokumen — Document Collection (DRL).',
  'Pemetaan Stakeholder — Stakeholder 2x2 Matrix.',
  'Registrasi Proses — Business Process Register.',
  'Wawancara & Kertas Kerja — Working Papers & Interviews.',
  'Asesmen BIA — BIA Wizard & Advanced Worksheets (MTPD, RTO, RPO, SPOF).',
  'Analisis Ketergantungan — Dependency & SPOF Radar.',
  'Validasi — Validation Workshop & persetujuan.',
  'Pelaporan — Reports & Consolidated BIA.',
  'Tata Kelola — System Config, Parameters & Governance, Audit Trail.',
];
