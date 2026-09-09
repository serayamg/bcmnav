'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import { RISK_CATEGORIES, RiskAssessmentData } from '@/lib/mock-data';
import { exportTablePdf } from '@/lib/pdf-export';
import {
  ShieldAlert,
  Plus,
  Search,
  Trash2,
  X,
  AlertTriangle,
  Target,
  Activity,
  Download,
} from 'lucide-react';

// Pedoman BCM §5.2.2.2 — Skor Risiko = Likelihood × Impact, Level E/T/M/R
function riskLevel(score: number): { code: 'E' | 'T' | 'M' | 'R'; label: string; cls: string } {
  if (score >= 20) return { code: 'E', label: 'Ekstrem', cls: 'bg-red-100 text-red-800 border-red-300' };
  if (score >= 12) return { code: 'T', label: 'Tinggi', cls: 'bg-orange-100 text-orange-800 border-orange-300' };
  if (score >= 6) return { code: 'M', label: 'Moderat', cls: 'bg-amber-100 text-amber-800 border-amber-300' };
  return { code: 'R', label: 'Rendah', cls: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
}

const LIKELIHOOD_LABELS: Record<number, string> = {
  5: '5 — Hampir Pasti (>1x/th)',
  4: '4 — Sering (1x/1–2th)',
  3: '3 — Mungkin (1x/2–5th)',
  2: '2 — Jarang (1x/5–10th)',
  1: '1 — Sangat Jarang (<1x/10th)',
};

const IMPACT_LABELS: Record<number, string> = {
  5: '5 — Sangat Tinggi',
  4: '4 — Tinggi',
  3: '3 — Sedang',
  2: '2 — Rendah',
  1: '1 — Sangat Rendah',
};

const STATUS_OPTIONS = ['Open', 'Mitigasi Berjalan', 'Dipantau', 'Selesai'];

export default function RiskAssessmentPage() {
  const { riskAssessments, setRiskAssessments, addAuditLog } = useBcm();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // form state
  const [category, setCategory] = useState<string>(RISK_CATEGORIES[0]);
  const [riskName, setRiskName] = useState('');
  const [affectedAsset, setAffectedAsset] = useState('');
  const [likelihood, setLikelihood] = useState(3);
  const [impact, setImpact] = useState(3);
  const [existingControl, setExistingControl] = useState('');
  const [mitigationPlan, setMitigationPlan] = useState('');
  const [pic, setPic] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [status, setStatus] = useState('Open');

  const resetForm = () => {
    setCategory(RISK_CATEGORIES[0]);
    setRiskName('');
    setAffectedAsset('');
    setLikelihood(3);
    setImpact(3);
    setExistingControl('');
    setMitigationPlan('');
    setPic('');
    setTargetDate('');
    setStatus('Open');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riskName.trim()) return;
    const newRisk: RiskAssessmentData = {
      id: `risk-${Date.now()}`,
      code: `RA-${Math.floor(Math.random() * 900 + 100)}`,
      category,
      riskName: riskName.trim(),
      affectedAsset: affectedAsset.trim(),
      likelihood,
      impact,
      existingControl: existingControl.trim(),
      mitigationPlan: mitigationPlan.trim(),
      pic: pic.trim(),
      targetDate,
      status,
    };
    setRiskAssessments((prev) => [...prev, newRisk]);
    addAuditLog('CREATE_RISK', 'RISK_ASSESSMENT', newRisk.code, `Menambahkan risiko: ${newRisk.riskName} (L${likelihood}xI${impact})`);
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string, code: string) => {
    setRiskAssessments((prev) => prev.filter((r) => r.id !== id));
    addAuditLog('DELETE_RISK', 'RISK_ASSESSMENT', code, `Menghapus entri risiko ${code}`);
  };

  const filtered = riskAssessments.filter(
    (r) =>
      r.riskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.affectedAsset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.pic || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = riskAssessments.length;
  const extremeHigh = riskAssessments.filter((r) => r.likelihood * r.impact >= 12).length;
  const openCount = riskAssessments.filter((r) => r.status !== 'Selesai').length;

  const previewScore = likelihood * impact;
  const previewLevel = riskLevel(previewScore);

  const handleDownloadPdf = () => {
    if (riskAssessments.length === 0) {
      alert('Belum ada entri risiko untuk diunduh.');
      return;
    }
    exportTablePdf({
      title: 'Continuity Risk Register',
      subtitle: 'Register Risiko Kelangsungan (Pedoman BCM §9.21)',
      meta: [
        { label: 'Total Risiko', value: String(riskAssessments.length) },
        { label: 'Tinggi/Ekstrem', value: String(extremeHigh) },
      ],
      columns: [
        { header: 'No', key: 'no', width: 10 },
        { header: 'Risiko / Ancaman', key: 'riskName', width: 55 },
        { header: 'Kategori', key: 'category', width: 28 },
        { header: 'Proses/Aset', key: 'affectedAsset', width: 35 },
        { header: 'L', key: 'likelihood', width: 8 },
        { header: 'I', key: 'impact', width: 8 },
        { header: 'Skor', key: 'score', width: 12 },
        { header: 'Level', key: 'level', width: 22 },
        { header: 'Kontrol Eksisting', key: 'existingControl' },
        { header: 'Mitigasi', key: 'mitigationPlan' },
        { header: 'PIC', key: 'pic', width: 24 },
        { header: 'Target', key: 'targetDate', width: 22 },
      ],
      rows: riskAssessments.map((r, i) => {
        const score = r.likelihood * r.impact;
        return {
          no: i + 1,
          riskName: r.riskName,
          category: r.category,
          affectedAsset: r.affectedAsset || '-',
          likelihood: r.likelihood,
          impact: r.impact,
          score,
          level: `${riskLevel(score).code} — ${riskLevel(score).label}`,
          existingControl: r.existingControl || '-',
          mitigationPlan: r.mitigationPlan || '-',
          pic: r.pic || '-',
          targetDate: r.targetDate || '-',
        };
      }),
      fileName: 'Continuity_Risk_Register.pdf',
    });
    addAuditLog('EXPORT_PDF', 'RISK_ASSESSMENT', 'Risk Register', `Mengunduh PDF ${riskAssessments.length} entri risiko`);
  };

  return (
    <div className="p-3.5 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0B1F3A] to-[#133C67] rounded-2xl p-5 sm:p-6 text-white shadow-lg">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#00A9CE] to-sky-400 flex items-center justify-center shadow-md">
              <ShieldAlert className="w-5 h-5 text-[#04283a]" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-cyan-200 font-semibold">Module — Risk Assessment</div>
              <h1 className="text-xl sm:text-2xl font-extrabold">Continuity Risk Register</h1>
              <p className="text-cyan-100 text-[13px] mt-0.5">
                Identifikasi &amp; penilaian risiko kelangsungan (Pedoman BCM &sect;9.21) — Skor = Likelihood &times; Impact.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 text-sm font-bold rounded-xl flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" /> PDF
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-[#00A9CE] hover:bg-cyan-400 text-[#04283a] text-sm font-bold rounded-xl flex items-center gap-2 shadow transition-all"
            >
              <Plus className="w-4 h-4" /> Tambah Risiko
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-[12px] font-semibold"><Activity className="w-4 h-4" /> Total Risiko</div>
          <div className="text-2xl font-extrabold text-[#0B1F3A] mt-1">{total}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-[12px] font-semibold"><AlertTriangle className="w-4 h-4 text-orange-500" /> Tinggi/Ekstrem</div>
          <div className="text-2xl font-extrabold text-orange-600 mt-1">{extremeHigh}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-[12px] font-semibold"><Target className="w-4 h-4 text-cyan-600" /> Belum Selesai</div>
          <div className="text-2xl font-extrabold text-cyan-700 mt-1">{openCount}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari risiko, kategori, aset terdampak, atau PIC..."
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-[13px] border-collapse min-w-[900px]">
          <thead>
            <tr>
              {['No', 'Risiko / Ancaman', 'Kategori', 'Proses/Aset Terdampak', 'L', 'I', 'Skor', 'Level', 'Kontrol Eksisting', 'Mitigasi Tambahan', 'PIC', 'Target', 'Status', ''].map((h, i) => (
                <th key={i} className="bg-[#0B1F3A] text-white text-left px-3 py-2.5 font-semibold whitespace-nowrap text-[12px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={14} className="text-center text-slate-400 py-10">
                  Belum ada entri risiko. Klik <b>Tambah Risiko</b> untuk mengisi Continuity Risk Register.
                </td>
              </tr>
            ) : (
              filtered.map((r, idx) => {
                const score = r.likelihood * r.impact;
                const lvl = riskLevel(score);
                return (
                  <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/70 align-top">
                    <td className="px-3 py-2.5 text-slate-500">{idx + 1}</td>
                    <td className="px-3 py-2.5 font-semibold text-[#0B1F3A] max-w-[220px]">
                      {r.riskName}
                      <div className="text-[11px] text-slate-400 font-mono">{r.code}</div>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{r.category}</td>
                    <td className="px-3 py-2.5 text-slate-600 max-w-[160px]">{r.affectedAsset || '—'}</td>
                    <td className="px-3 py-2.5 text-center font-semibold">{r.likelihood}</td>
                    <td className="px-3 py-2.5 text-center font-semibold">{r.impact}</td>
                    <td className="px-3 py-2.5 text-center font-extrabold text-[#0B1F3A]">{score}</td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${lvl.cls}`}>{lvl.code} — {lvl.label}</span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 max-w-[180px]">{r.existingControl || '—'}</td>
                    <td className="px-3 py-2.5 text-slate-600 max-w-[180px]">{r.mitigationPlan || '—'}</td>
                    <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{r.pic || '—'}</td>
                    <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{r.targetDate || '—'}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">{r.status}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <button onClick={() => handleDelete(r.id, r.code)} className="text-slate-400 hover:text-red-500" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[11.5px] text-slate-400">
        Skala: Likelihood 1–5, Impact 1–5. Level Risiko — <b>E</b> Ekstrem (20–25), <b>T</b> Tinggi (12–19), <b>M</b> Moderat (6–11), <b>R</b> Rendah (1–5). Sesuai Pedoman BCM &sect;5.2.2.2.
      </p>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-[#0B1F3A]">Tambah Entri Risiko</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-slate-600">Kategori Ancaman</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    {RISK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-slate-600">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-slate-600">Risiko / Ancaman *</label>
                <input value={riskName} onChange={(e) => setRiskName(e.target.value)} required placeholder="mis. Serangan ransomware pada Core Insurance System" className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-slate-600">Proses / Aset Terdampak</label>
                <input value={affectedAsset} onChange={(e) => setAffectedAsset(e.target.value)} placeholder="mis. Pembayaran Klaim, Core Insurance System" className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-slate-600">Likelihood</label>
                  <select value={likelihood} onChange={(e) => setLikelihood(Number(e.target.value))} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    {[5, 4, 3, 2, 1].map((v) => <option key={v} value={v}>{LIKELIHOOD_LABELS[v]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-slate-600">Impact</label>
                  <select value={impact} onChange={(e) => setImpact(Number(e.target.value))} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    {[5, 4, 3, 2, 1].map((v) => <option key={v} value={v}>{IMPACT_LABELS[v]}</option>)}
                  </select>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <span className="text-[13px] text-slate-600 font-semibold">Skor Risiko (otomatis)</span>
                <span className="flex items-center gap-2">
                  <span className="text-lg font-extrabold text-[#0B1F3A]">{previewScore}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${previewLevel.cls}`}>{previewLevel.code} — {previewLevel.label}</span>
                </span>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-slate-600">Kontrol Eksisting</label>
                <textarea value={existingControl} onChange={(e) => setExistingControl(e.target.value)} rows={2} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-slate-600">Rencana Mitigasi Tambahan</label>
                <textarea value={mitigationPlan} onChange={(e) => setMitigationPlan(e.target.value)} rows={2} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-slate-600">PIC</label>
                  <input value={pic} onChange={(e) => setPic(e.target.value)} placeholder="Penanggung jawab" className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-slate-600">Target</label>
                  <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-[#0B1F3A] text-white text-sm font-bold">Simpan Risiko</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
