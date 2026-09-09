import { SystemUser, SecurityEventLog, UserPermission } from '@/types';

export interface ClientData {
  id: string;
  code: string;
  name: string;
  industry: string;
  country: string;
  address: string;
}

export interface ProjectData {
  id: string;
  code: string;
  name: string;
  clientId: string;
  clientName: string;
  framework: string;
  sponsorName: string;
  bcmCoordinatorName: string;
  consultingPmName: string;
  startDate: string;
  targetDate: string;
  status: string;
  scopeDescription: string;
  location: string;
  completionPercent: number;
}

export interface OrganizationUnitData {
  id: string;
  code: string;
  name: string;
  level: number;
  levelName: string;
  parentId?: string | null;
  unitHeadName: string;
  bcmCoordName: string;
  location: string;
  processCount: number;
  biaCompletedCount: number;
}

export interface DocumentRequestData {
  id: string;
  code: string;
  unitId: string;
  unitName: string;
  category: string;
  name: string;
  description: string;
  mandatory: boolean;
  confidentiality: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Requested' | 'Requested' | 'In Progress' | 'Submitted' | 'Under Review' | 'Incomplete' | 'Need Clarification' | 'Accepted' | 'Superseded' | 'Closed';
  targetDate: string;
  uploadedFileName?: string;
  uploadedFileSize?: string;
  uploadedAt?: string;
  version: string;
  reviewStatus?: string;
  completeness?: number;
  relevance?: string;
  keyFindings?: string;
  gapIdentified?: string;
  followUpRequired?: string;
  reviewerName?: string;
  reviewedAt?: string;
}

export interface StakeholderData {
  id: string;
  code: string;
  name: string;
  unitId: string;
  unitName: string;
  position: string;
  email: string;
  phone: string;
  isInternal: boolean;
  bcmRole: string;
  influenceLevel: number;
  interestLevel: number;
  criticality: 'High' | 'Medium' | 'Low';
  decisionAuthority: string;
  recommendedBiaRole: boolean;
  notes: string;
  quadrant: 'Manage Closely' | 'Keep Satisfied' | 'Keep Informed' | 'Monitor';
}

export interface BusinessProcessData {
  id: string;
  code: string;
  name: string;
  unitId: string;
  unitName: string;
  level: number;
  levelName: string;
  processOwnerId: string;
  processOwnerName: string;
  description: string;
  objective: string;
  productService: string;
  customers: string;
  inputs: string;
  keyActivities: string;
  outputs: string;
  frequency: string;
  operatingHours: string;
  peakPeriod: string;
  transactionVolume: string;
  financialValue: string;
  slaRequirement: string;
  regulatoryReq: string;
  manualWorkaround: string;
  existingBcp: string;
  status: 'Identified' | 'Ready for BIA' | 'In Assessment' | 'Validated' | 'Approved';
  isCriticalFlag: boolean;
  rto?: string;
  rpo?: string;
  mtpd?: string;
  criticalityTier?: string;
  spofFlag?: boolean;
}

export const INITIAL_CLIENT: ClientData = {
  id: 'clt-01',
  code: 'CLT-BNU-01',
  name: 'PT Bank Nusantara Sejahtera Tbk',
  industry: 'Banking & Financial Services (KBMI 3)',
  country: 'Indonesia',
  address: 'Menara Nusantara Lt. 28, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan',
};

export const INITIAL_PROJECT: ProjectData = {
  id: 'prj-01',
  code: 'PRJ-BCM-2025-01',
  name: 'Pendampingan Implementasi BCM & Business Impact Analysis ISO 22301:2019',
  clientId: 'clt-01',
  clientName: 'PT Bank Nusantara Sejahtera Tbk',
  framework: 'ISO 22301:2019, ISO 22317:2021 & POJK No. 11/POJK.03/2022',
  sponsorName: 'Bambang Soediro (Direktur Kepatuhan & Manajemen Risiko)',
  bcmCoordinatorName: 'Rian Pratama, CRISC (VP Enterprise Risk)',
  consultingPmName: 'Sarah Wijaya, MBCI (Senior BCM Consultant)',
  startDate: '2025-01-15',
  targetDate: '2025-07-31',
  status: 'Active',
  scopeDescription: 'Head Office (Jakarta), DC Serpong, DRC Surabaya, dan 15 Unit Kerja Operasional Inti Perbankan.',
  location: 'Jakarta Head Office & DC Serpong',
  completionPercent: 64,
};

export const INITIAL_UNITS: OrganizationUnitData[] = [
  {
    id: 'unit-01',
    code: 'DIR-OPS',
    name: 'Direktorat Operasi & Teknologi Informasi',
    level: 1,
    levelName: 'Directorate',
    parentId: null,
    unitHeadName: 'Bambang Soediro (Direktur)',
    bcmCoordName: 'Rian Pratama',
    location: 'Menara Nusantara Lt. 25',
    processCount: 28,
    biaCompletedCount: 19,
  },
  {
    id: 'unit-02',
    code: 'DIV-SETTLE',
    name: 'Divisi Settlement & Kliring Pembayaran',
    level: 2,
    levelName: 'Division',
    parentId: 'unit-01',
    unitHeadName: 'Budi Santoso, SE, MM',
    bcmCoordName: 'Dina Kusuma',
    location: 'Menara Nusantara Lt. 18',
    processCount: 8,
    biaCompletedCount: 6,
  },
  {
    id: 'unit-03',
    code: 'DIV-ITOPS',
    name: 'Divisi IT Infrastructure & Core Operations',
    level: 2,
    levelName: 'Division',
    parentId: 'unit-01',
    unitHeadName: 'Eko Prasetyo, M.Kom',
    bcmCoordName: 'Fajar Nugraha',
    location: 'DC Serpong & Menara Lt. 12',
    processCount: 12,
    biaCompletedCount: 9,
  },
  {
    id: 'unit-04',
    code: 'DIV-TRS',
    name: 'Divisi Treasury & Global Markets',
    level: 2,
    levelName: 'Division',
    parentId: 'unit-01',
    unitHeadName: 'Kartika Chandra, CFA',
    bcmCoordName: 'Reza Pahlevi',
    location: 'Menara Nusantara Lt. 22',
    processCount: 5,
    biaCompletedCount: 3,
  },
  {
    id: 'unit-05',
    code: 'DIV-RISK',
    name: 'Divisi Manajemen Risiko & BCM',
    level: 2,
    levelName: 'Division',
    parentId: 'unit-01',
    unitHeadName: 'Rian Pratama, CRISC',
    bcmCoordName: 'Rian Pratama',
    location: 'Menara Nusantara Lt. 20',
    processCount: 3,
    biaCompletedCount: 1,
  },
  {
    id: 'unit-06',
    code: 'DIV-HRGA',
    name: 'Divisi Sumber Daya Manusia & Umum (HRGA)',
    level: 2,
    levelName: 'Division',
    parentId: 'unit-01',
    unitHeadName: 'Agus Salim',
    bcmCoordName: 'Maya Puspita',
    location: 'Menara Nusantara Lt. 15',
    processCount: 4,
    biaCompletedCount: 0,
  },
];

