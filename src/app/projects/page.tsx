'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import { INITIAL_UNITS } from '@/lib/mock-data';
import {
  FolderGit2,
  Plus,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Building,
  ShieldCheck,
  Users,
  Settings,
  Rocket,
  Check,
  Clock,
  Sparkles,
  Search,
  Globe,
  Mail,
  Phone,
  MapPin,
  UserCheck,
  Briefcase,
  Landmark,
  FileText,
  Upload,
  Hash,
  Network,
  Layers,
  Trash2,
  PlusCircle,
  CheckSquare,
  Sliders,
  Database,
  AlertTriangle,
  FolderTree,
  ChevronRight,
  CheckCheck,
  Server,
  Radio,
  CreditCard,
  AlertCircle,
  Activity,
  Scale,
  Target,
  ShieldAlert,
  RotateCcw,
  Edit3,
  Info
} from 'lucide-react';

const WIZARD_STEPS = [
  { step: 1, title: 'Client Info', desc: 'Identitas & Tata Kelola Klien' },
  { step: 2, title: 'Organization', desc: 'Struktur & Level Organisasi' },
  { step: 3, title: 'Project Scope', desc: 'Lokasi & Batasan Wilayah' },
  { step: 4, title: 'BCM Methodology', desc: 'Standar ISO 22301 / 22317' },
  { step: 5, title: 'Parameters', desc: 'Skala Dampak & Horizon Waktu' },
  { step: 6, title: 'User Assignment', desc: 'Penugasan Konsultan & PIC' },
  { step: 7, title: 'Launch Project', desc: 'Verifikasi & Kick-Off' },
];

const DEFAULT_FACILITIES = [
  { id: 'fac-01', name: 'Menara Nusantara Head Office', category: 'Kantor Pusat (HO)', city: 'Jakarta Selatan', tier: 'Tier-1 Kritis', redundancy: 'Dual Power Grid & Genset', inScope: true },
  { id: 'fac-02', name: 'Primary Data Center Tier-3 Serpong', category: 'Primary Data Center', city: 'Serpong, Tangerang', tier: 'Tier-1 Kritis', redundancy: 'N+1 Redundant Tier-3', inScope: true },
  { id: 'fac-03', name: 'Disaster Recovery Center (DRC) Tier-3', category: 'Secondary DRC', city: 'Rungkut, Surabaya', tier: 'Tier-1 Kritis', redundancy: 'Synchronous / Async Replication', inScope: true },
  { id: 'fac-04', name: 'Cloud Disaster Recovery AWS / GCP', category: 'Hybrid Cloud DC', city: 'Region Jakarta', tier: 'Tier-1 Kritis', redundancy: 'Multi-Availability Zone', inScope: true },
  { id: 'fac-05', name: 'Jaringan 45 Kantor Cabang Utama (KCU)', category: 'Cabang Operasional', city: 'Nasional (Jawa & Luar Jawa)', tier: 'Tier-2 Pendukung', redundancy: 'Dual Link WAN & VSAT', inScope: true },
  { id: 'fac-06', name: 'Alternate Workplace & Contact Center Sentul', category: 'Workplace Alternate Site', city: 'Sentul, Bogor', tier: 'Tier-2 Pendukung', redundancy: 'Warm Standby (150 Seats)', inScope: true },
];

const DEFAULT_CRITICAL_SERVICES = [
  { id: 'srv-01', name: 'Real-Time Gross Settlement (BI-RTGS) & SKNBI', targetRto: '< 2 Jam', regulator: 'Bank Indonesia', category: 'Sistem Kliring Pembayaran', inScope: true },
  { id: 'srv-02', name: 'BI-FAST & Instant Payment Hub 24/7', targetRto: '< 2 Jam', regulator: 'Bank Indonesia', category: 'Fast Payment Gateway', inScope: true },
  { id: 'srv-03', name: 'Core Banking System & Transaksi Tabungan/Giro', targetRto: '< 4 Jam', regulator: 'OJK & BI', category: 'Core Banking Ledger', inScope: true },
  { id: 'srv-04', name: 'Digital Banking & Mobile Application (BNU Mobile)', targetRto: '< 2 Jam', regulator: 'OJK', category: 'Digital Channels', inScope: true },
  { id: 'srv-05', name: 'Treasury Dealing Room & Transaksi Pasar Uang', targetRto: '< 4 Jam', regulator: 'Bank Indonesia', category: 'Treasury & Dealing', inScope: true },
  { id: 'srv-06', name: 'Jaringan ATM & Switching Kartu Debit (GPN)', targetRto: '< 4 Jam', regulator: 'Bank Indonesia', category: 'ATM & Switching', inScope: true },
  { id: 'srv-07', name: 'Trade Finance & Garansi Bank Korporasi', targetRto: '< 8 Jam', regulator: 'OJK', category: 'Commercial Lending', inScope: true },
];

