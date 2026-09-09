'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Users2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Check,
  X,
  Search,
  Timer,
  ShieldAlert,
  Target
} from 'lucide-react';

export default function WorkshopPage() {
  const { processes, submitBiaApproval, addAuditLog } = useBcm();
  const [selectedProcessId, setSelectedProcessId] = useState(processes[0]?.id || 'proc-01');
  const [procSearchQuery, setProcSearchQuery] = useState('');
  const [workshopNotes, setWorkshopNotes] = useState(
    'Seluruh peserta workshop menyetujui target RTO 2 Jam dan MTPD 4 Jam untuk transaksi RTGS & BI-FAST. Divisi IT diinstruksikan mempercepat pengujian load test replikasi DRC Surabaya.'
  );
  const [decision, setDecision] = useState<'Validated' | 'Need Revision' | 'Escalated'>('Validated');

  const selectedProc = processes.find((p) => p.id === selectedProcessId) || processes[0];

  const filteredProcesses = processes.filter(
    (p) =>
      p.name.toLowerCase().includes(procSearchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(procSearchQuery.toLowerCase()) ||
      (p.unitName && p.unitName.toLowerCase().includes(procSearchQuery.toLowerCase()))
  );

  if (!selectedProc) {
    return (
      <div className="p-6 max-w-7xl mx-auto w-full">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
          Belum ada proses bisnis yang dapat divalidasi. Tambahkan proses pada Business Process Register terlebih dahulu.
        </div>
      </div>
    );
  }

  const handleValidate = () => {
    submitBiaApproval(selectedProc.id, 'Validation Workshop', workshopNotes);
    addAuditLog(
      'WORKSHOP_DECISION',
      'WORKSHOP',
      selectedProc.code,
      `Keputusan Workshop: ${decision}. Catatan: ${workshopNotes}`
    );
    alert(`Proses ${selectedProc.name} berhasil disimpan dengan status: ${decision}!`);
  };

  return (
    <div className="p-3.5 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
              Module 7 — Validation & Sign-off
            </span>
            <span className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Joint Consultant & Client Review
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            BIA Validation Workshop Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
            Sesi telaah bersama antara Konsultan BCM, Process Owner, Unit Head, dan Direksi untuk penyelarasan target pemulihan.
          </p>
        </div>
      </div>

      {/* Workshop Session Info Card */}
      <div className="bg-[#0B1F3A] text-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase font-bold text-cyan-400 tracking-wider">
            <Sparkles className="w-3 h-3" />
            Active Workshop Session
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white leading-snug">
            BIA Validation Session: Kluster Operasi Settlement, Treasury & IT
          </h2>
          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 pt-0.5 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              18 Februari 2025 • 09:00 - 16:30 WIB
            </span>
            <span className="flex items-center gap-1.5">
              <Users2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              Fasilitator: Sarah Wijaya, MBCI & Dr. Hendra Gunawan
            </span>
          </div>
        </div>

        <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-800/90 rounded-lg border border-slate-700/80 shrink-0 self-start md:self-auto">
          <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Status Sesi</div>
          <div className="text-emerald-400 font-bold text-xs sm:text-sm mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            In Progress & Documented
          </div>
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left Column: Process List (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm sm:text-base text-slate-800">Pilih Proses untuk Validasi</h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              {filteredProcesses.length} Proses
            </span>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kode atau nama proses..."
              value={procSearchQuery}
              onChange={(e) => setProcSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#00A9CE]/30 focus:border-[#00A9CE] transition-all"
            />
          </div>

          {/* Process List Items */}
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-0.5 scrollbar-thin">
            {filteredProcesses.map((proc) => {
              const isSelected = proc.id === selectedProc?.id;
              const isValidated = proc.status === 'Validated';

              return (
                <div
                  key={proc.id}
                  onClick={() => setSelectedProcessId(proc.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-cyan-50/70 border-[#00A9CE] shadow-xs ring-1 ring-[#00A9CE]'
                      : 'bg-white hover:bg-slate-50/90 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="font-mono text-[11px] font-semibold text-[#00A9CE]">{proc.code}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        isValidated
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {proc.status}
                    </span>
                  </div>
                  <div className="font-semibold text-xs sm:text-sm text-slate-800 mt-1 leading-snug line-clamp-2">
                    {proc.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">{proc.unitName}</div>
                </div>
              );
            })}

            {filteredProcesses.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-500">
                Tidak ada proses yang sesuai pencarian.
              </div>
            )}
          </div>
        </div>

        {/* Center & Right Columns: Validation Form (8 cols on lg) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4 sm:space-y-5">
          {/* Active Process Title & Tier Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 border-b border-slate-100 pb-3">
            <div className="space-y-0.5 min-w-0 flex-1">
              <span className="font-mono text-[11px] font-bold text-[#00A9CE] uppercase tracking-wide">
                {selectedProc.code}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug break-words">
                {selectedProc.name}
              </h2>
              <div className="text-xs text-slate-500">
                Unit / Divisi: <span className="text-slate-700 font-medium">{selectedProc.unitName || 'Divisi Settlement & Kliring'}</span>
              </div>
            </div>
            <div className="shrink-0 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 font-semibold border border-rose-200 rounded-lg text-xs">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>{selectedProc.criticalityTier || 'Tier 1 — Mission Critical'}</span>
              </span>
            </div>
          </div>

          {/* 4 Metric Parameter Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-0.5">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">MTPD Disetujui</span>
              </div>
              <div className="font-bold text-slate-900 text-sm sm:text-base mt-0.5">
                {selectedProc.mtpd || '4 Hours'}
              </div>
            </div>

            <div className="p-3 bg-cyan-50/40 rounded-xl border border-cyan-200/60">
              <div className="flex items-center gap-1.5 text-cyan-800 text-[11px] font-semibold uppercase tracking-wider mb-0.5">
                <Target className="w-3 h-3 text-cyan-600 shrink-0" />
                <span className="truncate">Target RTO</span>
              </div>
              <div className="font-bold text-cyan-900 text-sm sm:text-base mt-0.5">
                {selectedProc.rto || '2 Hours'}
              </div>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-0.5">
                <Timer className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">Target RPO</span>
              </div>
              <div className="font-bold text-slate-900 text-sm sm:text-base mt-0.5">
                {selectedProc.rpo || '15 Minutes'}
              </div>
            </div>

            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/70">
              <div className="flex items-center gap-1.5 text-amber-800 text-[11px] font-semibold uppercase tracking-wider mb-0.5">
                <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                <span className="truncate">SPOF Risk</span>
              </div>
              <div className="font-bold text-amber-900 text-sm sm:text-base mt-0.5">
                {selectedProc.spofFlag ? 'Detected' : 'None'}
              </div>
            </div>
          </div>

          {/* Workshop Notes / Minutes */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-xs sm:text-sm text-slate-800">
              Catatan Workshop & Notulensi Kesepakatan (Workshop Minutes):
            </label>
            <textarea
              rows={3}
              value={workshopNotes}
              onChange={(e) => setWorkshopNotes(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#00A9CE]/30 focus:border-[#00A9CE] transition-all bg-white"
              placeholder="Tuliskan butir kesepakatan, instruksi mitigasi, dan komitmen stakeholder..."
            />
          </div>

          {/* Decision Radio Options */}
          <div className="space-y-2">
            <label className="block font-semibold text-xs sm:text-sm text-slate-800">
              Keputusan Validasi Sesi:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={() => setDecision('Validated')}
                className={`p-2.5 sm:p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 text-xs sm:text-sm font-semibold transition-all text-left ${
                  decision === 'Validated'
                    ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 shadow-xs ring-1 ring-emerald-400'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    decision === 'Validated' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                  }`}
                >
                  {decision === 'Validated' && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                </div>
                <span>Validated (Disetujui)</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision('Need Revision')}
                className={`p-2.5 sm:p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 text-xs sm:text-sm font-semibold transition-all text-left ${
                  decision === 'Need Revision'
                    ? 'bg-amber-50/90 border-amber-500 text-amber-950 shadow-xs ring-1 ring-amber-400'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    decision === 'Need Revision' ? 'border-amber-600 bg-amber-600' : 'border-slate-300'
                  }`}
                >
                  {decision === 'Need Revision' && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                </div>
                <span>Need Revision</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision('Escalated')}
                className={`p-2.5 sm:p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 text-xs sm:text-sm font-semibold transition-all text-left ${
                  decision === 'Escalated'
                    ? 'bg-rose-50/90 border-rose-500 text-rose-950 shadow-xs ring-1 ring-rose-400'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    decision === 'Escalated' ? 'border-rose-600 bg-rose-600' : 'border-slate-300'
                  }`}
                >
                  {decision === 'Escalated' && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                </div>
                <span>Escalate to Board</span>
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              onClick={handleValidate}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#0B1F3A] hover:bg-[#133C67] active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Simpan Keputusan Validasi Workshop</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