export const INITIAL_STAKEHOLDERS: StakeholderData[] = [
  {
    id: 'stk-01',
    code: 'STK-001',
    name: 'Budi Santoso, SE, MM',
    unitId: 'unit-02',
    unitName: 'Divisi Settlement & Kliring',
    position: 'Head of Settlement & Clearing',
    email: 'budi.santoso@banknusantara.co.id',
    phone: '+62 815-5566-7788',
    isInternal: true,
    bcmRole: 'Process Owner',
    influenceLevel: 5,
    interestLevel: 5,
    criticality: 'High',
    decisionAuthority: 'Operational & Authorizer',
    recommendedBiaRole: true,
    notes: 'Pemegang kunci otorisasi RTGS, BI-FAST, dan SKNBI. Wajib menjadi responden utama BIA.',
    quadrant: 'Manage Closely',
  },
  {
    id: 'stk-02',
    code: 'STK-002',
    name: 'Eko Prasetyo, M.Kom',
    unitId: 'unit-03',
    unitName: 'Divisi IT Infrastructure',
    position: 'VP IT Infrastructure & Data Center',
    email: 'eko.prasetyo@banknusantara.co.id',
    phone: '+62 811-3344-5566',
    isInternal: true,
    bcmRole: 'Disaster Recovery Lead',
    influenceLevel: 4,
    interestLevel: 5,
    criticality: 'High',
    decisionAuthority: 'Technical Strategy',
    recommendedBiaRole: true,
    notes: 'Penanggung jawab DRP, RTO/RPO sistem dan fasilitas Data Center Serpong & DRC Surabaya.',
    quadrant: 'Manage Closely',
  },
  {
    id: 'stk-03',
    code: 'STK-003',
    name: 'Rian Pratama, CRISC',
    unitId: 'unit-05',
    unitName: 'Divisi Manajemen Risiko',
    position: 'VP Enterprise Risk & BCM Coordinator',
    email: 'rian.pratama@banknusantara.co.id',
    phone: '+62 813-1122-3344',
    isInternal: true,
    bcmRole: 'BCM Coordinator',
    influenceLevel: 4,
    interestLevel: 4,
    criticality: 'Medium',
    decisionAuthority: 'Steering Committee Member',
    recommendedBiaRole: false,
    notes: 'Fasilitator internal review dan approval BIA per unit.',
    quadrant: 'Keep Satisfied',
  },
  {
    id: 'stk-04',
    code: 'STK-004',
    name: 'Hendra Wijayanto',
    unitId: 'ext-regulator',
    unitName: 'Regulator / Otoritas Eksternal (BI / OJK)',
    position: 'Pengawas Utama - Otoritas Jasa Keuangan (OJK)',
    email: 'hendra.wijayanto@ojk.go.id',
    phone: '+62 21-2960-0000',
    isInternal: false,
    bcmRole: 'External Regulator / Vendor',
    influenceLevel: 5,
    interestLevel: 3,
    criticality: 'High',
    decisionAuthority: 'Strategic',
    recommendedBiaRole: false,
    notes: 'Regulator utama yang mewajibkan pelaporan implementasi BCM sesuai POJK No. 11/POJK.03/2022. Pengaruh sangat tinggi terhadap keberlangsungan izin usaha, namun tidak terlibat pada aktivitas operasional harian BCM.',
    quadrant: 'Keep Satisfied',
  },
  {
    id: 'stk-05',
    code: 'STK-005',
    name: 'Andra Saputra',
    unitId: 'ext-vendor',
    unitName: 'Penyedia Jasa Kritis (Third-Party Vendor)',
    position: 'Account Director - PT Awan Data Nusantara (Data Center & Cloud Provider)',
    email: 'andra.saputra@awandatanusantara.co.id',
    phone: '+62 878-1234-5678',
    isInternal: false,
    bcmRole: 'External Regulator / Vendor',
    influenceLevel: 3,
    interestLevel: 5,
    criticality: 'High',
    decisionAuthority: 'Tactical',
    recommendedBiaRole: true,
    notes: 'Penyedia layanan colocation Data Center Serpong dan konektivitas DRC Surabaya. Sangat berkepentingan terhadap kelangsungan SLA, namun pengaruh strategis terbatas pada keputusan internal bank.',
    quadrant: 'Keep Informed',
  },
  {
    id: 'stk-06',
    code: 'STK-006',
    name: 'Ratna Kusumawati',
    unitId: 'ext-vendor',
    unitName: 'Penyedia Jasa Kritis (Third-Party Vendor)',
    position: 'Senior Account Manager - PT Solusi Perbankan Digital (Core Banking System Vendor)',
    email: 'ratna.kusumawati@solusiperbankandigital.co.id',
    phone: '+62 812-9988-7766',
    isInternal: false,
    bcmRole: 'External Regulator / Vendor',
    influenceLevel: 4,
    interestLevel: 4,
    criticality: 'High',
    decisionAuthority: 'Tactical',
    recommendedBiaRole: true,
    notes: 'Vendor pemelihara sistem core banking utama. Keterlibatan tinggi dalam pengujian DRP aplikasi kritikal serta dukungan teknis eskalasi saat terjadi gangguan mayor.',
    quadrant: 'Manage Closely',
  },
  {
    id: 'stk-07',
    code: 'STK-007',
    name: 'Yulia Anggraini, CPA',
    unitId: 'ext-auditor',
    unitName: 'Mitra Strategis Eksternal (Kantor Akuntan Publik / Auditor Independen)',
    position: 'Partner - KAP Wijaya & Rekan (Auditor Independen)',
    email: 'yulia.anggraini@kap-wijayarekan.co.id',
    phone: '+62 21-5140-2200',
    isInternal: false,
    bcmRole: 'External Regulator / Vendor',
    influenceLevel: 2,
    interestLevel: 2,
    criticality: 'Low',
    decisionAuthority: 'Operational',
    recommendedBiaRole: false,
    notes: 'Melakukan audit tahunan atas kesiapan BCM sebagai bagian dari audit umum. Keterlibatan bersifat periodik dan tidak mempengaruhi keputusan operasional BCM sehari-hari.',
    quadrant: 'Monitor',
  },
];

