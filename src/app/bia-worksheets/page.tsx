'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import { DetailedBiaWorksheet, CriticalityTier, RecoveryPriority } from '@/types';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  FileSpreadsheet,
  Layers,
  Clock,
  DollarSign,
  ShieldCheck,
  Building,
  Users2,
  Table,
  Eye,
  Edit3,
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Download,
  Check,
  AlertCircle
} from 'lucide-react';

export default function BiaWorksheetsPage() {
  const { detailedBiaWorksheets, saveDetailedBiaWorksheet, lockDetailedBiaWorksheet, processes } = useBcm();

  const [viewMode, setViewMode] = useState<'worksheet' | 'grid'>('worksheet');
  const [selectedBiaId, setSelectedBiaId] = useState<string>(
    detailedBiaWorksheets[0]?.id || 'BIA-PROC-01'
  );

  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([]);
  const [selectedImpactCategory, setSelectedImpactCategory] = useState<string>('Financial');

  const currentBia = detailedBiaWorksheets.find((b) => b.id === selectedBiaId) || detailedBiaWorksheets[0];

  const getHeatmapColor = (score: number) => {
    switch (score) {
      case 1:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 2:
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 3:
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 4:
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 5:
        return 'bg-rose-600 text-white border-rose-700 font-black';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTierBadge = (tier: CriticalityTier) => {
    switch (tier) {
      case 'Tier 1 — Mission Critical':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs px-2.5 py-0.5 rounded-full font-black">Tier 1 — Mission Critical</span>;
      case 'Tier 2 — Critical':
        return <span className="bg-orange-50 text-orange-700 border border-orange-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Tier 2 — Critical</span>;
      case 'Tier 3 — Important':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">Tier 3 — Important</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-300 text-xs px-2.5 py-0.5 rounded-full font-medium">Tier 4 — Non-Critical</span>;
    }
  };

  const durations = ['1 Jam', '4 Jam', '24 Jam', '72 Jam', '1 Minggu', '2 Minggu +'];
  const categories = [
    'Financial',
    'Operational',
    'Customer',
    'Regulatory',
    'Reputation',
    'Legal',
    'Human',
    'Strategic'
  ];

  // Validation: RTO <= MTPD Check
  const rtoValid = currentBia ? currentBia.rtoDetermination.compliesWithMtpd : true;

  const handleToggleBulk = (id: string) => {
    setBulkSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = () => {
    bulkSelectedIds.forEach((id) => {
      lockDetailedBiaWorksheet(id, 'Lead BCM Consultant (Bulk Review)');
    });
    setBulkSelectedIds([]);
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-start lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-extrabold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Module DA-ED — Advanced BIA Worksheet & Grid
            </span>
            <span className="bg-cyan-50 text-cyan-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-cyan-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
              Rule Validator (RTO ≤ MTPD)
            </span>
            <span className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
              ISO 22317:2021 & POJK 11/2022
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Lembar Kerja BIA Lanjutan & Grid Database Spreadsheet
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Matriks dampak 8 kategori × 6 durasi, estimasi kerugian finansial IDR, analisis MTPD, RTO, RPO, MBCO, dan horizon sumber daya.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => setViewMode('worksheet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'worksheet' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-teal-600" /> Executive Worksheet
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'grid' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-4 h-4 text-indigo-600" /> Spreadsheet Grid ({detailedBiaWorksheets.length})
          </button>
        </div>
      </div>

      {viewMode === 'worksheet' && currentBia ? (
        /* EXECUTIVE WORKSHEET VIEW */
        <div className="space-y-5">
          {/* Top Process Selector & Status Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
                Pilih Proses BIA:
              </span>
              <select
                value={selectedBiaId}
                onChange={(e) => setSelectedBiaId(e.target.value)}
                className="text-xs font-bold py-2 px-3 rounded-lg border border-slate-300 bg-white focus:outline-teal-500 max-w-md w-full"
              >
                {detailedBiaWorksheets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.processCode} — {b.processName} ({b.unitName})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {getTierBadge(currentBia.criticalityTier)}
              <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded font-mono font-bold">
                Score: {currentBia.criticalityScore}/100
              </span>

              {currentBia.isLocked ? (
                <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs px-3 py-1 rounded-lg font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Terkunci (Locked)
                </span>
              ) : (
                <button
                  onClick={() => lockDetailedBiaWorksheet(currentBia.id, 'Lead BCM Consultant JMA')}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 shadow-2xs transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" /> Kunci BIA (Final Lock)
                </button>
              )}
            </div>
          </div>

          {/* Business Rule Validation Alert Banner (RTO <= MTPD) */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              rtoValid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            {rtoValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-xs sm:text-sm uppercase tracking-wider">
                  {rtoValid ? 'Aturan Validasi Kepatuhan BCM Terpenuhi (RTO ≤ MTPD)' : 'Peringatan Pelanggaran Aturan: RTO Melebihi MTPD!'}
                </h4>
                <span className="font-mono font-bold text-xs bg-white/80 px-2 py-0.5 rounded border border-current">
                  RTO: {currentBia.rtoDetermination.approvedRto || currentBia.rtoDetermination.suggestedRto} | MTPD: {currentBia.mtpdAnalysis.approvedMtpd || currentBia.mtpdAnalysis.proposedMtpd}
                </span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {currentBia.rtoDetermination.justification}
              </p>
            </div>
          </div>

          {/* Section: Process Profile & Key Thresholds */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building className="w-4 h-4 text-teal-600" /> Profil Proses & Ruang Lingkup Operasional
                </h3>
                <span className="text-xs text-slate-400 font-mono">{currentBia.currentRevision}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{currentBia.processProfile.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[11px]">Jam Operasional:</span>
                  <span className="font-bold text-slate-800">{currentBia.processProfile.operatingHours}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[11px]">Volume Harian:</span>
                  <span className="font-bold text-slate-800">{currentBia.processProfile.transactionVolume}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[11px]">Nilai Finansial:</span>
                  <span className="font-bold text-emerald-700">{currentBia.processProfile.financialValue}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[11px]">Target SLA:</span>
                  <span className="font-bold text-slate-800">{currentBia.processProfile.sla}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[11px]">Standar Regulasi:</span>
                  <span className="font-bold text-slate-800 truncate block">{currentBia.processProfile.regulatoryReq}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[11px]">Periode Kritis:</span>
                  <span className="font-bold text-rose-700">{currentBia.processProfile.criticalPeriod}</span>
                </div>
              </div>
            </div>

            {/* Target Metric Cards */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-600" /> Sasaran Pemulihan BCM
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-600 font-medium">Maximum Tolerable Period of Disruption (MTPD):</span>
                  <span className="font-black text-rose-700 text-sm">
                    {currentBia.mtpdAnalysis.approvedMtpd || currentBia.mtpdAnalysis.proposedMtpd}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-teal-50 rounded-lg border border-teal-200">
                  <span className="text-teal-900 font-bold">Recovery Time Objective (RTO):</span>
                  <span className="font-black text-teal-800 text-sm">
                    {currentBia.rtoDetermination.approvedRto || currentBia.rtoDetermination.suggestedRto}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-cyan-50 rounded-lg border border-cyan-200">
                  <span className="text-cyan-900 font-medium">Recovery Point Objective (RPO):</span>
                  <span className="font-bold text-cyan-800 text-sm">
                    {currentBia.rpoDetermination.requiredRpo}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-indigo-50 rounded-lg border border-indigo-200">
                  <span className="text-indigo-900 font-medium">Minimum Business Continuity Objective (MBCO):</span>
                  <span className="font-bold text-indigo-800 text-sm">
                    {currentBia.mbcoAnalysis.minimumPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: 8-Category x 6-Duration Impact Matrix Heatmap */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" /> Matriks Dampak 8 Dimensi × 6 Skala Waktu (Impact Heatmap)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Skala 1 (Negligible) sampai 5 (Catastrophic). Klik sel untuk melihat justifikasi kualitatif.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold flex-wrap">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded">1 Rendah</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded">2 Minor</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded">3 Sedang</span>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-900 rounded">4 Tinggi</span>
                <span className="px-2 py-0.5 bg-rose-600 text-white rounded">5 Kritis</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="p-3 text-left border border-slate-200">Kategori Dampak BIA</th>
                    {durations.map((dur, i) => (
                      <th key={i} className="p-3 border border-slate-200">
                        {dur}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, catIdx) => (
                    <tr key={catIdx} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-800 text-left border border-slate-200 bg-slate-50/80">
                        {cat}
                      </td>
                      {durations.map((dur, durIdx) => {
                        const cell = currentBia.impactMatrix[cat]?.[dur];
                        const score = cell?.score || 1;
                        return (
                          <td
                            key={durIdx}
                            className="p-2 border border-slate-200 relative group cursor-pointer"
                            title={cell?.comment || `Score: ${score}`}
                          >
                            <span
                              className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto text-xs font-bold border transition-transform group-hover:scale-110 ${getHeatmapColor(
                                score
                              )}`}
                            >
                              {score}
                            </span>
                            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-900 text-white text-[10px] rounded shadow-lg z-20 w-48 text-left pointer-events-none">
                              <span className="font-bold block text-teal-300">{cat} • {dur} (Score {score})</span>
                              <span className="leading-tight">{cell?.comment || 'Tidak ada catatan'}</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Financial Impact Breakdown & Resource Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Financial Losses */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Lembar Estimasi Kerugian Finansial (IDR)
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Total: Rp {currentBia.financialImpact.totalFinancialImpact.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="space-y-2">
                {currentBia.financialImpact.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{item.category}</span>
                      <span className="text-rose-700 font-mono">Rp {item.dailyLoss.toLocaleString('id-ID')} / Hari</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{item.description}</p>
                    <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-slate-200">
                      <span>Per Jam: Rp {item.hourlyLoss.toLocaleString('id-ID')}</span>
                      <span>Per Minggu: Rp {item.weeklyLoss.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resource Time-Horizon Requirements */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" /> Kebutuhan Sumber Daya Sesuai Horizon Waktu
                </h3>
              </div>

              <div className="space-y-2.5">
                {currentBia.resourceMatrix.map((res, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span className="text-teal-800 font-bold">{res.resourceType}</span>
                      <span className="text-slate-500 font-normal">Normal: {res.normalCapacity}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-white p-2 rounded border border-slate-200">
                        <span className="text-slate-400 block">0 - 4 Jam (Immediate):</span>
                        <span className="font-semibold text-slate-800">{res.h0to2} • {res.h2to4}</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200">
                        <span className="text-slate-400 block">4 - 24 Jam:</span>
                        <span className="font-semibold text-slate-800">{res.h4to8} • {res.h8to24}</span>
                      </div>
                    </div>
                    {res.notes && <p className="text-[10px] text-slate-500 italic">Catatan: {res.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SPREADSHEET DATABASE GRID VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-4">
          {/* Bulk Action Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">
                {bulkSelectedIds.length > 0 ? `${bulkSelectedIds.length} baris terpilih` : 'Tampilan Spreadsheet BIA Master'}
              </span>
              {bulkSelectedIds.length > 0 && (
                <button
                  onClick={handleBulkApprove}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Setujui & Kunci Massal
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  alert('Ekspor database BIA ke format Microsoft Excel / CSV berhasil dimulai.');
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Ekspor ke Excel (.xlsx)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3 w-8 text-center">
                    <input
                      type="checkbox"
                      checked={bulkSelectedIds.length === detailedBiaWorksheets.length && detailedBiaWorksheets.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBulkSelectedIds(detailedBiaWorksheets.map((b) => b.id));
                        } else {
                          setBulkSelectedIds([]);
                        }
                      }}
                      className="rounded text-teal-600"
                    />
                  </th>
                  <th className="p-3">Kode BIA</th>
                  <th className="p-3">Nama Proses Bisnis</th>
                  <th className="p-3">Unit Kerja</th>
                  <th className="p-3">Kritikalitas</th>
                  <th className="p-3">MTPD</th>
                  <th className="p-3">Target RTO</th>
                  <th className="p-3">Target RPO</th>
                  <th className="p-3">MBCO %</th>
                  <th className="p-3">Validasi RTO≤MTPD</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {detailedBiaWorksheets.map((bia) => {
                  const isValid = bia.rtoDetermination.compliesWithMtpd;
                  const isSelected = bulkSelectedIds.includes(bia.id);
                  return (
                    <tr
                      key={bia.id}
                      className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-teal-50/50' : ''}`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleBulk(bia.id)}
                          className="rounded text-teal-600"
                        />
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-800">{bia.code}</td>
                      <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{bia.processName}</td>
                      <td className="p-3 text-slate-600">{bia.unitName}</td>
                      <td className="p-3">{getTierBadge(bia.criticalityTier)}</td>
                      <td className="p-3 font-mono font-bold text-rose-700">
                        {bia.mtpdAnalysis.approvedMtpd || bia.mtpdAnalysis.proposedMtpd}
                      </td>
                      <td className="p-3 font-mono font-bold text-teal-800">
                        {bia.rtoDetermination.approvedRto || bia.rtoDetermination.suggestedRto}
                      </td>
                      <td className="p-3 font-mono text-slate-700">{bia.rpoDetermination.requiredRpo}</td>
                      <td className="p-3 font-bold text-indigo-700">{bia.mbcoAnalysis.minimumPercentage}%</td>
                      <td className="p-3">
                        {isValid ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px] flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Lolos (Passed)
                          </span>
                        ) : (
                          <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold text-[10px] flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> Gagal
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {bia.isLocked ? (
                          <span className="text-slate-500 font-medium flex items-center gap-1">
                            <Lock className="w-3 h-3 text-slate-400" /> Locked
                          </span>
                        ) : (
                          <span className="text-cyan-700 font-bold">{bia.assessmentStatus}</span>
                        )}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setSelectedBiaId(bia.id);
                            setViewMode('worksheet');
                          }}
                          className="text-teal-700 hover:text-teal-900 font-bold bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded transition-colors"
                        >
                          Buka BIA
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
