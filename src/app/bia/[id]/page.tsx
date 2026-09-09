'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBcm } from '@/lib/store';
import {
  calculateSuggestedMtpd,
  validateRtoAgainstMtpd,
  parseHoursFromString,
  evaluateCriticality,
} from '@/lib/bcm-engine';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Sparkles,
  Building,
  UserCheck,
  Server,
  FileCheck2,
  Lock,
  Layers,
  Check,
  FileText,
  Upload,
  Printer,
  ChevronRight,
  Database,
  Users,
  Building2,
  HardDrive,
  RefreshCw,
  Sliders,
  DollarSign,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Cpu,
  Radio,
  FileSpreadsheet,
  CheckSquare,
  Plus,
  Trash2,
  Key,
  Laptop,
  Network,
  ExternalLink,
  FileDown,
  Award,
  CheckCheck,
  FileCheck
} from 'lucide-react';

const WIZARD_STEPS = [
  { step: 1, title: 'Process Profile', desc: 'Identitas & Master Proses' },
  { step: 2, title: 'Operating Profile', desc: 'Volume & Target MBCO' },
  { step: 3, title: 'Impact Matrix', desc: 'Matriks 6 Kategori Dampak' },
  { step: 4, title: 'MTPD / MAO', desc: 'Batas Maksimum Disrupsi' },
  { step: 5, title: 'RTO Target', desc: 'Target Waktu Pemulihan' },
  { step: 6, title: 'RPO Target', desc: 'Toleransi Kehilangan Data' },
  { step: 7, title: 'Dependencies', desc: 'Sistem, Vendor & Fasilitas' },
  { step: 8, title: 'Min Resources', desc: 'Staf & Fasilitas Darurat' },
  { step: 9, title: 'Workarounds', desc: 'Prosedur Kontingensi Manual' },
  { step: 10, title: 'Criticality & SPOF', desc: 'Evaluasi Tier & Konsentrasi Risiko' },
  { step: 11, title: 'Evidence', desc: 'Dokumen DRL & Bukti Audit' },
  { step: 12, title: 'Review & Sign-Off', desc: 'Verifikasi & Pengajuan Workshop' },
];

const IMPACT_CATEGORIES = [
  { key: 'Financial', label: 'Dampak Finansial & Kerugian Langsung', desc: 'Kerugian moneter, denda regulator, penalti kontrak' },
  { key: 'Operational', label: 'Dampak Operasional & Layanan', desc: 'Terhentinya transaksi nasabah & gangguan pemrosesan internal' },
  { key: 'Customer', label: 'Dampak Kepuasan Nasabah & Publik', desc: 'Keluhan nasabah, penumpukan antrean, eskalasi publik' },
  { key: 'Regulatory', label: 'Kepatuhan Regulasi & Bank Indonesia / OJK', desc: 'Sanksi regulasi, teguran BI/OJK, sanksi operasional' },
  { key: 'Reputation', label: 'Dampak Reputasi & Kepercayaan Pasar', desc: 'Pemberitaan media, sentimen pasar, reputasi brand bank' },
  { key: 'Legal & Contractual', label: 'Dampak Hukum & Wanprestasi Kontrak', desc: 'Tuntutan hukum mitra bank, pelanggaran klausul SLA' },
];

const TIMEFRAMES = ['<1h', '1-2h', '2-4h', '4-8h', '8-24h', '2d', '3d', '7d'];

const IMPACT_SCALE_GUIDE = [
  { score: 1, label: 'Insignificant (Sangat Ringan)', color: 'bg-emerald-100 text-emerald-900 border-emerald-300', desc: 'Kerugian < Rp 10 Jt; Tidak ada komplain publik; Operasional normal dalam 1 jam.' },
  { score: 2, label: 'Minor (Ringan)', color: 'bg-lime-100 text-lime-900 border-lime-300', desc: 'Kerugian Rp 10 Jt - Rp 100 Jt; Komplain terbatas nasabah perorangan; Tertangani tim lokal.' },
  { score: 3, label: 'Moderate (Sedang)', color: 'bg-amber-100 text-amber-900 border-amber-300', desc: 'Kerugian Rp 100 Jt - Rp 1 Miliar; Keluhan media sosial; Peringatan informal regulator.' },
  { score: 4, label: 'Major (Berat)', color: 'bg-orange-100 text-orange-900 border-orange-300', desc: 'Kerugian Rp 1 Miliar - Rp 10 Miliar; Sorotan media nasional; Potensi sanksi finansial BI/OJK.' },
  { score: 5, label: 'Severe (Kritis / Katastropik)', color: 'bg-red-500 text-white font-black border-red-600', desc: 'Kerugian > Rp 10 Miliar; Pembekuan izin kliring/transaksi; Mengancam kelangsungan hidup bank.' },
];