export const INITIAL_PROCESSES: BusinessProcessData[] = [
  {
    id: 'proc-01',
    code: 'PROC-001',
    name: 'Pemrosesan Transaksi Settlement RTGS & BI-FAST',
    unitId: 'unit-02',
    unitName: 'Divisi Settlement & Kliring',
    level: 2,
    levelName: 'Business Process',
    processOwnerId: 'stk-01',
    processOwnerName: 'Budi Santoso, SE, MM',
    description: 'Pemrosesan, verifikasi, dan kliring transaksi pembayaran bernilai besar dan instan retail antar bank secara real time.',
    objective: 'Memastikan seluruh setelmen dana nasabah dan antar-bank tuntas tanpa kegagalan likuiditas sistemik.',
    productService: 'BI-FAST, SKNBI, BI-RTGS, Interbank Transfer',
    customers: 'Nasabah Korporasi, Nasabah Retail, Bank Mitra, Bank Indonesia',
    inputs: 'Instruksi pembayaran nasabah dari channel e-Banking dan Cabang',
    keyActivities: '1. Validasi saldo nasabah; 2. Enkripsi pesan transaksi; 3. Pengiriman ke BI Gateway; 4. Konfirmasi settlement; 5. Update buku besar perbankan',
    outputs: 'Notifikasi berhasil ke nasabah, laporan mutasi harian, konfirmasi setelmen BI',
    frequency: 'Continuous / 24x7 Real Time',
    operatingHours: '24/7 (Cut-off RTGS pukul 17.00 WIB)',
    peakPeriod: 'Hari kerja pukul 09:00 - 15:00 WIB, Akhir Bulan (Tutup Buku)',
    transactionVolume: '450.000 transaksi/hari (~Rp 8.5 Triliun/hari)',
    financialValue: 'Rp 8.5 Triliun / hari',
    slaRequirement: 'Maksimum latency 3 detik; Kegagalan sistemik maksimal 1 jam',
    regulatoryReq: 'POJK No. 11/POJK.03/2022 & PADG Bank Indonesia No. 23/2021',
    manualWorkaround: 'Tidak ada manual workaround untuk transaksi volume tinggi BI-FAST. Opsi failover hot standby ke DRC Surabaya.',
    existingBcp: 'Dokumen BCP Divisi Settlement 2023 (Perlu pembaruan skenario DR)',
    status: 'Validated',
    isCriticalFlag: true,
    rto: '2 Hours',
    rpo: '15 Minutes',
    mtpd: '4 Hours',
    criticalityTier: 'Tier 1 — Mission Critical',
    spofFlag: true,
  },
  {
    id: 'proc-02',
    code: 'PROC-002',
    name: 'Operasional Switch Transaksi ATM & Kartu Debit/Kredit',
    unitId: 'unit-03',
    unitName: 'Divisi IT Infrastructure',
    level: 2,
    levelName: 'Business Process',
    processOwnerId: 'stk-02',
    processOwnerName: 'Eko Prasetyo, M.Kom',
    description: 'Routing dan otorisasi transaksi ATM off-us / on-us dan transaksi EDC merchant.',
    objective: 'Ketersediaan layanan tarik tunai dan transaksi non-tunai di seluruh jaringan merchant dan ATM.',
    productService: 'ATM Bersama, Prima, Link, Visa, Mastercard',
    customers: 'Nasabah pemegang kartu & merchant',
    inputs: 'Pesan ISO 8583 dari ATM/EDC terminal',
    keyActivities: 'Verifikasi PIN, cek saldo, otorisasi transaksi, pencatatan jurnal',
    outputs: 'Approval response code, cetak struk, update saldo akun nasabah',
    frequency: 'Continuous 24/7',
    operatingHours: '24/7',
    peakPeriod: 'Weekend & Hari Libur Nasional (Hari Raya Idul Fitri & Tahun Baru)',
    transactionVolume: '650.000 transaksi/hari',
    financialValue: 'Rp 450 Miliar / hari',
    slaRequirement: 'Uptime 99.95%, Response time < 1.5 detik',
    regulatoryReq: 'POJK SPPur & Peraturan BI Sistem Pembayaran',
    manualWorkaround: 'Offline processing dengan limit darurat Rp 500.000 (maks. 2 jam)',
    existingBcp: 'DRP IT Switch 2024',
    status: 'Validated',
    isCriticalFlag: true,
    rto: '1 Hour',
    rpo: 'Real Time',
    mtpd: '3 Hours',
    criticalityTier: 'Tier 1 — Mission Critical',
    spofFlag: false,
  },
  {
    id: 'proc-03',
    code: 'PROC-003',
    name: 'Penyelesaian Transaksi Valuta Asing & Pasar Uang Antar Bank (Treasury Dealing)',
    unitId: 'unit-04',
    unitName: 'Divisi Treasury & Global Markets',
    level: 2,
    levelName: 'Business Process',
    processOwnerId: 'stk-01',
    processOwnerName: 'Kartika Chandra, CFA',
    description: 'Konfirmasi dan eksekusi transaksi instrumen pasar uang, repo, FX swap, dan obligasi pemerintah.',
    objective: 'Mengelola likuiditas valas dan posisi kepatuhan Giro Wajib Minimum (GWM) Bank Indonesia.',
    productService: 'FX Spot, FX Forward, Money Market, SBN',
    customers: 'Bank Sentral, Institusi Finansial, Nasabah Korporasi Prioritas',
    inputs: 'Dealing ticket dari Bloomberg / Refinitiv dealer',
    keyActivities: 'Pencocokan konfirmasi transaksi via SWIFT FIN/ISO 20022, transfer rekening nostro, update posisi portofolio',
    outputs: 'MT103/MT202 SWIFT message, voucher setelmen, laporan posisi devisa netto',
    frequency: 'Harian (Senin - Jumat)',
    operatingHours: '08:00 - 17:00 WIB',
    peakPeriod: 'Pukul 14:00 - 16:30 WIB (Pasar uang penutupan BI)',
    transactionVolume: '350 transaksi/hari (~Rp 12 Triliun/hari)',
    financialValue: 'Rp 12 Triliun / hari',
    slaRequirement: 'Selesai sebelum cut-off BI SSSS dan SWIFT cut-off 16:30 WIB',
    regulatoryReq: 'Peraturan BI Transaksi Valuta Asing Terhadap Rupiah',
    manualWorkaround: 'Pengiriman fax bertanda tangan spesimen resmi & verifikasi call-back telepon rekaman darurat',
    existingBcp: 'SOP Kontingensi Treasury 2023',
    status: 'In Assessment',
    isCriticalFlag: true,
    rto: '4 Hours',
    rpo: '30 Minutes',
    mtpd: '6 Hours',
    criticalityTier: 'Tier 2 — Critical',
    spofFlag: true,
  },
  {
    id: 'proc-04',
    code: 'PROC-004',
    name: 'Penggajian Karyawan & Pembayaran Tunjangan (Payroll Processing)',
    unitId: 'unit-06',
    unitName: 'Divisi Sumber Daya Manusia & Umum (HRGA)',
    level: 2,
    levelName: 'Business Process',
    processOwnerId: 'stk-01',
    processOwnerName: 'Agus Salim',
    description: 'Perhitungan absensi, insentif, pajak PPh 21, dan pemindahbukuan gaji seluruh karyawan bank.',
    objective: 'Menjamin hak finansial 5.200 karyawan bank disalurkan tepat waktu pada tanggal penggajian.',
    productService: 'Internal Salary Crediting',
    customers: 'Seluruh pegawai tetap, kontrak, dan vendor outsourcing',
    inputs: 'Data kehadiran, lembur, perubahan status kepegawaian',
    keyActivities: 'Kalkulasi payroll engine, rekonsiliasi total debit, otorisasi mass payout ke rekening',
    outputs: 'Slip gaji digital, kredit rekening nasabah karyawan, laporan setoran pajak',
    frequency: 'Bulanan (Cut-off tanggal 20, transfer tanggal 25)',
    operatingHours: 'Jam kerja 08:30 - 17:30',
    peakPeriod: 'Tanggal 20 - 25 setiap bulan',
    transactionVolume: '5.200 transfer / bulan',
    financialValue: 'Rp 42 Miliar / bulan',
    slaRequirement: 'Pencairan gaji maksimal pukul 08:00 WIB pada tanggal 25',
    regulatoryReq: 'Undang-Undang Ketenagakerjaan',
    manualWorkaround: 'Penggajian parsial menggunakan rata-rata bulan sebelumnya dengan penyesuaian susulan',
    existingBcp: 'Prosedur manual HR',
    status: 'Identified',
    isCriticalFlag: false,
    rto: '48 Hours',
    rpo: '24 Hours',
    mtpd: '3 Days',
    criticalityTier: 'Tier 4 — Non-Critical',
    spofFlag: false,
  },
];

