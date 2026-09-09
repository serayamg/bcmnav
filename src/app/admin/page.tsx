'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import {
  Sliders,
  Save,
  Plus,
  Trash2,
  Layers,
  Clock,
  Coins,
  ShieldCheck,
  CheckCircle2,
  FileCode2,
  RefreshCw,
  Scale,
  Sparkles,
  Info,
  Calendar,
  AlertTriangle,
  Lock,
  GitBranch,
} from 'lucide-react';

export default function AdminPage() {
  const { addAuditLog } = useBcm();
  const [methodologyVersion, setMethodologyVersion] = useState('v1.1 (POJK 11 Compliant)');
  const [activePreset, setActivePreset] = useState<'kbmi3' | 'kbmi4' | 'fintech' | 'corporate'>('kbmi3');

  // Impact categories state with ISO clause & description
  const [categories, setCategories] = useState([
    { id: 'cat-1', name: 'Finansial & Kerugian Langsung', clause: 'ISO 22317 Clause 7.2', weight: 25, enabled: true, color: 'rose' },
    { id: 'cat-2', name: 'Operasional & SLA Transaksi', clause: 'ISO 22317 Clause 7.3', weight: 20, enabled: true, color: 'blue' },
    { id: 'cat-3', name: 'Kepercayaan Nasabah & Publik', clause: 'ISO 22301 Clause 8.2.2', weight: 15, enabled: true, color: 'amber' },
    { id: 'cat-4', name: 'Kepatuhan Regulasi (OJK / BI)', clause: 'POJK 11/2022 Mandate', weight: 20, enabled: true, color: 'red' },
    { id: 'cat-5', name: 'Reputasi & Brand Value', clause: 'ISO 22301 Clause 4.2', weight: 10, enabled: true, color: 'purple' },
    { id: 'cat-6', name: 'Hukum & Litigasi Pihak Ketiga', clause: 'Contractual & SLA', weight: 10, enabled: true, color: 'indigo' },
  ]);

  // Financial threshold scales
  const [scales, setScales] = useState([
    { score: 1, label: 'Insignificant', severity: 'Tingkat 1 - Sangat Ringan', threshold: '< Rp 100 Juta', maxRto: '> 7 Hari', defaultRpo: '≤ 24 Jam', targetMtpd: '> 14 Hari' },
    { score: 2, label: 'Minor', severity: 'Tingkat 2 - Ringan', threshold: 'Rp 100 Juta – Rp 500 Juta', maxRto: '2 – 7 Hari', defaultRpo: '≤ 12 Jam', targetMtpd: '≤ 14 Hari' },
    { score: 3, label: 'Moderate', severity: 'Tingkat 3 - Menengah', threshold: 'Rp 500 Juta – Rp 2 Miliar', maxRto: '8 – 24 Jam', defaultRpo: '≤ 4 Jam', targetMtpd: '≤ 48 Jam' },
    { score: 4, label: 'Major', severity: 'Tingkat 4 - Signifikan', threshold: 'Rp 2 Miliar – Rp 10 Miliar', maxRto: '4 – 8 Jam', defaultRpo: '≤ 1 Jam', targetMtpd: '≤ 12 Jam' },
    { score: 5, label: 'Severe / Catastrophic', severity: 'Tingkat 5 - Bencana', threshold: '> Rp 10 Miliar', maxRto: '< 2 Jam', defaultRpo: '0 – 15 Menit', targetMtpd: '≤ 4 Jam' },
  ]);

  // Evaluation time horizons
  const [timeHorizons, setTimeHorizons] = useState([
    { horizon: '< 1 Jam', priority: 'P1', focus: 'Real-time Payment / ATM / Core' },
    { horizon: '1 – 2 Jam', priority: 'P1', focus: 'Kliring SKNBI / RTGS / Settlement' },
    { horizon: '2 – 4 Jam', priority: 'P2', focus: 'Mobile & Internet Banking SLA' },
    { horizon: '4 – 8 Jam', priority: 'P2', focus: 'End-of-Day Accounting Backlog' },
    { horizon: '8 – 24 Jam', priority: 'P3', focus: 'Overnight Batch Processing' },
    { horizon: '1 – 2 Hari', priority: 'P3', focus: 'Cabang Pendukung & Trade Finance' },
    { horizon: '2 – 3 Hari', priority: 'P4', focus: 'Internal HR & GA Support' },
    { horizon: '> 7 Hari', priority: 'P4', focus: 'Aktivitas Arsip & Pelaporan Tahunan' },
  ]);

  const applyIndustryPreset = (preset: 'kbmi3' | 'kbmi4' | 'fintech' | 'corporate') => {
    setActivePreset(preset);
    if (preset === 'kbmi4') {
      setMethodologyVersion('v1.2 (KBMI 4 - Systemic Bank)');
      setScales([
        { score: 1, label: 'Insignificant', severity: 'Tingkat 1 - Sangat Ringan', threshold: '< Rp 500 Juta', maxRto: '> 5 Hari', defaultRpo: '≤ 24 Jam', targetMtpd: '> 14 Hari' },
        { score: 2, label: 'Minor', severity: 'Tingkat 2 - Ringan', threshold: 'Rp 500 Juta – Rp 5 Miliar', maxRto: '2 – 5 Hari', defaultRpo: '≤ 8 Jam', targetMtpd: '≤ 7 Hari' },
        { score: 3, label: 'Moderate', severity: 'Tingkat 3 - Menengah', threshold: 'Rp 5 Miliar – Rp 25 Miliar', maxRto: '8 – 24 Jam', defaultRpo: '≤ 2 Jam', targetMtpd: '≤ 48 Jam' },
        { score: 4, label: 'Major', severity: 'Tingkat 4 - Signifikan', threshold: 'Rp 25 Miliar – Rp 100 Miliar', maxRto: '2 – 4 Jam', defaultRpo: '≤ 30 Menit', targetMtpd: '≤ 8 Jam' },
        { score: 5, label: 'Severe / Catastrophic', severity: 'Tingkat 5 - Bencana', threshold: '> Rp 100 Miliar', maxRto: '≤ 2 Jam', defaultRpo: '0 – 5 Menit', targetMtpd: '≤ 4 Jam' },
      ]);
    } else if (preset === 'fintech') {
      setMethodologyVersion('v1.0 (FinTech & Payment Gateway)');
      setScales([
        { score: 1, label: 'Insignificant', severity: 'Tingkat 1 - Sangat Ringan', threshold: '< Rp 50 Juta', maxRto: '> 3 Hari', defaultRpo: '≤ 12 Jam', targetMtpd: '> 7 Hari' },
        { score: 2, label: 'Minor', severity: 'Tingkat 2 - Ringan', threshold: 'Rp 50 Juta – Rp 250 Juta', maxRto: '24 – 48 Jam', defaultRpo: '≤ 4 Jam', targetMtpd: '≤ 5 Hari' },
        { score: 3, label: 'Moderate', severity: 'Tingkat 3 - Menengah', threshold: 'Rp 250 Juta – Rp 2 Miliar', maxRto: '4 – 12 Jam', defaultRpo: '≤ 1 Jam', targetMtpd: '≤ 24 Jam' },
        { score: 4, label: 'Major', severity: 'Tingkat 4 - Signifikan', threshold: 'Rp 2 Miliar – Rp 10 Miliar', maxRto: '1 – 4 Jam', defaultRpo: '≤ 15 Menit', targetMtpd: '≤ 8 Jam' },
        { score: 5, label: 'Severe / Catastrophic', severity: 'Tingkat 5 - Bencana', threshold: '> Rp 10 Miliar', maxRto: '< 1 Jam', defaultRpo: '0 – 5 Menit', targetMtpd: '≤ 2 Jam' },
      ]);
    } else if (preset === 'corporate') {
      setMethodologyVersion('v1.0 (Corporate Enterprise)');
      setScales([
        { score: 1, label: 'Insignificant', severity: 'Tingkat 1 - Sangat Ringan', threshold: '< Rp 50 Juta', maxRto: '> 7 Hari', defaultRpo: '≤ 24 Jam', targetMtpd: '> 14 Hari' },
        { score: 2, label: 'Minor', severity: 'Tingkat 2 - Ringan', threshold: 'Rp 50 Juta – Rp 500 Juta', maxRto: '3 – 7 Hari', defaultRpo: '≤ 12 Jam', targetMtpd: '≤ 14 Hari' },
        { score: 3, label: 'Moderate', severity: 'Tingkat 3 - Menengah', threshold: 'Rp 500 Juta – Rp 5 Miliar', maxRto: '24 – 72 Jam', defaultRpo: '≤ 8 Jam', targetMtpd: '≤ 7 Hari' },
        { score: 4, label: 'Major', severity: 'Tingkat 4 - Signifikan', threshold: 'Rp 5 Miliar – Rp 25 Miliar', maxRto: '8 – 24 Jam', defaultRpo: '≤ 4 Jam', targetMtpd: '≤ 48 Jam' },
        { score: 5, label: 'Severe / Catastrophic', severity: 'Tingkat 5 - Bencana', threshold: '> Rp 25 Miliar', maxRto: '< 8 Jam', defaultRpo: '≤ 1 Jam', targetMtpd: '≤ 24 Jam' },
      ]);
    } else {
      setMethodologyVersion('v1.1 (POJK 11 Compliant)');
      setScales([
        { score: 1, label: 'Insignificant', severity: 'Tingkat 1 - Sangat Ringan', threshold: '< Rp 100 Juta', maxRto: '> 7 Hari', defaultRpo: '≤ 24 Jam', targetMtpd: '> 14 Hari' },
        { score: 2, label: 'Minor', severity: 'Tingkat 2 - Ringan', threshold: 'Rp 100 Juta – Rp 500 Juta', maxRto: '2 – 7 Hari', defaultRpo: '≤ 12 Jam', targetMtpd: '≤ 14 Hari' },
        { score: 3, label: 'Moderate', severity: 'Tingkat 3 - Menengah', threshold: 'Rp 500 Juta – Rp 2 Miliar', maxRto: '8 – 24 Jam', defaultRpo: '≤ 4 Jam', targetMtpd: '≤ 48 Jam' },
        { score: 4, label: 'Major', severity: 'Tingkat 4 - Signifikan', threshold: 'Rp 2 Miliar – Rp 10 Miliar', maxRto: '4 – 8 Jam', defaultRpo: '≤ 1 Jam', targetMtpd: '≤ 12 Jam' },
        { score: 5, label: 'Severe / Catastrophic', severity: 'Tingkat 5 - Bencana', threshold: '> Rp 10 Miliar', maxRto: '< 2 Jam', defaultRpo: '0 – 15 Menit', targetMtpd: '≤ 4 Jam' },
      ]);
    }
  };

  const handleSaveParams = () => {
    addAuditLog('UPDATE_PARAMETERS', 'ADMIN', methodologyVersion, 'Parameter metodologi BIA dan threshold finansial diperbarui.');
    alert('Konfigurasi parameter metodologi BIA berhasil disimpan!');
  };

  const totalWeight = categories.reduce((sum, c) => sum + (c.enabled ? c.weight : 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
              Module 12 — Master Data & Governance
            </span>
            <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-300">
              Zero Hardcoded Logic
            </span>
            <span className="bg-cyan-100 text-cyan-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-cyan-300">
              ISO 22317 Parameterized
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manajemen Parameter & Versi Metodologi BIA
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
            Konfigurasi kustom skala dampak, kategori risiko, batas waktu pemulihan, dan rumus penilaian tanpa perubahan source code.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveParams}
          className="px-5 py-2.5 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 text-sm font-extrabold rounded-xl flex items-center gap-2 shadow-md transition-all shrink-0 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Parameter Metodologi</span>
        </button>
      </div>

      {/* Versioning & Policy Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyan-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Metodologi Berjalan & Kebijakan Versi
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            Versi Metodologi BIA Aktif Saat Ini
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            Perubahan parameter disimpan dengan nomor versi unik (Parameter Versioning Policy) sehingga tidak merusak arsip kuesioner BIA historis yang telah disetujui sebelumnya.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Identifier Versi:</span>
            <input
              type="text"
              value={methodologyVersion}
              onChange={(e) => setMethodologyVersion(e.target.value)}
              className="px-3.5 py-2 text-sm border border-slate-300 rounded-xl font-mono font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-[#00A9CE] focus:outline-none min-w-[240px]"
            />
          </div>
        </div>
      </div>

      {/* Preset Quick Calibration */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Preset Kalibrasi Cepat Skala Dampak Industri:
            </h3>
          </div>
          <span className="text-xs text-slate-500 italic">Pilih preset untuk memuat acuan ambang batas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'kbmi3', title: 'Bank KBMI 2–3 / BPD', sub: 'Aset Rp 10T – 100T', badge: 'Standar Default' },
            { id: 'kbmi4', title: 'Bank KBMI 4 (Sistemik)', sub: 'Aset > Rp 100T', badge: 'Bank Besar BUMN' },
            { id: 'fintech', title: 'FinTech & PJP Gateway', sub: 'Aset < Rp 10T', badge: 'Payment Gateway' },
            { id: 'corporate', title: 'Korporasi & Manufaktur', sub: 'General Enterprise', badge: 'Supply Chain' },
          ].map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                type="button"
                key={preset.id}
                onClick={() => applyIndustryPreset(preset.id as any)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-cyan-600 bg-cyan-50/70 text-cyan-950 ring-2 ring-cyan-500/30'
                    : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm">{preset.title}</span>
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">{preset.sub}</div>
                <div className="text-[11px] text-slate-400 mt-1 font-semibold">{preset.badge}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Financial Threshold Scales */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Batas Nilai Finansial (Financial Loss Thresholds)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Disesuaikan dengan ukuran modal / aset institusi klien serta target pemulihan maksimal per tingkat dampak.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
            <Coins className="w-3.5 h-3.5 text-slate-500" />
            <span>Mata Uang: IDR (Rupiah)</span>
          </div>
        </div>

        <div className="space-y-3">
          {scales.map((s, idx) => (
            <div
              key={s.score}
              className="p-4 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Score Badge & Label */}
              <div className="flex items-center gap-3.5 min-w-[220px]">
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-sm shrink-0 ${
                    s.score === 5
                      ? 'bg-rose-600 text-white ring-2 ring-rose-200'
                      : s.score === 4
                      ? 'bg-orange-500 text-white ring-2 ring-orange-200'
                      : s.score === 3
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-200'
                      : s.score === 2
                      ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                      : 'bg-emerald-600 text-white ring-2 ring-emerald-200'
                  }`}
                >
                  {s.score}
                </span>
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">{s.label}</div>
                  <div className="text-xs text-slate-500 font-medium">{s.severity}</div>
                </div>
              </div>

              {/* Middle Inputs: Nominal Threshold */}
              <div className="flex-1 max-w-md w-full">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                  Ambang Nominal Kerugian:
                </label>
                <input
                  type="text"
                  value={s.threshold}
                  onChange={(e) => {
                    const updated = [...scales];
                    updated[idx].threshold = e.target.value;
                    setScales(updated);
                  }}
                  className="px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 bg-white w-full focus:border-[#00A9CE] focus:ring-1 focus:ring-[#00A9CE]"
                />
              </div>

              {/* Right Recovery Targets */}
              <div className="grid grid-cols-3 gap-2 shrink-0 text-center w-full md:w-auto">
                <div className="p-2 rounded-xl bg-white border border-slate-200 min-w-[85px]">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Max RTO</div>
                  <div className="text-xs font-mono font-bold text-cyan-800 mt-0.5">{s.maxRto}</div>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200 min-w-[85px]">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Target RPO</div>
                  <div className="text-xs font-mono font-bold text-indigo-800 mt-0.5">{s.defaultRpo}</div>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200 min-w-[85px]">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Maks MTPD</div>
                  <div className="text-xs font-mono font-bold text-rose-800 mt-0.5">{s.targetMtpd}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Categories & Weights */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Kategori Dimensi Dampak & Bobot Penilaian (ISO 22317)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Dimensi risiko yang dinilai pada kuesioner BIA step 3 beserta persentase bobot pembobotan scoring.
            </p>
          </div>
          <div
            className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border shrink-0 ${
              totalWeight === 100
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-rose-50 text-rose-900 border-rose-300'
            }`}
          >
            Total Bobot: {totalWeight}% {totalWeight === 100 ? '✓ Tervalidasi' : '⚠️ Harus 100%'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {categories.map((c, idx) => (
            <div
              key={c.id}
              className="p-4 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                    {c.clause}
                  </span>
                  <span className="text-emerald-700 bg-emerald-100/70 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300 text-xs">
                    Aktif
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm mt-2">{c.name}</h4>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-xs font-semibold text-slate-600">Bobot Scoring:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={c.weight}
                    onChange={(e) => {
                      const updated = [...categories];
                      updated[idx].weight = Number(e.target.value) || 0;
                      setCategories(updated);
                    }}
                    className="w-16 px-2 py-1 text-xs font-bold text-center border border-slate-300 rounded-lg bg-white"
                  />
                  <span className="text-xs font-bold text-slate-700">%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standard Time Horizons Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Horizon Waktu Standar Downtime (Timeframe Evaluation Buckets)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Bucket waktu standar ISO 22317 untuk pengukuran eskalasi kurva dampak operasional dan finansial.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            8 Bucket Standar
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {timeHorizons.map((th) => (
            <div
              key={th.horizon}
              className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 hover:border-cyan-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-slate-900">{th.horizon}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    th.priority === 'P1'
                      ? 'bg-rose-100 text-rose-800'
                      : th.priority === 'P2'
                      ? 'bg-orange-100 text-orange-800'
                      : th.priority === 'P3'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {th.priority}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium leading-tight">
                {th.focus}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>
            Parameter tersimpan secara dinamis ke Master Database. Perubahan berlaku otomatis untuk seluruh kuesioner BIA aktif.
          </span>
        </div>
        <span className="font-mono text-cyan-300 font-bold hidden sm:inline-block">
          Dynamic Config Engine Ready
        </span>
      </div>
    </div>
  );
}