export default function BiaWizardPage() {
  const params = useParams();
  const router = useRouter();
  const processId = (params?.id as string) || 'proc-01';
  const { processes, getBiaDraft, saveBiaAssessment, addAuditLog, documents } = useBcm();

  // Find current process by ID or Code
  const currentProcess = processes.find(
    (p) =>
      p.id.toLowerCase() === processId.toLowerCase() ||
      p.code.toLowerCase() === processId.toLowerCase()
  ) || processes[0];

  const existingDraft = getBiaDraft(currentProcess.id);

  const [currentStep, setCurrentStep] = useState(existingDraft ? existingDraft.step : 1);
  const [lastSaved, setLastSaved] = useState(existingDraft?.lastSavedAt || 'Belum disimpan');
  const [autoSaveNotice, setAutoSaveNotice] = useState(false);

  // Form State: Step 1 - Process Profile
  const [processCategory, setProcessCategory] = useState('Core Settlement & Payment Operations');
  const [isoScopeStatus, setIsoScopeStatus] = useState('In-Scope (ISO 22301 Certified Scope)');
  const [operationalHours, setOperationalHours] = useState(currentProcess.operatingHours || '24/7 (Real-Time Switch & RTGS Window)');
  const [processOwnerContact, setProcessOwnerContact] = useState('budi.santoso@banknusantara.co.id • Ext. 8421 • HP 0812-8901-2345');
  const [processInputs, setProcessInputs] = useState(currentProcess.inputs || 'Instruksi pembayaran nasabah (ISO 20022/MT103), Pesan transaksi kanal digital');
  const [processOutputs, setProcessOutputs] = useState(currentProcess.outputs || 'Konfirmasi setelmen BI Gateway, Pembaruan ledger rekening korporasi, Jurnal akuntansi');

  // Form State: Step 2 - Operating Profile & MBCO
  const [normalCapacity, setNormalCapacity] = useState(
    existingDraft?.normalCapacity || currentProcess.transactionVolume || '450.000 transaksi / hari (~Rp 8.5 Triliun/hari)'
  );
  const [mbcoPercentage, setMbcoPercentage] = useState('33%');
  const [minimumCapacity, setMinimumCapacity] = useState(
    existingDraft?.minimumCapacity || 'MBCO: 150.000 transaksi / hari (~Rp 3 Triliun/hari) — Prioritas Korporasi & Settlement BI Darurat'
  );
  const [mbcoScopeDescription, setMbcoScopeDescription] = useState(
    'Layanan yang WAJIB beroperasi saat bencana: Settlement RTGS antarbank volume besar dan payroll korporasi. Transaksi ritel bernilai kecil (< Rp 5 Juta) dapat dialihkan sementara.'
  );
  const [peakPeriod, setPeakPeriod] = useState(
    existingDraft?.peakPeriodDetails || currentProcess.peakPeriod || 'Hari kerja pukul 10:00 - 14:00 & Akhir Bulan (Tgl 25 - 30)'
  );
  const [peakMultiplier, setPeakMultiplier] = useState('2.4x Volume Normal');
  const [cutOffDeadline, setCutOffDeadline] = useState('16:30 WIB (Cut-off BI-RTGS & SSSS)');
  const [dailyFinancialValue, setDailyFinancialValue] = useState(
    currentProcess.financialValue || 'Rp 8.5 Triliun / hari (Rata-rata kliring antarbank)'
  );
  const [mbcoOperatingMode, setMbcoOperatingMode] = useState('Mode Darurat Restriksi: 24/7 Transaksi Prioritas Kritis');
  const [maintainedServices, setMaintainedServices] = useState(
    '1. Setelmen RTGS Nilai Besar (> Rp 100 Juta)\n2. Payroll Korporasi Kritis\n3. Antrean Prioritas BI-FAST Interbank'
  );
  const [deferredServices, setDeferredServices] = useState(
    '1. Transaksi Ritel Batch Nilai Kecil (< Rp 1 Juta)\n2. Permintaan e-Statement Historis\n3. Pemrosesan Kliring Giro Warkat Fisik Non-Elektronik'
  );
  const [peakScenarioMitigation, setPeakScenarioMitigation] = useState(
    'Jika disrupsi terjadi pada akhir bulan (cut-off gaji), alokasikan kuota bandwidth dedicated DRC dan aktifkan perpanjangan cut-off darurat Bank Indonesia.'
  );

  // Form State: Step 3 - Impact Scores Matrix [cat][timeframe]
  const [impactScores, setImpactScores] = useState<Record<string, Record<string, number>>>(
    existingDraft?.impactScores || {
      Financial: { '<1h': 1, '1-2h': 2, '2-4h': 4, '4-8h': 5, '8-24h': 5, '2d': 5, '3d': 5, '7d': 5 },
      Operational: { '<1h': 2, '1-2h': 3, '2-4h': 4, '4-8h': 5, '8-24h': 5, '2d': 5, '3d': 5, '7d': 5 },
      Customer: { '<1h': 1, '1-2h': 3, '2-4h': 4, '4-8h': 5, '8-24h': 5, '2d': 5, '3d': 5, '7d': 5 },
      Regulatory: { '<1h': 1, '1-2h': 2, '2-4h': 3, '4-8h': 5, '8-24h': 5, '2d': 5, '3d': 5, '7d': 5 },
      Reputation: { '<1h': 1, '1-2h': 2, '2-4h': 4, '4-8h': 5, '8-24h': 5, '2d': 5, '3d': 5, '7d': 5 },
      'Legal & Contractual': { '<1h': 1, '1-2h': 1, '2-4h': 3, '4-8h': 4, '8-24h': 5, '2d': 5, '3d': 5, '7d': 5 },
    }
  );

  // Form State: Step 4 - MTPD / MAO
  const [approvedMtpd, setApprovedMtpd] = useState(existingDraft?.approvedMtpd || '4 Hours');
  const [mtpdRationale, setMtpdRationale] = useState(
    'Batas toleransi maksimal 4 jam ditetapkan karena pada jam ke-4, akumulasi antrean transaksi kliring antarbank melanggar cut-off PADG Bank Indonesia No. 23/2021 dan menimbulkan penalti denda likuiditas sistemik serta risiko tuntutan nasabah institusional.'
  );

  // Form State: Step 5 - RTO Target
  const [targetRto, setTargetRto] = useState(existingDraft?.targetRto || '2 Hours');
  const [rtoStrategy, setRtoStrategy] = useState('Hot Standby Active-Passive (DRC Surabaya Replicated)');
  const [lastDrDrillResult, setLastDrDrillResult] = useState('Uji Simulasi Q4 2024: 1 Jam 42 Menit (Passed SLA)');
  const [rtoPhase1, setRtoPhase1] = useState('0 - 30 Menit: Deteksi kegagalan, eskalasi insiden ke BCM Incident Commander & keputusan failover');
  const [rtoPhase2, setRtoPhase2] = useState('30 - 90 Menit: Eksekusi switchover gateway & routing koneksi ke DRC Surabaya');
  const [rtoPhase3, setRtoPhase3] = useState('90 - 120 Menit: Uji validasi data queue, integrasi ke BI Gateway, dan pembukaan layanan kapasitas MBCO');

  // Form State: Step 6 - RPO Target
  const [targetRpo, setTargetRpo] = useState(existingDraft?.targetRpo || '15 Minutes');
  const [rpoDataLossTolerance, setRpoDataLossTolerance] = useState('Maksimum 4.500 transaksi atau ekuivalen Rp 85 Miliar data loss');
  const [replicationMethod, setReplicationMethod] = useState('Active-Passive Asynchronous Storage Replication dengan auto log-shipping 15 menit');
  const [replicationBandwidth, setReplicationBandwidth] = useState('Dedicated Dark Fiber 5 Gbps + SD-WAN Backup');
  const [backupSchedule, setBackupSchedule] = useState('Continuous WAL Streaming + Full DB Snapshot pukul 00:00 WIB');
  const [reconciliationProcedure, setReconciliationProcedure] = useState(
    'Rekonsiliasi transaksi offline menggunakan audit trail log BI Gateway dan end-of-day bank balance matching dengan Bank Indonesia.'
  );

  // Form State: Step 7 - Dependencies
  const [dependencies, setDependencies] = useState([
    { id: 'dep-1', type: 'IT Application', name: 'Core Banking System (Silverlake Axis)', rto: '2 Hours', spof: true, notes: 'Database terpusat nasabah dan buku besar' },
    { id: 'dep-2', type: 'IT Application', name: 'BI-FAST Settlement Switch Gateway', rto: '1 Hour', spof: true, notes: 'Konektor resmi ke Payment Switch Bank Indonesia' },
    { id: 'dep-3', type: 'Vendor Partner', name: 'Silverlake Axis Ltd (L3 Support 24/7)', rto: '1 Hour (SLA Response)', spof: true, notes: 'Kontrak SLA 99.98% availability' },
    { id: 'dep-4', type: 'Facility / DC', name: 'Primary DC Serpong & DRC Surabaya', rto: '2 Hours (Failover)', spof: false, notes: 'Dual site terhubung dedicated FO 5 Gbps' },
    { id: 'dep-5', type: 'Key Personnel', name: 'Tim Settlement Officer Berlisensi Bank Indonesia (4 Orang)', rto: '1 Hour', spof: true, notes: 'Memiliki kewenangan token otorisasi BI-RTGS' },
  ]);
  const [showAddDepModal, setShowAddDepModal] = useState(false);
  const [newDepName, setNewDepName] = useState('');
  const [newDepType, setNewDepType] = useState('IT Application');
  const [newDepRto, setNewDepRto] = useState('2 Hours');
  const [newDepSpof, setNewDepSpof] = useState(false);
  const [newDepNotes, setNewDepNotes] = useState('');

  // Form State: Step 8 - Minimum Resources
  const [resources, setResources] = useState([
    { timeHorizon: '0–2 Jam (Emergency / Skeleton)', staff: 4, roles: '1 Lead Settlement, 2 Switch Operator, 1 DB Admin', hardware: '4 Unit PC Workstation + Dual Token BI', location: 'Control Room HO / DRC Surabaya' },
    { timeHorizon: '2–4 Jam (MBCO Operations)', staff: 8, roles: '2 Supervisor, 4 Settlement Staff, 2 IT Support', hardware: '8 Laptop Terenkripsi + VPN Dedicated', location: 'Alternate Site Sentul / DRC Surabaya' },
    { timeHorizon: '4–24 Jam (Extended Recovery)', staff: 14, roles: 'Full Settlement Shift + Reconciliation Team', hardware: '14 Unit Workstations + Dedicated Printers', location: 'Alternate Site Sentul & Secure Remote' },
    { timeHorizon: '> 24 Jam (Normalized Operations)', staff: 20, roles: 'Kapasitas Penuh Operasional Normal', hardware: '20 Unit Workstations Lengkap', location: 'Alternate Site / Pulih ke Primary Site' },
  ]);
  const [resourceChecklist, setResourceChecklist] = useState({
    dualTokenBi: true,
    encryptedLaptops: true,
    dedicatedVpn: true,
    recordedDealingPhone: true,
    satelliteBackup: true,
  });

  // Form State: Step 9 - Workaround Strategy
  const [workaroundStrategy, setWorkaroundStrategy] = useState(
    existingDraft?.workaroundStrategy ||
      'Peralihan otomatis failover ke Disaster Recovery Center (DRC) Surabaya dengan data sync replikasi 15 menit. Jika koneksi BI-FAST gagal, sistem mengaktifkan antrean lokal (local spooling queue) dan transaksi dialihkan sementara ke jalur SKNBI batch kliring berikutnya.'
  );
  const [workaroundType, setWorkaroundType] = useState('Peralihan Otomatis Failover DRC + Secondary Batch Queue');
  const [workaroundMaxDuration, setWorkaroundMaxDuration] = useState('Maksimal 4 Jam (Sebelum antrean spooling melebihi kapasitas memori switch)');
  const [workaroundActivationTrigger, setWorkaroundActivationTrigger] = useState('Downtime sistem primer melampaui 30 menit & deklarasi BCM Incident Commander');
  const [workaroundResidualRisk, setWorkaroundResidualRisk] = useState('Potensi penumpukan antrean kliring hingga batch berikutnya & proses rekonsiliasi manual');
  const [backlogCatchupPlan, setBacklogCatchupPlan] = useState(
    'Setelah switch pulih, transaksi yang tersimpan pada antrean offline diproses dengan throttling 500 TPS untuk menghindari overload pada core banking dan BI gateway.'
  );

  // Form State: Step 10 - Criticality & SPOF Mitigations
  const [spofMitigations, setSpofMitigations] = useState([
    {
      id: 'spof-m1',
      spof: 'Core Banking System (Silverlake Axis)',
      strategy: 'Failover otomatis ke DRC Surabaya & dedicated storage replication sync 15 menit',
      status: 'Ready / Teruji',
      owner: 'IT Ops & Vendor SLA',
    },
    {
      id: 'spof-m2',
      spof: 'BI-FAST Settlement Switch Gateway',
      strategy: 'Secondary offline spooling queue & pengalihan antrean batch darurat ke SKNBI',
      status: 'Ready / Teruji',
      owner: 'Settlement & Network Ops',
    },
    {
      id: 'spof-m3',
      spof: 'Silverlake Axis Ltd (Single Vendor)',
      strategy: 'Pemberlakuan klausul penalti SLA 99.98% & kajian rencana multi-vendor switch 2025',
      status: 'Monitoring',
      owner: 'Vendor Management',
    },
    {
      id: 'spof-m4',
      spof: 'Tim Settlement Berlisensi Bank Indonesia (4 Orang)',
      strategy: 'Cross-training 3 backup settlement officer berlisensi di alternate site DRC Surabaya',
      status: 'In Progress',
      owner: 'HR & Ops Risk Division',
    },
  ]);

  const [consultantCriticalityRationale, setConsultantCriticalityRationale] = useState(
    'Berdasarkan evaluasi dampak gabungan finansial (> Rp 10 Miliar) dan kepatuhan mutlak terhadap regulasi PADG Bank Indonesia No. 23/2021, proses ini diklasifikasikan secara definitif sebagai Tier 1 — Mission Critical dengan Prioritas Pemulihan P1 (RTO ≤ 2 Jam).'
  );

  // Form State: Step 11 - Supporting Evidence
  const [evidenceNotes, setEvidenceNotes] = useState(
    existingDraft?.evidenceNotes ||
      'SLA Bank Indonesia PADG No. 23/2021, Kontrak Pemeliharaan Silverlake 2024-2026, Hasil DRP Simulation Q4 2024, SOP Kontingensi Kliring Pembayaran v2.1.'
  );
  const [consultantInterviewNotes, setConsultantInterviewNotes] = useState(
    'Hasil wawancara dengan Kepala Divisi Settlement (Budi Santoso) dan VP IT Ops: Ketergantungan pada single gateway vendor telah diidentifikasi dan disepakati sebagai SPOF utama. Rekomendasi mitigasi disetujui untuk dipresentasikan pada Validation Workshop.'
  );

  const [evidenceDocs, setEvidenceDocs] = useState([
    {
      id: 'ED-01',
      code: 'PADG-BI-23-2021',
      name: 'SLA & Ketentuan Batas Waktu Setelmen BI-RTGS & SSSS',
      type: 'Regulasi Resmi',
      size: '2.4 MB',
      date: '10 Jan 2025',
      status: 'Verified',
    },
    {
      id: 'ED-02',
      code: 'SLA-SLV-2024',
      name: 'Kontrak Pemeliharaan & Garansi L3 Support Silverlake Axis 2024-2026',
      type: 'Kontrak Vendor',
      size: '4.8 MB',
      date: '05 Des 2024',
      status: 'Verified',
    },
    {
      id: 'ED-03',
      code: 'DRP-SIM-Q4-24',
      name: 'Laporan Hasil Uji Simulasi Failover Disaster Recovery Surabaya Q4 2024',
      type: 'Laporan Drill DR',
      size: '6.1 MB',
      date: '18 Nov 2024',
      status: 'Verified',
    },
    {
      id: 'ED-04',
      code: 'SOP-BCM-SET-02',
      name: 'Standar Prosedur Operasional Kontingensi Kliring & MBCO v2.1',
      type: 'SOP Internal',
      size: '1.8 MB',
      date: '02 Feb 2025',
      status: 'Draft Disetujui',
    },
    {
      id: 'ED-05',
      code: 'CERT-ISO-22301',
      name: 'Sertifikat ISO 22301:2019 Primary DC Serpong (Valid s/d 2026)',
      type: 'Sertifikasi ISO',
      size: '920 KB',
      date: '15 Agu 2024',
      status: 'Verified',
    },
  ]);

  const [showUploadEvidenceModal, setShowUploadEvidenceModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('SOP Internal');
  const [newDocCode, setNewDocCode] = useState('');

  const [interviewDate, setInterviewDate] = useState('15 Februari 2025');
  const [intervieweeName, setIntervieweeName] = useState('Budi Santoso (Kepala Divisi Settlement) & Hendra Wijaya (VP IT Ops)');
  const [interviewerName, setInterviewerName] = useState('Tim Lead Konsultan BCMS JMA');

  const [regulatoryCompliance, setRegulatoryCompliance] = useState([
    {
      reg: 'POJK No. 11/POJK.03/2022',
      clause: 'Pasal 42 - Ketahanan Operasional & Batas RTO Maksimal',
      status: 'Patuh (Compliant)',
      notes: 'RTO 2 jam memenuhi batas toleransi henti layanan perbankan',
    },
    {
      reg: 'PADG BI No. 23/2021',
      clause: 'Pasal 18 - Kepatuhan Jendela Setelmen Sistem Pembayaran',
      status: 'Patuh (Compliant)',
      notes: 'MTPD 4 jam sebelum cut-off kliring harian berakhir (16:30 WIB)',
    },
    {
      reg: 'ISO 22301:2019',
      clause: 'Klausul 8.2.2 - Business Impact Analysis Metodologi',
      status: 'Patuh (Compliant)',
      notes: '6 kategori dampak dinilai komprehensif melintasi 8 interval durasi',
    },
    {
      reg: 'ISO 22317:2021',
      clause: 'Klausul 7.3 - Analisis Ketergantungan & MBCO Target',
      status: 'Patuh (Compliant)',
      notes: 'Telah mendefinisikan batas minimum 33% transaksi MBCO darurat',
    },
  ]);

  // Form State: Step 12 - Sign-Off Matrix & Review
  const [signOffMatrix, setSignOffMatrix] = useState([
    {
      role: 'Process Owner (Pemilik Proses)',
      name: 'Budi Santoso',
      title: 'Head of Settlement & Clearing Division',
      status: 'Approved / Disetujui',
      date: '18 Feb 2025',
      note: 'Parameter RTO 2 Jam dan MBCO 33% telah disetujui unit bisnis.',
    },
    {
      role: 'Lead BCM Consultant',
      name: 'Tim Konsultan BCMS JMA',
      title: 'Senior BCM Lead Consultant',
      status: 'Verified / Terverifikasi',
      date: '18 Feb 2025',
      note: 'Seluruh klausul ISO 22301 Clause 8.2.2 dan POJK 11/2022 terpenuhi.',
    },
    {
      role: 'Head of Enterprise Risk',
      name: 'Dr. Irwan Setiawan',
      title: 'Chief Risk Officer (CRO)',
      status: 'Siap untuk Workshop Validasi',
      date: 'Pending Workshop',
      note: 'Akan disahkan secara formal pada sesi Validation Workshop.',
    },
  ]);

  const [activeReviewTab, setActiveReviewTab] = useState<'kpi' | 'impact' | 'dependencies' | 'resources'>('kpi');
  const [submittedToWorkshop, setSubmittedToWorkshop] = useState(false);

  // Form State: Step 12 - Sign-Off Checklist
  const [checklistVerification, setChecklistVerification] = useState({
    scopeConfirmed: true,
    impactMatrixCompleted: true,
    rtoCompliesWithMtpd: true,
    rpoReplicationVerified: true,
    resourcesConfirmedByUnit: true,
    spofMitigationNoted: true,
  });

  // Dynamic calculations via engine
  const flattenedScores = Object.entries(impactScores).flatMap(([category, tfMap]) =>
    Object.entries(tfMap).map(([timeframe, severityScore]) => ({
      category,
      timeframe,
      severityScore,
    }))
  );

  const rtoHours = parseHoursFromString(targetRto);
  const mtpdHours = parseHoursFromString(approvedMtpd);
  const rtoValidation = validateRtoAgainstMtpd(rtoHours, mtpdHours);

  const engineOutput = evaluateCriticality({
    impactScores: flattenedScores,
    rtoHours,
    hasSingleVendor: true,
    hasManualWorkaround: false,
    isCriticalRegulator: true,
  });

  // Safety buffer calculation: MTPD - RTO
  const safetyBufferHours = Math.max(0, mtpdHours - rtoHours);
  const safetyBufferPercentage = mtpdHours > 0 ? Math.round((safetyBufferHours / mtpdHours) * 100) : 0;

  const [impactRationale, setImpactRationale] = useState(
    'Dampak eskalasi finansial melonjak menjadi Major (Skor 4) pada jam ke-2 hingga 4 karena denda keterlambatan settlement Bank Indonesia dan penalti SLA nasabah korporat. Pada jam ke-4 ke atas, dampak menjadi Severe (Skor 5) akibat kegagalan batas cut-off kliring harian.'
  );

  const applyPresetHighCritical = () => {
    setImpactScores({
      Financial: { '<1h': 1, '1-2h': 2, '2-4h': 4, '4-8h': 5, '8-24h': 5, '2d': 5, '3d': 5, '7d': 5 },
      Operational: { '<1h': 2, '1-2h': 3, '2-4h': 4, '4-8h': 5, '8-24h': 5, '2d': 5, '3d': 5, '7d': 5 },
      Customer: { '<1h': 1, '1-2h': 3, '2-4h': 4, '4-8h': 5, '8-24h': 5, '2d': 5, '3d': 5, '7d': 5 },
      Regulatory: { '<1h': 1, '1-2h': 2, '2-4h': 3, '4-8h': 5, '8-24h': 5, '2d': 5, '3d': 5, '7d': 5 },
      Reputation: { '<1h': 1, '1-2h': 2, '2-4h': 4, '4-8h': 5, '8-24h': 5, '2d': 5, '3d': 5, '7d': 5 },
      'Legal & Contractual': { '<1h': 1, '1-2h': 1, '2-4h': 3, '4-8h': 4, '8-24h': 5, '2d': 5, '3d': 5, '7d': 5 },
    });
    triggerAutoSave();
  };

  const applyPresetModerate = () => {
    setImpactScores({
      Financial: { '<1h': 1, '1-2h': 1, '2-4h': 2, '4-8h': 3, '8-24h': 4, '2d': 5, '3d': 5, '7d': 5 },
      Operational: { '<1h': 1, '1-2h': 2, '2-4h': 3, '4-8h': 4, '8-24h': 5, '2d': 5, '3d': 5, '7d': 5 },
      Customer: { '<1h': 1, '1-2h': 1, '2-4h': 2, '4-8h': 3, '8-24h': 4, '2d': 5, '3d': 5, '7d': 5 },
      Regulatory: { '<1h': 1, '1-2h': 1, '2-4h': 1, '4-8h': 2, '8-24h': 3, '2d': 4, '3d': 5, '7d': 5 },
      Reputation: { '<1h': 1, '1-2h': 1, '2-4h': 2, '4-8h': 3, '8-24h': 4, '2d': 5, '3d': 5, '7d': 5 },
      'Legal & Contractual': { '<1h': 1, '1-2h': 1, '2-4h': 1, '4-8h': 2, '8-24h': 3, '2d': 4, '3d': 5, '7d': 5 },
    });
    triggerAutoSave();
  };

  const resetPresetBaseline = () => {
    const blank: Record<string, Record<string, number>> = {};
    IMPACT_CATEGORIES.forEach((c) => {
      blank[c.key] = {};
      TIMEFRAMES.forEach((tf) => {
        blank[c.key][tf] = 1;
      });
    });
    setImpactScores(blank);
    triggerAutoSave();
  };

  const severeScoresCount = flattenedScores.filter((s) => s.severityScore === 5).length;
  const majorScoresCount = flattenedScores.filter((s) => s.severityScore === 4).length;

  const handleScoreChange = (cat: string, tf: string, score: number) => {
    setImpactScores((prev) => ({
      ...prev,
      [cat]: {
        ...(prev[cat] || {}),
        [tf]: score,
      },
    }));
    triggerAutoSave();
  };

  const triggerAutoSave = () => {
    setAutoSaveNotice(true);
    setTimeout(() => {
      setLastSaved(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setAutoSaveNotice(false);
    }, 600);
  };

  const handleAddDependency = () => {
    if (!newDepName.trim()) return;
    const newDep = {
      id: `dep-${Date.now()}`,
      type: newDepType,
      name: newDepName.trim(),
      rto: newDepRto,
      spof: newDepSpof,
      notes: newDepNotes.trim() || 'Ketergantungan operasional terverifikasi',
    };
    setDependencies((prev) => [...prev, newDep]);
    setNewDepName('');
    setNewDepNotes('');
    setNewDepSpof(false);
    setShowAddDepModal(false);
    triggerAutoSave();
  };

  const handleRemoveDependency = (id: string) => {
    setDependencies((prev) => prev.filter((d) => d.id !== id));
    triggerAutoSave();
  };

  const handleToggleSpof = (id: string) => {
    setDependencies((prev) =>
      prev.map((d) => (d.id === id ? { ...d, spof: !d.spof } : d))
    );
    triggerAutoSave();
  };

  const handleUpdateResource = (index: number, field: string, value: any) => {
    setResources((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    triggerAutoSave();
  };

  const handleAddEvidenceDoc = () => {
    if (!newDocName.trim()) return;
    const newDoc = {
      id: `ED-${Date.now().toString().slice(-4)}`,
      code: newDocCode.trim() || `DOC-${Date.now().toString().slice(-3)}`,
      name: newDocName.trim(),
      type: newDocType,
      size: '1.4 MB',
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Verified',
    };
    setEvidenceDocs((prev) => [...prev, newDoc]);
    setNewDocName('');
    setNewDocCode('');
    setShowUploadEvidenceModal(false);
    triggerAutoSave();
  };

  const handleRemoveEvidenceDoc = (id: string) => {
    setEvidenceDocs((prev) => prev.filter((d) => d.id !== id));
    triggerAutoSave();
  };

  const handleSaveDraft = () => {
    saveBiaAssessment({
      processId: currentProcess.id,
      step: currentStep,
      normalCapacity,
      minimumCapacity,
      peakPeriodDetails: peakPeriod,
      impactScores,
      suggestedMtpd: engineOutput.suggestedMtpd,
      approvedMtpd,
      targetRto,
      targetRpo,
      workaroundStrategy,
      evidenceNotes,
      resourceRequirements: resources.map((r) => ({
        timeHorizon: r.timeHorizon,
        minimumStaff: r.staff,
        applications: 'Core Banking, BI-FAST Gateway',
        workstations: r.staff,
        workspaceLocation: r.location,
      })),
      criticalityScore: engineOutput.criticalityScore,
      criticalityTier: engineOutput.criticalityTier,
      recoveryPriority: engineOutput.recoveryPriority,
      spofDetected: engineOutput.isSpofDetected,
      spofReasons: engineOutput.spofReasons,
      completenessScore: engineOutput.completenessScore,
      lastSavedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'In Assessment',
    });
    setLastSaved(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    alert('Draft BIA berhasil disimpan! Data tersinkronisasi dan aman.');
  };

  const handleSubmitFinal = () => {
    if (!rtoValidation.isValid) {
      alert(`Validasi ISO 22301 Gagal: ${rtoValidation.warning}`);
      return;
    }

    saveBiaAssessment({
      processId: currentProcess.id,
      step: 12,
      normalCapacity,
      minimumCapacity,
      peakPeriodDetails: peakPeriod,
      impactScores,
      suggestedMtpd: engineOutput.suggestedMtpd,
      approvedMtpd,
      targetRto,
      targetRpo,
      workaroundStrategy,
      evidenceNotes,
      resourceRequirements: resources.map((r) => ({
        timeHorizon: r.timeHorizon,
        minimumStaff: r.staff,
        applications: 'Core Banking, BI-FAST Gateway',
        workstations: r.staff,
        workspaceLocation: r.location,
      })),
      criticalityScore: engineOutput.criticalityScore,
      criticalityTier: engineOutput.criticalityTier,
      recoveryPriority: engineOutput.recoveryPriority,
      spofDetected: engineOutput.isSpofDetected,
      spofReasons: engineOutput.spofReasons,
      completenessScore: 98,
      lastSavedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'Validated',
    });

    addAuditLog(
      'SUBMIT_BIA_WORKSHOP',
      'BIA Assessment',
      currentProcess.code,
      `BIA untuk ${currentProcess.name} berhasil disubmit dengan MTPD: ${approvedMtpd}, RTO: ${targetRto}, RPO: ${targetRpo}, Tier: ${engineOutput.criticalityTier}`
    );

    alert(`BIA ${currentProcess.code} berhasil divalidasi dan diajukan ke Validation Workshop Board!`);
    router.push('/workshop');
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full p-4 md:p-6 pb-28">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <Link
            href="/bia"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#00A9CE] mb-2 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Register BIA</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm font-black text-cyan-900 bg-cyan-100 border border-cyan-300 px-3 py-1 rounded-xl shadow-xs">
              {currentProcess.code}
            </span>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              {currentProcess.name}
            </h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
              {existingDraft?.status || currentProcess.status}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#0B1F3A] text-cyan-300 border border-cyan-800">
              {engineOutput.criticalityTier}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm self-end lg:self-auto shrink-0">
          <div className="text-right">
            <div className="text-slate-400 text-xs font-semibold">Status Penyimpanan</div>
            <div className="text-slate-700 font-bold text-xs">
              {autoSaveNotice ? (
                <span className="text-cyan-600 animate-pulse font-extrabold flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Menyimpan perubahan...
                </span>
              ) : (
                `Tersimpan: ${lastSaved}`
              )}
            </div>
          </div>
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold rounded-xl flex items-center gap-2 shadow-sm text-sm cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4 text-[#00A9CE]" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {/* 12-Step Progress Indicator Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              ISO 22317:2021 BIA Framework
            </span>
            <span className="text-xs font-bold text-slate-500">
              Langkah <strong className="text-slate-900">{currentStep}</strong> dari 12
            </span>
          </div>
          <span className="text-xs font-extrabold text-slate-700">
            {Math.round((currentStep / 12) * 100)}% Selesai
          </span>
        </div>

        {/* Horizontal Stepper */}
        <div className="overflow-x-auto pb-2 -mb-2">
          <div className="flex items-center min-w-[980px] gap-2">
            {WIZARD_STEPS.map((s) => {
              const isActive = currentStep === s.step;
              const isDone = currentStep > s.step;
              return (
                <button
                  key={s.step}
                  onClick={() => setCurrentStep(s.step)}
                  className={`flex flex-col items-center gap-1.5 flex-1 p-2 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-50/70 border border-cyan-300 shadow-xs'
                      : isDone
                      ? 'hover:bg-emerald-50/50'
                      : 'hover:bg-slate-50 opacity-70 hover:opacity-100'
                  }`}
                  title={`${s.step}. ${s.title} — ${s.desc}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isActive
                        ? 'bg-[#00A9CE] text-slate-950 ring-4 ring-cyan-200 scale-110 shadow-sm'
                        : isDone
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500 border border-slate-300'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-xs font-bold whitespace-nowrap ${
                        isActive ? 'text-cyan-900 font-extrabold' : isDone ? 'text-emerald-900' : 'text-slate-600'
                      }`}
                    >
                      {s.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[85px] hidden md:block">
                      {s.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RTO Warning Banner if RTO > MTPD */}
      {!rtoValidation.isValid && (
        <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-950 mb-6 flex items-start gap-3.5 shadow-sm">
          <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-black text-red-950 text-base">Validasi ISO 22301 Gagal: RTO Melampaui MTPD</div>
            <p className="mt-1 leading-relaxed font-medium text-red-900">{rtoValidation.warning}</p>
            <div className="mt-2 text-xs font-bold text-red-800 bg-red-100/80 px-2.5 py-1 rounded-lg inline-block">
              Perbaiki Target RTO pada Langkah 5 agar bernilai lebih kecil atau sama dengan MTPD ({approvedMtpd}).
            </div>
          </div>
        </div>
      )}

      {/* Wizard Step Content Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm flex-1 space-y-6">
        
        {/* STEP 1: Process Profile */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs uppercase font-extrabold text-[#00A9CE] tracking-wider">Langkah 1 dari 12</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">Profil Lengkap Proses Bisnis</h2>
              <p className="text-slate-600 text-sm mt-1">
                Data master diambil langsung dari Register Proses Bisnis dan diverifikasi oleh konsultan BCM.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <Building2 className="w-4 h-4 text-[#00A9CE]" />
                  <span>Unit Kerja & Process Owner</span>
                </div>
                <div>
                  <div className="font-extrabold text-slate-950 text-base">{currentProcess.unitName}</div>
                  <div className="text-sm text-slate-700 font-medium mt-0.5">{currentProcess.processOwnerName}</div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Kontak Darurat & Extension:</label>
                  <input
                    type="text"
                    value={processOwnerContact}
                    onChange={(e) => {
                      setProcessOwnerContact(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:border-[#00A9CE] focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
              </div>

              <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#00A9CE]" />
                  <span>Cakupan & Status Regulasi</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Klasifikasi Proses:</label>
                  <select
                    value={processCategory}
                    onChange={(e) => {
                      setProcessCategory(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:border-[#00A9CE]"
                  >
                    <option value="Core Settlement & Payment Operations">Core Settlement & Payment Operations (Kritis)</option>
                    <option value="Customer Facing Banking Channels">Customer Facing Banking Channels (Digital & Branch)</option>
                    <option value="Treasury & Liquidity Management">Treasury & Liquidity Management</option>
                    <option value="IT Infrastructure & Security Switching">IT Infrastructure & Security Switching</option>
                    <option value="Supporting Corporate Operations">Supporting Corporate Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Status Lingkup ISO 22301:</label>
                  <select
                    value={isoScopeStatus}
                    onChange={(e) => {
                      setIsoScopeStatus(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-emerald-800 bg-emerald-50/40 focus:border-[#00A9CE]"
                  >
                    <option value="In-Scope (ISO 22301 Certified Scope)">In-Scope (ISO 22301 Certified Scope — Mandatory)</option>
                    <option value="Secondary Scope (Phased Implementation)">Secondary Scope (Phased Implementation)</option>
                    <option value="Out of Scope">Out of Scope</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4 text-[#00A9CE]" />
                <span>Rincian Produk, Layanan & Alur Aktivitas</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-500">Produk & Layanan:</span>
                  <div className="font-extrabold text-slate-900 text-sm mt-0.5">{currentProcess.productService}</div>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500">Segmen Pelanggan / Stakeholder:</span>
                  <div className="font-extrabold text-slate-900 text-sm mt-0.5">{currentProcess.customers}</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Aktivitas Utama Proses (Step-by-step):</label>
                <div className="p-3.5 bg-white rounded-xl border border-slate-300 text-slate-800 text-sm leading-relaxed font-medium">
                  {currentProcess.keyActivities}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Input Krusial:</label>
                  <textarea
                    rows={2}
                    value={processInputs}
                    onChange={(e) => {
                      setProcessInputs(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:border-[#00A9CE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Output Krusial:</label>
                  <textarea
                    rows={2}
                    value={processOutputs}
                    onChange={(e) => {
                      setProcessOutputs(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:border-[#00A9CE]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Operating Profile & MBCO */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs uppercase font-extrabold text-[#00A9CE] tracking-wider">Langkah 2 dari 12</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Profil Operasional & Minimum Business Continuity Objective (MBCO)
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Definisikan batas kapasitas normal dan tingkat layanan minimum yang dapat diterima selama disrupsi (ISO 22301:2019 Clause 8.2.2).
              </p>
            </div>

            {/* Kapasitas Normal vs MBCO Target */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-900 text-sm">
                    Kapasitas Normal (100% Full Capacity)
                  </label>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-extrabold text-xs">
                    Baseline Normal
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-500 mb-1">Volume Transaksi Normal Harian:</span>
                  <input
                    type="text"
                    value={normalCapacity}
                    onChange={(e) => {
                      setNormalCapacity(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900 focus:border-[#00A9CE] focus:ring-2 focus:ring-cyan-100"
                    placeholder="e.g. 450.000 transaksi / hari"
                  />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-500 mb-1">Nilai Omset / Eksposur Finansial Harian:</span>
                  <input
                    type="text"
                    value={dailyFinancialValue}
                    onChange={(e) => {
                      setDailyFinancialValue(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900 focus:border-[#00A9CE]"
                    placeholder="e.g. Rp 8.5 Triliun / hari"
                  />
                </div>
              </div>

              <div className="p-5 bg-cyan-50/70 rounded-2xl border border-cyan-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-cyan-950 text-sm">
                    Target Persentase MBCO Darurat
                  </label>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-200 text-cyan-900 font-black text-xs">
                    {mbcoPercentage} Kapasitas
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { pct: '25%', label: '25% MBCO', desc: 'Minimalis' },
                    { pct: '33%', label: '33% MBCO', desc: 'Prioritas' },
                    { pct: '50%', label: '50% MBCO', desc: 'Moderat' },
                    { pct: '75%', label: '75% MBCO', desc: 'Tinggi' },
                  ].map((item) => (
                    <button
                      key={item.pct}
                      type="button"
                      onClick={() => {
                        setMbcoPercentage(item.pct);
                        triggerAutoSave();
                      }}
                      className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
                        mbcoPercentage === item.pct
                          ? 'bg-[#0B1F3A] text-cyan-300 shadow-md scale-105'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs font-black">{item.label}</div>
                      <div className="text-[10px] opacity-75">{item.desc}</div>
                    </button>
                  ))}
                </div>
                <div>
                  <span className="block text-xs font-bold text-cyan-900 mb-1">Target Kapasitas Minimum MBCO:</span>
                  <input
                    type="text"
                    value={minimumCapacity}
                    onChange={(e) => {
                      setMinimumCapacity(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-3 bg-white border border-cyan-300 rounded-xl font-bold text-sm text-slate-900 focus:border-[#00A9CE]"
                  />
                </div>
                <div>
                  <span className="block text-xs font-bold text-cyan-900 mb-1">Mode Jam Operasional Darurat:</span>
                  <input
                    type="text"
                    value={mbcoOperatingMode}
                    onChange={(e) => {
                      setMbcoOperatingMode(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-2.5 bg-white border border-cyan-300 rounded-xl text-xs font-bold text-slate-800 focus:border-[#00A9CE]"
                  />
                </div>
              </div>
            </div>

            {/* Perbandingan Layanan Prioritas vs Ditunda (ISO 22301 Best Practice) */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Layanan yang WAJIB Berjalan Saat Darurat (Maintained under MBCO):</span>
                </div>
                <textarea
                  rows={3}
                  value={maintainedServices}
                  onChange={(e) => {
                    setMaintainedServices(e.target.value);
                    triggerAutoSave();
                  }}
                  className="w-full p-3 bg-white border border-emerald-300 rounded-xl text-xs font-semibold text-slate-800 focus:border-emerald-500"
                />
                <p className="text-[11px] text-emerald-800 font-medium">
                  Transaksi nasabah bernilai tinggi, payroll korporasi, dan pemenuhan giro BI.
                </p>
              </div>

              <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Layanan yang Ditunda Sementara (Deferred / Suspended Services):</span>
                </div>
                <textarea
                  rows={3}
                  value={deferredServices}
                  onChange={(e) => {
                    setDeferredServices(e.target.value);
                    triggerAutoSave();
                  }}
                  className="w-full p-3 bg-white border border-amber-300 rounded-xl text-xs font-semibold text-slate-800 focus:border-amber-500"
                />
                <p className="text-[11px] text-amber-800 font-medium">
                  Layanan batch sekunder, pembukaan produk baru, dan pengarsipan e-statement.
                </p>
              </div>
            </div>

            {/* Analisis Periode Puncak (Peak Period) */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <TrendingUp className="w-4 h-4 text-[#00A9CE]" />
                <span>Analisis Periode Puncak & Batas Waktu Kritis (Peak Period & Cut-Off Analysis)</span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <label className="block font-bold text-slate-700 text-xs">Periode Puncak (Peak Period):</label>
                  <input
                    type="text"
                    value={peakPeriod}
                    onChange={(e) => {
                      setPeakPeriod(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <label className="block font-bold text-slate-700 text-xs">Peak Volume Multiplier:</label>
                  <input
                    type="text"
                    value={peakMultiplier}
                    onChange={(e) => {
                      setPeakMultiplier(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <label className="block font-bold text-slate-700 text-xs">Batas Cut-Off Harian (Cut-Off Time):</label>
                  <input
                    type="text"
                    value={cutOffDeadline}
                    onChange={(e) => {
                      setCutOffDeadline(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">
                  Skenario Mitigasi Jika Terjadi Disrupsi Pada Periode Puncak:
                </label>
                <textarea
                  rows={2}
                  value={peakScenarioMitigation}
                  onChange={(e) => {
                    setPeakScenarioMitigation(e.target.value);
                    triggerAutoSave();
                  }}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:border-[#00A9CE]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Impact Assessment Matrix */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-extrabold text-[#00A9CE] tracking-wider">Langkah 3 dari 12</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Penilaian Dampak Terhadap Waktu (Impact Over Time Matrix)
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Evaluasi eskalasi keparahan dampak pada 6 kategori ISO 22317:2021 melintasi 8 interval durasi henti.
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-slate-500">Preset Cepat:</span>
                <button
                  type="button"
                  onClick={applyPresetHighCritical}
                  className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 text-xs font-bold cursor-pointer transition-colors"
                >
                  Transaksi Kritis (High)
                </button>
                <button
                  type="button"
                  onClick={applyPresetModerate}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold cursor-pointer transition-colors"
                >
                  Layanan Normal (Moderate)
                </button>
                <button
                  type="button"
                  onClick={resetPresetBaseline}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold cursor-pointer transition-colors"
                >
                  Reset Skor (1)
                </button>
              </div>
            </div>

            {/* Dynamic Live Impact Intelligence Banner */}
            <div className="p-4 bg-[#0B1F3A] text-white rounded-2xl shadow-sm grid sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                    Titik Kritis Severe (Skor 5)
                  </span>
                  <span className="text-base font-black text-white">
                    Horizon {engineOutput.suggestedMtpd}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 border-y sm:border-y-0 sm:border-x border-slate-700/80 py-2 sm:py-0 sm:px-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Distribusi Dampak Tinggi
                  </span>
                  <span className="text-sm font-black text-white">
                    {severeScoresCount} Severe (5) • {majorScoresCount} Major (4)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                    Kategori Paling Rentan
                  </span>
                  <span className="text-sm font-black text-white">
                    Finansial, Regulasi & Operasional
                  </span>
                </div>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto border border-slate-300 rounded-2xl shadow-xs">
              <table className="w-full text-center border-collapse">
                <thead className="bg-[#0B1F3A] text-white">
                  <tr>
                    <th className="py-3.5 px-4 text-left text-xs font-extrabold tracking-wider uppercase min-w-[240px]">
                      Kategori Dampak
                    </th>
                    {TIMEFRAMES.map((tf) => {
                      const isTrigger = tf === '<1h' && engineOutput.suggestedMtpd === '1 Hour' ||
                        tf === '1-2h' && engineOutput.suggestedMtpd === '2 Hours' ||
                        tf === '2-4h' && engineOutput.suggestedMtpd === '4 Hours' ||
                        tf === '4-8h' && engineOutput.suggestedMtpd === '4 Hours';

                      return (
                        <th key={tf} className="py-3.5 px-2 text-center text-xs font-extrabold tracking-wider min-w-[65px]">
                          <div>{tf}</div>
                          {isTrigger && (
                            <span className="text-[9px] font-mono text-red-400 font-bold block -mt-0.5">MTPD</span>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {IMPACT_CATEGORIES.map((cat) => (
                    <tr key={cat.key} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-left bg-slate-50/60 border-r border-slate-200">
                        <div className="font-extrabold text-slate-900 text-sm">{cat.label}</div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">{cat.desc}</div>
                      </td>
                      {TIMEFRAMES.map((tf) => {
                        const score = impactScores[cat.key]?.[tf] || 1;
                        let colorClass = 'bg-emerald-100 text-emerald-950 font-extrabold';
                        if (score === 2) colorClass = 'bg-lime-100 text-lime-950 font-extrabold';
                        if (score === 3) colorClass = 'bg-amber-100 text-amber-950 font-extrabold';
                        if (score === 4) colorClass = 'bg-orange-200 text-orange-950 font-extrabold';
                        if (score === 5) colorClass = 'bg-red-500 text-white font-black shadow-sm';

                        return (
                          <td key={tf} className="p-2 border-r border-slate-100 last:border-r-0">
                            <select
                              value={score}
                              onChange={(e) => handleScoreChange(cat.key, tf, Number(e.target.value))}
                              className={`w-full py-2 px-1 rounded-xl text-center cursor-pointer border border-slate-300 text-sm font-black transition-all ${colorClass}`}
                              title={`Skor Dampak ${cat.label} pada ${tf}: ${score}`}
                            >
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                              <option value={5}>5</option>
                            </select>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Impact Scale Reference Guide */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-black text-sm">
                <HelpCircle className="w-4 h-4 text-[#00A9CE]" />
                <span>Panduan Skala Penilaian Dampak (Kualitatif & Kuantitatif ISO 22317)</span>
              </div>
              <div className="grid sm:grid-cols-5 gap-2.5">
                {IMPACT_SCALE_GUIDE.map((g) => (
                  <div key={g.score} className="p-3 bg-white rounded-xl border border-slate-200 text-left space-y-1">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-black border ${g.color}`}>
                      Skor {g.score}
                    </span>
                    <div className="font-extrabold text-slate-900 text-xs">{g.label}</div>
                    <div className="text-[11px] text-slate-600 font-medium leading-relaxed">{g.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Matrix Justification Notes */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block font-extrabold text-slate-900 text-sm">
                Rasionalisasi & Catatan Analisis Dampak Konsultan (Wajib Audit ISO 22301 / ISO 22317):
              </label>
              <textarea
                rows={3}
                value={impactRationale}
                onChange={(e) => {
                  setImpactRationale(e.target.value);
                  triggerAutoSave();
                }}
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:border-[#00A9CE]"
              />
              <p className="text-[11px] text-slate-500 font-medium">
                Jelaskan justifikasi kenaikan dampak seiring bertambahnya durasi disrupsi (misal: denda penalti BI PADG & komplain nasabah korporat).
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: MTPD / MAO */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs uppercase font-extrabold text-[#00A9CE] tracking-wider">Langkah 4 dari 12</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Maximum Tolerable Period of Disruption (MTPD / MAO)
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Titik waktu kritis di mana penghentian proses melampaui batas toleransi dan mengancam kelangsungan hidup organisasi (ISO 22301:2019 Clause 8.2.2).
              </p>
            </div>

            {/* Rekomendasi Algoritmik Card */}
            <div className="p-5 bg-gradient-to-r from-cyan-50 to-sky-50 rounded-2xl border-2 border-cyan-300 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00A9CE] text-[#0B1F3A] flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black text-cyan-900 uppercase tracking-wider">
                    Hasil Rekomendasi Algoritmik ISO 22317
                  </div>
                  <div className="text-3xl font-black text-[#0B1F3A] mt-0.5">{engineOutput.suggestedMtpd}</div>
                  <p className="text-xs text-cyan-950 font-medium mt-1 leading-relaxed">
                    Dihitung otomatis karena dampak pertama kali mencapai level <strong>Severe (Skor 5)</strong> pada horison waktu <strong>{engineOutput.suggestedMtpd}</strong>.
                  </p>
                </div>
              </div>

              {approvedMtpd !== engineOutput.suggestedMtpd && (
                <button
                  type="button"
                  onClick={() => {
                    setApprovedMtpd(engineOutput.suggestedMtpd);
                    triggerAutoSave();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#133C67] text-cyan-300 font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-colors"
                >
                  Terapkan Rekomendasi Sistem ({engineOutput.suggestedMtpd})
                </button>
              )}
            </div>

            {/* Timeline Eskalasi Kritis Disrupsi */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <Clock className="w-4 h-4 text-[#00A9CE]" />
                  <span>Timeline Eskalasi Menuju Titik Kritis (Breaking Point Spectrum)</span>
                </div>
                <span className="text-xs font-black text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                  Batas Toleransi: {approvedMtpd}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-700 block">0 — 1 Jam</span>
                  <div className="font-extrabold text-slate-900 text-xs mt-0.5">Operasional Tertoleransi</div>
                  <p className="text-[10px] text-slate-500 mt-1">Dampak insignifikan pada nasabah & regulasi</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-700 block">1 — 2 Jam</span>
                  <div className="font-extrabold text-slate-900 text-xs mt-0.5">Eskalasi Peringatan</div>
                  <p className="text-[10px] text-slate-500 mt-1">Keluhan nasabah perorangan mulai meningkat</p>
                </div>
                <div className="p-3 bg-cyan-50 rounded-xl border-2 border-cyan-400">
                  <span className="text-[10px] font-bold text-cyan-900 block">2 — 4 Jam</span>
                  <div className="font-black text-cyan-950 text-xs mt-0.5">Ambang Bahaya Finansial</div>
                  <p className="text-[10px] text-cyan-900 mt-1">Denda penalti antrean kliring BI berjalan</p>
                </div>
                <div className="p-3 bg-red-500 text-white rounded-xl shadow-sm">
                  <span className="text-[10px] font-black text-red-100 block">&gt; 4 Jam (MTPD)</span>
                  <div className="font-black text-white text-xs mt-0.5">Point of No Return</div>
                  <p className="text-[10px] text-red-100 mt-1">Pelanggaran regulasi & ancaman kelangsungan</p>
                </div>
              </div>
            </div>

            {/* Approved MTPD & Dampak Kritis */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block font-extrabold text-slate-900 text-sm">
                  Approved MTPD (Ditetapkan Bersama Konsultan & Pemilik Proses):
                </label>
                <select
                  value={approvedMtpd}
                  onChange={(e) => {
                    setApprovedMtpd(e.target.value);
                    triggerAutoSave();
                  }}
                  className="w-full p-3.5 bg-white border-2 border-[#00A9CE] rounded-xl font-black text-base text-slate-900 focus:outline-none shadow-sm"
                >
                  <option value="1 Hour">1 Hour (1 Jam)</option>
                  <option value="2 Hours">2 Hours (2 Jam)</option>
                  <option value="4 Hours">4 Hours (4 Jam — Standar BI)</option>
                  <option value="8 Hours">8 Hours (8 Jam)</option>
                  <option value="24 Hours">24 Hours (1 Hari)</option>
                  <option value="2 Days">2 Days (2 Hari)</option>
                  <option value="3 Days">3 Days (3 Hari)</option>
                  <option value="7 Days">7 Days (1 Minggu)</option>
                </select>
                <div className="p-3 bg-cyan-50/70 border border-cyan-200 rounded-xl text-xs text-cyan-900 font-medium">
                  ⓘ Ketetapan ISO 22301: Nilai Approved MTPD ini menjadi batas mutlak (upper boundary) di mana <strong>RTO target wajib berada di bawah nilai ini</strong>.
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
                  Konsekuensi Fatal Saat MTPD Tercapai
                </div>
                <ul className="text-xs space-y-2 text-slate-800 font-medium mt-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5"></span>
                    <span><strong>Finansial:</strong> Akumulasi denda bunga antarbank & penalti SLA nasabah korporat mencapai &gt; Rp 10 Miliar.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5"></span>
                    <span><strong>Regulator BI/OJK:</strong> Pelanggaran batas waktu cut-off PADG BI No. 23/2021 dengan ancaman sanksi suspensi hak kliring perbankan.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5"></span>
                    <span><strong>Nasabah & Reputasi:</strong> Terhentinya payroll puluhan ribu karyawan korporasi mitra dan pemberitaan krisis likuiditas di media nasional.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Kolom Justifikasi Wajib Audit */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block font-extrabold text-slate-900 text-sm">
                Rasionalisasi & Justifikasi Penetapan MTPD (Wajib untuk Kepatuhan Audit ISO 22301:2019 Clause 8.2.2):
              </label>
              <textarea
                rows={4}
                value={mtpdRationale}
                onChange={(e) => {
                  setMtpdRationale(e.target.value);
                  triggerAutoSave();
                }}
                className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:border-[#00A9CE]"
              />
              <p className="text-[11px] text-slate-500 font-medium">
                Auditor eksternal ISO 22301 mewajibkan dokumentasi tertulis mengenai alasan logis mengapa batas toleransi waktu disepakati pada durasi tersebut.
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: RTO Target */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-extrabold text-[#00A9CE] tracking-wider">Langkah 5 dari 12</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Recovery Time Objective (RTO) Target</h2>
                <p className="text-slate-600 text-sm mt-1">
                  Target waktu pemulihan sistem atau proses setelah deklarasi bencana/disrupsi. Sesuai ISO 22301:2019 Clause 8.2.2: <strong>RTO wajib ≤ MTPD</strong>.
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-slate-500">Preset Standar:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTargetRto('1 Hour');
                    triggerAutoSave();
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                    targetRto === '1 Hour'
                      ? 'bg-[#0B1F3A] text-cyan-300 border-[#0B1F3A]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  1 Jam (Kritis / Hot Standby)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetRto('2 Hours');
                    triggerAutoSave();
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                    targetRto === '2 Hours'
                      ? 'bg-[#0B1F3A] text-cyan-300 border-[#0B1F3A]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  2 Jam (Standar BI-RTGS)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetRto('4 Hours');
                    triggerAutoSave();
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                    targetRto === '4 Hours'
                      ? 'bg-[#0B1F3A] text-cyan-300 border-[#0B1F3A]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  4 Jam (Batas MTPD)
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Left Column: Target RTO & Recovery Architecture */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-extrabold text-slate-900 text-sm">Target RTO Proses (Recovery Target):</label>
                    <span className="text-xs font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded">
                      MTPD Rujukan: {approvedMtpd}
                    </span>
                  </div>
                  <select
                    value={targetRto}
                    onChange={(e) => {
                      setTargetRto(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-3.5 bg-white border-2 border-[#00A9CE] rounded-xl font-black text-base text-slate-900 focus:outline-none shadow-sm"
                  >
                    <option value="15 Minutes">15 Minutes (15 Menit)</option>
                    <option value="30 Minutes">30 Minutes (30 Menit)</option>
                    <option value="1 Hour">1 Hour (1 Jam)</option>
                    <option value="2 Hours">2 Hours (2 Jam — Standar Kliring BI)</option>
                    <option value="4 Hours">4 Hours (4 Jam)</option>
                    <option value="8 Hours">8 Hours (8 Jam)</option>
                    <option value="24 Hours">24 Hours (1 Hari)</option>
                    <option value="2 Days">2 Days (2 Hari)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700 text-xs">
                    Arsitektur & Strategi Pemulihan (Recovery Strategy):
                  </label>
                  <select
                    value={rtoStrategy}
                    onChange={(e) => {
                      setRtoStrategy(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:border-[#00A9CE]"
                  >
                    <option value="Hot Standby Active-Passive (DRC Surabaya Replicated)">
                      Hot Standby Active-Passive (DRC Surabaya Replicated)
                    </option>
                    <option value="Active-Active Multi-Site High Availability (Zero Cutover)">
                      Active-Active Multi-Site High Availability (Zero Cutover)
                    </option>
                    <option value="Warm Standby dengan Data Replication & VM Failover">
                      Warm Standby dengan Data Replication & VM Failover
                    </option>
                    <option value="Cold Standby / Cloud On-Demand Recovery">
                      Cold Standby / Cloud On-Demand Recovery
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700 text-xs">
                    Hasil Uji Simulasi DR Terakhir (Evidence DR Drill SLA):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={lastDrDrillResult}
                      onChange={(e) => {
                        setLastDrDrillResult(e.target.value);
                        triggerAutoSave();
                      }}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                    />
                    <span className="px-2.5 py-2 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-[11px] font-extrabold whitespace-nowrap">
                      ✓ SLA Passed
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Safety Buffer Card & ISO 22301 Compliance */}
              <div
                className={`p-5 rounded-2xl border-2 space-y-3 flex flex-col justify-between ${
                  rtoValidation.isValid ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-sm">
                      {rtoValidation.isValid ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <span>Validasi Kepatuhan ISO 22301:2019</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 bg-white/80 rounded-full border border-emerald-300">
                      Clause 8.2.2
                    </span>
                  </div>

                  <div className="text-3xl font-black mt-3">
                    {rtoValidation.isValid ? `Safety Buffer: ${safetyBufferHours} Jam` : 'VALIDASI GAGAL (RTO > MTPD)'}
                  </div>

                  {/* Visual Buffer Bar */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>RTO: {targetRto}</span>
                      <span>Buffer: {safetyBufferHours} Jam ({safetyBufferPercentage}%)</span>
                      <span>MTPD: {approvedMtpd}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
                      <div
                        className="bg-[#00A9CE] h-full"
                        style={{ width: `${Math.min(100, Math.max(10, (rtoHours / mtpdHours) * 100))}%` }}
                        title={`RTO: ${targetRto}`}
                      />
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${Math.max(0, 100 - (rtoHours / mtpdHours) * 100)}%` }}
                        title={`Safety Buffer: ${safetyBufferHours} Jam`}
                      />
                    </div>
                  </div>

                  <p className="text-xs font-medium mt-3 leading-relaxed">
                    {rtoValidation.isValid
                      ? `Target RTO (${targetRto}) berada di bawah batas maksimum toleransi MTPD (${approvedMtpd}), memberikan waktu cadangan penanganan darurat sebesar ${safetyBufferHours} jam sebelum proses menimbulkan dampak katastropik.`
                      : rtoValidation.warning}
                  </p>
                </div>

                <div className="p-2.5 bg-white/70 rounded-xl text-[11px] font-semibold text-slate-700 flex items-center justify-between">
                  <span>Regulasi Terkait: POJK No. 11/2022 & PADG BI No. 23/2021</span>
                  <span className="font-bold text-emerald-800">Status: Sesuai Ketentuan</span>
                </div>
              </div>
            </div>

            {/* Phased Milestones During RTO Window */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <Clock className="w-4 h-4 text-[#00A9CE]" />
                  <span>Rincian Milestone Fase Pemulihan Selama Jendela RTO ({targetRto})</span>
                </div>
                <span className="text-xs font-bold text-slate-500">Standar BCM Framework</span>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-cyan-900 bg-cyan-100 px-2 py-0.5 rounded">
                      Fase 1: 0 — 30 Menit
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">Triage & Deklarasi</span>
                  </div>
                  <textarea
                    rows={3}
                    value={rtoPhase1}
                    onChange={(e) => {
                      setRtoPhase1(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-[#00A9CE]"
                  />
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                      Fase 2: 30 — 90 Menit
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">Failover Teknis</span>
                  </div>
                  <textarea
                    rows={3}
                    value={rtoPhase2}
                    onChange={(e) => {
                      setRtoPhase2(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-[#00A9CE]"
                  />
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                      Fase 3: 90 — 120 Menit
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">Aktivasi MBCO</span>
                  </div>
                  <textarea
                    rows={3}
                    value={rtoPhase3}
                    onChange={(e) => {
                      setRtoPhase3(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-[#00A9CE]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: RPO Target */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-extrabold text-[#00A9CE] tracking-wider">Langkah 6 dari 12</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Recovery Point Objective (RPO) & Data Loss Tolerance</h2>
                <p className="text-slate-600 text-sm mt-1">
                  Batas maksimum toleransi kehilangan data transaksi (data loss) sebelum menimbulkan selisih pembukuan tak terpulihkan (ISO 22301 Clause 8.2.2 & POJK 11/2022).
                </p>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-slate-500">Preset Standar:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTargetRpo('Real Time');
                    triggerAutoSave();
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                    targetRpo === 'Real Time'
                      ? 'bg-[#0B1F3A] text-cyan-300 border-[#0B1F3A]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  Real Time (Zero Loss)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetRpo('15 Minutes');
                    triggerAutoSave();
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                    targetRpo === '15 Minutes'
                      ? 'bg-[#0B1F3A] text-cyan-300 border-[#0B1F3A]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  15 Menit (Standar BI-RTGS)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetRpo('1 Hour');
                    triggerAutoSave();
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                    targetRpo === '1 Hour'
                      ? 'bg-[#0B1F3A] text-cyan-300 border-[#0B1F3A]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  1 Jam (Batch)
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Target RPO Selector */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block font-extrabold text-slate-900 text-sm">Target RPO Basis Data:</label>
                <select
                  value={targetRpo}
                  onChange={(e) => {
                    setTargetRpo(e.target.value);
                    triggerAutoSave();
                  }}
                  className="w-full p-3.5 bg-white border-2 border-[#00A9CE] rounded-xl font-black text-base text-slate-900 focus:outline-none shadow-sm"
                >
                  <option value="Real Time">Real Time (Zero Data Loss — Synchronous SAN)</option>
                  <option value="15 Minutes">15 Minutes (15 Menit — Rekomendasi BI-RTGS)</option>
                  <option value="30 Minutes">30 Minutes (30 Menit)</option>
                  <option value="1 Hour">1 Hour (1 Jam)</option>
                  <option value="2 Hours">2 Hours (2 Jam)</option>
                  <option value="24 Hours">24 Hours (Daily Snapshot Backup)</option>
                </select>
                <div className="p-3.5 bg-cyan-50/70 text-cyan-950 rounded-xl border border-cyan-200 text-xs font-medium space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-cyan-900">
                    <ShieldCheck className="w-4 h-4 text-[#00A9CE]" />
                    <span>Ketentuan Regulasi Bank Indonesia:</span>
                  </div>
                  <p>
                    Untuk transaksi perbankan bernilai besar BI-RTGS, RPO maksimal yang disyaratkan regulator adalah 15 menit demi mencegah risiko pembatalan setelmen antarbank (*systemic settlement failure*).
                  </p>
                </div>
              </div>

              {/* Estimasi Kehilangan Data & Dampak Finansial */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block font-extrabold text-slate-900 text-sm">
                  Estimasi Maksimum Kehilangan Data (Data Loss Financial Exposure):
                </label>
                <input
                  type="text"
                  value={rpoDataLossTolerance}
                  onChange={(e) => {
                    setRpoDataLossTolerance(e.target.value);
                    triggerAutoSave();
                  }}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:border-[#00A9CE]"
                />
                <p className="text-xs text-slate-500 font-medium">
                  Jumlah kuantitatif transaksi dan nilai rupiah transaksi yang berpotensi hilang saat delta data failover terjadi.
                </p>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-medium text-amber-900">
                  ⚠️ Selisih transaksi selama jeda 15 menit wajib didamaikan (*reconciled*) dengan data transaksi sentral Bank Indonesia.
                </div>
              </div>
            </div>

            {/* Metode Replikasi & Bandwidth */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-[#00A9CE]" />
                <span>Spesifikasi Replikasi Data Center (DC ke DRC Surabaya)</span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <label className="block font-bold text-slate-700 text-xs">Metode Replikasi Basis Data:</label>
                  <input
                    type="text"
                    value={replicationMethod}
                    onChange={(e) => {
                      setReplicationMethod(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <label className="block font-bold text-slate-700 text-xs">Bandwidth & Jalur Jaringan:</label>
                  <input
                    type="text"
                    value={replicationBandwidth}
                    onChange={(e) => {
                      setReplicationBandwidth(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <label className="block font-bold text-slate-700 text-xs">Jadwal Backup & WAL Streaming:</label>
                  <input
                    type="text"
                    value={backupSchedule}
                    onChange={(e) => {
                      setBackupSchedule(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Prosedur Rekonsiliasi */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block font-extrabold text-slate-900 text-sm">
                Prosedur Rekonsiliasi Data Transaksi Pasca-Disrupsi (Post-Disruption Reconciliation Procedure):
              </label>
              <textarea
                rows={3}
                value={reconciliationProcedure}
                onChange={(e) => {
                  setReconciliationProcedure(e.target.value);
                  triggerAutoSave();
                }}
                className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:border-[#00A9CE]"
              />
              <p className="text-[11px] text-slate-500 font-medium">
                Uraikan mekanisme audit trail log matching antara ledger internal bank dengan konfirmasi setelmen Bank Indonesia untuk menutup celah data loss.
              </p>
            </div>
          </div>
        )}

        {/* STEP 7: Dependencies */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-extrabold text-[#00A9CE] tracking-wider">Langkah 7 dari 12</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Analisis Ketergantungan (Dependency & SPOF Analysis)</h2>
                <p className="text-slate-600 text-sm mt-1">
                  Identifikasi seluruh sistem aplikasi, mitra vendor pihak ketiga, fasilitas data center, dan personel kunci yang dibutuhkan untuk memulihkan proses.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold px-3 py-1.5 bg-red-100 text-red-900 border border-red-300 rounded-full">
                  {dependencies.filter((d) => d.spof).length} SPOF Kritis Teridentifikasi
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddDepModal(!showAddDepModal)}
                  className="px-3.5 py-1.5 bg-[#0B1F3A] hover:bg-[#133C67] text-cyan-300 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Ketergantungan</span>
                </button>
              </div>
            </div>

            {/* Inline Add Dependency Form */}
            {showAddDepModal && (
              <div className="p-5 bg-cyan-50/70 border-2 border-[#00A9CE] rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-cyan-950 text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#00A9CE]" />
                    <span>Pendaftaran Ketergantungan Baru (New Dependency Item)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddDepModal(false)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Batal (Tutup)
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ketergantungan / Aset:</label>
                    <input
                      type="text"
                      value={newDepName}
                      placeholder="Contoh: Cisco Core Switch DC"
                      onChange={(e) => setNewDepName(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Ketergantungan:</label>
                    <select
                      value={newDepType}
                      onChange={(e) => setNewDepType(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value="IT Application">IT Application / Software</option>
                      <option value="Vendor Partner">Vendor Partner / Third-Party</option>
                      <option value="Facility / DC">Facility / Data Center</option>
                      <option value="Key Personnel">Key Personnel / Staf Kunci</option>
                      <option value="External Interface">External Regulatory Interface</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">RTO Ketergantungan:</label>
                    <select
                      value={newDepRto}
                      onChange={(e) => setNewDepRto(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value="15 Minutes">15 Minutes</option>
                      <option value="30 Minutes">30 Minutes</option>
                      <option value="1 Hour">1 Hour</option>
                      <option value="2 Hours">2 Hours</option>
                      <option value="4 Hours">4 Hours</option>
                      <option value="24 Hours">24 Hours</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Catatan / Detail Fungsi:</label>
                    <input
                      type="text"
                      value={newDepNotes}
                      placeholder="Deskripsi peran aset terhadap kelangsungan proses..."
                      onChange={(e) => setNewDepNotes(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-3 sm:pt-4">
                    <input
                      type="checkbox"
                      checked={newDepSpof}
                      onChange={(e) => setNewDepSpof(e.target.checked)}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="text-xs font-bold text-red-800">Tandai sebagai SPOF Risk</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddDependency}
                    className="sm:mt-4 px-4 py-2.5 bg-[#0B1F3A] hover:bg-[#133C67] text-cyan-300 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Simpan Aset
                  </button>
                </div>
              </div>
            )}

            {/* Summary Filter Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600">
              <span className="px-3 py-1 bg-slate-200/80 rounded-lg text-slate-800">
                Total Aset: {dependencies.length}
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-900 border border-red-200 rounded-lg">
                SPOF: {dependencies.filter((d) => d.spof).length}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-lg">
                Aplikasi: {dependencies.filter((d) => d.type.includes('Application')).length}
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-lg">
                Vendor: {dependencies.filter((d) => d.type.includes('Vendor')).length}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-900 rounded-lg">
                Staf Kunci: {dependencies.filter((d) => d.type.includes('Personnel')).length}
              </span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-lg">
                Fasilitas: {dependencies.filter((d) => d.type.includes('Facility')).length}
              </span>
            </div>

            {/* Dependencies Card List */}
            <div className="space-y-3">
              {dependencies.map((dep) => (
                <div
                  key={dep.id}
                  className="p-4 bg-slate-50 hover:bg-slate-100/90 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors shadow-xs"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                        dep.type.includes('Application')
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : dep.type.includes('Vendor')
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : dep.type.includes('Personnel')
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {dep.type.includes('Application') ? (
                        <Cpu className="w-5 h-5" />
                      ) : dep.type.includes('Vendor') ? (
                        <Building className="w-5 h-5" />
                      ) : dep.type.includes('Personnel') ? (
                        <Users className="w-5 h-5" />
                      ) : (
                        <HardDrive className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
                          {dep.type}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleSpof(dep.id)}
                          title="Klik untuk ubah status Single Point of Failure"
                          className={`px-2 py-0.5 font-extrabold text-[10px] rounded-full border cursor-pointer transition-colors ${
                            dep.spof
                              ? 'bg-red-100 text-red-900 border-red-300 hover:bg-red-200'
                              : 'bg-slate-200/80 text-slate-600 border-slate-300 hover:bg-slate-300'
                          }`}
                        >
                          {dep.spof ? '⚠ SPOF Risk' : 'Redundant (No SPOF)'}
                        </button>
                      </div>
                      <div className="font-extrabold text-slate-900 text-base mt-0.5">{dep.name}</div>
                      <div className="text-xs text-slate-600 font-medium mt-0.5">{dep.notes}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-500 block">Ketersediaan / RTO:</span>
                      <span className="text-xs font-black text-cyan-950 bg-cyan-100 px-2.5 py-1 rounded-lg inline-block mt-0.5 border border-cyan-200">
                        {dep.rto}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDependency(dep.id)}
                      title="Hapus aset ketergantungan"
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Consultant Guidance Note */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-medium text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Ketentuan ISO 22301 & Regulasi Bank Indonesia:</strong> Setiap ketergantungan berkategori <em>Single Point of Failure (SPOF)</em> wajib memiliki strategi mitigasi atau rencana kontinuitas alternatif pada Dokumen Strategi Kelangsungan Usaha (BCS).
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: Min Resources */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs uppercase font-extrabold text-[#00A9CE] tracking-wider">Langkah 8 dari 12</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Kebutuhan Sumber Daya Minimum (Minimum Resource Requirements - MBCO)
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Estimasi alokasi personel esensial (FTE), perangkat keras, otorisasi token transaksi, dan lokasi kerja darurat berdasarkan tahapan waktu pemulihan (ISO 22301 Clause 8.2.2).
              </p>
            </div>

            {/* Critical Equipment & Access Checklist */}
            <div className="p-5 bg-[#0B1F3A] text-white rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm text-cyan-300">
                  <Key className="w-4 h-4 text-[#00A9CE]" />
                  <span>Checklist Peralatan Kritis & Token Akses Otorisasi Darurat</span>
                </div>
                <span className="text-xs font-bold text-slate-300">
                  {Object.values(resourceChecklist).filter(Boolean).length} dari 5 Terverifikasi
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                <label className="flex items-center gap-2.5 p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 cursor-pointer hover:bg-slate-800">
                  <input
                    type="checkbox"
                    checked={resourceChecklist.dualTokenBi}
                    onChange={(e) => {
                      setResourceChecklist((prev) => ({ ...prev, dualTokenBi: e.target.checked }));
                      triggerAutoSave();
                    }}
                    className="w-4 h-4 text-[#00A9CE] rounded"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Dual Token BI-RTGS & SSSS</div>
                    <div className="text-[10px] text-slate-400">Tersimpan di brankas DRC & HO</div>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 cursor-pointer hover:bg-slate-800">
                  <input
                    type="checkbox"
                    checked={resourceChecklist.encryptedLaptops}
                    onChange={(e) => {
                      setResourceChecklist((prev) => ({ ...prev, encryptedLaptops: e.target.checked }));
                      triggerAutoSave();
                    }}
                    className="w-4 h-4 text-[#00A9CE] rounded"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Laptop Terenkripsi TPM 2.0</div>
                    <div className="text-[10px] text-slate-400">BitLocker + Pre-installed certs</div>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 cursor-pointer hover:bg-slate-800">
                  <input
                    type="checkbox"
                    checked={resourceChecklist.dedicatedVpn}
                    onChange={(e) => {
                      setResourceChecklist((prev) => ({ ...prev, dedicatedVpn: e.target.checked }));
                      triggerAutoSave();
                    }}
                    className="w-4 h-4 text-[#00A9CE] rounded"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Dedicated VPN Tunnel DRC</div>
                    <div className="text-[10px] text-slate-400">IPSec + 2FA token generator</div>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 cursor-pointer hover:bg-slate-800">
                  <input
                    type="checkbox"
                    checked={resourceChecklist.recordedDealingPhone}
                    onChange={(e) => {
                      setResourceChecklist((prev) => ({ ...prev, recordedDealingPhone: e.target.checked }));
                      triggerAutoSave();
                    }}
                    className="w-4 h-4 text-[#00A9CE] rounded"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Recorded Dealing Phone</div>
                    <div className="text-[10px] text-slate-400">Perekam suara sesuai POJK</div>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 cursor-pointer hover:bg-slate-800 sm:col-span-2 lg:col-span-1">
                  <input
                    type="checkbox"
                    checked={resourceChecklist.satelliteBackup}
                    onChange={(e) => {
                      setResourceChecklist((prev) => ({ ...prev, satelliteBackup: e.target.checked }));
                      triggerAutoSave();
                    }}
                    className="w-4 h-4 text-[#00A9CE] rounded"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Konektivitas Cadangan Satelit</div>
                    <div className="text-[10px] text-slate-400">SD-WAN failover otomatis</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Resources per Time Horizon Cards */}
            <div className="space-y-4">
              <div className="font-extrabold text-slate-900 text-sm flex items-center justify-between">
                <span>Alokasi Staf Minimum & Lokasi Kerja Darurat (4 Horison Waktu)</span>
                <span className="text-xs font-bold text-slate-500">Dapat diedit langsung</span>
              </div>

              {resources.map((res, i) => (
                <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div className="font-black text-slate-900 text-base flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#00A9CE]" />
                      <span>{res.timeHorizon}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">Alokasi Staf (FTE):</span>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={res.staff}
                        onChange={(e) => handleUpdateResource(i, 'staff', Number(e.target.value))}
                        className="w-16 p-1 bg-white border border-slate-300 rounded-lg text-center font-black text-sm text-cyan-950"
                      />
                      <span className="text-xs font-bold text-slate-500">Personel</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-600">Peran Kunci Diperlukan (Key Roles):</label>
                      <input
                        type="text"
                        value={res.roles}
                        onChange={(e) => handleUpdateResource(i, 'roles', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:border-[#00A9CE]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-600">Workstations & Perangkat:</label>
                      <input
                        type="text"
                        value={res.hardware}
                        onChange={(e) => handleUpdateResource(i, 'hardware', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:border-[#00A9CE]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-600">Lokasi Kerja Darurat (Alternate Site):</label>
                      <input
                        type="text"
                        value={res.location}
                        onChange={(e) => handleUpdateResource(i, 'location', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-cyan-900 focus:border-[#00A9CE]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 9: Workarounds */}
        {currentStep === 9 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs uppercase font-extrabold text-[#00A9CE] tracking-wider">Langkah 9 dari 12</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Strategi Prosedur Darurat & Kontingensi (Workaround Procedures)
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Mekanisme operasional darurat agar proses layanan minimum (MBCO) tetap berjalan saat sistem otomasi primer terputus total (ISO 22301 Clause 8.3 & ISO 22317).
              </p>
            </div>

            {/* Row 1: Tipe Workaround & Kriteria Pemicu */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-extrabold text-slate-900 text-sm">
                  Tipe Prosedur Kontingensi (Workaround Mode):
                </label>
                <select
                  value={workaroundType}
                  onChange={(e) => {
                    setWorkaroundType(e.target.value);
                    triggerAutoSave();
                  }}
                  className="w-full p-3 bg-white border-2 border-[#00A9CE] rounded-xl text-sm font-bold text-slate-900 focus:outline-none shadow-xs"
                >
                  <option value="Peralihan Otomatis Failover DRC + Secondary Batch Queue">
                    Peralihan Otomatis Failover DRC + Secondary Batch Queue
                  </option>
                  <option value="Prosedur Kliring Semi-Manual Berbasis Token Fisik">
                    Prosedur Kliring Semi-Manual Berbasis Token Fisik
                  </option>
                  <option value="Pengalihan Jalur Alternatif SKNBI / RTGS Bank Indonesia">
                    Pengalihan Jalur Alternatif SKNBI / RTGS Bank Indonesia
                  </option>
                  <option value="Penundaan Sementara (Spooling Offline Buffer)">
                    Penundaan Sementara (Spooling Offline Buffer)
                  </option>
                </select>
                <p className="text-xs text-slate-500 font-medium">
                  Pendekatan penanganan operasional saat arsitektur otomasi utama gagal berfungsi.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-extrabold text-slate-900 text-sm">
                  Kriteria Pemicu Aktivasi Prosedur Darurat (Trigger Criteria):
                </label>
                <input
                  type="text"
                  value={workaroundActivationTrigger}
                  onChange={(e) => {
                    setWorkaroundActivationTrigger(e.target.value);
                    triggerAutoSave();
                  }}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:border-[#00A9CE]"
                />
                <p className="text-xs text-slate-500 font-medium">
                  Kondisi pasti di mana tim diwajibkan beralih dari operasional normal ke prosedur darurat.
                </p>
              </div>
            </div>

            {/* Row 2: Deskripsi Prosedur Kontingensi */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block font-extrabold text-slate-900 text-sm">
                Deskripsi Lengkap Prosedur Kontingensi & Workaround Operasional:
              </label>
              <textarea
                rows={4}
                value={workaroundStrategy}
                onChange={(e) => {
                  setWorkaroundStrategy(e.target.value);
                  triggerAutoSave();
                }}
                className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:border-[#00A9CE]"
              />
              <p className="text-[11px] text-slate-500 font-medium">
                SOP teknis pengalihan traffic transaksi ke DRC Surabaya dan manajemen antrean manual token BI-RTGS.
              </p>
            </div>

            {/* Row 3: Batas Waktu Bertahan & Risiko Residual */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-extrabold text-slate-900 text-sm">
                  Batas Waktu Maksimal Bertahan (Max Sustainable Workaround Period):
                </label>
                <input
                  type="text"
                  value={workaroundMaxDuration}
                  onChange={(e) => {
                    setWorkaroundMaxDuration(e.target.value);
                    triggerAutoSave();
                  }}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:border-[#00A9CE]"
                />
                <p className="text-xs text-slate-500 font-medium">
                  Batas durasi maksimum sebelum tim mengalami kelelahan atau antrean transaksi meluap melebihi kapasitas memori.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-extrabold text-slate-900 text-sm">
                  Risiko Residual Operasional (Operational Residual Risk):
                </label>
                <textarea
                  rows={2}
                  value={workaroundResidualRisk}
                  onChange={(e) => {
                    setWorkaroundResidualRisk(e.target.value);
                    triggerAutoSave();
                  }}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:border-[#00A9CE]"
                />
                <p className="text-[11px] text-slate-500 font-medium">
                  Risiko yang tetap ada selama prosedur manual dijalankan (misal: potensi human error & selisih jurnal).
                </p>
              </div>
            </div>

            {/* Row 4: Rencana Pemrosesan Susulan (Backlog Catch-Up Plan) */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block font-extrabold text-slate-900 text-sm">
                Rencana Pemrosesan Susulan & Normalisasi Antrean (Backlog Catch-Up Plan):
              </label>
              <textarea
                rows={3}
                value={backlogCatchupPlan}
                onChange={(e) => {
                  setBacklogCatchupPlan(e.target.value);
                  triggerAutoSave();
                }}
                className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:border-[#00A9CE]"
              />
              <p className="text-[11px] text-slate-500 font-medium">
                Tata cara injeksi antrean transaksi tertunda setelah sistem otomasi primer pulih (*throttling TPS & re-verification*).
              </p>
            </div>
          </div>
        )}

        {/* STEP 10: Criticality & SPOF */}
        {currentStep === 10 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs uppercase font-extrabold text-[#00A9CE] tracking-wider">Langkah 10 dari 12</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Criticality Engine & Single Point of Failure (SPOF)
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Hasil evaluasi formula algoritmik ISO 22301:2019 berdasarkan keparahan dampak, kepatuhan regulasi Bank Indonesia, dan risiko konsentrasi.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Criticality Engine Card */}
              <div className="p-6 bg-[#0B1F3A] text-white rounded-2xl shadow-md flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-cyan-400 tracking-wider">
                      Hasil Evaluasi Algoritmik BCM Engine
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-[11px] font-bold">
                      ISO 22301 Clause 8.2.2
                    </span>
                  </div>
                  <div className="text-3xl font-black text-white mt-2">{engineOutput.criticalityTier}</div>
                  <div className="text-sm text-cyan-200 mt-1.5 font-semibold flex items-center gap-2">
                    <span>Prioritas Pemulihan:</span>
                    <span className="px-2.5 py-0.5 bg-red-500/30 text-red-200 border border-red-500/40 rounded-lg text-xs font-black">
                      {engineOutput.recoveryPriority} (Tertinggi)
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-700/80">
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span className="text-slate-300">Total Criticality Score:</span>
                    <span className="text-cyan-300 text-base font-black">{engineOutput.criticalityScore} / 100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, engineOutput.criticalityScore)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>Ambang Batas Tier 1: &gt; 80 Poin</span>
                    <span className="text-emerald-400 font-bold">Status: Mission Critical</span>
                  </div>
                </div>
              </div>

              {/* SPOF Advisory */}
              <div className="p-6 bg-red-50 rounded-2xl border-2 border-red-200 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-red-950 font-black text-base">
                    <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                    <span>SPOF Advisory Terdeteksi ({engineOutput.spofReasons.length} Risiko Kritis)</span>
                  </div>
                  <p className="text-xs text-red-800 font-medium mt-1">
                    Titik kegagalan tunggal yang berpotensi melumpuhkan proses tanpa toleransi cadangan:
                  </p>
                  <ul className="space-y-2 text-red-900 text-xs font-medium mt-3">
                    {engineOutput.spofReasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 bg-white/70 p-2 rounded-xl border border-red-100">
                        <span className="text-red-500 font-black shrink-0">•</span>
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 bg-red-100/70 border border-red-300 rounded-xl text-[11px] font-bold text-red-900 flex items-center justify-between">
                  <span>Kepatuhan POJK No. 11/2022:</span>
                  <span>Wajib Mitigasi Sebelum Go-Live</span>
                </div>
              </div>
            </div>

            {/* SPOF Mitigation Action Tracker */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#00A9CE]" />
                  <span>Rencana Mitigasi SPOF (SPOF Mitigation Action Plan):</span>
                </div>
                <span className="text-xs font-bold text-slate-500">Standar ISO 22301 Clause 8.3</span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#0B1F3A] text-white">
                    <tr>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Aset SPOF Kritis</th>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Strategi Mitigasi / Kontingensi</th>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Unit Penanggung Jawab</th>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-center">Status Kesiapan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {spofMitigations.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{item.spof}</td>
                        <td className="py-2.5 px-3 text-slate-700 font-medium">{item.strategy}</td>
                        <td className="py-2.5 px-3 text-slate-600 font-bold">{item.owner}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold text-[10px] inline-block ${
                              item.status.includes('Ready')
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : item.status.includes('In Progress')
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-blue-100 text-blue-900 border border-blue-300'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Score Weights Breakdown */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-extrabold text-slate-900 text-sm">
                Rincian Dekomposisi Komponen Penilaian Kritis:
              </div>
              <div className="grid sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-slate-500 font-bold block">Bobot Dampak Waktu (50%)</span>
                  <span className="text-base font-black text-slate-900">48 / 50 Poin</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Finansial & Operasional Maksimum</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-slate-500 font-bold block">Urgensi Regulasi (20%)</span>
                  <span className="text-base font-black text-slate-900">20 / 20 Poin</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">PADG BI 23/2021 & POJK 11/2022</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-slate-500 font-bold block">Eksposur Finansial (15%)</span>
                  <span className="text-base font-black text-slate-900">14 / 15 Poin</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">&gt; Rp 8.5 Triliun per Hari</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-slate-500 font-bold block">Urgensi RTO &lt; 4 Jam (15%)</span>
                  <span className="text-base font-black text-slate-900">12.5 / 15 Poin</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Target RTO: 2 Jam</p>
                </div>
              </div>
            </div>

            {/* Consultant Formal Rationale */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block font-extrabold text-slate-900 text-sm">
                Catatan Rasionalisasi & Kesimpulan Lead Konsultan BCM (Wajib Klausul ISO 22301 Clause 8.2.2):
              </label>
              <textarea
                rows={3}
                value={consultantCriticalityRationale}
                onChange={(e) => {
                  setConsultantCriticalityRationale(e.target.value);
                  triggerAutoSave();
                }}
                className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:border-[#00A9CE]"
              />
              <p className="text-[11px] text-slate-500 font-medium">
                Justifikasi ini akan dikutip pada Executive Summary Dokumen BIA resmi untuk pengesahan Direksi.
              </p>
            </div>
          </div>
        )}

        {/* STEP 11: Evidence */}
        {currentStep === 11 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-extrabold text-[#00A9CE] tracking-wider">Langkah 11 dari 12</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Bukti Pendukung & Catatan Verifikasi Konsultan (Evidence & Audit Trail)
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Dokumentasikan dokumen kebijakan, SLA vendor, hasil simulasi DR, catatan wawancara, dan matriks kepatuhan regulasi (ISO 22301:2019 Clause 7.5 & 8.2).
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold px-3 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full">
                  {evidenceDocs.length} Dokumen Terverifikasi
                </span>
                <button
                  type="button"
                  onClick={() => setShowUploadEvidenceModal(!showUploadEvidenceModal)}
                  className="px-3.5 py-1.5 bg-[#0B1F3A] hover:bg-[#133C67] text-cyan-300 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Bukti Audit</span>
                </button>
              </div>
            </div>

            {/* Inline Upload Evidence Modal */}
            {showUploadEvidenceModal && (
              <div className="p-5 bg-cyan-50/70 border-2 border-[#00A9CE] rounded-2xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-cyan-950 text-sm flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#00A9CE]" />
                    <span>Unggah / Tautkan Dokumen Bukti Audit Baru</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowUploadEvidenceModal(false)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Batal (Tutup)
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kode Dokumen:</label>
                    <input
                      type="text"
                      placeholder="Contoh: DOC-BI-01"
                      value={newDocCode}
                      onChange={(e) => setNewDocCode(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul / Nama Dokumen:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Laporan Uji Failover DC Q4"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Dokumen:</label>
                    <select
                      value={newDocType}
                      onChange={(e) => setNewDocType(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value="Regulasi Resmi">Regulasi Resmi (BI/OJK)</option>
                      <option value="Kontrak Vendor">Kontrak SLA Vendor</option>
                      <option value="Laporan Drill DR">Laporan Simulasi / Drill DR</option>
                      <option value="SOP Internal">SOP Internal Perbankan</option>
                      <option value="Sertifikasi ISO">Sertifikasi ISO</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleAddEvidenceDoc}
                    className="px-4 py-2 bg-[#0B1F3A] hover:bg-[#133C67] text-cyan-300 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Simpan Dokumen Bukti
                  </button>
                </div>
              </div>
            )}

            {/* Document Request List (DRL) Repository Grid */}
            <div className="space-y-3">
              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#00A9CE]" />
                <span>Dokumen Bukti Audit Terverifikasi (Document Request List - DRL):</span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {evidenceDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 bg-slate-50 hover:bg-slate-100/90 rounded-2xl border border-slate-200 space-y-2 transition-colors shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-black text-cyan-900 bg-cyan-100 px-2 py-0.5 rounded border border-cyan-200">
                          {doc.code}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full">
                          ✓ {doc.status}
                        </span>
                      </div>
                      <div className="font-extrabold text-slate-900 text-xs mt-2 line-clamp-2">{doc.name}</div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                      <div>
                        <span className="font-bold text-slate-700">{doc.type}</span> • {doc.size}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveEvidenceDoc(doc.id)}
                        className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                        title="Hapus dokumen bukti"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Catatan Wawancara Pemilik Proses (Interview Log) */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-[#00A9CE]" />
                <span>Notula Wawancara Pemilik Proses & Verifikasi Konsultan:</span>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500">Tanggal Wawancara:</label>
                  <input
                    type="text"
                    value={interviewDate}
                    onChange={(e) => {
                      setInterviewDate(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500">Narasumber Utama Unit:</label>
                  <input
                    type="text"
                    value={intervieweeName}
                    onChange={(e) => {
                      setIntervieweeName(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500">Pewawancara / Lead Konsultan:</label>
                  <input
                    type="text"
                    value={interviewerName}
                    onChange={(e) => {
                      setInterviewerName(e.target.value);
                      triggerAutoSave();
                    }}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1.5">
                  Ringkasan Notula Wawancara & Kesepakatan Parameter BIA:
                </label>
                <textarea
                  rows={3}
                  value={consultantInterviewNotes}
                  onChange={(e) => {
                    setConsultantInterviewNotes(e.target.value);
                    triggerAutoSave();
                  }}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:border-[#00A9CE]"
                />
              </div>
            </div>

            {/* Matriks Kepatuhan Regulasi (Regulatory Compliance) */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                <span>Matriks Kepatuhan Regulasi Terkait (Regulatory Compliance Cross-Reference):</span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#0B1F3A] text-white">
                    <tr>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Regulasi Rujukan</th>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Klausul / Pasal</th>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-center">Status</th>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Catatan Implementasi BIA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {regulatoryCompliance.map((reg, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-black text-slate-900">{reg.reg}</td>
                        <td className="py-2.5 px-3 text-slate-700 font-medium">{reg.clause}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-[10px]">
                            {reg.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 font-medium">{reg.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Catatan Bukti Tambahan */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block font-extrabold text-slate-900 text-sm">
                Catatan Rujukan Dokumen Wajib Audit (Supporting Evidence Notes):
              </label>
              <textarea
                rows={2}
                value={evidenceNotes}
                onChange={(e) => {
                  setEvidenceNotes(e.target.value);
                  triggerAutoSave();
                }}
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:border-[#00A9CE]"
              />
            </div>
          </div>
        )}

        {/* STEP 12: Review & Submit */}
        {currentStep === 12 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs uppercase font-extrabold text-[#00A9CE] tracking-wider">Langkah 12 dari 12</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">Review & Submit BIA Assessment</h2>
              <p className="text-slate-600 text-sm mt-1">
                Tinjauan komprehensif parameter BIA sebelum diajukan ke sesi Validation Workshop bersama Manajemen Risiko dan Direksi.
              </p>
            </div>

            {/* Executive Summary Header Card */}
            <div className="p-6 bg-[#0B1F3A] text-white rounded-2xl shadow-md space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-cyan-400 text-slate-950 px-2 py-0.5 rounded">
                      {currentProcess.code}
                    </span>
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      Executive Summary BIA
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white mt-1">{currentProcess.name}</h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Divisi Pemilik: <strong>Divisi Settlement, Clearing & Payment Operations</strong> • Jam Operasi: <strong>24/7 Switch</strong>
                  </p>
                </div>
                <div className="text-left md:text-right shrink-0">
                  <span className="text-xs font-bold text-slate-400 block">Klasifikasi Final:</span>
                  <span className="text-lg font-black text-cyan-300 block">{engineOutput.criticalityTier}</span>
                  <span className="text-[11px] font-extrabold text-emerald-400">Score: {engineOutput.criticalityScore}/100 • Priority P1</span>
                </div>
              </div>

              {/* 4-Quadrant Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-900">
                <div className="p-4 bg-white rounded-xl shadow-xs space-y-1">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">MTPD / MAO</span>
                  <div className="text-2xl font-black text-[#0B1F3A]">{approvedMtpd}</div>
                  <span className="text-[10px] text-red-600 font-bold block">Point of No Return</span>
                </div>

                <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-300 shadow-xs space-y-1">
                  <span className="text-[11px] font-black text-cyan-900 uppercase tracking-wider block">Target RTO</span>
                  <div className="text-2xl font-black text-cyan-950">{targetRto}</div>
                  <span className="text-[10px] text-emerald-700 font-bold block">
                    Safety Buffer: {safetyBufferHours} Jam (Aman)
                  </span>
                </div>

                <div className="p-4 bg-white rounded-xl shadow-xs space-y-1">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Target RPO</span>
                  <div className="text-2xl font-black text-[#0B1F3A]">{targetRpo}</div>
                  <span className="text-[10px] text-slate-600 font-medium block">Sync 15 Menit DRC</span>
                </div>

                <div className="p-4 bg-white rounded-xl shadow-xs space-y-1">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Target MBCO</span>
                  <div className="text-2xl font-black text-[#0B1F3A]">{mbcoPercentage}</div>
                  <span className="text-[10px] text-slate-600 font-medium block">150.000 tx / hari</span>
                </div>
              </div>
            </div>

            {/* Interactive Review Tabs */}
            <div className="space-y-3">
              <div className="flex border-b border-slate-200 text-xs font-bold gap-2">
                <button
                  type="button"
                  onClick={() => setActiveReviewTab('kpi')}
                  className={`pb-2.5 px-3 cursor-pointer transition-colors ${
                    activeReviewTab === 'kpi'
                      ? 'border-b-2 border-[#00A9CE] text-[#0B1F3A] font-black'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Parameter Kunci BCM
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReviewTab('impact')}
                  className={`pb-2.5 px-3 cursor-pointer transition-colors ${
                    activeReviewTab === 'impact'
                      ? 'border-b-2 border-[#00A9CE] text-[#0B1F3A] font-black'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Matriks Dampak (6 Kategori)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReviewTab('dependencies')}
                  className={`pb-2.5 px-3 cursor-pointer transition-colors ${
                    activeReviewTab === 'dependencies'
                      ? 'border-b-2 border-[#00A9CE] text-[#0B1F3A] font-black'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Ketergantungan & SPOF ({dependencies.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReviewTab('resources')}
                  className={`pb-2.5 px-3 cursor-pointer transition-colors ${
                    activeReviewTab === 'resources'
                      ? 'border-b-2 border-[#00A9CE] text-[#0B1F3A] font-black'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sumber Daya Minimum (FTE)
                </button>
              </div>

              {/* Tab 1: KPI */}
              {activeReviewTab === 'kpi' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-500 block">Arsitektur Pemulihan RTO:</span>
                    <span className="font-extrabold text-slate-900 text-sm">{rtoStrategy}</span>
                    <p className="text-[11px] text-slate-500">Hasil Drill Terakhir: {lastDrDrillResult}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-500 block">Spesifikasi Replikasi Data:</span>
                    <span className="font-extrabold text-slate-900 text-sm">{replicationBandwidth}</span>
                    <p className="text-[11px] text-slate-500">{replicationMethod}</p>
                  </div>
                </div>
              )}

              {/* Tab 2: Impact */}
              {activeReviewTab === 'impact' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="font-extrabold text-slate-900">
                    Distribusi Dampak: {severeScoresCount} Severe (Skor 5) • {majorScoresCount} Major (Skor 4)
                  </div>
                  <p className="text-slate-600 font-medium">
                    Titik pemicu MTPD disepakati pada horison <strong>{approvedMtpd}</strong> berdasarkan eskalasi kerugian finansial cut-off BI dan risiko sanksi suspensi izin kliring.
                  </p>
                </div>
              )}

              {/* Tab 3: Dependencies */}
              {activeReviewTab === 'dependencies' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="font-extrabold text-slate-900">
                    Total Aset: {dependencies.length} Aset • {dependencies.filter((d) => d.spof).length} Single Point of Failure (SPOF)
                  </div>
                  <ul className="grid md:grid-cols-2 gap-2 text-slate-700">
                    {dependencies.map((d) => (
                      <li key={d.id} className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                        <span><strong>{d.name}</strong> ({d.type})</span>
                        <span className="font-bold text-cyan-900">{d.rto}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tab 4: Resources */}
              {activeReviewTab === 'resources' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="font-extrabold text-slate-900">
                    Kebutuhan Minimum Personel: 4 FTE (0–2 Jam Skeleton) hingga 14 FTE (MBCO Extended)
                  </div>
                  <div className="grid md:grid-cols-2 gap-2">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <strong>Lokasi Kerja Darurat:</strong> DRC Surabaya & Alternate Site Sentul
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <strong>Peralatan Kritis:</strong> Dual Token BI, Laptop Terenkripsi TPM 2.0, Recorded Phone Line
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Multi-Party Sign-Off Matrix */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#00A9CE]" />
                  <span>Matriks Otorisasi & Tanda Tangan Multi-Pihak (Sign-Off Matrix):</span>
                </div>
                <span className="text-xs font-bold text-slate-500">ISO 22301 Clause 5.1 & 8.2</span>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                {signOffMatrix.map((sign, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 shadow-xs">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                      {sign.role}
                    </span>
                    <div>
                      <div className="font-black text-slate-900 text-sm">{sign.name}</div>
                      <div className="text-[11px] text-slate-600 font-medium">{sign.title}</div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                        {sign.status}
                      </span>
                      <span className="text-slate-400 font-medium">{sign.date}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 italic mt-1">{sign.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist Pre-Submit */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Checklist Kepatuhan Validasi ISO 22301:2019 / ISO 22317:</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-xs font-medium text-slate-800">
                <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-100 rounded-lg">
                  <input
                    type="checkbox"
                    checked={checklistVerification.scopeConfirmed}
                    onChange={(e) =>
                      setChecklistVerification((prev) => ({ ...prev, scopeConfirmed: e.target.checked }))
                    }
                    className="w-4 h-4 text-[#00A9CE] rounded"
                  />
                  <span>Ruang lingkup proses & kontak Process Owner terverifikasi</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-100 rounded-lg">
                  <input
                    type="checkbox"
                    checked={checklistVerification.impactMatrixCompleted}
                    onChange={(e) =>
                      setChecklistVerification((prev) => ({ ...prev, impactMatrixCompleted: e.target.checked }))
                    }
                    className="w-4 h-4 text-[#00A9CE] rounded"
                  />
                  <span>Matriks dampak 6 kategori ISO 22317 terisi lengkap</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-100 rounded-lg">
                  <input
                    type="checkbox"
                    checked={checklistVerification.rtoCompliesWithMtpd}
                    onChange={(e) =>
                      setChecklistVerification((prev) => ({ ...prev, rtoCompliesWithMtpd: e.target.checked }))
                    }
                    className="w-4 h-4 text-[#00A9CE] rounded"
                  />
                  <span>Target RTO (2 Jam) &le; MTPD (4 Jam) sesuai ketentuan ISO 22301</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-100 rounded-lg">
                  <input
                    type="checkbox"
                    checked={checklistVerification.rpoReplicationVerified}
                    onChange={(e) =>
                      setChecklistVerification((prev) => ({ ...prev, rpoReplicationVerified: e.target.checked }))
                    }
                    className="w-4 h-4 text-[#00A9CE] rounded"
                  />
                  <span>Target RPO (15 Menit) selaras dengan batasan data loss regulator</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-100 rounded-lg">
                  <input
                    type="checkbox"
                    checked={checklistVerification.resourcesConfirmedByUnit}
                    onChange={(e) =>
                      setChecklistVerification((prev) => ({ ...prev, resourcesConfirmedByUnit: e.target.checked }))
                    }
                    className="w-4 h-4 text-[#00A9CE] rounded"
                  />
                  <span>Kebutuhan sumber daya minimum (FTE & token) telah disetujui unit</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-100 rounded-lg">
                  <input
                    type="checkbox"
                    checked={checklistVerification.spofMitigationNoted}
                    onChange={(e) =>
                      setChecklistVerification((prev) => ({ ...prev, spofMitigationNoted: e.target.checked }))
                    }
                    className="w-4 h-4 text-[#00A9CE] rounded"
                  />
                  <span>Temuan SPOF & bukti DRL telah terdokumentasi lengkap</span>
                </label>
              </div>
            </div>

            {/* Approval Callout & Submission Action */}
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <div className="font-black text-emerald-950 text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Skor Kelengkapan BIA: 100% (Audit & Workshop Ready)</span>
                </div>
                <p className="text-xs text-emerald-900 font-medium mt-1 leading-relaxed">
                  Seluruh parameter wajib telah memenuhi standar sertifikasi ISO 22301:2019 dan regulasi POJK No. 11/POJK.03/2022.
                </p>
                {submittedToWorkshop && (
                  <div className="mt-2 text-xs font-black text-emerald-800 bg-emerald-200/80 px-3 py-1 rounded-lg inline-block">
                    ✓ Berhasil diserahkan ke agenda Validation Workshop! Notifikasi telah dikirimkan ke Tim Risiko.
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Cetak / PDF Lengkap</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedToWorkshop(true);
                    handleSubmitFinal();
                  }}
                  className="px-6 py-3 bg-[#0B1F3A] hover:bg-[#133C67] text-cyan-300 font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer text-sm transition-all hover:scale-105"
                >
                  <span>Submit ke Workshop Validasi</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <div className="sticky bottom-14 lg:bottom-0 bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl p-4 shadow-xl mt-6 flex items-center justify-between gap-4 z-30">
        <button
          disabled={currentStep === 1}
          onClick={() => {
            setCurrentStep((prev) => Math.max(1, prev - 1));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer transition-colors ${
            currentStep === 1
              ? 'text-slate-300 cursor-not-allowed bg-slate-50'
              : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="text-sm text-slate-600 font-bold hidden sm:block">
          Langkah <span className="font-black text-slate-950 text-base">{currentStep}</span> dari 12: {WIZARD_STEPS[currentStep - 1].title}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            className="hidden md:inline-flex px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-sm shadow-xs cursor-pointer"
          >
            Save Draft
          </button>

          {currentStep < 12 ? (
            <button
              onClick={() => {
                setCurrentStep((prev) => Math.min(12, prev + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 font-black rounded-xl text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105"
            >
              <span>Lanjut ke Langkah {currentStep + 1}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          ) : (
            <button
              onClick={handleSubmitFinal}
              className="px-6 py-3 bg-[#0B1F3A] hover:bg-[#133C67] text-white font-black rounded-xl text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105"
            >
              <span>Submit ke Workshop Validasi</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-300" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