export const INITIAL_DRL: DocumentRequestData[] = [
  {
    id: 'drl-01',
    code: 'DRL-001',
    unitId: 'unit-02',
    unitName: 'Divisi Settlement & Kliring',
    category: 'BCM',
    name: 'Existing Business Continuity Plan (BCP) Divisi Settlement',
    description: 'Dokumen prosedur kelangsungan usaha eksisting untuk proses kliring dan penyelesaian transaksi.',
    mandatory: true,
    confidentiality: 'Confidential',
    priority: 'High',
    status: 'Accepted',
    targetDate: '2025-02-01',
    uploadedFileName: 'BCP_Settlement_Kliring_v2.1_2023.pdf',
    uploadedFileSize: '4.8 MB',
    uploadedAt: '2025-01-28',
    version: '2.1',
    reviewStatus: 'Accepted',
    completeness: 90,
    relevance: 'High',
    keyFindings: 'Prosedur pemulihan manual belum mengantisipasi lonjakan transaksi BI-FAST; skenario failover DRC masih bergantung pada intervensi manual.',
    gapIdentified: 'RTO tercantum 6 jam, melebihi toleransi terkini POJK (2 jam). Perlu revisi target pemulihan.',
    followUpRequired: 'Sinkronisasi target RTO pada BIA v1.0 dan pembaruan runbook teknis DRC.',
    reviewerName: 'Sarah Wijaya, MBCI',
    reviewedAt: '2025-01-30',
  },
  {
    id: 'drl-02',
    code: 'DRL-002',
    unitId: 'unit-03',
    unitName: 'Divisi IT Infrastructure',
    category: 'IT',
    name: 'Disaster Recovery Plan (DRP) & Arsitektur Jaringan DC-DRC',
    description: 'Diagram topologi, arsitektur replikasi basis data Silverlake, dan prosedur failover sistem perbankan utama.',
    mandatory: true,
    confidentiality: 'Restricted',
    priority: 'High',
    status: 'Under Review',
    targetDate: '2025-02-05',
    uploadedFileName: 'DRP_Topology_Network_DCDRC_2024.pdf',
    uploadedFileSize: '12.4 MB',
    uploadedAt: '2025-02-04',
    version: '1.4',
    reviewerName: 'Sarah Wijaya, MBCI',
  },
  {
    id: 'drl-03',
    code: 'DRL-003',
    unitId: 'unit-05',
    unitName: 'Divisi Manajemen Risiko',
    category: 'Risk Management',
    name: 'Profil Risiko Operasional & Risk Register Bank 2024/2025',
    description: 'Risk register komprehensif mencakup skenario kegagalan sistem, bencana alam, dan cyber incident.',
    mandatory: true,
    confidentiality: 'Confidential',
    priority: 'High',
    status: 'Accepted',
    targetDate: '2025-01-25',
    uploadedFileName: 'Risk_Register_Operasional_2024.xlsx',
    uploadedFileSize: '2.1 MB',
    uploadedAt: '2025-01-22',
    version: '3.0',
    reviewStatus: 'Accepted',
    completeness: 95,
    relevance: 'High',
    reviewerName: 'Dr. Hendra Gunawan',
    reviewedAt: '2025-01-24',
  },
  {
    id: 'drl-04',
    code: 'DRL-004',
    unitId: 'unit-04',
    unitName: 'Divisi Treasury & Global Markets',
    category: 'Operational',
    name: 'SOP Transaksi Pasar Uang & Valas serta SLA Dealer',
    description: 'Standar prosedur operasional transaksi valuta asing dan surat berharga.',
    mandatory: false,
    confidentiality: 'Internal',
    priority: 'Medium',
    status: 'Requested',
    targetDate: '2025-03-01',
    version: '1.0',
  },
  {
    id: 'drl-05',
    code: 'DRL-005',
    unitId: 'unit-01',
    unitName: 'Direktorat Operasi & Teknologi Informasi',
    category: 'Organizational',
    name: 'Bagan Struktur Organisasi & Susunan Direksi/Komite BCM 2025',
    description: 'Bagan organisasi perusahaan, susunan keanggotaan Direksi, Komite Manajemen Risiko, dan Komite Pengarah BCM (BCM Steering Committee) beserta deskripsi jabatan kunci terkait tata kelola kelangsungan usaha.',
    mandatory: true,
    confidentiality: 'Internal',
    priority: 'Medium',
    status: 'Accepted',
    targetDate: '2025-01-20',
    uploadedFileName: 'Struktur_Organisasi_Komite_BCM_2025.pdf',
    uploadedFileSize: '3.2 MB',
    uploadedAt: '2025-01-18',
    version: '1.0',
    reviewStatus: 'Accepted',
    completeness: 100,
    relevance: 'High',
    keyFindings: 'Struktur pelaporan BCM Coordinator ke Komite Pengarah BCM sudah jelas dan selaras dengan POJK No. 11/POJK.03/2022.',
    gapIdentified: 'Tidak ada gap signifikan; deskripsi jabatan BCM Coordinator per unit sudah lengkap.',
    followUpRequired: 'Tidak ada tindak lanjut wajib.',
    reviewerName: 'Sarah Wijaya, MBCI',
    reviewedAt: '2025-01-19',
  },
  {
    id: 'drl-06',
    code: 'DRL-006',
    unitId: 'unit-03',
    unitName: 'Divisi IT Infrastructure',
    category: 'Application',
    name: 'Daftar Inventaris Aplikasi & Kekritisan Sistem TI (Application Criticality List)',
    description: 'Inventarisasi seluruh aplikasi/sistem TI yang mendukung proses bisnis inti, termasuk klasifikasi kekritisan, RTO/RPO, dan status kepemilikan (in-house/vendor).',
    mandatory: true,
    confidentiality: 'Restricted',
    priority: 'High',
    status: 'Accepted',
    targetDate: '2025-02-10',
    uploadedFileName: 'Application_Criticality_List_2025_v1.3.xlsx',
    uploadedFileSize: '1.6 MB',
    uploadedAt: '2025-02-08',
    version: '1.3',
    reviewStatus: 'Accepted dengan Catatan',
    completeness: 78,
    relevance: 'High',
    keyFindings: 'Aplikasi core banking (Silverlake), RTGS, dan BI-FAST sudah terklasifikasi Tier 1 (Mission Critical) dengan RTO/RPO terdefinisi.',
    gapIdentified: 'Terdapat 6 aplikasi legacy (termasuk sistem antrian cabang & pelaporan internal) yang belum memiliki klasifikasi RTO/RPO formal.',
    followUpRequired: 'Lakukan workshop klasifikasi kekritisan aplikasi legacy bersama Divisi IT Infrastructure sebelum konsolidasi BIA.',
    reviewerName: 'Sarah Wijaya, MBCI',
    reviewedAt: '2025-02-09',
  },
  {
    id: 'drl-07',
    code: 'DRL-007',
    unitId: 'unit-05',
    unitName: 'Divisi Manajemen Risiko',
    category: 'Policy',
    name: 'Kebijakan Manajemen Kelangsungan Usaha (BCM Policy) & Piagam BCM',
    description: 'Kebijakan tingkat direksi yang menetapkan komitmen, ruang lingkup, tujuan, dan tata kelola program BCM, termasuk piagam BCM Steering Committee.',
    mandatory: true,
    confidentiality: 'Internal',
    priority: 'High',
    status: 'Submitted',
    targetDate: '2025-02-15',
    uploadedFileName: 'BCM_Policy_Piagam_BCM_Steering_Committee_2024.pdf',
    uploadedFileSize: '2.4 MB',
    uploadedAt: '2025-02-12',
    version: '1.1',
  },
  {
    id: 'drl-08',
    code: 'DRL-008',
    unitId: 'unit-05',
    unitName: 'Divisi Manajemen Risiko',
    category: 'Policy',
    name: 'Kebijakan Manajemen Risiko Operasional & Enterprise Risk Management Framework',
    description: 'Kerangka kerja manajemen risiko perusahaan (ERM) mencakup risk appetite, metodologi penilaian risiko, dan mekanisme eskalasi risiko operasional.',
    mandatory: true,
    confidentiality: 'Internal',
    priority: 'Medium',
    status: 'Under Review',
    targetDate: '2025-02-20',
    uploadedFileName: 'Kebijakan_Manajemen_Risiko_ERM_Framework_2024.pdf',
    uploadedFileSize: '3.9 MB',
    uploadedAt: '2025-02-18',
    version: '2.0',
    reviewerName: 'Dr. Hendra Gunawan',
  },
  {
    id: 'drl-09',
    code: 'DRL-009',
    unitId: 'unit-01',
    unitName: 'Direktorat Operasi & Teknologi Informasi',
    category: 'Operational',
    name: 'Laporan Data Operasional: Volume Transaksi Harian, Jam Layanan, dan Headcount per Unit Kerja 2024/2025',
    description: 'Kompilasi data operasional seluruh unit kerja inti perbankan mencakup volume transaksi harian, jam layanan operasional, dan jumlah headcount per unit sebagai dasar analisis dependensi sumber daya BIA.',
    mandatory: true,
    confidentiality: 'Confidential',
    priority: 'High',
    status: 'In Progress',
    targetDate: '2025-03-05',
    version: '1.0',
  },
];