export default function ProjectsPage() {
  const { currentProject, setProject, addAuditLog, units, setUnits } = useBcm();
  const [showWizard, setShowWizard] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Form states for Step 1: Client Info
  const [clientCode, setClientCode] = useState('CLT-001');
  const [clientName, setClientName] = useState('');
  const [clientAlias, setClientAlias] = useState('');
  const [industry, setIndustry] = useState('Perbankan & Jasa Keuangan (KBMI 3)');
  const [orgScale, setOrgScale] = useState('Enterprise (KBMI 3 / BUKU 3)');
  const [regulators, setRegulators] = useState(['Otoritas Jasa Keuangan (OJK)', 'Bank Indonesia (BI)', 'BSSN']);
  const [address, setAddress] = useState('');
  const [cityPostal, setCityPostal] = useState('');
  const [country, setCountry] = useState('Indonesia');
  const [website, setWebsite] = useState('');
  const [totalEmployees, setTotalEmployees] = useState('');
  const [totalBranches, setTotalBranches] = useState('');
  const [dailyTransactionValue, setDailyTransactionValue] = useState('');
  const [clientPicName, setClientPicName] = useState('');
  const [clientPicTitle, setClientPicTitle] = useState('');
  const [clientPicEmail, setClientPicEmail] = useState('');
  const [clientPicPhone, setClientPicPhone] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorTitle, setSponsorTitle] = useState('');

  // Form states for Step 2: Organization Hierarchy & Units
  const [hierarchyPreset, setHierarchyPreset] = useState<string>('banking');
  const [hierarchyDepth, setHierarchyDepth] = useState<number>(3);
  const [levelLabels, setLevelLabels] = useState<Record<number, string>>({
    1: 'Direktorat (Directorate)',
    2: 'Divisi (Division)',
    3: 'Departemen / Unit Kerja (Department)',
    4: 'Seksi / Sub-Unit Operasional (Section)',
  });
  const [showAddUnitForm, setShowAddUnitForm] = useState(false);
  const [newUnitCode, setNewUnitCode] = useState('');
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitLevel, setNewUnitLevel] = useState<number>(2);
  const [newUnitParent, setNewUnitParent] = useState('');
  const [newUnitHead, setNewUnitHead] = useState('');
  const [newUnitCoord, setNewUnitCoord] = useState('');
  const [newUnitLocation, setNewUnitLocation] = useState('');

  // Form states for Step 3: Scope & Locations
  const [projectName, setProjectName] = useState('Implementasi & Sertifikasi ISO 22301');
  const [projectCode, setProjectCode] = useState('PRJ-2025-01');
  const [engagementType, setEngagementType] = useState('Implementasi Penuh BCMS ISO 22301:2019 & BIA ISO 22317:2021');
  const [projectObjective, setProjectObjective] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [targetDate, setTargetDate] = useState('');

  // Facilities manager state (clean start, default can be loaded via button)
  const [facilities, setFacilities] = useState<typeof DEFAULT_FACILITIES>([]);
  const [showAddFacility, setShowAddFacility] = useState(false);
  const [newFacName, setNewFacName] = useState('');
  const [newFacCategory, setNewFacCategory] = useState('Kantor Cabang');
  const [newFacCity, setNewFacCity] = useState('');

  // Critical services manager state (clean start, default can be loaded via button)
  const [criticalServices, setCriticalServices] = useState<typeof DEFAULT_CRITICAL_SERVICES>([]);
  const [showAddService, setShowAddService] = useState(false);
  const [newSrvName, setNewSrvName] = useState('');
  const [newSrvRto, setNewSrvRto] = useState('< 4 Jam');
  const [newSrvRegulator, setNewSrvRegulator] = useState('OJK');

  const [scope, setScope] = useState('');
  const [outOfScope, setOutOfScope] = useState('');

  const toggleFacilityInScope = (id: string) => {
    setFacilities((prev) => prev.map((f) => (f.id === id ? { ...f, inScope: !f.inScope } : f)));
  };

  const handleDeleteFacility = (id: string) => {
    setFacilities((prev) => prev.filter((f) => f.id !== id));
  };

  const handleResetFacilities = () => {
    setFacilities(DEFAULT_FACILITIES);
  };

  const handleAddFacility = () => {
    if (!newFacName.trim()) return;
    setFacilities((prev) => [
      ...prev,
      {
        id: `fac-${Date.now().toString().slice(-4)}`,
        name: newFacName.trim(),
        category: newFacCategory,
        city: newFacCity.trim() || 'Indonesia',
        tier: 'Tier-2 Pendukung',
        redundancy: 'Standby',
        inScope: true,
      },
    ]);
    setNewFacName('');
    setNewFacCity('');
    setShowAddFacility(false);
  };

  const toggleServiceInScope = (id: string) => {
    setCriticalServices((prev) => prev.map((s) => (s.id === id ? { ...s, inScope: !s.inScope } : s)));
  };

  const handleDeleteService = (id: string) => {
    setCriticalServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleResetServices = () => {
    setCriticalServices(DEFAULT_CRITICAL_SERVICES);
  };

  const handleAddService = () => {
    if (!newSrvName.trim()) return;
    setCriticalServices((prev) => [
      ...prev,
      {
        id: `srv-${Date.now().toString().slice(-4)}`,
        name: newSrvName.trim(),
        targetRto: newSrvRto,
        regulator: newSrvRegulator,
        category: 'Layanan Bisnis Kritis',
        inScope: true,
      },
    ]);
    setNewSrvName('');
    setShowAddService(false);
  };

  // Form states for Step 4: Methodology & Standards
  const [framework, setFramework] = useState('ISO 22301:2019, ISO 22317:2021 & POJK No. 11/POJK.03/2022');
  const [assessmentApproach, setAssessmentApproach] = useState<'dual_track' | 'quantitative' | 'qualitative'>('dual_track');
  const [selectedHorizons, setSelectedHorizons] = useState<string[]>([
    '0 - 2 Jam',
    '2 - 4 Jam',
    '4 - 8 Jam',
    '24 Jam',
    '48 Jam',
    '> 7 Hari',
  ]);
  const [dimensionsConfig, setDimensionsConfig] = useState([
    {
      id: 'fin',
      name: 'Finansial & Kerugian Langsung',
      clause: 'ISO 22317 Section 7.2',
      desc: 'Nilai kerugian materiil, revenue loss, biaya pemulihan darurat, penalti bunga transaksi.',
      weight: 25,
      metric: 'Estimasi kerugian nominal Rupiah (Rp) per durasi outage.',
      enabled: true,
      color: 'rose',
    },
    {
      id: 'reg',
      name: 'Kepatuhan Regulasi & Sanksi OJK/BI',
      clause: 'POJK 11/2022 & PADG BI',
      desc: 'Pelanggaran batas SLA regulasi, pelaporan insiden wajib, audit findings & sanksi administratif.',
      weight: 25,
      metric: 'Tingkat sanksi (Teguran tertulis, denda finansial, hingga pembatasan izin produk).',
      enabled: true,
      color: 'red',
    },
    {
      id: 'rep',
      name: 'Reputasi & Kepercayaan Publik / Nasabah',
      clause: 'ISO 22301 Clause 8.2.2',
      desc: 'Sentimen media massa, trending komplain publik, potensi penarikan dana nasabah (liquidity rush).',
      weight: 20,
      metric: 'Eskalasi liputan media nasional, keluhan nasabah prioritas, penurunan skor kredibilitas.',
      enabled: true,
      color: 'amber',
    },
    {
      id: 'ops',
      name: 'Operasional & Gangguan SLA Transaksi',
      clause: 'ISO 22317 Section 7.3',
      desc: 'Akumulasi antrean transaksi kliring/RTGS, kegagalan batch settlement, gangguan channel mobile & ATM.',
      weight: 20,
      metric: 'Persentase transaksi gagal diproses dan lama waktu penyelesaian backlog operasional.',
      enabled: true,
      color: 'blue',
    },
    {
      id: 'leg',
      name: 'Hukum, Kontraktual & Litigasi Pihak Ketiga',
      clause: 'ISO 22301 Clause 4.2',
      desc: 'Klausul wanprestasi perjanjian kerjasama (PKS/SLA) vendor/mitra, tuntutan ganti rugi perdata perbankan.',
      weight: 10,
      metric: 'Potensi gugatan hukum, klaim penalti pihak ketiga, dan sengketa perdata.',
      enabled: true,
      color: 'purple',
    },
    {
      id: 'k3',
      name: 'Keselamatan Jiwa, Personel & K3 Lingkungan',
      clause: 'SMK3 & ISO 45001 Aligned',
      desc: 'Dampak terhadap keselamatan kerja fisik pegawai, evakuasi gedung, ancaman keselamatan di fasilitas kritis.',
      weight: 0,
      metric: 'Jumlah personel terdampak evakuasi dan kepatuhan standar K3 nasional.',
      enabled: false,
      color: 'emerald',
    },
  ]);
  const [mbcoTarget, setMbcoTarget] = useState('75% Kapasitas Normal (Standar Perbankan - Rekomendasi)');
  const [strictRtoRule, setStrictRtoRule] = useState(true);
  const [autoSpofDetection, setAutoSpofDetection] = useState(true);
  const [approvalWorkflow, setApprovalWorkflow] = useState('3-Tier: Process Owner PIC -> Consultant Lead QA -> Steering Committee / Direksi');
  const [showAddCustomDim, setShowAddCustomDim] = useState(false);
  const [newDimName, setNewDimName] = useState('');
  const [newDimDesc, setNewDimDesc] = useState('');
  const [newDimWeight, setNewDimWeight] = useState(10);

  const toggleHorizon = (horizon: string) => {
    setSelectedHorizons((prev) =>
      prev.includes(horizon) ? prev.filter((h) => h !== horizon) : [...prev, horizon]
    );
  };

  const toggleDimension = (id: string) => {
    setDimensionsConfig((prev) =>
      prev.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d))
    );
  };

  const updateDimensionWeight = (id: string, weight: number) => {
    setDimensionsConfig((prev) =>
      prev.map((d) => (d.id === id ? { ...d, weight: Math.max(0, Math.min(100, weight)) } : d))
    );
  };

  const handleAddCustomDim = () => {
    if (!newDimName.trim()) return;
    const newDim = {
      id: `custom-${Date.now().toString().slice(-4)}`,
      name: newDimName.trim(),
      clause: 'Custom Client Standard',
      desc: newDimDesc.trim() || 'Dimensi dampak khusus yang ditetapkan dalam kuesioner BIA.',
      weight: Number(newDimWeight) || 10,
      metric: 'Metrik kualitatif/kuantitatif kustom.',
      enabled: true,
      color: 'cyan',
    };
    setDimensionsConfig((prev) => [...prev, newDim]);
    setNewDimName('');
    setNewDimDesc('');
    setNewDimWeight(10);
    setShowAddCustomDim(false);
  };

  const handleDeleteDimension = (id: string) => {
    setDimensionsConfig((prev) => prev.filter((d) => d.id !== id));
  };

  const totalWeight = dimensionsConfig
    .filter((d) => d.enabled)
    .reduce((acc, curr) => acc + curr.weight, 0);

  // Form states for Step 5: Parameters & Thresholds
  const [materialityPreset, setMaterialityPreset] = useState<'banking_kbmi2_3' | 'banking_kbmi4' | 'fintech_mid' | 'corporate_general'>('banking_kbmi2_3');
  const [lossThresholds, setLossThresholds] = useState([
    {
      tier: 1,
      label: 'Tingkat 1 - Insignificant',
      severity: 'Insignificant',
      amount: '< Rp 100 Juta',
      rto: '> 7 Hari',
      rpo: '≤ 24 Jam',
      mtpd: '> 14 Hari',
      criticalityTier: 'Tier 4 — Non-Critical',
      color: 'emerald',
      desc: 'Dampak finansial minor yang dapat diserap kas operasional harian tanpa eskalasi.',
    },
    {
      tier: 2,
      label: 'Tingkat 2 - Minor',
      severity: 'Minor',
      amount: 'Rp 100 Juta - Rp 1 Miliar',
      rto: '2 - 7 Hari',
      rpo: '≤ 12 Jam',
      mtpd: '≤ 14 Hari',
      criticalityTier: 'Tier 4 — Routine',
      color: 'blue',
      desc: 'Kerugian finansial terbatas, penalti keterlambatan ringan, ditangani level manajer unit.',
    },
    {
      tier: 3,
      label: 'Tingkat 3 - Moderate',
      severity: 'Moderate',
      amount: 'Rp 1 Miliar - Rp 10 Miliar',
      rto: '8 - 24 Jam',
      rpo: '≤ 4 Jam',
      mtpd: '≤ 48 Jam',
      criticalityTier: 'Tier 3 — Essential',
      color: 'amber',
      desc: 'Penurunan likuiditas sementara, biaya penanganan khusus, membutuhkan koordinasi Kepala Divisi.',
    },
    {
      tier: 4,
      label: 'Tingkat 4 - Major',
      severity: 'Major',
      amount: 'Rp 10 Miliar - Rp 50 Miliar',
      rto: '4 - 8 Jam',
      rpo: '≤ 1 Jam',
      mtpd: '≤ 12 Jam',
      criticalityTier: 'Tier 2 — Critical',
      color: 'orange',
      desc: 'Potensi erosi modal kerja, denda berat OJK/BI, eskalasi darurat ke Direksi & Crisis Team.',
    },
    {
      tier: 5,
      label: 'Tingkat 5 - Severe / Catastrophic',
      severity: 'Catastrophic',
      amount: '> Rp 50 Miliar',
      rto: '< 2 Jam',
      rpo: '0 - 15 Menit',
      mtpd: '≤ 4 Jam',
      criticalityTier: 'Tier 1 — Mission Critical',
      color: 'rose',
      desc: 'Ancaman kelangsungan hidup bank (going concern), sistemik perbankan, aktivasi Disaster Recovery penuh.',
    },
  ]);

  const [qualitativeTab, setQualitativeTab] = useState<'regulatory' | 'reputation' | 'operational' | 'legal'>('regulatory');
  const [dailyTxTrigger, setDailyTxTrigger] = useState('Rp 500 Miliar / Hari');
  const [userImpactTrigger, setUserImpactTrigger] = useState('100.000 Pengguna Aktif');
  const [rpoFinancialSla, setRpoFinancialSla] = useState('0 - 15 Menit (Near Zero Data Loss - POJK 11)');

  const applyMaterialityPreset = (preset: 'banking_kbmi2_3' | 'banking_kbmi4' | 'fintech_mid' | 'corporate_general') => {
    setMaterialityPreset(preset);
    if (preset === 'banking_kbmi4') {
      setLossThresholds([
        { tier: 1, label: 'Tingkat 1 - Insignificant', severity: 'Insignificant', amount: '< Rp 500 Juta', rto: '> 5 Hari', rpo: '≤ 24 Jam', mtpd: '> 14 Hari', criticalityTier: 'Tier 4 — Non-Critical', color: 'emerald', desc: 'Dampak nominal kecil relatif terhadap aset KBMI 4 (> Rp 100 Triliun).' },
        { tier: 2, label: 'Tingkat 2 - Minor', severity: 'Minor', amount: 'Rp 500 Juta - Rp 5 Miliar', rto: '2 - 5 Hari', rpo: '≤ 8 Jam', mtpd: '≤ 7 Hari', criticalityTier: 'Tier 4 — Routine', color: 'blue', desc: 'Fluktuasi operasional lokal cabang tanpa dampak neraca konsolidasian.' },
        { tier: 3, label: 'Tingkat 3 - Moderate', severity: 'Moderate', amount: 'Rp 5 Miliar - Rp 25 Miliar', rto: '8 - 24 Jam', rpo: '≤ 2 Jam', mtpd: '≤ 48 Jam', criticalityTier: 'Tier 3 — Essential', color: 'amber', desc: 'Keterlambatan transaksi wholesale/treasury, biaya darurat pemulihan data.' },
        { tier: 4, label: 'Tingkat 4 - Major', severity: 'Major', amount: 'Rp 25 Miliar - Rp 100 Miliar', rto: '2 - 4 Jam', rpo: '≤ 30 Menit', mtpd: '≤ 8 Jam', criticalityTier: 'Tier 2 — Critical', color: 'orange', desc: 'Gangguan kliring nasional, pelaporan darurat wajib OJK/BI 1x24 jam.' },
        { tier: 5, label: 'Tingkat 5 - Severe / Catastrophic', severity: 'Catastrophic', amount: '> Rp 100 Miliar', rto: '≤ 2 Jam', rpo: '0 - 5 Menit', mtpd: '≤ 4 Jam', criticalityTier: 'Tier 1 — Mission Critical', color: 'rose', desc: 'Ancaman solvabilitas dan integritas sistem moneter nasional (Bank Sistemik).' },
      ]);
      setDailyTxTrigger('Rp 2.5 Triliun / Hari');
      setUserImpactTrigger('500.000 Pengguna Aktif');
    } else if (preset === 'fintech_mid') {
      setLossThresholds([
        { tier: 1, label: 'Tingkat 1 - Insignificant', severity: 'Insignificant', amount: '< Rp 50 Juta', rto: '> 3 Hari', rpo: '≤ 12 Jam', mtpd: '> 7 Hari', criticalityTier: 'Tier 4 — Non-Critical', color: 'emerald', desc: 'Gangguan minor mikro-transaksi tanpa klaim ganti rugi merchant.' },
        { tier: 2, label: 'Tingkat 2 - Minor', severity: 'Minor', amount: 'Rp 50 Juta - Rp 250 Juta', rto: '24 - 48 Jam', rpo: '≤ 4 Jam', mtpd: '≤ 5 Hari', criticalityTier: 'Tier 4 — Routine', color: 'blue', desc: 'Pending settlement merchant e-commerce diselesaikan dalam H+1.' },
        { tier: 3, label: 'Tingkat 3 - Moderate', severity: 'Moderate', amount: 'Rp 250 Juta - Rp 2 Miliar', rto: '4 - 12 Jam', rpo: '≤ 1 Jam', mtpd: '≤ 24 Jam', criticalityTier: 'Tier 3 — Essential', color: 'amber', desc: 'Penalti SLA gateway pembayaran dan eskalasi keluhan pengguna aplikasi.' },
        { tier: 4, label: 'Tingkat 4 - Major', severity: 'Major', amount: 'Rp 2 Miliar - Rp 10 Miliar', rto: '1 - 4 Jam', rpo: '≤ 15 Menit', mtpd: '≤ 8 Jam', criticalityTier: 'Tier 2 — Critical', color: 'orange', desc: 'Pemblokiran saldo dompet digital massal, risiko sanksi pencabutan izin BI.' },
        { tier: 5, label: 'Tingkat 5 - Severe / Catastrophic', severity: 'Catastrophic', amount: '> Rp 10 Miliar', rto: '< 1 Jam', rpo: '0 - 5 Menit', mtpd: '≤ 2 Jam', criticalityTier: 'Tier 1 — Mission Critical', color: 'rose', desc: 'Kebocoran data saldo masif atau kelumpuhan core API transaksi payment.' },
      ]);
      setDailyTxTrigger('Rp 100 Miliar / Hari');
      setUserImpactTrigger('50.000 Pengguna Aktif');
    } else if (preset === 'corporate_general') {
      setLossThresholds([
        { tier: 1, label: 'Tingkat 1 - Insignificant', severity: 'Insignificant', amount: '< Rp 50 Juta', rto: '> 7 Hari', rpo: '≤ 24 Jam', mtpd: '> 14 Hari', criticalityTier: 'Tier 4 — Non-Critical', color: 'emerald', desc: 'Biaya lembur staf administrasi internal korporasi.' },
        { tier: 2, label: 'Tingkat 2 - Minor', severity: 'Minor', amount: 'Rp 50 Juta - Rp 500 Juta', rto: '3 - 7 Hari', rpo: '≤ 12 Jam', mtpd: '≤ 14 Hari', criticalityTier: 'Tier 4 — Routine', color: 'blue', desc: 'Keterlambatan pengiriman produk logistik lokal tanpa penalti kontrak.' },
        { tier: 3, label: 'Tingkat 3 - Moderate', severity: 'Moderate', amount: 'Rp 500 Juta - Rp 5 Miliar', rto: '24 - 72 Jam', rpo: '≤ 8 Jam', mtpd: '≤ 7 Hari', criticalityTier: 'Tier 3 — Essential', color: 'amber', desc: 'Penghentian 1 lini produksi pabrik atau gangguan sistem ERP regional.' },
        { tier: 4, label: 'Tingkat 4 - Major', severity: 'Major', amount: 'Rp 5 Miliar - Rp 25 Miliar', rto: '8 - 24 Jam', rpo: '≤ 4 Jam', mtpd: '≤ 48 Jam', criticalityTier: 'Tier 2 — Critical', color: 'orange', desc: 'Klaim wanprestasi rantai pasok B2B utama dan penalti kontrak tender.' },
        { tier: 5, label: 'Tingkat 5 - Severe / Catastrophic', severity: 'Catastrophic', amount: '> Rp 25 Miliar', rto: '< 8 Jam', rpo: '≤ 1 Jam', mtpd: '≤ 24 Jam', criticalityTier: 'Tier 1 — Mission Critical', color: 'rose', desc: 'Kelumpuhan seluruh fasilitas pabrik manufaktur dan gudang sentral.' },
      ]);
      setDailyTxTrigger('Rp 200 Miliar / Hari');
      setUserImpactTrigger('20.000 Pengguna Aktif');
    } else {
      // Default: Banking KBMI 2-3
      setLossThresholds([
        { tier: 1, label: 'Tingkat 1 - Insignificant', severity: 'Insignificant', amount: '< Rp 100 Juta', rto: '> 7 Hari', rpo: '≤ 24 Jam', mtpd: '> 14 Hari', criticalityTier: 'Tier 4 — Non-Critical', color: 'emerald', desc: 'Dampak finansial minor yang dapat diserap kas operasional harian tanpa eskalasi.' },
        { tier: 2, label: 'Tingkat 2 - Minor', severity: 'Minor', amount: 'Rp 100 Juta - Rp 1 Miliar', rto: '2 - 7 Hari', rpo: '≤ 12 Jam', mtpd: '≤ 14 Hari', criticalityTier: 'Tier 4 — Routine', color: 'blue', desc: 'Kerugian finansial terbatas, penalti keterlambatan ringan, ditangani level manajer unit.' },
        { tier: 3, label: 'Tingkat 3 - Moderate', severity: 'Moderate', amount: 'Rp 1 Miliar - Rp 10 Miliar', rto: '8 - 24 Jam', rpo: '≤ 4 Jam', mtpd: '≤ 48 Jam', criticalityTier: 'Tier 3 — Essential', color: 'amber', desc: 'Penurunan likuiditas sementara, biaya penanganan khusus, membutuhkan koordinasi Kepala Divisi.' },
        { tier: 4, label: 'Tingkat 4 - Major', severity: 'Major', amount: 'Rp 10 Miliar - Rp 50 Miliar', rto: '4 - 8 Jam', rpo: '≤ 1 Jam', mtpd: '≤ 12 Jam', criticalityTier: 'Tier 2 — Critical', color: 'orange', desc: 'Potensi erosi modal kerja, denda berat OJK/BI, eskalasi darurat ke Direksi & Crisis Team.' },
        { tier: 5, label: 'Tingkat 5 - Severe / Catastrophic', severity: 'Catastrophic', amount: '> Rp 50 Miliar', rto: '< 2 Jam', rpo: '0 - 15 Menit', mtpd: '≤ 4 Jam', criticalityTier: 'Tier 1 — Mission Critical', color: 'rose', desc: 'Ancaman kelangsungan hidup bank (going concern), sistemik perbankan, aktivasi Disaster Recovery penuh.' },
      ]);
      setDailyTxTrigger('Rp 500 Miliar / Hari');
      setUserImpactTrigger('100.000 Pengguna Aktif');
    }
  };

  const updateThresholdField = (tierNum: number, field: string, value: string) => {
    setLossThresholds((prev) =>
      prev.map((item) => (item.tier === tierNum ? { ...item, [field]: value } : item))
    );
  };

  // Form states for Step 6: User Assignment & RACI (ISO 22301 Clause 5.3)
  const [pm, setPm] = useState('Sarah Wijaya, MBCI (Senior BCM Consultant)');
  const [consultantDrLead, setConsultantDrLead] = useState('Dr. Hendra Gunawan (IT DRP Specialist)');
  const [consultantQa, setConsultantQa] = useState('Farhan Malik, CISA (Quality Assurance Lead)');
  const [consultantSecSpecialist, setConsultantSecSpecialist] = useState('Arief Budiman, CISSP (Cyber Resilience Specialist)');
  const [consultantJuniorAnalyst, setConsultantJuniorAnalyst] = useState('Nadia Safitri, S.Kom (BCM Business Analyst)');

  // Client Governance Additional Roles
  const [clientAuditLead, setClientAuditLead] = useState('');
  const [clientCrisisCommander, setClientCrisisCommander] = useState('');
  const [clientItOpsPic, setClientItOpsPic] = useState('');
  const [clientHrPic, setClientHrPic] = useState('');

  // RACI Matrix Table for ISO 22301
  const [raciMatrix, setRaciMatrix] = useState([
    { activity: 'Persetujuan Kebijakan BCM & Konteks Organisasi (Clause 5.2)', sponsor: 'A', coordinator: 'R', pmLead: 'C', drpLead: 'I', unitHead: 'C' },
    { activity: 'Pelaksanaan Kuesioner & Wawancara BIA (Clause 8.2.2)', sponsor: 'I', coordinator: 'C', pmLead: 'R', drpLead: 'C', unitHead: 'A' },
    { activity: 'Penetapan MTPD, RTO, RPO & Criticality Tiers (Clause 8.2.2)', sponsor: 'A', coordinator: 'C', pmLead: 'R', drpLead: 'R', unitHead: 'C' },
    { activity: 'Penyusunan Strategi Keberlangsungan Bisnis / BCP (Clause 8.3)', sponsor: 'I', coordinator: 'R', pmLead: 'R', drpLead: 'C', unitHead: 'C' },
    { activity: 'Perancangan Disaster Recovery Plan (DRP) TI & DRC (Clause 8.4)', sponsor: 'I', coordinator: 'C', pmLead: 'C', drpLead: 'A', unitHead: 'I' },
    { activity: 'Pengujian, Simulasi Drill & Tabletop Exercise (Clause 8.5)', sponsor: 'I', coordinator: 'A', pmLead: 'R', drpLead: 'R', unitHead: 'R' },
    { activity: 'Review Manajemen & Audit Kepatuhan Regulasi (Clause 9.3)', sponsor: 'A', coordinator: 'R', pmLead: 'C', drpLead: 'I', unitHead: 'C' },
  ]);

  const updateRaciRole = (index: number, role: 'sponsor' | 'coordinator' | 'pmLead' | 'drpLead' | 'unitHead', val: string) => {
    setRaciMatrix((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [role]: val } : row))
    );
  };

  const [sendWelcomeInvite, setSendWelcomeInvite] = useState(true);
  const [requireMfaGovernance, setRequireMfaGovernance] = useState(true);
  const [autoReminderDays, setAutoReminderDays] = useState('3');

  // Form states for Step 7: Launch Project & Readiness Sign-off
  const [readinessChecks, setReadinessChecks] = useState({
    charterSigned: true,
    dataAccessGranted: true,
    steeringScheduled: true,
    biaSurveyReady: true,
  });

  const toggleReadinessCheck = (key: keyof typeof readinessChecks) => {
    setReadinessChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [kickoffDate, setKickoffDate] = useState('2025-03-03');
  const [kickoffVenue, setKickoffVenue] = useState('Auditorium Menara Nusantara Lt. 12 & Hybrid Zoom');
  const [targetBiaCompletion, setTargetBiaCompletion] = useState('2025-04-15');
  const [broadcastNotification, setBroadcastNotification] = useState(true);

  const toggleRegulator = (reg: string) => {
    setRegulators((prev) =>
      prev.includes(reg) ? prev.filter((r) => r !== reg) : [...prev, reg]
    );
  };


  const applyHierarchyPreset = (preset: 'banking' | 'corporate' | 'tech') => {
    setHierarchyPreset(preset);
    if (preset === 'banking') {
      setHierarchyDepth(3);
      setLevelLabels({
        1: 'Direktorat (Directorate)',
        2: 'Divisi (Division)',
        3: 'Departemen / Unit Kerja (Department)',
        4: 'Seksi / Sub-Unit Operasional (Section)',
      });
    } else if (preset === 'corporate') {
      setHierarchyDepth(3);
      setLevelLabels({
        1: 'Holding / Direktorat Korporasi',
        2: 'Group Bisnis / Divisi',
        3: 'Bagian / Biro / Operasional',
        4: 'Sub-Bagian / Tim Kerja',
      });
    } else if (preset === 'tech') {
      setHierarchyDepth(3);
      setLevelLabels({
        1: 'Executive / Domain Head',
        2: 'Tribe / Chapter Area',
        3: 'Squad / Functional Team',
        4: 'Pod / Working Group',
      });
    }
  };

  const handleAddUnit = () => {
    if (!newUnitCode.trim() || !newUnitName.trim()) return;
    const newId = `unit-${Date.now().toString().slice(-4)}`;
    const addedUnit = {
      id: newId,
      code: newUnitCode.trim().toUpperCase(),
      name: newUnitName.trim(),
      level: newUnitLevel,
      levelName: levelLabels[newUnitLevel] || `Level ${newUnitLevel}`,
      parentId: newUnitLevel === 1 ? null : newUnitParent,
      unitHeadName: newUnitHead.trim() || 'Belum Ditugaskan',
      bcmCoordName: newUnitCoord.trim() || clientPicName || 'Belum Ditugaskan',
      location: newUnitLocation.trim() || 'Head Office',
      processCount: 0,
      biaCompletedCount: 0,
    };
    setUnits((prev) => [...prev, addedUnit]);
    setNewUnitCode('');
    setNewUnitName('');
    setNewUnitHead('');
    setNewUnitCoord('');
    setShowAddUnitForm(false);
  };

  const handleDeleteUnit = (unitId: string) => {
    setUnits((prev) => prev.filter((u) => u.id !== unitId));
  };

  const handleResetDefaultUnits = () => {
    setUnits(INITIAL_UNITS);
  };

  const handleNext = () => {
    if (activeStep < 7) {
      setActiveStep(activeStep + 1);
    } else {
      // Launch
      const inScopeFacilities = facilities.filter((f) => f.inScope).map((f) => f.name).join(', ');
      const inScopeServices = criticalServices.filter((s) => s.inScope).map((s) => s.name).join(', ');
      setProject({
        ...currentProject,
        name: projectName,
        code: projectCode,
        clientName,
        framework,
        sponsorName: `${sponsorName} (${sponsorTitle})`,
        bcmCoordinatorName: `${clientPicName} (${clientPicTitle})`,
        consultingPmName: pm,
        scopeDescription: `${inScopeFacilities} | Layanan: ${inScopeServices}`,
        location: facilities.find((f) => f.inScope)?.city || 'Jakarta Head Office & DC Serpong',
        startDate,
        targetDate,
      });
      addAuditLog('CREATE_PROJECT', 'PROJECT', projectCode, `Project ${projectCode} (${projectName}) untuk ${clientName} (${clientCode}) berhasil di-launch.`);
      setShowWizard(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
              Module 1 — Project Portfolio
            </span>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Multi-Client Ready
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Project Setup & Engagement Management
          </h1>
          <p className="text-xs text-slate-500">
            Kelola parameter penugasan konsultasi BCM, profil lengkap klien, ruang lingkup organisasi, dan metodologi BIA.
          </p>
        </div>

        <button
          onClick={() => {
            setShowWizard(true);
            setActiveStep(1);
          }}
          className="px-4 py-2.5 bg-[#0B1F3A] hover:bg-[#133C67] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Setup Project Baru (Wizard)</span>
        </button>
      </div>

      {/* Existing Projects List */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Active Project Card */}
        <div className="bg-white rounded-2xl border-2 border-[#00A9CE]/40 p-5 shadow-md relative">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active Engagement
            </span>
            <span className="font-mono text-xs font-bold text-slate-400">{currentProject.code}</span>
          </div>

          <h3 className="font-bold text-base text-slate-900">{currentProject.clientName}</h3>
          <p className="text-xs text-slate-600 mt-1 font-medium">{currentProject.name}</p>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-[11px] text-slate-400">Framework</div>
              <div className="font-semibold text-slate-800">{currentProject.framework}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Lead Consultant</div>
              <div className="font-semibold text-slate-800">{currentProject.consultingPmName}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Project Sponsor</div>
              <div className="font-semibold text-slate-800">{currentProject.sponsorName}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Target Selesai</div>
              <div className="font-semibold text-slate-800">{currentProject.targetDate}</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#00A9CE] h-full rounded-full" style={{ width: `${currentProject.completionPercent}%` }} />
              </div>
              <span className="text-xs font-bold text-[#00A9CE]">{currentProject.completionPercent}%</span>
            </div>
            <button
              onClick={() => {
                setShowWizard(true);
                setActiveStep(1);
              }}
              className="text-xs font-bold text-slate-700 hover:text-[#00A9CE] flex items-center gap-1"
            >
              <span>Edit Configuration</span>
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 7-Step Project Setup Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Wizard Header */}
            <div className="p-4 sm:p-5 bg-[#0B1F3A] text-white flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-base sm:text-lg font-bold">
                  Step {activeStep} of 7: {WIZARD_STEPS[activeStep - 1].title}
                </h2>
              </div>
              <button
                onClick={() => setShowWizard(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕ Tutup
              </button>
            </div>

            {/* Step Indicators */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 overflow-x-auto flex items-center gap-2 shrink-0">
              {WIZARD_STEPS.map((s) => (
                <div
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shrink-0 transition-colors ${
                    activeStep === s.step
                      ? 'bg-[#00A9CE] text-slate-950 shadow-sm'
                      : activeStep > s.step
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-white text-slate-500 border border-slate-200'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-black/10">
                    {activeStep > s.step ? '✓' : s.step}
                  </span>
                  <span>{s.title}</span>
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-xs space-y-5">
              {/* STEP 1: COMPREHENSIVE CLIENT INFO */}
              {activeStep === 1 && (
                <div className="space-y-6">
                  {/* Top Intro Alert */}
                  <div className="p-3.5 bg-cyan-50/70 border border-cyan-200/80 rounded-xl flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-cyan-950 text-xs">Identifikasi Profil & Tata Kelola Klien (ISO 22301 Clause 4.1)</h4>
                      <p className="text-[11px] text-cyan-900 mt-0.5 leading-relaxed">
                        Lengkapi profil legal entitas, regulator pengawas, skala operasional, dan penanggung jawab proyek. Data ini menjadi fondasi parameter BIA, kuesioner dampak, serta laporan audit kelangsungan usaha.
                      </p>
                    </div>
                  </div>

                  {/* Section A: Identitas Entitas Legal */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <Landmark className="w-4 h-4 text-cyan-600" />
                      <h4 className="font-bold text-sm text-slate-900">A. Identitas Badan Hukum & Industri</h4>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Kode Unik Klien</label>
                        <div className="relative">
                          <Hash className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                          <input
                            type="text"
                            value={clientCode}
                            onChange={(e) => setClientCode(e.target.value)}
                            placeholder="e.g. CLT-BNU-01"
                            className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-[#00A9CE]"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">Nama Legal Klien / Badan Hukum Perusahaan</label>
                        <div className="relative">
                          <Building className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                          <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="e.g. PT Bank Nusantara Sejahtera Tbk"
                            className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 focus:border-[#00A9CE]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Nama Merek / Alias Klien</label>
                        <input
                          type="text"
                          value={clientAlias}
                          onChange={(e) => setClientAlias(e.target.value)}
                          placeholder="e.g. Bank Nusantara / BNU"
                          className="w-full p-2 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:border-[#00A9CE]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Sektor / Industri</label>
                        <select
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-xl font-semibold text-slate-800 bg-white focus:border-[#00A9CE]"
                        >
                          <option value="Perbankan & Jasa Keuangan (KBMI 3)">Perbankan & Jasa Keuangan (KBMI 3)</option>
                          <option value="Perbankan Syariah & Digital Banking">Perbankan Syariah & Digital Banking</option>
                          <option value="Asuransi Jiwa & Umum">Asuransi Jiwa & Umum</option>
                          <option value="Multi-finance & Pembiayaan">Multi-finance & Pembiayaan</option>
                          <option value="Pasar Modal & Sekuritas">Pasar Modal & Sekuritas</option>
                          <option value="Telekomunikasi & Layanan Digital">Telekomunikasi & Layanan Digital</option>
                          <option value="Energi, Migas & Utilitas (BUMN)">Energi, Migas & Utilitas (BUMN)</option>
                          <option value="Kesehatan & Farmasi">Kesehatan & Farmasi</option>
                          <option value="Manufaktur & Rantai Pasok">Manufaktur & Rantai Pasok</option>
                          <option value="Pemerintahan & Badan Publik">Pemerintahan & Badan Publik</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Skala Organisasi</label>
                        <select
                          value={orgScale}
                          onChange={(e) => setOrgScale(e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-xl font-semibold text-slate-800 bg-white focus:border-[#00A9CE]"
                        >
                          <option value="Enterprise (KBMI 3 / BUKU 3)">Enterprise (KBMI 3 / BUKU 3)</option>
                          <option value="Tier-1 Mega Enterprise (KBMI 4 / Konglomerasi)">Tier-1 Mega Enterprise (KBMI 4 / Konglomerasi)</option>
                          <option value="Large Commercial Enterprise">Large Commercial Enterprise</option>
                          <option value="Mid-Market Enterprise">Mid-Market Enterprise</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">
                        Lembaga Regulator Pengawas Utama (Pilih yang berlaku):
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Otoritas Jasa Keuangan (OJK)',
                          'Bank Indonesia (BI)',
                          'BSSN',
                          'Kementerian Komunikasi dan Digital (Komdigi)',
                          'Kementerian BUMN',
                          'Kementerian Keuangan',
                        ].map((reg) => {
                          const checked = regulators.includes(reg);
                          return (
                            <button
                              type="button"
                              key={reg}
                              onClick={() => toggleRegulator(reg)}
                              className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${
                                checked
                                  ? 'bg-[#0B1F3A] text-white shadow-sm border border-slate-800'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                              }`}
                            >
                              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${checked ? 'bg-[#00A9CE] text-[#0B1F3A]' : 'bg-slate-300 text-slate-600'}`}>
                                {checked ? '✓' : '+'}
                              </span>
                              <span>{reg}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Section B: Domisili Kantor Pusat & Kontak */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <MapPin className="w-4 h-4 text-cyan-600" />
                      <h4 className="font-bold text-sm text-slate-900">B. Domisili Kantor Pusat & Saluran Resmi</h4>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap Kantor Pusat (Head Office)</label>
                        <textarea
                          rows={2}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Nama Gedung, Lantai, Jalan, Kawasan..."
                          className="w-full p-2.5 border border-slate-300 rounded-xl leading-relaxed focus:border-[#00A9CE]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Kota, Provinsi & Kode Pos</label>
                          <input
                            type="text"
                            value={cityPostal}
                            onChange={(e) => setCityPostal(e.target.value)}
                            placeholder="e.g. Jakarta Selatan, DKI Jakarta 12190"
                            className="w-full p-2 border border-slate-300 rounded-xl"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Negara Domisili</label>
                            <input
                              type="text"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Situs Web Resmi</label>
                            <div className="relative">
                              <Globe className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
                              <input
                                type="text"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="https://..."
                                className="w-full pl-8 pr-2 py-2 border border-slate-300 rounded-xl"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section C: Dimensi Operasional & Ruang Lingkup BCM */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <Briefcase className="w-4 h-4 text-cyan-600" />
                      <h4 className="font-bold text-sm text-slate-900">C. Dimensi Operasional & Ruang Lingkup BCM</h4>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Total Tenaga Kerja / Karyawan</label>
                        <div className="relative">
                          <Users className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                          <input
                            type="text"
                            value={totalEmployees}
                            onChange={(e) => setTotalEmployees(e.target.value)}
                            placeholder="e.g. 5.200 Pegawai"
                            className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-xl font-semibold text-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Nilai Rata-rata Transaksi Harian</label>
                        <input
                          type="text"
                          value={dailyTransactionValue}
                          onChange={(e) => setDailyTransactionValue(e.target.value)}
                          placeholder="e.g. Rp 8.5 Triliun / hari"
                          className="w-full p-2 border border-slate-300 rounded-xl font-semibold text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Fasilitas Utama Terlibat</label>
                        <input
                          type="text"
                          value={totalBranches}
                          onChange={(e) => setTotalBranches(e.target.value)}
                          placeholder="e.g. Head Office, DC Serpong, DRC Surabaya"
                          className="w-full p-2 border border-slate-300 rounded-xl font-semibold text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section D: Kontak PIC Klien & Executive Sponsor */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <UserCheck className="w-4 h-4 text-cyan-600" />
                      <h4 className="font-bold text-sm text-slate-900">D. PIC Pendampingan Klien & Executive Sponsor</h4>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                      {/* Sub-row 1: Client BCM Coordinator PIC */}
                      <div>
                        <div className="text-[11px] font-bold text-cyan-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                          <span>1. Client BCM Coordinator PIC (Kontak Harian Proyek)</span>
                        </div>
                        <div className="grid sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block font-medium text-slate-600 mb-1">Nama Lengkap PIC</label>
                            <input
                              type="text"
                              value={clientPicName}
                              onChange={(e) => setClientPicName(e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded-xl font-semibold text-slate-800 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block font-medium text-slate-600 mb-1">Jabatan PIC</label>
                            <input
                              type="text"
                              value={clientPicTitle}
                              onChange={(e) => setClientPicTitle(e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded-xl text-slate-800 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block font-medium text-slate-600 mb-1">Email Resmi</label>
                            <div className="relative">
                              <Mail className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
                              <input
                                type="email"
                                value={clientPicEmail}
                                onChange={(e) => setClientPicEmail(e.target.value)}
                                className="w-full pl-8 pr-2 py-2 border border-slate-300 rounded-xl text-slate-800 bg-white"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block font-medium text-slate-600 mb-1">Telepon / WhatsApp</label>
                            <div className="relative">
                              <Phone className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
                              <input
                                type="text"
                                value={clientPicPhone}
                                onChange={(e) => setClientPicPhone(e.target.value)}
                                className="w-full pl-8 pr-2 py-2 border border-slate-300 rounded-xl text-slate-800 bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sub-row 2: Executive Sponsor (C-Level) */}
                      <div className="pt-3 border-t border-slate-200">
                        <div className="text-[11px] font-bold text-cyan-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                          <span>2. Project Executive Sponsor (Direksi / Pemilik Risiko)</span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-medium text-slate-600 mb-1">Nama Executive Sponsor</label>
                            <input
                              type="text"
                              value={sponsorName}
                              onChange={(e) => setSponsorName(e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded-xl font-semibold text-slate-800 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block font-medium text-slate-600 mb-1">Jabatan Tingkat Direksi</label>
                            <input
                              type="text"
                              value={sponsorTitle}
                              onChange={(e) => setSponsorTitle(e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded-xl text-slate-800 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Organization */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  {/* Top Intro Alert */}
                  <div className="p-3.5 bg-cyan-50/70 border border-cyan-200/80 rounded-xl flex items-start gap-3">
                    <Network className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-cyan-950 text-xs">
                        Definisi Kedalaman Struktur & Unit Organisasi Klien (ISO 22301 Clause 5.3)
                      </h4>
                      <p className="text-[11px] text-cyan-900 mt-0.5 leading-relaxed">
                        Tentukan kedalaman tingkatan hierarki dan nomenklatur level organisasi sesuai struktur aktual klien (parameterized, tidak di-hardcode). Daftarkan unit kerja awal yang menjadi ruang lingkup penilaian BCM.
                      </p>
                    </div>
                  </div>

                  {/* Section A: Konfigurasi Kedalaman Level Hirarki */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-600" />
                        <h4 className="font-bold text-sm text-slate-900">A. Kedalaman Level & Nomenklatur Hierarki</h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs flex-wrap">
                        <span className="text-slate-500 font-medium">Preset Cepat:</span>
                        <button
                          type="button"
                          onClick={() => applyHierarchyPreset('banking')}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 text-[11px]"
                        >
                          🏦 Perbankan
                        </button>
                        <button
                          type="button"
                          onClick={() => applyHierarchyPreset('corporate')}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 text-[11px]"
                        >
                          🏢 Korporasi/BUMN
                        </button>
                        <button
                          type="button"
                          onClick={() => applyHierarchyPreset('tech')}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 text-[11px]"
                        >
                          🚀 Tech / Agile
                        </button>
                      </div>
                    </div>

                    {/* Depth Selection Buttons */}
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">
                        Pilih Jumlah Tingkatan Kedalaman Struktur:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          { depth: 2, label: '2 Tingkat', desc: 'Direktorat > Unit Pelaksana (Struktur Ringkas)' },
                          { depth: 3, label: '3 Tingkat (Standar)', desc: 'Direktorat > Divisi > Departemen / Unit (Rekomendasi ISO)' },
                          { depth: 4, label: '4 Tingkat', desc: 'Holding > Direktorat > Divisi > Unit / Seksi (Enterprise Kompleks)' },
                        ].map((d) => (
                          <button
                            type="button"
                            key={d.depth}
                            onClick={() => setHierarchyDepth(d.depth)}
                            className={`p-3 rounded-xl text-left border transition-all ${
                              hierarchyDepth === d.depth
                                ? 'bg-cyan-50 border-cyan-500 ring-2 ring-cyan-400/20 shadow-sm'
                                : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 text-xs">{d.label}</span>
                              {hierarchyDepth === d.depth && (
                                <span className="w-4 h-4 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[10px]">
                                  ✓
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">{d.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Level Label Inputs */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                      <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                        Sesuaikan Nama Nomenklatur Setiap Tingkat:
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {Array.from({ length: hierarchyDepth }, (_, idx) => idx + 1).map((lvl) => (
                          <div key={lvl}>
                            <label className="block font-medium text-slate-600 text-[11px] mb-1">
                              Tingkat {lvl} (Level {lvl})
                            </label>
                            <input
                              type="text"
                              value={levelLabels[lvl] || ''}
                              onChange={(e) =>
                                setLevelLabels((prev) => ({
                                  ...prev,
                                  [lvl]: e.target.value,
                                }))
                              }
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white focus:border-[#00A9CE]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section B: Unit Kerja Klien & Quick Unit Builder */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-cyan-600" />
                        <h4 className="font-bold text-sm text-slate-900">
                          B. Unit Kerja Organisasi Klien ({units.length} Unit Terdaftar)
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleResetDefaultUnits}
                          className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white shadow-xs"
                        >
                          Muat Default Bank
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddUnitForm(!showAddUnitForm)}
                          className="px-3 py-1.5 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{showAddUnitForm ? 'Tutup Form' : 'Tambah Unit Baru'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Inline Form to Add New Unit */}
                    {showAddUnitForm && (
                      <div className="p-4 bg-cyan-50/50 border-2 border-cyan-200 rounded-xl space-y-3 animate-in fade-in duration-150">
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <PlusCircle className="w-4 h-4 text-cyan-600" />
                          <span>Form Tambah Unit Kerja Organisasi Baru</span>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Kode Unit</label>
                            <input
                              type="text"
                              value={newUnitCode}
                              onChange={(e) => setNewUnitCode(e.target.value)}
                              placeholder="e.g. DIV-CC"
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono font-bold bg-white"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block font-semibold text-slate-700 mb-1">Nama Unit Kerja</label>
                            <input
                              type="text"
                              value={newUnitName}
                              onChange={(e) => setNewUnitName(e.target.value)}
                              placeholder="e.g. Divisi Customer Care & Contact Center 24/7"
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Tingkat Hirarki</label>
                            <select
                              value={newUnitLevel}
                              onChange={(e) => setNewUnitLevel(Number(e.target.value))}
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                            >
                              {Array.from({ length: hierarchyDepth }, (_, idx) => idx + 1).map((lvl) => (
                                <option key={lvl} value={lvl}>
                                  Level {lvl} - {levelLabels[lvl] || `Level ${lvl}`}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Unit Induk (Parent)</label>
                            <select
                              disabled={newUnitLevel === 1}
                              value={newUnitParent}
                              onChange={(e) => setNewUnitParent(e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white disabled:bg-slate-100"
                            >
                              <option value="">(Tidak Ada - Top Level Unit)</option>
                              {units
                                .filter((u) => u.level < newUnitLevel)
                                .map((u) => (
                                  <option key={u.id} value={u.id}>
                                    {u.code} - {u.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Lokasi Gedung / Fisik</label>
                            <input
                              type="text"
                              value={newUnitLocation}
                              onChange={(e) => setNewUnitLocation(e.target.value)}
                              placeholder="e.g. Menara Nusantara Lt. 15"
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Kepala Unit Kerja (Unit Head)</label>
                            <input
                              type="text"
                              value={newUnitHead}
                              onChange={(e) => setNewUnitHead(e.target.value)}
                              placeholder="Nama & Gelar Kepala Unit"
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">BCM Coordinator PIC Unit</label>
                            <input
                              type="text"
                              value={newUnitCoord}
                              onChange={(e) => setNewUnitCoord(e.target.value)}
                              placeholder="Nama PIC Pendamping BCM Unit"
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-cyan-200">
                          <button
                            type="button"
                            onClick={() => setShowAddUnitForm(false)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 font-semibold text-xs hover:bg-slate-100"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={handleAddUnit}
                            className="px-4 py-1.5 bg-[#0B1F3A] hover:bg-[#133C67] text-white font-bold text-xs rounded-lg shadow-sm"
                          >
                            Simpan Unit ke Ruang Lingkup Proyek
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Units Table */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                      <div className="max-h-72 overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] sticky top-0">
                            <tr>
                              <th className="py-2.5 px-3">Kode & Unit Kerja</th>
                              <th className="py-2.5 px-3">Tingkat Hierarki</th>
                              <th className="py-2.5 px-3">Unit Induk (Parent)</th>
                              <th className="py-2.5 px-3">Kepala Unit & BCM PIC</th>
                              <th className="py-2.5 px-3">Lokasi</th>
                              <th className="py-2.5 px-3 text-center">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                            {units.map((unit) => {
                              const parent = units.find((u) => u.id === unit.parentId);
                              return (
                                <tr key={unit.id} className="hover:bg-slate-50/70 transition-colors">
                                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                                    <div className="flex items-center gap-1.5">
                                      {unit.level > 1 && (
                                        <span className="text-slate-300 font-mono">
                                          {'—'.repeat(unit.level - 1)}
                                        </span>
                                      )}
                                      <span className="font-mono text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                        {unit.code}
                                      </span>
                                      <span>{unit.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <span
                                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        unit.level === 1
                                          ? 'bg-[#0B1F3A] text-white'
                                          : unit.level === 2
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-emerald-100 text-emerald-800'
                                      }`}
                                    >
                                      Level {unit.level}: {levelLabels[unit.level] || unit.levelName}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                                    {parent ? `${parent.code} - ${parent.name}` : '(Top Level)'}
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <div className="font-medium text-slate-800">{unit.unitHeadName}</div>
                                    <div className="text-[10px] text-cyan-700 font-semibold flex items-center gap-1">
                                      <UserCheck className="w-3 h-3" />
                                      <span>PIC: {unit.bcmCoordName}</span>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                                    {unit.location}
                                  </td>
                                  <td className="py-2.5 px-3 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteUnit(unit.id)}
                                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                                      title="Hapus Unit"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Section C: Indikator Tata Kelola & Validasi Organisasi */}
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-[11px] text-slate-500 font-medium">Total Unit Organisasi</div>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">{units.length} Unit Kerja</div>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 100% In-Scope BCM
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-[11px] text-slate-500 font-medium">Penugasan PIC BCM Unit</div>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">
                        {units.filter((u) => u.bcmCoordName && u.bcmCoordName !== 'Belum Ditugaskan').length} / {units.length}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Lengkap Terpenuhi
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-[11px] text-slate-500 font-medium">Kesesuaian ISO 22301:2019</div>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">Clause 5.3 Valid</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Peran & wewenang operasional terdefinisi
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Project Scope */}
              {activeStep === 3 && (
                <div className="space-y-6">
                  {/* Intro Banner */}
                  <div className="p-3.5 bg-cyan-50/70 border border-cyan-200/80 rounded-xl flex items-start gap-3">
                    <Building className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-cyan-950 text-xs">
                        Penetapan Ruang Lingkup Proyek & Batasan BCMS (ISO 22301 Clause 4.3)
                      </h4>
                      <p className="text-[11px] text-cyan-900 mt-0.5 leading-relaxed">
                        Definisikan parameter engagement, fasilitas fisik & data center kritis, produk & layanan prioritas, unit kerja yang berpartisipasi, serta justifikasi pengecualian ruang lingkup yang auditable.
                      </p>
                    </div>
                  </div>

                  {/* Section A: Parameter & Karakteristik Engagement Proyek */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <Briefcase className="w-4 h-4 text-cyan-600" />
                      <h4 className="font-bold text-sm text-slate-900">A. Parameter Engagement & Sasaran Proyek</h4>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">Judul / Nama Proyek Pendampingan</label>
                        <input
                          type="text"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          placeholder="e.g. Pendampingan Implementasi BCM & BIA ISO 22301:2019"
                          className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-slate-900 focus:border-[#00A9CE]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Kode Registrasi Proyek</label>
                        <div className="relative">
                          <Hash className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                          <input
                            type="text"
                            value={projectCode}
                            onChange={(e) => setProjectCode(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-slate-800 bg-slate-50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Paket / Tipe Engagement</label>
                        <select
                          value={engagementType}
                          onChange={(e) => setEngagementType(e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-xl font-semibold text-slate-800 bg-white focus:border-[#00A9CE]"
                        >
                          <option value="Implementasi Penuh BCMS ISO 22301:2019 & BIA ISO 22317:2021">
                            Implementasi Penuh BCMS ISO 22301 & BIA ISO 22317
                          </option>
                          <option value="BIA Refreshment & POJK 11/2022 Compliance Review">
                            BIA Refreshment & POJK 11/2022 Compliance Review
                          </option>
                          <option value="Disaster Recovery Plan (DRP) & Crisis Simulation Drill">
                            Disaster Recovery Plan (DRP) & Crisis Simulation Drill
                          </option>
                          <option value="Pre-Audit Gap Assessment & Operational Resilience Review">
                            Pre-Audit Gap Assessment & Operational Resilience
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Tanggal Mulai (Kick-Off)</label>
                        <div className="relative">
                          <Calendar className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Target Penyelesaian / Audit BCM</label>
                        <div className="relative">
                          <Calendar className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                          <input
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Sasaran & Objektif Utama Proyek</label>
                      <textarea
                        rows={2}
                        value={projectObjective}
                        onChange={(e) => setProjectObjective(e.target.value)}
                        placeholder="Uraikan objektif strategis kepatuhan dan ketahanan operasional proyek..."
                        className="w-full p-2.5 border border-slate-300 rounded-xl leading-relaxed text-xs focus:border-[#00A9CE]"
                      />
                    </div>
                  </div>

                  {/* Section B: Fasilitas Fisik, Data Center & Lokasi Kritis */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-cyan-600" />
                        <h4 className="font-bold text-sm text-slate-900">
                          B. Fasilitas Fisik, Data Center & Lokasi Kritis ({facilities.filter((f) => f.inScope).length} In-Scope)
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {facilities.length < DEFAULT_FACILITIES.length && (
                          <button
                            type="button"
                            onClick={handleResetFacilities}
                            className="px-2.5 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors"
                            title="Pulihkan fasilitas default"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Reset Default</span>
                          </button>
                        )}
                        {facilities.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Hapus semua fasilitas dari ruang lingkup?')) {
                                setFacilities([]);
                              }
                            }}
                            className="px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors"
                            title="Hapus semua fasilitas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Hapus Semua</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowAddFacility(!showAddFacility)}
                          className="px-3 py-1.5 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{showAddFacility ? 'Tutup Form' : 'Tambah Fasilitas'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Inline Form Add Facility */}
                    {showAddFacility && (
                      <div className="p-3.5 bg-cyan-50/50 border-2 border-cyan-200 rounded-xl space-y-3 animate-in fade-in duration-150">
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <PlusCircle className="w-4 h-4 text-cyan-600" />
                          <span>Form Tambah Lokasi Fasilitas Kritis Baru</span>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block font-semibold text-slate-700 mb-1">Nama Gedung / Fasilitas</label>
                            <input
                              type="text"
                              value={newFacName}
                              onChange={(e) => setNewFacName(e.target.value)}
                              placeholder="e.g. Data Center Tier-4 Cikarang"
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold bg-white"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Kategori Fasilitas</label>
                            <select
                              value={newFacCategory}
                              onChange={(e) => setNewFacCategory(e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                            >
                              <option value="Kantor Pusat (HO)">Kantor Pusat (HO)</option>
                              <option value="Primary Data Center">Primary Data Center</option>
                              <option value="Secondary DRC">Secondary DRC</option>
                              <option value="Hybrid Cloud DC">Hybrid Cloud DC</option>
                              <option value="Cabang Operasional">Cabang Operasional</option>
                              <option value="Workplace Alternate Site">Workplace Alternate Site</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Kota / Lokasi Geografis</label>
                            <input
                              type="text"
                              value={newFacCity}
                              onChange={(e) => setNewFacCity(e.target.value)}
                              placeholder="e.g. Bekasi, Jawa Barat"
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                            />
                          </div>
                          <div className="flex items-end justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setShowAddFacility(false)}
                              className="px-3 py-2 rounded-lg border border-slate-300 text-slate-600 font-semibold text-xs hover:bg-slate-100"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={handleAddFacility}
                              className="px-4 py-2 bg-[#0B1F3A] hover:bg-[#133C67] text-white font-bold text-xs rounded-lg shadow-sm"
                            >
                              Simpan Fasilitas
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Facilities Interactive Cards */}
                    {facilities.length === 0 ? (
                      <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 space-y-2">
                        <p className="text-xs text-slate-500 font-medium">Belum ada lokasi fasilitas yang terdaftar dalam ruang lingkup.</p>
                        <div className="flex items-center justify-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleResetFacilities}
                            className="px-3 py-1.5 text-xs font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 flex items-center gap-1.5 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Muat Default Fasilitas Perbankan</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {facilities.map((fac) => (
                          <div
                            key={fac.id}
                            onClick={() => toggleFacilityInScope(fac.id)}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start justify-between gap-3 ${
                              fac.inScope
                                ? 'bg-cyan-50/60 border-cyan-400 ring-1 ring-cyan-300/40 shadow-xs'
                                : 'bg-slate-50/60 border-slate-200 opacity-60 hover:opacity-90'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-slate-900 text-xs">{fac.name}</span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                    fac.tier.includes('Tier-1')
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  {fac.tier}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-600 flex items-center gap-2">
                                <span className="font-medium text-cyan-800">{fac.category}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-slate-500">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {fac.city}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-medium">
                                Redundansi: {fac.redundancy}
                              </div>
                            </div>

                            <div className="shrink-0 pt-0.5 flex items-center gap-1">
                              <button
                                type="button"
                                title="Hapus fasilitas ini"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFacility(fac.id);
                                }}
                                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-100/80 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <span
                                title={fac.inScope ? 'In-Scope (klik untuk toggle)' : 'Out-of-Scope (klik untuk toggle)'}
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                  fac.inScope ? 'bg-[#00A9CE] text-slate-950 shadow-xs' : 'bg-slate-200 text-slate-400'
                                }`}
                              >
                                {fac.inScope ? '✓' : '+'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section C: Produk & Layanan Kritis Perbankan In-Scope */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-600" />
                        <h4 className="font-bold text-sm text-slate-900">
                          C. Produk & Layanan Kritis Perbankan ({criticalServices.filter((s) => s.inScope).length} Layanan Prioritas)
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {criticalServices.length < DEFAULT_CRITICAL_SERVICES.length && (
                          <button
                            type="button"
                            onClick={handleResetServices}
                            className="px-2.5 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors"
                            title="Pulihkan layanan default"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Reset Default</span>
                          </button>
                        )}
                        {criticalServices.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Hapus semua produk & layanan kritis dari ruang lingkup?')) {
                                setCriticalServices([]);
                              }
                            }}
                            className="px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors"
                            title="Hapus semua layanan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Hapus Semua</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowAddService(!showAddService)}
                          className="px-3 py-1.5 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{showAddService ? 'Tutup Form' : 'Tambah Layanan'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Inline Form Add Service */}
                    {showAddService && (
                      <div className="p-3.5 bg-emerald-50/50 border-2 border-emerald-200 rounded-xl space-y-3 animate-in fade-in duration-150">
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <PlusCircle className="w-4 h-4 text-emerald-600" />
                          <span>Form Tambah Produk & Layanan Kritis Baru</span>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block font-semibold text-slate-700 mb-1">Nama Produk / Layanan</label>
                            <input
                              type="text"
                              value={newSrvName}
                              onChange={(e) => setNewSrvName(e.target.value)}
                              placeholder="e.g. Open API Banking Ecosystem & Virtual Account"
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold bg-white"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Target Baseline RTO</label>
                            <select
                              value={newSrvRto}
                              onChange={(e) => setNewSrvRto(e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                            >
                              <option value="< 1 Jam">&lt; 1 Jam</option>
                              <option value="< 2 Jam">&lt; 2 Jam</option>
                              <option value="< 4 Jam">&lt; 4 Jam</option>
                              <option value="< 8 Jam">&lt; 8 Jam</option>
                              <option value="< 24 Jam">&lt; 24 Jam</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Regulator Pengawas Utama</label>
                            <select
                              value={newSrvRegulator}
                              onChange={(e) => setNewSrvRegulator(e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                            >
                              <option value="Bank Indonesia">Bank Indonesia</option>
                              <option value="OJK">Otoritas Jasa Keuangan (OJK)</option>
                              <option value="OJK & BI">OJK & Bank Indonesia</option>
                              <option value="BSSN">BSSN</option>
                            </select>
                          </div>
                          <div className="flex items-end justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setShowAddService(false)}
                              className="px-3 py-2 rounded-lg border border-slate-300 text-slate-600 font-semibold text-xs hover:bg-slate-100"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={handleAddService}
                              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg shadow-sm"
                            >
                              Simpan Layanan Kritis
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Services Interactive Grid */}
                    {criticalServices.length === 0 ? (
                      <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 space-y-2">
                        <p className="text-xs text-slate-500 font-medium">Belum ada produk atau layanan kritis yang terdaftar.</p>
                        <div className="flex items-center justify-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleResetServices}
                            className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Muat Default Layanan Kritis Perbankan</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {criticalServices.map((srv) => (
                          <div
                            key={srv.id}
                            onClick={() => toggleServiceInScope(srv.id)}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start justify-between gap-3 ${
                              srv.inScope
                                ? 'bg-emerald-50/60 border-emerald-400 ring-1 ring-emerald-300/40 shadow-xs'
                                : 'bg-slate-50/60 border-slate-200 opacity-60 hover:opacity-90'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-slate-900 text-xs">{srv.name}</span>
                              </div>
                              <div className="text-[11px] text-slate-600 flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-emerald-800">{srv.category}</span>
                                <span>•</span>
                                <span className="text-slate-500 font-medium">Reg: {srv.regulator}</span>
                              </div>
                              <div className="text-[10px] font-bold text-cyan-800 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-cyan-600" />
                                <span>Target Baseline RTO: {srv.targetRto}</span>
                              </div>
                            </div>

                            <div className="shrink-0 pt-0.5 flex items-center gap-1">
                              <button
                                type="button"
                                title="Hapus layanan ini"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteService(srv.id);
                                }}
                                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-100/80 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <span
                                title={srv.inScope ? 'In-Scope (klik untuk toggle)' : 'Out-of-Scope (klik untuk toggle)'}
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                  srv.inScope ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 text-slate-400'
                                }`}
                              >
                                {srv.inScope ? '✓' : '+'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section D: Unit Kerja yang Masuk Ruang Lingkup (From Step 2) */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <Network className="w-4 h-4 text-cyan-600" />
                      <h4 className="font-bold text-sm text-slate-900">
                        D. Unit Kerja Organisasi Terlibat ({units.length} Unit In-Scope dari Step 2)
                      </h4>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <p className="text-[11px] text-slate-600 mb-2">
                        Seluruh unit kerja yang didefinisikan pada Step 2 otomatis terintegrasi ke dalam ruang lingkup BIA dan BCP:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {units.map((u) => (
                          <div
                            key={u.id}
                            className="bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs shadow-2xs"
                          >
                            <span className="font-mono text-cyan-800 bg-cyan-50 px-1 py-0.5 rounded text-[10px] font-bold">
                              {u.code}
                            </span>
                            <span className="font-semibold text-slate-800">{u.name}</span>
                            <span className="text-[10px] text-emerald-600 font-bold">✓ In-Scope</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section E: Pengecualian Ruang Lingkup (Out of Scope Justification) */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <AlertCircle className="w-4 h-4 text-cyan-600" />
                      <h4 className="font-bold text-sm text-slate-900">
                        E. Pengecualian & Batasan Ruang Lingkup (ISO 22301 Clause 4.3 Requirement)
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Sesuai standar ISO 22301, auditor sertifikasi mewajibkan organisasi mendokumentasikan batas dan pengecualian secara formal. Pengecualian tidak boleh merusak kemampuan organisasi dalam memenuhi kewajiban kontinuitas hukum dan regulasi.
                    </p>
                    <textarea
                      rows={3}
                      value={outOfScope}
                      onChange={(e) => setOutOfScope(e.target.value)}
                      placeholder="Uraikan entitas/proses/sistem yang dikecualikan beserta alasan dan justifikasinya..."
                      className="w-full p-3 border border-slate-300 rounded-xl leading-relaxed text-xs focus:border-[#00A9CE]"
                    />
                  </div>

                  {/* Section F: Scorecard Kesiapan Ruang Lingkup */}
                  <div className="grid sm:grid-cols-4 gap-3 pt-1">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-[11px] text-slate-500 font-medium">Fasilitas In-Scope</div>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">
                        {facilities.filter((f) => f.inScope).length} Lokasi
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Termasuk DC & DRC
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-[11px] text-slate-500 font-medium">Layanan Prioritas</div>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">
                        {criticalServices.filter((s) => s.inScope).length} Layanan
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Baseline RTO Set
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-[11px] text-slate-500 font-medium">Unit Terlibat</div>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">
                        {units.length} Unit Kerja
                      </div>
                      <div className="text-[10px] text-cyan-700 font-semibold flex items-center gap-1">
                        <Network className="w-3 h-3" /> Step 2 Connected
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-[11px] text-slate-500 font-medium">ISO 22301 Clause 4.3</div>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">Auditable</div>
                      <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCheck className="w-3 h-3" /> Scope Validated
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: BCM Methodology */}
              {activeStep === 4 && (
                <div className="space-y-6 text-sm">
                  {/* Top Intro Alert */}
                  <div className="p-4 bg-cyan-50/80 border border-cyan-200 rounded-2xl flex items-start gap-3.5 shadow-xs">
                    <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-5 h-5 text-cyan-700" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-cyan-950 text-sm md:text-base">
                          Kerangka Standar & Metodologi BIA Engine (ISO 22301 & ISO 22317)
                        </h4>
                        <span className="text-xs font-mono font-bold bg-cyan-200/80 text-cyan-900 px-2.5 py-0.5 rounded-md">
                          Clause 8.2 & Clause 8.4 Aligned
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-cyan-900 leading-relaxed font-normal">
                        Konfigurasikan standar kepatuhan regulasi, metodologi evaluasi dampak kuantitatif & kualitatif, pembobotan dimensi kuesioner BIA, serta parameter Minimum Business Continuity Objective (MBCO).
                      </p>
                    </div>
                  </div>

                  {/* Section A: Primary Framework Standards */}
                  <div className="space-y-3.5 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                          <Landmark className="w-4 h-4 text-cyan-700" />
                          <span>A. Kerangka Kerja Standar Utama & Regulasi Kepatuhan</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Pilih acuan standar yang menjadi tolok ukur audit resiliensi dan kepatuhan hukum klien.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                        4 Standar Tersedia
                      </span>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          id: 'banking',
                          name: 'ISO 22301:2019, ISO 22317:2021 & POJK No. 11/POJK.03/2022',
                          badge: 'Enterprise Financial Banking',
                          desc: 'Standar Internasional BCMS + Panduan Pelaksanaan BIA + Regulasi Ketahanan Operasional Penyelenggaraan TI Bank Umum OJK & Bank Indonesia (BI-FAST/RTGS).',
                          clauses: ['ISO 22301 Clause 8.2', 'POJK 11 Bab IV (DRC & BCP)', 'PADG BI No. 23/2021'],
                        },
                        {
                          id: 'corporate',
                          name: 'ISO 22301:2019 & ISO 22313:2020 (Global Corporate BCMS)',
                          badge: 'Global Corporate & Supply Chain',
                          desc: 'Sertifikasi BCMS mandiri untuk korporasi lintas industri, manufaktur, logistik, dan retail dengan fokus ketahanan rantai pasok multi-site.',
                          clauses: ['ISO 22301 Full Clause 4-10', 'ISO 22313 Guidance', 'Supply Chain Resilience'],
                        },
                        {
                          id: 'cyber',
                          name: 'NIST SP 800-34 Rev. 1 & BSSN Cyber Resilience Framework',
                          badge: 'Cyber Security & IT DRP',
                          desc: 'Fokus pada kontinuitas sistem teknologi informasi, disaster recovery arsitektur cloud, data replication, dan penanganan insiden siber nasional.',
                          clauses: ['NIST Contingency Planning', 'BSSN Peraturan No. 4/2021', 'RPO/RTO Technical SLA'],
                        },
                        {
                          id: 'integrated',
                          name: 'ISO 22301:2019 + ISO/IEC 27001:2022 Integrated Resilience',
                          badge: 'Integrated BCMS & InfoSec',
                          desc: 'Tata kelola gabungan terpadu antara Keberlangsungan Usaha (BCM) dan Keamanan Informasi (ISMS) untuk Fintech, Digital Banking, & Data Center Provider.',
                          clauses: ['ISO 22301 & ISO 27001 Annex A', 'Zero Trust Architecture', 'Dual Audit Compliance'],
                        },
                      ].map((std) => {
                        const isSelected = framework.includes(std.name.split(',')[0]) || framework === std.name;
                        return (
                          <label
                            key={std.id}
                            className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-cyan-50/70 border-cyan-500 shadow-sm ring-1 ring-cyan-400/50'
                                : 'bg-white border-slate-200 hover:bg-slate-50/80'
                            }`}
                          >
                            <input
                              type="radio"
                              name="framework_standard"
                              checked={isSelected}
                              onChange={() => setFramework(std.name)}
                              className="mt-1 w-4 h-4 text-[#00A9CE] accent-[#00A9CE]"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="font-bold text-slate-900 text-sm">{std.name}</span>
                                <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 shrink-0">
                                  {std.badge}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">{std.desc}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                                {std.clauses.map((cl) => (
                                  <span key={cl} className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                                    • {cl}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section B: BIA Assessment Engine Approach */}
                  <div className="space-y-3.5 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        <Scale className="w-4 h-4 text-cyan-700" />
                        <span>B. Pendekatan Metodologi BIA Engine (Assessment Logic)</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Tentukan logika penilaian dampak yang akan digunakan kuesioner BIA dalam mengukur keparahan downtime.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3.5">
                      {[
                        {
                          key: 'dual_track',
                          title: 'Dual-Track Assessment',
                          badge: 'Rekomendasi Konsultan',
                          desc: 'Menggabungkan kerugian finansial riil (Rp) per durasi outage dengan penilaian kualitatif dampak regulasi, reputasi, operasional, & hukum.',
                          tags: ['Kuantitatif + Kualitatif', 'ISO 22317 Standard'],
                        },
                        {
                          key: 'quantitative',
                          title: 'Full Quantitative',
                          badge: 'Financial Focus',
                          desc: 'Fokus menghitung nilai moneter hilangnya pendapatan (lost revenue), penalti kontrak harian, denda regulator, dan biaya pemulihan darurat.',
                          tags: ['Estimasi Nilai Rp Riil', 'Cost of Recovery'],
                        },
                        {
                          key: 'qualitative',
                          title: 'Qualitative Matrix (1-5)',
                          badge: 'FGD & Konsensus',
                          desc: 'Penilaian berbasis skala 1 (Insignificant) hingga 5 (Catastrophic) berdasarkan wawancara, FGD, dan konsensus pemilik proses kerja.',
                          tags: ['Matriks 5x5 Tingkat', 'Kuesioner Wawancara'],
                        },
                      ].map((app) => {
                        const isSelected = assessmentApproach === app.key;
                        return (
                          <div
                            key={app.key}
                            onClick={() => setAssessmentApproach(app.key as any)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'bg-cyan-50/70 border-cyan-500 ring-1 ring-cyan-400/50 shadow-sm'
                                : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1.5">
                                <span className="font-bold text-sm text-slate-900">{app.title}</span>
                                {app.key === 'dual_track' && (
                                  <span className="text-xs font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded">
                                    ★ Top
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed font-normal">{app.desc}</p>
                            </div>
                            <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                              {app.tags.map((t) => (
                                <span key={t} className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section C: Evaluated Time Horizons */}
                  <div className="space-y-3 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-cyan-700" />
                          <span>C. Horizon Interval Waktu Downtime yang Dievaluasi</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Pilih interval waktu gangguan yang diwajibkan diisi responden saat mengisi kuesioner BIA (ISO 22317 Section 7.4).
                        </p>
                      </div>
                      <span className="text-xs font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200">
                        {selectedHorizons.length} Interval Terpilih
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                      {[
                        { horizon: '0 - 2 Jam', label: 'Real-Time / Urgent', desc: 'Critical SLA OJK' },
                        { horizon: '2 - 4 Jam', label: 'Short-Term', desc: 'P1 Threshold' },
                        { horizon: '4 - 8 Jam', label: 'Same-Day Cut-Off', desc: 'End of Day Batch' },
                        { horizon: '24 Jam', label: '1 Hari Kerja', desc: 'Next Day Clearing' },
                        { horizon: '48 Jam', label: '2 Hari Kerja', desc: 'Weekly Outage' },
                        { horizon: '> 7 Hari', label: 'Prolonged Crisis', desc: 'Severe Disaster' },
                      ].map((item) => {
                        const isChecked = selectedHorizons.includes(item.horizon);
                        return (
                          <div
                            key={item.horizon}
                            onClick={() => toggleHorizon(item.horizon)}
                            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-cyan-50/80 border-cyan-400 ring-1 ring-cyan-300/40 text-slate-900'
                                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                            }`}
                          >
                            <div className="font-extrabold text-sm text-slate-900">{item.horizon}</div>
                            <div className="text-xs font-bold text-cyan-800 mt-0.5">{item.label}</div>
                            <div className="text-[11px] text-slate-500 mt-1">{item.desc}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section D: Impact Dimensions & Weights */}
                  <div className="space-y-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                            <Target className="w-4 h-4 text-cyan-700" />
                            <span>D. Dimensi Dampak & Pembobotan Skor BIA</span>
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Aktifkan dimensi yang dievaluasi dan sesuaikan bobot persentase kalkulasi skor agregat dampak.
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border ${
                            totalWeight === 100
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          <span>Total Bobot: {totalWeight}%</span>
                          <span>{totalWeight === 100 ? '✓ (Valid)' : '⚠ (Wajib 100%)'}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowAddCustomDim(!showAddCustomDim)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Dimensi</span>
                        </button>
                      </div>
                    </div>

                    {/* Add Custom Dimension Form */}
                    {showAddCustomDim && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in fade-in duration-150">
                        <div className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                          Tambah Dimensi Dampak Khusus
                        </div>
                        <div className="grid sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Dimensi</label>
                            <input
                              type="text"
                              placeholder="e.g. Dampak Lingkungan Hidup & Limbah"
                              value={newDimName}
                              onChange={(e) => setNewDimName(e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Bobot (%)</label>
                            <input
                              type="number"
                              min={1}
                              max={100}
                              value={newDimWeight}
                              onChange={(e) => setNewDimWeight(Number(e.target.value))}
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Kriteria</label>
                          <input
                            type="text"
                            placeholder="Jelaskan dampak yang dievaluasi dalam kuesioner..."
                            value={newDimDesc}
                            onChange={(e) => setNewDimDesc(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowAddCustomDim(false)}
                            className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg font-semibold"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={handleAddCustomDim}
                            className="px-4 py-1.5 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg"
                          >
                            Tambahkan ke Kuesioner
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Dimensions List Cards */}
                    <div className="space-y-3">
                      {dimensionsConfig.map((dim, idx) => (
                        <div
                          key={dim.id}
                          className={`p-4 rounded-xl border transition-all ${
                            dim.enabled
                              ? 'bg-white border-slate-200 shadow-xs'
                              : 'bg-slate-50 border-slate-200 opacity-60'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={dim.enabled}
                                onChange={() => toggleDimension(dim.id)}
                                className="mt-1 w-4 h-4 accent-[#00A9CE] rounded cursor-pointer shrink-0"
                              />
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded">
                                    D{idx + 1}
                                  </span>
                                  <h5 className="font-bold text-slate-900 text-sm">{dim.name}</h5>
                                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                    {dim.clause}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed font-normal">{dim.desc}</p>
                                <div className="text-xs text-slate-500 flex items-center gap-1 font-medium pt-1">
                                  <span className="text-cyan-700 font-semibold">Indikator Metrik:</span> {dim.metric}
                                </div>
                              </div>
                            </div>

                            {/* Weight Control & Delete Action */}
                            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center pl-7 sm:pl-0">
                              <div className="text-right">
                                <div className="text-xs uppercase font-bold text-slate-400">Bobot Penilaian</div>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    disabled={!dim.enabled}
                                    value={dim.weight}
                                    onChange={(e) => updateDimensionWeight(dim.id, Number(e.target.value))}
                                    className="w-16 p-1.5 text-center text-sm font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-slate-100"
                                  />
                                  <span className="font-bold text-slate-700 text-sm">%</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                title="Hapus dimensi ini"
                                onClick={() => handleDeleteDimension(dim.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors mt-3 sm:mt-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section E: MBCO Policy & Consultant Automation Rules */}
                  <div className="space-y-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-cyan-700" />
                        <span>E. Parameter Kebijakan Resiliensi & Aturan Otomatis Konsultan</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Standar pemulihan minimum (MBCO) dan aturan validasi integritas data BIA (ISO 22301 Clause 8.2.2).
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5 text-xs uppercase tracking-wider">
                          Target Default MBCO (Minimum Business Continuity Objective)
                        </label>
                        <select
                          value={mbcoTarget}
                          onChange={(e) => setMbcoTarget(e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-sm bg-slate-50 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="50% Kapasitas Normal (Mode Darurat Minimum)">50% Kapasitas Normal (Mode Darurat Minimum)</option>
                          <option value="75% Kapasitas Normal (Standar Perbankan - Rekomendasi)">75% Kapasitas Normal (Standar Perbankan - Rekomendasi)</option>
                          <option value="100% Kapasitas Normal (Zero-Tolerance / No Degradation)">100% Kapasitas Normal (Zero-Tolerance / No Degradation)</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-1">
                          Kapasitas minimum pemrosesan transaksi yang wajib dipulihkan saat mode bencana aktif.
                        </p>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5 text-xs uppercase tracking-wider">
                          Alur Validasi & Sign-Off BIA (Approval Governance)
                        </label>
                        <select
                          value={approvalWorkflow}
                          onChange={(e) => setApprovalWorkflow(e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-sm bg-slate-50 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="3-Tier: Process Owner PIC -> Consultant Lead QA -> Steering Committee / Direksi">
                            3-Tier: Process Owner PIC → Consultant QA → Steering Committee
                          </option>
                          <option value="2-Tier: Process Owner PIC -> Head of BCM & Risk Management">
                            2-Tier: Process Owner PIC → Head of BCM & Risk Management
                          </option>
                        </select>
                        <p className="text-xs text-slate-500 mt-1">
                          Jenjang peninjauan dan pengesahan resmi laporan BIA sebelum penyusunan strategi BCP.
                        </p>
                      </div>
                    </div>

                    {/* Automation Rules Checkboxes */}
                    <div className="pt-3 border-t border-slate-100 space-y-2.5">
                      <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={strictRtoRule}
                          onChange={(e) => setStrictRtoRule(e.target.checked)}
                          className="mt-0.5 w-4 h-4 accent-[#00A9CE] rounded"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">
                            Aturan Konsistensi Ketat: RTO Harus Selalu Lebih Kecil dari MTPD (RTO &lt; MTPD)
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5">
                            Sistem secara otomatis menolak dan memblokir validasi jika Recovery Time Objective melampaui batas henti maksimal organisasi.
                          </div>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoSpofDetection}
                          onChange={(e) => setAutoSpofDetection(e.target.checked)}
                          className="mt-0.5 w-4 h-4 accent-[#00A9CE] rounded"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">
                            Deteksi Otomatis Single Point of Failure (SPOF Advisory Engine)
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5">
                            Menandai bendera peringatan risiko SPOF secara otomatis jika proses Tier 1-2 bergantung pada 1 vendor pihak ketiga atau aset TI tunggal.
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Section F: Summary Footer Card */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#00A9CE] text-slate-950 flex items-center justify-center font-bold">
                        ✓
                      </div>
                      <div>
                        <div className="font-bold text-sm">Metodologi & Parameter BIA Tervalidasi</div>
                        <div className="text-xs text-slate-400">
                          {dimensionsConfig.filter((d) => d.enabled).length} Dimensi Aktif • {totalWeight}% Total Bobot • {mbcoTarget.split('(')[0].trim()}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-cyan-300 font-mono font-semibold bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                      ISO 22317 Engine Ready
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Parameters */}
              {activeStep === 5 && (
                <div className="space-y-6">
                  {/* Header Banner */}
                  <div className="p-4 bg-gradient-to-r from-cyan-900/10 via-slate-900/5 to-cyan-800/10 border border-cyan-200/80 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-cyan-600 text-white shadow-sm shrink-0">
                        <Sliders className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">
                            Kalibrasi Skala Dampak & Horizon Waktu (ISO 22317 Parameterization)
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                            Clause 7.2 & 7.3
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Tetapkan batas materialitas kerugian finansial, kriteria dampak kualitatif non-finansial, serta target pemulihan (MTPD, RTO, RPO) yang disesuaikan dengan skala dan profil risiko klien.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Preset Selector */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-cyan-700" />
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Preset Kalibrasi Materialitas Dampak (Berdasarkan Skala Industri):
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 italic">
                        Klik preset untuk menerapkan standar industri
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {[
                        {
                          id: 'banking_kbmi2_3',
                          title: 'Bank KBMI 2–3 / BPD',
                          sub: 'Aset Rp 10T – 100T',
                          desc: 'Standar Bank Menengah & BPD',
                          borderActive: 'border-cyan-600 bg-cyan-50/70 text-cyan-950 ring-1 ring-cyan-500',
                        },
                        {
                          id: 'banking_kbmi4',
                          title: 'Bank KBMI 4 (Sistemik)',
                          sub: 'Aset > Rp 100T',
                          desc: 'Standar Bank Besar & BUMN',
                          borderActive: 'border-blue-600 bg-blue-50/70 text-blue-950 ring-1 ring-blue-500',
                        },
                        {
                          id: 'fintech_mid',
                          title: 'FinTech & PJP',
                          sub: 'Aset < Rp 10T',
                          desc: 'Payment Gateway / P2P',
                          borderActive: 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-500',
                        },
                        {
                          id: 'corporate_general',
                          title: 'Korporasi & Manufaktur',
                          sub: 'General Enterprise',
                          desc: 'Rantai Pasok & Retail',
                          borderActive: 'border-slate-700 bg-slate-100 text-slate-900 ring-1 ring-slate-400',
                        },
                      ].map((preset) => {
                        const isSelected = materialityPreset === preset.id;
                        return (
                          <button
                            type="button"
                            key={preset.id}
                            onClick={() => applyMaterialityPreset(preset.id as any)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              isSelected
                                ? preset.borderActive
                                : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs">{preset.title}</span>
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
                              )}
                            </div>
                            <div className="text-[11px] font-medium text-slate-500 mt-0.5">{preset.sub}</div>
                            <div className="text-[10px] text-slate-400 mt-1">{preset.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section A: Financial Loss Table (Fully Editable) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block font-bold text-slate-800 text-xs uppercase tracking-wide">
                          A. Tabel Ambang Batas Dampak Finansial Klien (ISO 22317 Matrix):
                        </label>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Nilai nominal, target RTO, RPO, dan MTPD dapat disesuaikan langsung (inline editing) per level dampak.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200">
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editable Values</span>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
                            <tr>
                              <th className="p-3 w-40">Tingkat Dampak</th>
                              <th className="p-3 min-w-[190px]">Rentang Nominal Kerugian</th>
                              <th className="p-3 w-32">Target RTO</th>
                              <th className="p-3 w-32">Target RPO</th>
                              <th className="p-3 w-32">Batas MTPD</th>
                              <th className="p-3 min-w-[200px]">Keterangan Konsekuensi Operasional</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {lossThresholds.map((tier) => (
                              <tr key={tier.tier} className="hover:bg-slate-50/80 transition-colors">
                                <td className="p-3 align-top">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                        tier.tier === 5
                                          ? 'bg-rose-500 ring-2 ring-rose-200'
                                          : tier.tier === 4
                                          ? 'bg-orange-500 ring-2 ring-orange-200'
                                          : tier.tier === 3
                                          ? 'bg-amber-500 ring-2 ring-amber-200'
                                          : tier.tier === 2
                                          ? 'bg-blue-500 ring-2 ring-blue-200'
                                          : 'bg-emerald-500 ring-2 ring-emerald-200'
                                      }`}
                                    />
                                    <div>
                                      <div className="font-bold text-slate-900 leading-tight">
                                        Level {tier.tier}
                                      </div>
                                      <div className="text-[10px] text-slate-500 font-normal">
                                        {tier.severity}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-1.5">
                                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                      {tier.criticalityTier.split('—')[0].trim()}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-3 align-top">
                                  <input
                                    type="text"
                                    value={tier.amount}
                                    onChange={(e) => updateThresholdField(tier.tier, 'amount', e.target.value)}
                                    className="w-full text-xs font-semibold text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-slate-50/50 hover:bg-white transition-colors"
                                  />
                                </td>
                                <td className="p-3 align-top">
                                  <input
                                    type="text"
                                    value={tier.rto}
                                    onChange={(e) => updateThresholdField(tier.tier, 'rto', e.target.value)}
                                    className="w-full text-xs font-mono font-bold text-cyan-800 px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-slate-50/50 hover:bg-white transition-colors"
                                  />
                                </td>
                                <td className="p-3 align-top">
                                  <input
                                    type="text"
                                    value={tier.rpo}
                                    onChange={(e) => updateThresholdField(tier.tier, 'rpo', e.target.value)}
                                    className="w-full text-xs font-mono font-bold text-indigo-800 px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-slate-50/50 hover:bg-white transition-colors"
                                  />
                                </td>
                                <td className="p-3 align-top">
                                  <input
                                    type="text"
                                    value={tier.mtpd}
                                    onChange={(e) => updateThresholdField(tier.tier, 'mtpd', e.target.value)}
                                    className="w-full text-xs font-mono font-bold text-rose-800 px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-slate-50/50 hover:bg-white transition-colors"
                                  />
                                </td>
                                <td className="p-3 align-top text-[11px] text-slate-600 leading-relaxed">
                                  {tier.desc}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Section B: Qualitative Non-Financial Criteria (ISO 22317 Clause 7.2) */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <label className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                            B. Definisi Dampak Kualitatif Non-Finansial (ISO 22317):
                          </label>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            Clause 7.2
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Pedoman skala penilaian kualitatif untuk unit kerja saat mengisi kuesioner BIA.
                        </p>
                      </div>

                      {/* Tab Navigation */}
                      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                        {[
                          { id: 'regulatory', label: 'Regulasi (OJK/BI)' },
                          { id: 'reputation', label: 'Reputasi' },
                          { id: 'operational', label: 'Operasional' },
                          { id: 'legal', label: 'Hukum & Litigasi' },
                        ].map((tab) => (
                          <button
                            type="button"
                            key={tab.id}
                            onClick={() => setQualitativeTab(tab.id as any)}
                            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                              qualitativeTab === tab.id
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tab Content Cards */}
                    <div className="space-y-2 pt-1">
                      {qualitativeTab === 'regulatory' && (
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                          <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80">
                            <div className="font-bold text-emerald-950 text-[11px]">Level 1 - Insignificant</div>
                            <div className="text-[10px] text-emerald-800 mt-1 leading-relaxed">
                              Tidak melanggar batas regulasi atau SLA wajib pelaporan.
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/80">
                            <div className="font-bold text-blue-950 text-[11px]">Level 2 - Minor</div>
                            <div className="text-[10px] text-blue-800 mt-1 leading-relaxed">
                              Teguran lisan atau klarifikasi informal dari pengawas OJK/BI.
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80">
                            <div className="font-bold text-amber-950 text-[11px]">Level 3 - Moderate</div>
                            <div className="text-[10px] text-amber-800 mt-1 leading-relaxed">
                              Surat teguran resmi tertulis atau audit finding mandatory remediate.
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200/80">
                            <div className="font-bold text-orange-950 text-[11px]">Level 4 - Major</div>
                            <div className="text-[10px] text-orange-800 mt-1 leading-relaxed">
                              Sanksi administratif finansial (denda) atau pembekuan layanan sementara.
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/80">
                            <div className="font-bold text-rose-950 text-[11px]">Level 5 - Catastrophic</div>
                            <div className="text-[10px] text-rose-800 mt-1 leading-relaxed">
                              Pencabutan izin operasional produk / penurunan tingkat kesehatan bank.
                            </div>
                          </div>
                        </div>
                      )}

                      {qualitativeTab === 'reputation' && (
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                          <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80">
                            <div className="font-bold text-emerald-950 text-[11px]">Level 1 - Insignificant</div>
                            <div className="text-[10px] text-emerald-800 mt-1 leading-relaxed">
                              Keluhan individu terselesaikan di unit call center Tier-1.
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/80">
                            <div className="font-bold text-blue-950 text-[11px]">Level 2 - Minor</div>
                            <div className="text-[10px] text-blue-800 mt-1 leading-relaxed">
                              Keluhan terbatas pada segmen nasabah tertentu tanpa liputan publik.
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80">
                            <div className="font-bold text-amber-950 text-[11px]">Level 3 - Moderate</div>
                            <div className="text-[10px] text-amber-800 mt-1 leading-relaxed">
                              Pemberitaan media lokal atau viral skala terbatas di media sosial.
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200/80">
                            <div className="font-bold text-orange-950 text-[11px]">Level 4 - Major</div>
                            <div className="text-[10px] text-orange-800 mt-1 leading-relaxed">
                              Trending topic nasional & liputan media massa nasional terkemuka.
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/80">
                            <div className="font-bold text-rose-950 text-[11px]">Level 5 - Catastrophic</div>
                            <div className="text-[10px] text-rose-800 mt-1 leading-relaxed">
                              Krisis kepercayaan nasabah sistemik, penarikan dana massal (rush).
                            </div>
                          </div>
                        </div>
                      )}

                      {qualitativeTab === 'operational' && (
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                          <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80">
                            <div className="font-bold text-emerald-950 text-[11px]">Level 1 - Insignificant</div>
                            <div className="text-[10px] text-emerald-800 mt-1 leading-relaxed">
                              Gangguan layanan internal yang teratasi dalam durasi standar SLA.
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/80">
                            <div className="font-bold text-blue-950 text-[11px]">Level 2 - Minor</div>
                            <div className="text-[10px] text-blue-800 mt-1 leading-relaxed">
                              Penundaan batch job pemrosesan harian &lt; 2 jam tanpa dampak nasabah.
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80">
                            <div className="font-bold text-amber-950 text-[11px]">Level 3 - Moderate</div>
                            <div className="text-[10px] text-amber-800 mt-1 leading-relaxed">
                              Akumulasi backlog transaksi antar-cabang, lembur staf operasional.
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200/80">
                            <div className="font-bold text-orange-950 text-[11px]">Level 4 - Major</div>
                            <div className="text-[10px] text-orange-800 mt-1 leading-relaxed">
                              Kelumpuhan channel transaksi utama (Mobile Banking / EDC) &gt; 4 jam.
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/80">
                            <div className="font-bold text-rose-950 text-[11px]">Level 5 - Catastrophic</div>
                            <div className="text-[10px] text-rose-800 mt-1 leading-relaxed">
                              Kegagalan total core banking & settlement sistem kliring nasional.
                            </div>
                          </div>
                        </div>
                      )}

                      {qualitativeTab === 'legal' && (
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                          <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80">
                            <div className="font-bold text-emerald-950 text-[11px]">Level 1 - Insignificant</div>
                            <div className="text-[10px] text-emerald-800 mt-1 leading-relaxed">
                              Tidak ada klausul wanprestasi atau sengketa hukum pihak ketiga.
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/80">
                            <div className="font-bold text-blue-950 text-[11px]">Level 2 - Minor</div>
                            <div className="text-[10px] text-blue-800 mt-1 leading-relaxed">
                              Klaim penalti kompensasi kontraktual minor dari vendor mitra.
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80">
                            <div className="font-bold text-amber-950 text-[11px]">Level 3 - Moderate</div>
                            <div className="text-[10px] text-amber-800 mt-1 leading-relaxed">
                              Somasi formal pihak ketiga atau potensi sengketa kontrak bisnis.
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200/80">
                            <div className="font-bold text-orange-950 text-[11px]">Level 4 - Major</div>
                            <div className="text-[10px] text-orange-800 mt-1 leading-relaxed">
                              Gugatan hukum perdata di pengadilan negeri atau arbitrase BANI.
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/80">
                            <div className="font-bold text-rose-950 text-[11px]">Level 5 - Catastrophic</div>
                            <div className="text-[10px] text-rose-800 mt-1 leading-relaxed">
                              Tuntutan hukum pidana korporasi atau gugatan class action massal.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section C: Process Criticality Tiering Guidelines */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-cyan-700" />
                      <label className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        C. Matriks Tingkat Kekritisan Proses (Process Criticality Tiers P1–P4):
                      </label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-900 text-xs">Tier 1: Mission Critical</span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-200 text-rose-800">
                            P1
                          </span>
                        </div>
                        <div className="space-y-1 text-[11px] text-rose-950">
                          <div><strong>Target RTO:</strong> ≤ 2 Jam</div>
                          <div><strong>Target RPO:</strong> 0 – 15 Menit</div>
                          <div><strong>MTPD:</strong> ≤ 4 Jam</div>
                          <div className="text-[10px] text-rose-700 pt-1 border-t border-rose-200/60">
                            Wajib DRC Active-Active / Automated Failover.
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border border-orange-200 bg-orange-50/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-orange-900 text-xs">Tier 2: Business Critical</span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange-200 text-orange-800">
                            P2
                          </span>
                        </div>
                        <div className="space-y-1 text-[11px] text-orange-950">
                          <div><strong>Target RTO:</strong> 2 – 4 Jam</div>
                          <div><strong>Target RPO:</strong> ≤ 1 Jam</div>
                          <div><strong>MTPD:</strong> ≤ 12 Jam</div>
                          <div className="text-[10px] text-orange-700 pt-1 border-t border-orange-200/60">
                            Wajib Warm Standby DRC & SOP Failover terdokumentasi.
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900 text-xs">Tier 3: Essential / Urgent</span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-800">
                            P3
                          </span>
                        </div>
                        <div className="space-y-1 text-[11px] text-amber-950">
                          <div><strong>Target RTO:</strong> 4 – 24 Jam</div>
                          <div><strong>Target RPO:</strong> ≤ 4 Jam</div>
                          <div><strong>MTPD:</strong> ≤ 48 Jam</div>
                          <div className="text-[10px] text-amber-700 pt-1 border-t border-amber-200/60">
                            Pemulihan harian via backup terjadwal & Cold Standby.
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900 text-xs">Tier 4: Non-Critical / Routine</span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800">
                            P4
                          </span>
                        </div>
                        <div className="space-y-1 text-[11px] text-emerald-950">
                          <div><strong>Target RTO:</strong> &gt; 24 Jam (&gt; 1 Hari)</div>
                          <div><strong>Target RPO:</strong> ≤ 24 Jam</div>
                          <div><strong>MTPD:</strong> &gt; 7 Hari</div>
                          <div className="text-[10px] text-emerald-700 pt-1 border-t border-emerald-200/60">
                            Bisa ditunda hingga aktivitas utama normal kembali.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section D: Standard Timeframe Horizons (Fixed Layout & Non-Clipping) */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-slate-800 text-xs uppercase tracking-wide">
                        D. Standard Timeframe Horizons (ISO 22317 Bucket Evaluasi BIA):
                      </label>
                      <span className="text-[11px] text-slate-500 font-medium">8 Horizon Evaluasi Standar</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { time: '< 1 Jam', label: 'Real-time Transaction', tag: 'Ultra-Fast' },
                        { time: '1–2 Jam', label: 'Immediate Escalation', tag: 'Critical' },
                        { time: '2–4 Jam', label: 'Intra-Day Core SLA', tag: 'High' },
                        { time: '4–8 Jam', label: 'End-of-Day Window', tag: 'Moderate' },
                        { time: '8–24 Jam', label: 'Overnight Batch Cycle', tag: 'Daily' },
                        { time: '1–2 Hari', label: 'Next Business Day', tag: 'Standard' },
                        { time: '2–3 Hari', label: 'Multi-Day Recovery', tag: 'Extended' },
                        { time: '> 7 Hari', label: 'Extended Workaround', tag: 'Deferred' },
                      ].map((tf) => (
                        <div
                          key={tf.time}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/30 transition-all text-center space-y-1"
                        >
                          <div className="text-xs font-bold text-slate-900 font-mono">{tf.time}</div>
                          <div className="text-[10px] text-slate-600 font-medium truncate">{tf.label}</div>
                          <div className="inline-block text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500">
                            {tf.tag}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section E: Automated Triggers for SPOF & Materiality */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-cyan-700" />
                      <label className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        E. Trigger Ambang Batas Otomatis SPOF & Kritis (ISO 22301 & POJK 11):
                      </label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-700">
                          Trigger Volume Transaksi Harian
                        </label>
                        <input
                          type="text"
                          value={dailyTxTrigger}
                          onChange={(e) => setDailyTxTrigger(e.target.value)}
                          className="w-full text-xs font-semibold text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-slate-50"
                        />
                        <span className="text-[10px] text-slate-400">Proses melampaui ini otomatis Tier 1.</span>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-700">
                          Trigger Jumlah Pengguna Terdampak
                        </label>
                        <input
                          type="text"
                          value={userImpactTrigger}
                          onChange={(e) => setUserImpactTrigger(e.target.value)}
                          className="w-full text-xs font-semibold text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-slate-50"
                        />
                        <span className="text-[10px] text-slate-400">Dampak massal langsung eskalasi direksi.</span>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-700">
                          Batas Maksimum RPO Finansial
                        </label>
                        <input
                          type="text"
                          value={rpoFinancialSla}
                          onChange={(e) => setRpoFinancialSla(e.target.value)}
                          className="w-full text-xs font-semibold text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-slate-50"
                        />
                        <span className="text-[10px] text-slate-400">Mandat POJK 11/2022 Transaksi Dana.</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Verification Note */}
                  <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-cyan-400" />
                      <span>
                        Parameter tersimpan ke konfigurasi BIA Engine klien. Siap dialokasikan ke RACI Governance.
                      </span>
                    </div>
                    <span className="font-mono text-cyan-300 font-bold text-[11px]">
                      {lossThresholds.length} Tiers Calibrated
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 6: User Assignment */}
              {activeStep === 6 && (
                <div className="space-y-6">
                  {/* Header Banner */}
                  <div className="p-4 bg-gradient-to-r from-cyan-900/10 via-slate-900/5 to-cyan-800/10 border border-cyan-200/80 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-cyan-600 text-white shadow-sm shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">
                            Penugasan Tim Proyek & RACI Governance (ISO 22301 Clause 5.3)
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                            Clause 5.3 & POJK 11
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Tetapkan susunan tim pengarah dari pihak klien (Executive Sponsor, Crisis Commander, Audit) dan tim konsultan ahli pendamping (Project Lead, DRP Specialist, QA & Cyber Resilience), serta matrik akuntabilitas RACI.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Two Main Columns: Client Governance vs Consultant Advisory */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left: Client Governance Team */}
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Landmark className="w-4 h-4 text-cyan-700" />
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                            Pihak Klien (Client Governance & Steering Committee)
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          Internal Client
                        </span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Executive Sponsor (Direksi / Pemilik Risiko Tertinggi):
                          </label>
                          <input
                            type="text"
                            value={sponsorName ? `${sponsorName} (${sponsorTitle})` : 'Bambang Soediro (Direktur Kepatuhan & Manajemen Risiko)'}
                            readOnly
                            className="w-full text-xs font-semibold text-slate-900 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 cursor-not-allowed"
                          />
                          <span className="text-[10px] text-slate-400 mt-0.5 block">Diambil otomatis dari identitas klien di Step 1.</span>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Client BCM Coordinator / Project Owner:
                          </label>
                          <input
                            type="text"
                            value={clientPicName ? `${clientPicName} (${clientPicTitle})` : 'Rian Pratama, CRISC (VP Enterprise Risk & BCM Coordinator)'}
                            readOnly
                            className="w-full text-xs font-semibold text-slate-900 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 cursor-not-allowed"
                          />
                          <span className="text-[10px] text-slate-400 mt-0.5 block">Koordinator operasional implementasi BCM di sisi klien.</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              Crisis Management Commander:
                            </label>
                            <input
                              type="text"
                              value={clientCrisisCommander}
                              onChange={(e) => setClientCrisisCommander(e.target.value)}
                              className="w-full text-xs font-medium text-slate-800 px-2.5 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              Head of Internal Audit (Oversight):
                            </label>
                            <input
                              type="text"
                              value={clientAuditLead}
                              onChange={(e) => setClientAuditLead(e.target.value)}
                              className="w-full text-xs font-medium text-slate-800 px-2.5 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              VP IT Infrastructure & DC/DRC:
                            </label>
                            <input
                              type="text"
                              value={clientItOpsPic}
                              onChange={(e) => setClientItOpsPic(e.target.value)}
                              className="w-full text-xs font-medium text-slate-800 px-2.5 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              Human Capital & People Safety PIC:
                            </label>
                            <input
                              type="text"
                              value={clientHrPic}
                              onChange={(e) => setClientHrPic(e.target.value)}
                              className="w-full text-xs font-medium text-slate-800 px-2.5 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Consultant Advisory Team */}
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-cyan-700" />
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                            Tim Konsultan Pendamping (BCM Advisory Team)
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                          External Experts
                        </span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Consulting Project Manager / BCM Lead:
                          </label>
                          <input
                            type="text"
                            value={pm}
                            onChange={(e) => setPm(e.target.value)}
                            className="w-full text-xs font-semibold text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-white"
                          />
                          <span className="text-[10px] text-slate-400 mt-0.5 block">Penanggung jawab metodologi ISO 22301, delivery, dan BIA quality.</span>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            IT DRP & Resilience Specialist:
                          </label>
                          <input
                            type="text"
                            value={consultantDrLead}
                            onChange={(e) => setConsultantDrLead(e.target.value)}
                            className="w-full text-xs font-semibold text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-white"
                          />
                          <span className="text-[10px] text-slate-400 mt-0.5 block">Spesialis arsitektur pemulihan DRC, RTO/RPO teknis, dan failover drill.</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              QA & Compliance Lead (CISA):
                            </label>
                            <input
                              type="text"
                              value={consultantQa}
                              onChange={(e) => setConsultantQa(e.target.value)}
                              className="w-full text-xs font-medium text-slate-800 px-2.5 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              Cyber Resilience Specialist:
                            </label>
                            <input
                              type="text"
                              value={consultantSecSpecialist}
                              onChange={(e) => setConsultantSecSpecialist(e.target.value)}
                              className="w-full text-xs font-medium text-slate-800 px-2.5 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            BCM Business Analyst (Data & Workshop Facilitator):
                          </label>
                          <input
                            type="text"
                            value={consultantJuniorAnalyst}
                            onChange={(e) => setConsultantJuniorAnalyst(e.target.value)}
                            className="w-full text-xs font-medium text-slate-800 px-3 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-white"
                          />
                          <span className="text-[10px] text-slate-400 mt-0.5 block">Fasilitator kuesioner unit kerja, data cleansing, dan dokumentasi rapat.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RACI Matrix Section (ISO 22301 Clause 5.3) */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <label className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                            Matriks Tanggung Jawab RACI Proyek (ISO 22301 Clause 5.3):
                          </label>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                            Governance Matrix
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          R = Responsible (Pelaksana), A = Accountable (Pengambil Keputusan/Penyetuju), C = Consulted (Narasumber), I = Informed (Diberitahu).
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-bold">
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">A : Accountable</span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">R : Responsible</span>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">C : Consulted</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">I : Informed</span>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
                            <tr>
                              <th className="p-3 min-w-[280px]">Tahapan & Aktivitas BCM</th>
                              <th className="p-3 text-center w-28">Executive Sponsor</th>
                              <th className="p-3 text-center w-28">Client Coordinator</th>
                              <th className="p-3 text-center w-28">Consultant Lead</th>
                              <th className="p-3 text-center w-28">IT DRP Lead</th>
                              <th className="p-3 text-center w-28">Unit Heads</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {raciMatrix.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                <td className="p-3 text-slate-800 font-semibold">{row.activity}</td>
                                {(['sponsor', 'coordinator', 'pmLead', 'drpLead', 'unitHead'] as const).map((role) => {
                                  const val = row[role];
                                  return (
                                    <td key={role} className="p-2.5 text-center">
                                      <select
                                        value={val}
                                        onChange={(e) => updateRaciRole(idx, role, e.target.value)}
                                        className={`text-xs font-bold font-mono px-2 py-1 rounded-lg border focus:ring-1 focus:ring-cyan-500 cursor-pointer ${
                                          val === 'A'
                                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                                            : val === 'R'
                                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                                            : val === 'C'
                                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                                            : 'bg-slate-50 text-slate-600 border-slate-300'
                                        }`}
                                      >
                                        <option value="R">R</option>
                                        <option value="A">A</option>
                                        <option value="C">C</option>
                                        <option value="I">I</option>
                                      </select>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Governance Controls & Automated Invites */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-cyan-700" />
                      <label className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                        Pengaturan Akses Portal & Notifikasi Kolaborasi:
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                        <input
                          type="checkbox"
                          checked={sendWelcomeInvite}
                          onChange={(e) => setSendWelcomeInvite(e.target.checked)}
                          className="mt-0.5 w-4 h-4 accent-[#00A9CE] rounded"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block">Kirim Email Undangan Otomatis</span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Kirim kredensial onboarding & panduan BIA ke seluruh tim saat proyek diluncurkan.
                          </span>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                        <input
                          type="checkbox"
                          checked={requireMfaGovernance}
                          onChange={(e) => setRequireMfaGovernance(e.target.checked)}
                          className="mt-0.5 w-4 h-4 accent-[#00A9CE] rounded"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block">Wajibkan MFA / SSO Perbankan</span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Proteksi akses data sensitif BIA & DRP dengan autentikasi dua faktor SOC2.
                          </span>
                        </div>
                      </label>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="font-bold text-slate-800 block">Interval Reminder Kuesioner BIA</span>
                        <select
                          value={autoReminderDays}
                          onChange={(e) => setAutoReminderDays(e.target.value)}
                          className="w-full text-xs font-semibold text-slate-800 px-2 py-1.5 rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="1">Setiap 1 Hari Sekali</option>
                          <option value="3">Setiap 3 Hari Sekali (Rekomendasi)</option>
                          <option value="7">Setiap 7 Hari Sekali</option>
                        </select>
                        <span className="text-[10px] text-slate-400 block">Pemberitahuan otomatis ke Process Owner yang belum submit.</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Confirmation Bar */}
                  <div className="p-3.5 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        Struktur penugasan tim klien dan konsultan telah siap. Matriks RACI telah diselaraskan dengan ISO 22301 Clause 5.3.
                      </span>
                    </div>
                    <span className="font-mono text-cyan-300 font-bold text-[11px] shrink-0">
                      RACI 7 Clauses Aligned
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 7: Launch */}
              {activeStep === 7 && (
                <div className="space-y-6 py-2">
                  {/* Executive Launch Banner */}
                  <div className="text-center space-y-2 bg-gradient-to-b from-cyan-50/60 to-white p-6 rounded-2xl border border-cyan-200/80 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-cyan-100 animate-pulse">
                      <Rocket className="w-8 h-8" />
                    </div>
                    <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">
                      Konfigurasi Proyek Siap Diluncurkan (Project Launch Readiness)
                    </h3>
                    <p className="text-slate-600 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
                      Seluruh parameter identitas klien, kedalaman hierarki unit kerja, ruang lingkup fasilitas kritis, metodologi penilaian BIA (ISO 22301 & 22317), skala materialitas dampak, serta struktur tim pengarah RACI telah divalidasi.
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 6 Tahapan Sebelumnya Tervalidasi 100%
                      </span>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                        Kode Proyek: {projectCode}
                      </span>
                    </div>
                  </div>

                  {/* Comprehensive 6-Pillar Summary Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                    {/* Pillar 1: Client Profile */}
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2 hover:border-cyan-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-cyan-700" />
                          1. Identitas Klien
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {clientCode}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm truncate">{clientName}</div>
                      <div className="text-slate-600 text-[11px] space-y-0.5">
                        <div>Sektor: <strong>{industry}</strong></div>
                        <div>Executive Sponsor: <strong>{sponsorName || 'Bambang Soediro'}</strong></div>
                      </div>
                    </div>

                    {/* Pillar 2: Hierarchy Scope */}
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2 hover:border-cyan-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <FolderTree className="w-3.5 h-3.5 text-cyan-700" />
                          2. Struktur Organisasi
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                          {hierarchyDepth} Tingkat
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm">
                        {units.length} Unit Kerja Terdaftar
                      </div>
                      <div className="text-slate-600 text-[11px] space-y-0.5">
                        <div>Model Hierarki: <strong>{hierarchyPreset.toUpperCase()}</strong></div>
                        <div className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> 100% PIC & Unit Head Tervalidasi
                        </div>
                      </div>
                    </div>

                    {/* Pillar 3: Facility Scope */}
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2 hover:border-cyan-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-cyan-700" />
                          3. Ruang Lingkup Fasilitas
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                          {facilities.filter((f) => f.inScope).length} In-Scope
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm">
                        {facilities.filter((f) => f.inScope).length} Fasilitas & Data Center
                      </div>
                      <div className="text-slate-600 text-[11px] space-y-0.5">
                        <div className="truncate">
                          Fasilitas: <strong>{facilities.filter((f) => f.inScope).slice(0, 2).map((f) => f.name).join(', ')}...</strong>
                        </div>
                        <div>Regulator Wajib: <strong>{regulators.join(', ')}</strong></div>
                      </div>
                    </div>

                    {/* Pillar 4: Methodology & Standards */}
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2 hover:border-cyan-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-700" />
                          4. Metodologi Standar
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-800">
                          {assessmentApproach === 'dual_track' ? 'Dual-Track' : 'Quantitative'}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm truncate" title={framework}>
                        {framework.split('&')[0]}
                      </div>
                      <div className="text-slate-600 text-[11px] space-y-0.5">
                        <div>Dimensi Dampak: <strong>{dimensionsConfig.filter((d) => d.enabled).length} Dimensi ({totalWeight}% Bobot)</strong></div>
                        <div>MBCO Target: <strong>{mbcoTarget.split('(')[0].trim()}</strong></div>
                      </div>
                    </div>

                    {/* Pillar 5: Parameters & Thresholds */}
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2 hover:border-cyan-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-cyan-700" />
                          5. Parameter & Materialitas
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800">
                          5 Tiers
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm">
                        Ambang Batas Tier 1 – Tier 5
                      </div>
                      <div className="text-slate-600 text-[11px] space-y-0.5">
                        <div>Max Catastrophic: <strong>{lossThresholds.find((t) => t.tier === 5)?.amount}</strong></div>
                        <div>SPOF Trigger: <strong>{dailyTxTrigger}</strong></div>
                      </div>
                    </div>

                    {/* Pillar 6: User Assignment & RACI */}
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2 hover:border-cyan-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-cyan-700" />
                          6. Tim & RACI Governance
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-50 text-cyan-800">
                          Clause 5.3
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm truncate">
                        Lead: {pm.split('(')[0].trim()}
                      </div>
                      <div className="text-slate-600 text-[11px] space-y-0.5">
                        <div className="truncate">DRP Lead: <strong>{consultantDrLead.split('(')[0].trim()}</strong></div>
                        <div>Matriks RACI: <strong>7 Klausul ISO 22301 Terpetakan</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Section B: Kickoff Schedule & Target Milestones */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3.5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-700" />
                      <label className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                        Jadwal Kick-Off & Target Milestone Proyek:
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1.5">
                        <label className="block font-semibold text-slate-700">Tanggal Kick-off Workshop</label>
                        <input
                          type="date"
                          value={kickoffDate}
                          onChange={(e) => setKickoffDate(e.target.value)}
                          className="w-full text-xs font-semibold text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-slate-50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block font-semibold text-slate-700">Lokasi / Media Kick-Off</label>
                        <input
                          type="text"
                          value={kickoffVenue}
                          onChange={(e) => setKickoffVenue(e.target.value)}
                          className="w-full text-xs font-semibold text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-slate-50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block font-semibold text-slate-700">Target Penyelesaian BIA Survey</label>
                        <input
                          type="date"
                          value={targetBiaCompletion}
                          onChange={(e) => setTargetBiaCompletion(e.target.value)}
                          className="w-full text-xs font-semibold text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section C: Pre-Launch Readiness Checklist */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-cyan-700" />
                        <label className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                          Checklist Kesiapan Peluncuran (Pre-Launch Sign-off):
                        </label>
                      </div>
                      <span className="text-[11px] text-slate-500">Centang seluruh syarat untuk konfirmasi</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <label
                        onClick={() => toggleReadinessCheck('charterSigned')}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          readinessChecks.charterSigned
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={readinessChecks.charterSigned}
                          onChange={() => {}}
                          className="mt-0.5 w-4 h-4 accent-emerald-600 rounded"
                        />
                        <div>
                          <div className="font-bold">Project Charter & NDA Ditandatangani</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">Surat penugasan konsultan dan perjanjian kerahasiaan data perbankan telah lengkap.</div>
                        </div>
                      </label>

                      <label
                        onClick={() => toggleReadinessCheck('dataAccessGranted')}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          readinessChecks.dataAccessGranted
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={readinessChecks.dataAccessGranted}
                          onChange={() => {}}
                          className="mt-0.5 w-4 h-4 accent-emerald-600 rounded"
                        />
                        <div>
                          <div className="font-bold">Akses Portal & Data DRL Diberikan</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">Akun tim konsultan pendamping dan PIC internal telah diverifikasi.</div>
                        </div>
                      </label>

                      <label
                        onClick={() => toggleReadinessCheck('steeringScheduled')}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          readinessChecks.steeringScheduled
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={readinessChecks.steeringScheduled}
                          onChange={() => {}}
                          className="mt-0.5 w-4 h-4 accent-emerald-600 rounded"
                        />
                        <div>
                          <div className="font-bold">Rapat Perdana Steering Committee Terjadwal</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">Undangan rapat koordinasi pembuka telah dikirim ke Executive Sponsor.</div>
                        </div>
                      </label>

                      <label
                        onClick={() => toggleReadinessCheck('biaSurveyReady')}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          readinessChecks.biaSurveyReady
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={readinessChecks.biaSurveyReady}
                          onChange={() => {}}
                          className="mt-0.5 w-4 h-4 accent-emerald-600 rounded"
                        />
                        <div>
                          <div className="font-bold">Instrumen Kuesioner BIA Siap Diedarkan</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">Template BIA ISO 22317 dan kriteria skala dampak siap disebar ke unit kerja.</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Notification Checkbox */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={broadcastNotification}
                        onChange={(e) => setBroadcastNotification(e.target.checked)}
                        className="w-4 h-4 accent-[#00A9CE] rounded"
                      />
                      <span className="font-semibold text-slate-800">
                        Kirim notifikasi peluncuran proyek dan kalender kick-off ke seluruh stakeholder ({units.length} Unit Kerja & Tim Konsultan)
                      </span>
                    </label>
                    <span className="text-[11px] font-mono text-cyan-800 font-bold hidden sm:inline-block">
                      Automated Dispatch
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Wizard Footer Navigation */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                disabled={activeStep === 1}
                onClick={() => setActiveStep(activeStep - 1)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                  activeStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <button
                onClick={handleNext}
                className="px-5 py-2 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
              >
                <span>{activeStep === 7 ? 'Launch Project Sekarang' : 'Lanjutkan'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
