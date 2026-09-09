'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import {
  Network,
  ShieldAlert,
  Server,
  Building,
  Users,
  Radio,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Database
} from 'lucide-react';

interface DependencyItem {
  id: string;
  processCode: string;
  processName: string;
  type: 'Application' | 'Vendor' | 'Infrastructure' | 'People' | 'Facility' | 'Database';
  targetName: string;
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  requiredRto: string;
  hasAlternative: boolean;
  isSpof: boolean;
  notes: string;
  mitigationPlan?: string;
  spofReason?: string;
}

export default function DependenciesPage() {
  const { processes } = useBcm();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSpofOnly, setShowSpofOnly] = useState(false);

  const dependencies: DependencyItem[] = [
    {
      id: 'dep-1',
      processCode: 'PROC-001',
      processName: 'Pemrosesan Transaksi Settlement RTGS & BI-FAST',
      type: 'Application',
      targetName: 'Core Banking System (Silverlake Axis v8.4)',
      criticality: 'Critical',
      requiredRto: '2 Jam (Hours)',
      hasAlternative: false,
      isSpof: true,
      notes: 'Jika Core Banking padam, seluruh transaksi setelmen dana, kliring BI, dan transfer batch antarbank terhenti total.',
      spofReason: 'Single instance host tanpa failover otomatis aktif-aktif ke DRC.',
      mitigationPlan: 'Implementasi Active-Active DB Replication & DRC automated orchestration.',
    },
    {
      id: 'dep-2',
      processCode: 'PROC-001',
      processName: 'Pemrosesan Transaksi Settlement RTGS & BI-FAST',
      type: 'Application',
      targetName: 'BI-FAST Settlement Gateway & Switch',
      criticality: 'Critical',
      requiredRto: '1 Jam (Hour)',
      hasAlternative: false,
      isSpof: true,
      notes: 'Koneksi API Switch langsung ke Bank Indonesia. Kegagalan gateway menyebabkan penalti kepatuhan OJK/BI.',
      spofReason: 'Hanya 1 pasang load balancer terkonfigurasi pada node primer.',
      mitigationPlan: 'Penyediaan redundant API connector multi-routing via DRC.',
    },
    {
      id: 'dep-3',
      processCode: 'PROC-001',
      processName: 'Pemrosesan Transaksi Settlement RTGS & BI-FAST',
      type: 'Vendor',
      targetName: 'Silverlake Axis Ltd (L3 Support 24/7)',
      criticality: 'High',
      requiredRto: '2 Jam (Hours)',
      hasAlternative: false,
      isSpof: true,
      notes: 'Sole vendor platform proprietary tanpa alternatif penyedia ketiga dan tim internal bank belum memiliki full source code.',
      spofReason: 'Ketergantungan eksklusif pada eskalasi tim teknis luar negeri.',
      mitigationPlan: 'Perjanjian escrow source code dan pelatihan transfer knowledge tier-2 internal.',
    },
    {
      id: 'dep-4',
      processCode: 'PROC-001',
      processName: 'Pemrosesan Transaksi Settlement RTGS & BI-FAST',
      type: 'People',
      targetName: 'Authorizer Settlement (Min. 2 Personel Berbeda)',
      criticality: 'High',
      requiredRto: '1 Jam (Hour)',
      hasAlternative: true,
      isSpof: false,
      notes: 'Tersedia 6 staf berwenang dengan token fisik dan otentikasi biometrik cadangan terdaftar di lokasi DRC.',
      mitigationPlan: 'Prosedur rotasi delegasi wewenang (Power of Attorney) berjalan baik.',
    },
    {
      id: 'dep-5',
      processCode: 'PROC-002',
      processName: 'Operasional Switch Transaksi ATM & Kartu',
      type: 'Infrastructure',
      targetName: 'Dedicated Fiber Optic Astinet HO - DC Serpong - DRC',
      criticality: 'High',
      requiredRto: '1 Jam (Hour)',
      hasAlternative: true,
      isSpof: false,
      notes: 'Memiliki jalur redundansi sekunder otomatis (dual homing) via operator Indosat Ooredoo & Telkomsel link backup.',
      mitigationPlan: 'BGP automatic routing switchover teruji berkala setiap semester.',
    },
    {
      id: 'dep-6',
      processCode: 'PROC-003',
      processName: 'Layanan Pengajuan & Pencairan Kredit Online',
      type: 'Facility',
      targetName: 'Primary Data Center (Tier IV Serpong BSD)',
      criticality: 'Critical',
      requiredRto: '4 Jam (Hours)',
      hasAlternative: true,
      isSpof: false,
      notes: 'Fasilitas DC dilengkapi UPS 2N+1, dual generator diesel 72 jam, dan DRC mirror di Surabaya Rungkut.',
      mitigationPlan: 'DR drill tahunan terverifikasi dengan RTO realisasi 2.8 jam.',
    },
    {
      id: 'dep-7',
      processCode: 'PROC-003',
      processName: 'Layanan Pengajuan & Pencairan Kredit Online',
      type: 'Database',
      targetName: 'Oracle Exadata Database Cluster (Cust & Loan Core)',
      criticality: 'Critical',
      requiredRto: '1 Jam (Hour)',
      hasAlternative: true,
      isSpof: false,
      notes: 'Oracle Data Guard standby database tersinkronisasi realtime (zero data loss mode RPO < 15 menit).',
      mitigationPlan: 'Fast-Start Failover (FSFO) aktif dengan recovery watcher otomatis.',
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Application':
        return <Server className="w-4 h-4 text-blue-500" />;
      case 'Vendor':
        return <Building2 className="w-4 h-4 text-purple-500" />;
      case 'Infrastructure':
        return <Radio className="w-4 h-4 text-emerald-500" />;
      case 'People':
        return <Users className="w-4 h-4 text-amber-500" />;
      case 'Facility':
        return <Building className="w-4 h-4 text-cyan-500" />;
      case 'Database':
        return <Database className="w-4 h-4 text-indigo-500" />;
      default:
        return <Network className="w-4 h-4 text-slate-500" />;
    }
  };

  const filtered = dependencies.filter((d) => {
    const matchesType = filterType === 'ALL' || d.type === filterType;
    const matchesSpof = !showSpofOnly || d.isSpof;
    const matchesSearch =
      d.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.processCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.processName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSpof && matchesSearch;
  });

  const totalDeps = dependencies.length;
  const totalSpof = dependencies.filter((d) => d.isSpof).length;
  const totalRedundant = dependencies.filter((d) => !d.isSpof).length;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-xs uppercase tracking-wider font-extrabold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-md">
              Modul 9 — Interdependency Architecture
            </span>
            <span className="bg-rose-50 text-rose-800 text-xs font-black px-2.5 py-1 rounded-md border border-rose-200 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              SPOF Advisory Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Analisis Ketergantungan Proses & Radar Titik Rawan Tunggal (SPOF)
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1 leading-relaxed max-w-4xl">
            Pemetaan ketergantungan menyeluruh proses bisnis kritis terhadap Aplikasi, Vendor Pihak Ketiga,
            Infrastruktur Jaringan, Database, Fasilitas Kerja, dan Personel Kunci.
          </p>
        </div>
      </div>

      {/* SPOF Advisory Banner & KPI Stats */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-950 via-[#0B1F3A] to-slate-900 text-white border border-red-800/60 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4 max-w-3xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/30 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/50 shadow-inner">
            <ShieldAlert className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-wider text-rose-300">
                Algorithmic Risk Advisory
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-900/80 text-rose-200 border border-rose-700">
                Prioritas Tinggi
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {totalSpof} Titik Rawan Tunggal (Single Point of Failure) Terdeteksi
            </h3>
            <p className="text-sm sm:text-base text-slate-200 mt-1.5 leading-relaxed font-normal">
              Proses misi kritis perbankan (<strong className="text-rose-300">Tier 1 — RTGS & BI-FAST</strong>)
              memiliki ketergantungan tunggal pada Core Banking & koneksi switch vendor proprietary tanpa failover otomatis aktif.
            </p>
          </div>
        </div>

        {/* Quick KPI Counters */}
        <div className="grid grid-cols-3 gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-700/80 lg:pl-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-white">{totalDeps}</div>
            <div className="text-xs font-bold text-slate-300 mt-0.5">Total Terpetakan</div>
          </div>
          <div className="bg-rose-950/60 rounded-xl p-3 text-center border border-rose-600/40">
            <div className="text-2xl sm:text-3xl font-black text-rose-400">{totalSpof}</div>
            <div className="text-xs font-bold text-rose-200 mt-0.5">SPOF Kritis</div>
          </div>
          <div className="bg-emerald-950/60 rounded-xl p-3 text-center border border-emerald-600/40">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">{totalRedundant}</div>
            <div className="text-xs font-bold text-emerald-200 mt-0.5">Redundan Aman</div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama komponen, kode proses, atau tipe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#00A9CE] focus:bg-white transition-colors"
            />
          </div>

          {/* SPOF Toggle Filter */}
          <button
            onClick={() => setShowSpofOnly(!showSpofOnly)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
              showSpofOnly
                ? 'bg-rose-600 text-white border-rose-700 shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <AlertTriangle className={`w-4 h-4 ${showSpofOnly ? 'text-white' : 'text-rose-600'}`} />
            <span>Hanya Tampilkan SPOF ({totalSpof})</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Kategori:
          </span>
          {[
            { id: 'ALL', label: 'Semua Tipe Dependency' },
            { id: 'Application', label: 'Application' },
            { id: 'Database', label: 'Database' },
            { id: 'Vendor', label: 'Vendor Pihak Ketiga' },
            { id: 'Infrastructure', label: 'Infrastruktur Jaringan' },
            { id: 'People', label: 'Personel Kunci' },
            { id: 'Facility', label: 'Fasilitas & DC' },
          ].map((t) => {
            const active = filterType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setFilterType(t.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#0B1F3A] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.id !== 'ALL' && getTypeIcon(t.id)}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dependency Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((dep) => (
          <div
            key={dep.id}
            className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${
              dep.isSpof
                ? 'border-rose-300 bg-gradient-to-b from-rose-50/20 to-white ring-1 ring-rose-200'
                : 'border-slate-200 hover:border-cyan-300'
            }`}
          >
            <div>
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs sm:text-sm font-black text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-lg">
                    {dep.processCode}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 truncate max-w-[200px] sm:max-w-[260px]">
                    {dep.processName}
                  </span>
                </div>

                {dep.isSpof ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-300 shadow-sm shrink-0">
                    <ShieldAlert className="w-4 h-4 text-rose-600" /> SPOF DETECTED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300 shadow-sm shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Redundant / Alternatif Ada
                  </span>
                )}
              </div>

              {/* Component Title & Type */}
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                  {getTypeIcon(dep.type)}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {dep.targetName}
                  </h3>
                  <div className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5">
                    Tipe Ketergantungan: <span className="text-slate-800 font-semibold">{dep.type}</span>
                  </div>
                </div>
              </div>

              {/* Impact / Notes Box */}
              <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Dampak Gangguan Ketergantungan:
                </div>
                {dep.notes}
              </div>

              {/* SPOF Diagnosis / Mitigation Box */}
              {dep.isSpof && dep.spofReason && (
                <div className="mt-3 p-3 bg-rose-50/80 rounded-xl border border-rose-200 text-xs sm:text-sm text-rose-900 leading-relaxed font-medium space-y-1">
                  <div>
                    <span className="font-bold text-rose-950">Akar Masalah SPOF: </span>
                    {dep.spofReason}
                  </div>
                  {dep.mitigationPlan && (
                    <div className="text-rose-800 text-xs pt-1 border-t border-rose-200/60 font-normal">
                      <strong className="font-semibold text-rose-900">Rekomendasi BCM: </strong>
                      {dep.mitigationPlan}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Card Footer Metadata */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Required RTO:</span>
                <strong className="text-slate-900 font-bold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                  {dep.requiredRto}
                </strong>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs font-semibold">Tingkat Kritis:</span>
                <span
                  className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    dep.criticality === 'Critical'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : dep.criticality === 'High'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {dep.criticality}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Network className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Tidak ada komponen dependency yang sesuai</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau sesuaikan filter kategori dependency di atas.
          </p>
          <button
            onClick={() => {
              setFilterType('ALL');
              setShowSpofOnly(false);
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-[#0B1F3A] text-white hover:bg-[#133C67] transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}