export const INITIAL_ISSUES = [
  {
    id: 'iss-01',
    code: 'ISS-001',
    unitName: 'Divisi IT Infrastructure',
    processName: 'Pemrosesan Transaksi Settlement RTGS & BI-FAST',
    title: 'Kapasitas Bandwidth Link Replikasi Data Center Serpong - DRC Surabaya',
    description: 'Hasil load test menunjukkan data sync lag mencapai 35 menit saat peak hours, melampaui target RPO 15 menit.',
    severity: 'Critical',
    owner: 'Eko Prasetyo (VP IT Infrastructure)',
    targetDate: '2025-03-15',
    status: 'In Progress',
    actionPlan: 'Upgrade bandwidth dedicated fiber optic dari 1 Gbps ke 5 Gbps dan tuning kompresi database replication.',
    consultantNotes: 'Critical blocker untuk finalisasi BIA Approval Tier-1.',
  },
  {
    id: 'iss-02',
    code: 'ISS-002',
    unitName: 'Divisi Settlement & Kliring',
    processName: 'Pemrosesan Transaksi Settlement RTGS & BI-FAST',
    title: 'Ketergantungan Single Point of Failure pada Vendor Silverlake Axis',
    description: 'Tidak tersedianya alternatif switch jika Silverlake mengalami crash arsitektur tanpa hot standby.',
    severity: 'High',
    owner: 'Budi Santoso',
    targetDate: '2025-04-01',
    status: 'Open',
    actionPlan: 'Kaji klausul SLA pinalti vendor dan siapkan secondary middleware queueing.',
    consultantNotes: 'Direkomendasikan masuk dalam BCM Strategy mitigasi risiko vendor pihak ketiga.',
  },
];

