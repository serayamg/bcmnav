'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import {
  FileText,
  Download,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Building,
  UserCheck,
  ShieldAlert,
  Clock,
  Coins,
  ChevronDown,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';

export default function ReportsPage() {
  const { processes, currentProject } = useBcm();
  const [selectedProcessId, setSelectedProcessId] = useState(processes[0]?.id || 'proc-01');
  const [activeTab, setActiveTab] = useState<'consolidated' | 'single'>('consolidated');
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');

  const selectedProc = processes.find((p) => p.id === selectedProcessId) || processes[0];

  const filteredProcesses = processes.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.processOwnerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTier =
      tierFilter === 'ALL' ||
      (tierFilter === 'Tier 1' && p.criticalityTier?.includes('Tier 1')) ||
      (tierFilter === 'Tier 2' && p.criticalityTier?.includes('Tier 2')) ||
      (tierFilter === 'Tier 3' && p.criticalityTier?.includes('Tier 3')) ||
      (tierFilter === 'Tier 4' && p.criticalityTier?.includes('Tier 4'));
    return matchSearch && matchTier;
  });

  const handlePrint = () => {
    window.print();
  };

  const getTierBadge = (tier?: string) => {
    if (!tier) return <span className="text-slate-600 text-xs font-semibold">Tier 2 — Critical</span>;
    if (tier.includes('Tier 1')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-rose-100 text-rose-900 border border-rose-300">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
          {tier}
        </span>
      );
    }
    if (tier.includes('Tier 2')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-orange-100 text-orange-900 border border-orange-300">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
          {tier}
        </span>
      );
    }
    if (tier.includes('Tier 3')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          {tier}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
        {tier}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
              Module 11 — Reporting & Deliverables
            </span>
            <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-300">
              Audit Ready ISO 22301
            </span>
            <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
              POJK 11 Compliant
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Laporan Konsultasi & Consolidated BIA Register
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
            Ekspor deliverable resmi, matriks BIA terkonsolidasi, dan lembar profil BIA per proses bisnis untuk pelaporan regulator dan audit direksi.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => alert('File Excel Consolidated_BIA_Register.xlsx berhasil diunduh.')}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 hover:bg-slate-50 text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export Excel</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-[#0B1F3A] hover:bg-[#133C67] text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Cetak / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm max-w-lg no-print">
        <button
          type="button"
          onClick={() => setActiveTab('consolidated')}
          className={`flex-1 py-2 text-xs sm:text-sm font-extrabold rounded-xl transition-all ${
            activeTab === 'consolidated'
              ? 'bg-[#0B1F3A] text-white shadow-sm ring-2 ring-[#0B1F3A]/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Consolidated BIA Register
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('single')}
          className={`flex-1 py-2 text-xs sm:text-sm font-extrabold rounded-xl transition-all ${
            activeTab === 'single'
              ? 'bg-[#0B1F3A] text-white shadow-sm ring-2 ring-[#0B1F3A]/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Lembar Profil BIA per Proses
        </button>
      </div>

      {/* TAB 1: Consolidated BIA Register */}
      {activeTab === 'consolidated' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 no-print">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kode proses, nama aktivitas, unit kerja, atau process owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:border-[#00A9CE] focus:ring-1 focus:ring-[#00A9CE] placeholder:text-slate-400 bg-slate-50/50 hover:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mr-1 shrink-0">
                Filter Tier:
              </span>
              {['ALL', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTierFilter(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    tierFilter === t
                      ? 'bg-[#0B1F3A] text-white shadow-sm ring-2 ring-[#0B1F3A]/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            {/* Table Header Info */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Consolidated Business Impact Analysis Register
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  {currentProject.clientName} • {currentProject.code} • Master Deliverable ISO 22301
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm shrink-0">
                <Layers className="w-3.5 h-3.5 text-cyan-700" />
                <span>Menampilkan <strong>{filteredProcesses.length}</strong> dari {processes.length} Proses</span>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-800">
                <thead className="bg-[#0B1F3A] text-white font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-5 min-w-[280px]">Proses Bisnis</th>
                    <th className="py-3.5 px-4 min-w-[180px]">Unit Kerja</th>
                    <th className="py-3.5 px-4 min-w-[170px]">Process Owner</th>
                    <th className="py-3.5 px-4 min-w-[190px]">Criticality Tier</th>
                    <th className="py-3.5 px-4 text-center w-28">MTPD</th>
                    <th className="py-3.5 px-4 text-center w-28">RTO</th>
                    <th className="py-3.5 px-4 text-center w-28">RPO</th>
                    <th className="py-3.5 px-4 text-center w-24">Priority</th>
                    <th className="py-3.5 px-4 min-w-[140px]">SPOF Risk</th>
                    <th className="py-3.5 px-4 text-center min-w-[120px]">Status BIA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredProcesses.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-500 text-sm">
                        Tidak ada proses bisnis yang cocok dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredProcesses.map((proc) => (
                      <tr key={proc.id} className="hover:bg-slate-50/90 transition-colors">
                        <td className="py-3.5 px-4 sm:px-5 align-top">
                          <div className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 inline-block mb-1">
                            {proc.code}
                          </div>
                          <div className="font-extrabold text-slate-900 text-sm leading-snug">
                            {proc.name}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 align-top text-xs sm:text-sm font-semibold text-slate-700">
                          {proc.unitName}
                        </td>
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {proc.processOwnerName}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 align-top">
                          {getTierBadge(proc.criticalityTier)}
                        </td>
                        <td className="py-3.5 px-4 align-top text-center font-mono font-bold text-rose-800 text-xs sm:text-sm">
                          {proc.mtpd || '4 Hours'}
                        </td>
                        <td className="py-3.5 px-4 align-top text-center font-mono font-extrabold text-cyan-800 text-xs sm:text-sm">
                          {proc.rto || '2 Hours'}
                        </td>
                        <td className="py-3.5 px-4 align-top text-center font-mono font-bold text-indigo-800 text-xs sm:text-sm">
                          {proc.rpo || '15 Minutes'}
                        </td>
                        <td className="py-3.5 px-4 align-top text-center">
                          <span className="font-mono font-black text-xs px-2 py-1 rounded bg-slate-100 text-slate-900 border border-slate-300">
                            P1
                          </span>
                        </td>
                        <td className="py-3.5 px-4 align-top">
                          {proc.spofFlag ? (
                            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              <AlertTriangle className="w-3 h-3" />
                              SPOF Detected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Redundant
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 align-top text-center">
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            {proc.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  Seluruh estimasi MTPD, RTO, dan RPO disahkan dalam BIA Workshop sesuai ISO 22317:2021.
                </span>
              </div>
              <div className="font-mono text-slate-500">
                Laporan Terverifikasi • Standar POJK No. 11/2022
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Printable BIA Report per Process (BF. BIA REPORT PER PROCESS) */}
      {activeTab === 'single' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm no-print">
            <span className="text-sm font-bold text-slate-700">Pilih Proses Bisnis:</span>
            <select
              value={selectedProcessId}
              onChange={(e) => setSelectedProcessId(e.target.value)}
              className="p-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-[#00A9CE] focus:outline-none max-w-md"
            >
              {processes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name} ({p.unitName})
                </option>
              ))}
            </select>
          </div>

          {/* Printable Report Sheet */}
          <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-sm space-y-6 text-slate-900 print:border-none print:shadow-none print:p-0">
            {/* Report Header */}
            <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <span>Business Continuity Advisory Report</span>
                  <span>•</span>
                  <span className="text-cyan-800">ISO 22301 / ISO 22317</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
                  LEMBAR PROFIL BUSINESS IMPACT ANALYSIS (BIA)
                </h2>
                <div className="text-sm text-slate-600 mt-0.5">
                  {currentProject.clientName} • {currentProject.name}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="font-mono text-base font-black text-slate-900">{selectedProc.code}</div>
                <div className="text-xs text-slate-500 font-semibold">Status: Validated & Signed</div>
              </div>
            </div>

            {/* Section 1: Process Profile */}
            <div>
              <h3 className="font-extrabold text-xs uppercase tracking-wider bg-slate-100 px-3 py-2 rounded-lg text-slate-800 mb-3 border border-slate-200">
                1. Profil Proses Bisnis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Nama Proses Bisnis:</span>
                  <div className="font-extrabold text-slate-900 mt-0.5">{selectedProc.name}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Unit Kerja Pelaksana:</span>
                  <div className="font-extrabold text-slate-900 mt-0.5">{selectedProc.unitName}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Process Owner:</span>
                  <div className="font-extrabold text-slate-900 mt-0.5">{selectedProc.processOwnerName}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Jam Operasional & SLA:</span>
                  <div className="font-extrabold text-slate-900 mt-0.5">{selectedProc.operatingHours}</div>
                </div>
              </div>
            </div>

            {/* Section 2: Time Criticality Objectives */}
            <div>
              <h3 className="font-extrabold text-xs uppercase tracking-wider bg-slate-100 px-3 py-2 rounded-lg text-slate-800 mb-3 border border-slate-200">
                2. Parameter Target Pemulihan (Time Criticality Objectives - ISO 22317)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-sm">
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                  <div className="text-slate-500 text-xs font-semibold">Maximum Tolerable Period (MTPD):</div>
                  <div className="font-black text-lg text-rose-800 font-mono mt-1">{selectedProc.mtpd || '4 Hours'}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Batas waktu sebelum kerugian fatal tak terpulihkan</div>
                </div>
                <div className="p-4 border border-slate-200 rounded-xl bg-cyan-50/40">
                  <div className="text-slate-500 text-xs font-semibold">Recovery Time Objective (RTO):</div>
                  <div className="font-black text-lg text-cyan-900 font-mono mt-1">{selectedProc.rto || '2 Hours'}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Target durasi sistem beroperasi kembali</div>
                </div>
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                  <div className="text-slate-500 text-xs font-semibold">Recovery Point Objective (RPO):</div>
                  <div className="font-black text-lg text-indigo-800 font-mono mt-1">{selectedProc.rpo || '15 Minutes'}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Toleransi maksimal kehilangan data transaksi</div>
                </div>
              </div>
            </div>

            {/* Section 3: Criticality Rating */}
            <div>
              <h3 className="font-extrabold text-xs uppercase tracking-wider bg-slate-100 px-3 py-2 rounded-lg text-slate-800 mb-3 border border-slate-200">
                3. Klasifikasi & Prioritas Pemulihan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Criticality Tier:</span>
                  <div className="mt-1">{getTierBadge(selectedProc.criticalityTier)}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Recovery Priority:</span>
                  <div className="font-extrabold text-slate-900 text-base mt-1">
                    P1 <span className="text-xs text-slate-500 font-normal">(Urutan Teratas dalam BCP Runbook & DRP Failover)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Workaround Strategy */}
            <div>
              <h3 className="font-extrabold text-xs uppercase tracking-wider bg-slate-100 px-3 py-2 rounded-lg text-slate-800 mb-3 border border-slate-200">
                4. Prosedur Kontingensi & Workaround Operasional
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                {selectedProc.manualWorkaround ||
                  'Failover otomatis script ke DRC Surabaya dengan replikasi data database 15 menit.'}
              </p>
            </div>

            {/* Section 5: Approval Sign-off Box */}
            <div className="pt-6 border-t-2 border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3.5">
                Tanda Tangan Pengesahan (Approval Matrix ISO 22301 Clause 5.3):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/40">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Disusun Oleh</div>
                  <div className="font-bold text-slate-900 mt-1.5">{selectedProc.processOwnerName}</div>
                  <div className="text-[10px] text-slate-500">Process Owner</div>
                  <div className="mt-8 text-[11px] text-emerald-700 font-bold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Signed Digitally
                  </div>
                </div>

                <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/40">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Diverifikasi Oleh</div>
                  <div className="font-bold text-slate-900 mt-1.5">Sarah Wijaya, MBCI</div>
                  <div className="text-[10px] text-slate-500">Senior BCM Consultant</div>
                  <div className="mt-8 text-[11px] text-emerald-700 font-bold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </div>
                </div>

                <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/40">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Divalidasi Oleh</div>
                  <div className="font-bold text-slate-900 mt-1.5">Rian Pratama, CRISC</div>
                  <div className="text-[10px] text-slate-500">BCM Coordinator</div>
                  <div className="mt-8 text-[11px] text-emerald-700 font-bold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Validated
                  </div>
                </div>

                <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/40">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Disetujui Oleh</div>
                  <div className="font-bold text-slate-900 mt-1.5">Bambang Soediro</div>
                  <div className="text-[10px] text-slate-500">Direktur Kepatuhan & Risiko</div>
                  <div className="mt-8 text-[11px] text-emerald-700 font-bold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