export const INITIAL_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'usr-sa-01',
    username: 'superadmin_sec',
    fullName: 'Muhammad Nadhil, CISA, CRISC',
    title: 'Super Administrator',
    email: 'muhammad.nadhil@pdsb.co.id',
    role: 'SUPER_ADMIN',
    roleBadge: 'Admin',
    roleDescription: 'Full system configuration, user credential management, audit trail & security policies',
    department: 'Advisory Leadership & Enterprise Security',
    organization: 'PT JMA Solusi Konsultindo',
    mfaEnabled: true,
    mfaType: 'Hardware FIDO2',
    status: 'Active',
    passwordHashSnippet: '$argon2id$v=19$m=65536,t=3,p=4$ZTRhNm...$9kXqM',
    lastLoginAt: '2025-02-28 08:15 WIB',
    lastLoginIp: '10.14.20.101 (VPN Gateway - Jakarta DC)',
    failedLoginAttempts: 0,
    maxFailedAttempts: 5,
    sessionTokenMasked: 'sess_sec_99a8****************3f21',
    passwordExpiresDays: 45,
    permissions: [
      'SYSTEM_CONFIG_MANAGE',
      'USER_CREDENTIAL_MANAGE',
      'SECURITY_POLICY_MANAGE',
      'AUDIT_LOG_EXPORT',
      'BIA_APPROVE_FINAL',
      'BIA_WORKSHEET_EDIT',
      'BIA_WORKSHEET_VIEW',
      'TEMPLATE_MANAGE',
      'WORKING_PAPER_EDIT',
      'PROCESS_REGISTER_EDIT',
      'DRL_UPLOAD_RESPONSE',
      'INTERVIEW_RESPONDENT',
      'EXECUTIVE_HEATMAP_VIEW',
    ],
    avatarInitial: 'MN',
    assignedBySuperAdmin: 'ROOT_SYS_INIT',
    assignedAt: '2025-01-01',
  },
  {
    id: 'usr-dir-02',
    username: 'hendra_director',
    fullName: 'Dr. Hendra Gunawan (Director)',
    title: 'Managing Director & Principal BCM Advisor',
    email: 'hendra.gunawan@jma-advisory.id',
    role: 'CONSULTANT_DIRECTOR',
    roleBadge: 'Consultant',
    roleDescription: 'Project Director, methodology governance & final executive sign-off',
    department: 'Advisory Leadership',
    organization: 'PT JMA Solusi Konsultindo',
    mfaEnabled: true,
    mfaType: 'TOTP Authenticator',
    status: 'Active',
    passwordHashSnippet: '$argon2id$v=19$m=65536,t=3,p=4$bWFzd...$7mRtK',
    lastLoginAt: '2025-02-27 16:40 WIB',
    lastLoginIp: '10.14.20.115 (Corporate Secure WiFi)',
    failedLoginAttempts: 0,
    maxFailedAttempts: 5,
    sessionTokenMasked: 'sess_dir_44b1****************8d99',
    passwordExpiresDays: 60,
    permissions: [
      'AUDIT_LOG_EXPORT',
      'BIA_APPROVE_FINAL',
      'BIA_WORKSHEET_EDIT',
      'BIA_WORKSHEET_VIEW',
      'TEMPLATE_MANAGE',
      'WORKING_PAPER_EDIT',
      'PROCESS_REGISTER_EDIT',
      'EXECUTIVE_HEATMAP_VIEW',
    ],
    avatarInitial: 'HG',
    assignedBySuperAdmin: 'usr-sa-01',
    assignedAt: '2025-01-05',
  },
  {
    id: 'usr-bcm-03',
    username: 'sarah_lead_bcm',
    fullName: 'Sarah Wijaya, MBCI (Senior Consultant)',
    title: 'Lead BCM & BIA Senior Assessor',
    email: 'sarah.wijaya@jma-advisory.id',
    role: 'BCM_CONSULTANT',
    roleBadge: 'Consultant',
    roleDescription: 'Active Lead BCM & BIA Assessor, Working Paper Author & Process Modeler',
    department: 'Business Continuity Practice',
    organization: 'PT JMA Solusi Konsultindo',
    mfaEnabled: true,
    mfaType: 'TOTP Authenticator',
    status: 'Active',
    passwordHashSnippet: '$argon2id$v=19$m=65536,t=3,p=4$c2Fy...$2xVwZ',
    lastLoginAt: '2025-02-28 09:12 WIB',
    lastLoginIp: '192.168.10.45 (Consultant Mobile Workstation)',
    failedLoginAttempts: 0,
    maxFailedAttempts: 5,
    sessionTokenMasked: 'sess_bcm_78ce****************2cc9',
    passwordExpiresDays: 75,
    permissions: [
      'BIA_WORKSHEET_EDIT',
      'BIA_WORKSHEET_VIEW',
      'TEMPLATE_MANAGE',
      'WORKING_PAPER_EDIT',
      'PROCESS_REGISTER_EDIT',
      'DRL_UPLOAD_RESPONSE',
      'EXECUTIVE_HEATMAP_VIEW',
    ],
    avatarInitial: 'SW',
    assignedBySuperAdmin: 'usr-sa-01',
    assignedAt: '2025-01-10',
  },
  {
    id: 'usr-clt-04',
    username: 'rian_coord',
    fullName: 'Rian Pratama, CRISC',
    title: 'VP Enterprise Risk Management & BCM Coordinator',
    email: 'rian.pratama@banknusantara.co.id',
    role: 'CLIENT_COORDINATOR',
    roleBadge: 'Client',
    roleDescription: 'Client BCM Coordinator, Progress Monitor & DRL Liaison',
    department: 'Divisi Manajemen Risiko & Kepatuhan',
    organization: 'PT Bank Nusantara Sejahtera Tbk',
    mfaEnabled: true,
    mfaType: 'SMS OTP',
    status: 'Active',
    passwordHashSnippet: '$argon2id$v=19$m=65536,t=3,p=4$cmlh...$1pLkA',
    lastLoginAt: '2025-02-28 08:30 WIB',
    lastLoginIp: '172.16.50.22 (Bank Internal Intranet)',
    failedLoginAttempts: 0,
    maxFailedAttempts: 5,
    sessionTokenMasked: 'sess_clt_33a1****************77e2',
    passwordExpiresDays: 80,
    permissions: ['DRL_UPLOAD_RESPONSE', 'BIA_WORKSHEET_VIEW', 'EXECUTIVE_HEATMAP_VIEW'],
    avatarInitial: 'RP',
    assignedBySuperAdmin: 'usr-sa-01',
    assignedAt: '2025-01-12',
  },
  {
    id: 'usr-uh-05',
    username: 'bambang_unithead',
    fullName: 'Bambang Soediro (Unit Head)',
    title: 'Director of Operations & Information Technology',
    email: 'bambang.soediro@banknusantara.co.id',
    role: 'UNIT_HEAD',
    roleBadge: 'Client',
    roleDescription: 'Director of Ops & IT Approver, Unit Resource Approver',
    department: 'Direktorat Operasi & IT',
    organization: 'PT Bank Nusantara Sejahtera Tbk',
    mfaEnabled: true,
    mfaType: 'TOTP Authenticator',
    status: 'Active',
    passwordHashSnippet: '$argon2id$v=19$m=65536,t=3,p=4$YmFt...$8kHjQ',
    lastLoginAt: '2025-02-26 14:10 WIB',
    lastLoginIp: '172.16.50.15 (Executive Office Network)',
    failedLoginAttempts: 0,
    maxFailedAttempts: 5,
    sessionTokenMasked: 'sess_uh_55f2****************99a1',
    passwordExpiresDays: 65,
    permissions: [
      'BIA_WORKSHEET_VIEW',
      'PROCESS_REGISTER_EDIT',
      'INTERVIEW_RESPONDENT',
      'EXECUTIVE_HEATMAP_VIEW',
    ],
    avatarInitial: 'BS',
    assignedBySuperAdmin: 'usr-sa-01',
    assignedAt: '2025-01-14',
  },
  {
    id: 'usr-po-06',
    username: 'budi_processowner',
    fullName: 'Budi Santoso (Process Owner)',
    title: 'Head of Payment Settlement & RTGS Operations',
    email: 'budi.santoso@banknusantara.co.id',
    role: 'PROCESS_OWNER',
    roleBadge: 'Client',
    roleDescription: 'Payment Settlement Owner, Interview Respondent & Workaround Subject',
    department: 'Divisi Settlement & Kliring',
    organization: 'PT Bank Nusantara Sejahtera Tbk',
    mfaEnabled: false,
    mfaType: 'SMS OTP',
    status: 'Active',
    passwordHashSnippet: '$argon2id$v=19$m=65536,t=3,p=4$YnVk...$4bNxT',
    lastLoginAt: '2025-02-27 11:25 WIB',
    lastLoginIp: '172.16.88.102 (Settlement Ops VLAN)',
    failedLoginAttempts: 1,
    maxFailedAttempts: 5,
    sessionTokenMasked: 'sess_po_22d4****************66c3',
    passwordExpiresDays: 30,
    permissions: ['INTERVIEW_RESPONDENT', 'BIA_WORKSHEET_VIEW'],
    avatarInitial: 'BU',
    assignedBySuperAdmin: 'usr-sa-01',
    assignedAt: '2025-01-15',
  },
  {
    id: 'usr-viw-07',
    username: 'executive_board',
    fullName: 'Executive Management (Audit / BOC)',
    title: 'Board of Commissioners & Audit Committee',
    email: 'audit.committee@banknusantara.co.id',
    role: 'VIEWER',
    roleBadge: 'Management',
    roleDescription: 'Read-only Executive Heatmaps, Compliance Reports & Board Dashboards',
    department: 'Komite Audit & Dewan Komisaris',
    organization: 'PT Bank Nusantara Sejahtera Tbk',
    mfaEnabled: true,
    mfaType: 'Hardware FIDO2',
    status: 'Active',
    passwordHashSnippet: '$argon2id$v=19$m=65536,t=3,p=4$Ym9j...$5zWqE',
    lastLoginAt: '2025-02-25 10:00 WIB',
    lastLoginIp: '172.16.10.5 (Boardroom Terminal)',
    failedLoginAttempts: 0,
    maxFailedAttempts: 5,
    sessionTokenMasked: 'sess_viw_11e7****************44b8',
    passwordExpiresDays: 90,
    permissions: ['BIA_WORKSHEET_VIEW', 'EXECUTIVE_HEATMAP_VIEW'],
    avatarInitial: 'EM',
    assignedBySuperAdmin: 'usr-sa-01',
    assignedAt: '2025-01-18',
  },
];

export interface RiskAssessmentData {
  id: string;
  code: string;
  category: string;
  riskName: string;
  affectedAsset: string;
  likelihood: number; // 1-5
  impact: number; // 1-5
  existingControl: string;
  mitigationPlan: string;
  pic: string;
  targetDate: string;
  status: string;
}

// Kategori Ancaman (Pedoman BCM §5.2.2.1)
export const RISK_CATEGORIES = [
  'Teknologi / Siber',
  'Infrastruktur',
  'Pihak Ketiga / Kontraktual',
  'Kepatuhan Syariah',
  'SDM Kunci',
  'Bencana Alam / Pandemi',
  'Regulasi / Reputasi',
  'Rantai Pasok Distribusi',
] as const;

// Continuity Risk Register starts empty; users input via the form.
export const INITIAL_RISKS: RiskAssessmentData[] = [];

export interface BcpActivationData {
  id: string;
  code: string;
  disasterType: string;
  severityLevel: number;
  activatedChapter: string;
  workingArrangement: string;
  affectedLocation: string;
  damageDescription: string;
  personnelSafety: string;
  affectedSystems: string;
  estRecoveryTime: string;
  activationTime: string;
  authorizedBy: string;
  status: string;
}

export const BCP_DISASTER_TYPES = ['Natural', 'Human', 'Cyber'] as const;
export const BCP_WORKING_ARRANGEMENTS = ['WFH', 'Alternate Site', 'Kombinasi'] as const;
export const BCP_STATUSES = ['Aktif', 'Stand-down', 'Ditutup'] as const;

export const INITIAL_BCP: BcpActivationData[] = [];

export interface AuditLogData {  id: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  recordName: string;
  details: string;
  timestamp: string;
}

export const INITIAL_AUDIT_LOGS: AuditLogData[] = [
  {
    id: 'aud-1',
    userName: 'Dr. Hendra Gunawan',
    userRole: 'SUPER_ADMIN',
    action: 'CREATE',
    module: 'PROJECT',
    recordName: INITIAL_PROJECT.name,
    details: 'Setup project kick-off ISO 22301:2019 & penetapan metodologi dual-track BIA.',
    timestamp: '2025-01-15 09:30',
  },
  {
    id: 'aud-2',
    userName: 'Sarah Wijaya, MBCI',
    userRole: 'BCM_CONSULTANT',
    action: 'APPROVE',
    module: 'BIA',
    recordName: 'PROC-001 (Settlement RTGS & BI-FAST)',
    details: 'Disetujui dalam BIA Validation Workshop (Tier 1, RTO ≤ 2 Jam, MTPD ≤ 4 Jam, RPO ≤ 15 Menit).',
    timestamp: '2025-02-18 16:00',
  },
  {
    id: 'aud-3',
    userName: 'Bambang Pratama, M.Sc',
    userRole: 'PROCESS_OWNER',
    action: 'UPDATE',
    module: 'BIA',
    recordName: 'PROC-002 (Mobile Banking & Open API)',
    details: 'Pembaruan estimasi financial loss downtime 4 jam menjadi Rp 12.5 Miliar.',
    timestamp: '2025-02-20 11:15',
  },
  {
    id: 'aud-4',
    userName: 'Farhan Malik, CISA',
    userRole: 'BCM_CONSULTANT',
    action: 'REVIEW',
    module: 'DRL',
    recordName: 'DOC-004 (Laporan Uji DRC Semester II 2024)',
    details: 'Status review diubah menjadi Accepted setelah verifikasi bukti failover drill Silverlake.',
    timestamp: '2025-02-22 14:40',
  },
  {
    id: 'aud-5',
    userName: 'Dewi Lestari, S.Kom',
    userRole: 'CLIENT_COORDINATOR',
    action: 'LOGIN',
    module: 'AUTH',
    recordName: 'Session Sso-Auth-Token',
    details: 'Autentikasi multi-faktor (MFA) berhasil dari jaringan korporat Bank.',
    timestamp: '2025-02-23 08:20',
  },
  {
    id: 'aud-6',
    userName: 'Sarah Wijaya, MBCI',
    userRole: 'BCM_CONSULTANT',
    action: 'UPDATE',
    module: 'STAKEHOLDER',
    recordName: 'Direktur Operasi & IT (Key Approver)',
    details: 'Pembaruan engagement level menjadi High Support dan matriks RACI Clause 5.3.',
    timestamp: '2025-02-24 10:05',
  },
];

export const INITIAL_SECURITY_LOGS: SecurityEventLog[] = [
  {
    id: 'sec-001',
    timestamp: '2025-02-28 08:15:22 WIB',
    userId: 'usr-sa-01',
    userName: 'Super Administrator',
    userRole: 'SUPER_ADMIN',
    eventType: 'LOGIN_SUCCESS',
    severity: 'INFO',
    ipAddress: '10.14.20.101',
    details: 'Login berhasil via FIDO2 Hardware Token WebAuthn. Session token dienkripsi TLS 1.3.',
  },
  {
    id: 'sec-002',
    timestamp: '2025-02-28 07:45:10 WIB',
    userId: 'usr-po-06',
    userName: 'Budi Santoso',
    userRole: 'PROCESS_OWNER',
    eventType: 'LOGIN_FAILED',
    severity: 'WARNING',
    ipAddress: '172.16.88.102',
    details: 'Percobaan login kata sandi salah (1/5). Akun masih aman dari brute-force threshold.',
  },
  {
    id: 'sec-003',
    timestamp: '2025-02-27 15:20:00 WIB',
    userId: 'usr-viw-07',
    userName: 'Executive Management',
    userRole: 'VIEWER',
    eventType: 'UNAUTHORIZED_ACCESS_ATTEMPT',
    severity: 'CRITICAL_SECURITY_ALERT',
    ipAddress: '172.16.10.5',
    details: 'Upaya akses ditolak pada endpoint konfigurasi sistem (/system-config). Role VIEWER tidak memiliki izin SYSTEM_CONFIG_MANAGE.',
    mitigationAction: 'Security Access Guard memblokir request dan mencatat audit trace.',
  },
  {
    id: 'sec-004',
    timestamp: '2025-02-27 10:10:45 WIB',
    userId: 'usr-bcm-03',
    userName: 'Sarah Wijaya, MBCI',
    userRole: 'BCM_CONSULTANT',
    eventType: 'MFA_CHALLENGE',
    severity: 'INFO',
    ipAddress: '192.168.10.45',
    details: 'Verifikasi TOTP 6-digit berhasil untuk otorisasi perubahan parameter BIA.',
  },
];
