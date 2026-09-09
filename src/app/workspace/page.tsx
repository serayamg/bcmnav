'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import {
  Columns3,
  Search,
  Building,
  Layers,
  FileSpreadsheet,
  Users2,
  Network,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  FileText,
  ShieldAlert,
  Server,
  Activity,
  CheckCircle,
  UserCheck,
  Plus,
  Download,
  Printer,
  Calendar,
  DollarSign,
  AlertCircle,
  Check,
  Radio,
  FileCheck2,
  Cpu,
  Globe,
  Lock,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function ConsultantWorkspacePage() {
  const { processes, units, documents, stakeholders, issues, setIssues, addAuditLog } = useBcm();
  const [selectedProcessId, setSelectedProcessId] = useState(processes[0]?.id || 'proc-01');
  const [activeRightTab, setActiveRightTab] = useState<'docs' | 'stk' | 'dep' | 'issues'>('docs');
  const [searchLeft, setSearchLeft] = useState('');
  const [tierFilter, setTierFilter] = useState<'ALL' | 'Tier 1' | 'Tier 2' | 'SPOF'>('ALL');

  // Quick Issue Form in Right Pane
  const [showAddIssue, setShowAddIssue] = useState(false);
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueSeverity, setNewIssueSeverity] = useState<'Critical' | 'High' | 'Medium'>('High');
  const [newIssueAction, setNewIssueAction] = useState('');

  // Consultant Quick Note in Right Pane
  const [consultantQuickNote, setConsultantQuickNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const selectedProc = processes.find((p) => p.id === selectedProcessId) || processes[0];
  const unitDocs = documents.filter((d) => d.unitId === selectedProc?.unitId);
  const unitStakeholders = stakeholders.filter((s) => s.unitId === selectedProc?.unitId);
  
  // Match issues by process name or unit name so the consultant sees contextual issues
  const procIssues = issues.filter(
    (i) => i.processName === selectedProc?.name || i.unitName === selectedProc?.unitName
  );

  const filteredProcesses = processes.filter((proc) => {
    const matchesSearch =
      proc.name.toLowerCase().includes(searchLeft.toLowerCase()) ||
      proc.code.toLowerCase().includes(searchLeft.toLowerCase()) ||
      proc.unitName.toLowerCase().includes(searchLeft.toLowerCase());

    if (tierFilter === 'Tier 1') {
      return matchesSearch && (proc.criticalityTier?.includes('Tier 1') || proc.criticalityTier?.includes('Tier-1'));
    }
    if (tierFilter === 'Tier 2') {
      return matchesSearch && proc.criticalityTier?.includes('Tier 2');
    }
    if (tierFilter === 'SPOF') {
      return matchesSearch && proc.spofFlag;
    }
    return matchesSearch;
  });

  const handleSaveIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssueTitle) return;

    const newIssue = {
      id: `iss-${Date.now()}`,
      code: `ISS-00${issues.length + 1}`,
      unitName: selectedProc.unitName,
      processName: selectedProc.name,
      title: newIssueTitle,
      description: `Temuan asesmen konsultan saat triase workspace pada proses ${selectedProc.name}.`,
      severity: newIssueSeverity,
      owner: selectedProc.processOwnerName || 'Unit Head Terkait',
      targetDate: '2025-04-15',
      status: 'Open',
      actionPlan: newIssueAction || 'Segera diskusikan pada BIA Validation Workshop.',
      consultantNotes: 'Dicatat dari Consultant Multi-Pane Workspace.',
    };

    setIssues((prev) => [newIssue, ...prev]);
    addAuditLog('LOG_ISSUE', 'WORKSPACE', selectedProc.code, `Temuan baru dicatat: ${newIssueTitle} (${newIssueSeverity})`);
    setNewIssueTitle('');
    setNewIssueAction('');
    setShowAddIssue(false);
  };

  const handleSaveQuickNote = () => {
    if (!consultantQuickNote.trim()) return;
    addAuditLog(
      'CONSULTANT_NOTE',
      'WORKSPACE',
      selectedProc.code,
      `Catatan Konsultan untuk ${selectedProc.name}: ${consultantQuickNote}`
    );
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Workspace Subheader */}
      <div className="bg-[#0B1F3A] text-white px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#00A9CE]/20 border border-[#00A9CE]/40 flex items-center justify-center text-cyan-300 shadow-sm">
            <Columns3 className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-sm sm:text-base tracking-wide text-white">
                CONSULTANT MULTI-PANE WORKSPACE
              </span>
              <span className="text-xs bg-[#00A9CE]/25 text-cyan-300 font-mono font-bold px-2 py-0.5 rounded border border-[#00A9CE]/40">
                3-Pane Live Triase
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ISO 22301:2019 & ISO 22317 Standard
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
          <span className="hidden sm:inline text-slate-400">Konsultan BCM Aktif:</span>
          <span className="font-bold text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
            Sarah Wijaya, MBCI
          </span>
          <button
            onClick={() => window.print()}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white rounded-lg border border-slate-700 flex items-center gap-1.5 font-bold transition-all cursor-pointer"
            title="Cetak Lembar Triase Eksekutif"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Cetak Brief</span>
          </button>
        </div>
      </div>

      {/* 3-Pane Workspace Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#F4F6F8]">
        {/* PANEL KIRI (Left): Unit & Process Selector */}
        <aside className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden shadow-sm">
          <div className="p-3.5 border-b border-slate-200 bg-slate-50 space-y-2.5 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-black tracking-wider text-slate-500">
                Panel Kiri: Navigator
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900">
                {filteredProcesses.length} Proses
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kode, proses, atau divisi..."
                value={searchLeft}
                onChange={(e) => setSearchLeft(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00A9CE]"
              />
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {(['ALL', 'Tier 1', 'Tier 2', 'SPOF'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTierFilter(t)}
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                    tierFilter === t
                      ? 'bg-[#0B1F3A] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 space-y-2 overflow-y-auto flex-1">
            {filteredProcesses.map((proc) => {
              const isSelected = proc.id === selectedProcessId;
              const isTier1 = proc.criticalityTier?.includes('Tier 1') || proc.criticalityTier?.includes('Tier-1');
              const isValidated = proc.status === 'Validated' || proc.status === 'Approved';

              return (
                <button
                  key={proc.id}
                  onClick={() => setSelectedProcessId(proc.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-50 to-sky-50/80 border-[#00A9CE] shadow-md ring-1 ring-cyan-400'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isValidated ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                      <span className={`font-mono text-xs font-black ${isSelected ? 'text-cyan-900' : 'text-slate-600'}`}>
                        {proc.code}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {proc.spofFlag && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                          SPOF
                        </span>
                      )}
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isTier1
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {proc.criticalityTier?.split('—')[0]?.trim() || 'Tier 2'}
                      </span>
                    </div>
                  </div>
                  <div className={`font-black text-sm leading-snug line-clamp-2 ${isSelected ? 'text-slate-950' : 'text-slate-800'}`}>
                    {proc.name}
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mt-1 flex items-center justify-between">
                    <span className="truncate max-w-[150px]">{proc.unitName}</span>
                    <span className="font-mono text-cyan-800 font-bold shrink-0">RTO: {proc.rto || '2h'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* PANEL TENGAH (Center): Current Assessment View & ISO 22301 Core Analysis */}
        <main className="flex-1 bg-white border-r border-slate-200 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {/* Header Detail: Responsive & Executive Card Banner */}
          <div className="bg-gradient-to-br from-slate-50/90 via-white to-cyan-50/20 rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5">
            {/* Top row: Badges on left, CTA Button on right (adapts gracefully on mobile) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-black text-cyan-900 bg-cyan-100/70 border border-cyan-300 px-2.5 py-1 rounded-lg shadow-2xs">
                  {selectedProc?.code}
                </span>
                <span className="text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                  {selectedProc?.criticalityTier || 'Tier 1 — Mission Critical'}
                </span>
                <span className="text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Status: {selectedProc?.status || 'Validated'}
                </span>
                {selectedProc?.spofFlag && (
                  <span className="text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                    SPOF
                  </span>
                )}
              </div>

              {/* Action Button: Sleek and touch-friendly */}
              <Link
                href={`/bia/${selectedProc?.id || 'proc-01'}`}
                className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-[#00A9CE] to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 text-xs sm:text-sm font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all active:scale-[0.98] shrink-0 cursor-pointer"
              >
                <span>Buka Wizard BIA</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
              </Link>
            </div>

            {/* Title & Metadata row */}
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-snug break-words">
                {selectedProc?.name}
              </h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/70">
                  <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  {selectedProc?.unitName}
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                  Process Owner: <strong className="text-slate-800 font-semibold">{selectedProc?.processOwnerName}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* 4 Recovery Objectives Row (ISO 22301 Clause 8.2.2 Core Parameters) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
            <div className="p-4 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-sm transition-all">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> RTO Disetujui
              </span>
              <div className="font-black text-slate-900 text-xl sm:text-2xl mt-1.5">
                {selectedProc?.rto || '1 Hour'}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Target waktu pemulihan operasional</p>
            </div>

            <div className="p-4 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-sm transition-all">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> MTPD / MAO
              </span>
              <div className="font-black text-slate-900 text-xl sm:text-2xl mt-1.5">
                {selectedProc?.mtpd || '3 Hours'}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Batas toleransi downtime maksimal</p>
            </div>

            <div className="p-4 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-sm transition-all">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" /> RPO Target
              </span>
              <div className="font-black text-slate-900 text-xl sm:text-2xl mt-1.5">
                {selectedProc?.rpo || 'Real Time'}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Toleransi kehilangan data transaksi</p>
            </div>

            <div className="p-4 bg-cyan-50/50 hover:bg-cyan-50/80 rounded-2xl border border-cyan-200 shadow-sm transition-all">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" /> MBCO (Min Capacity)
              </span>
              <div className="font-black text-cyan-950 text-xl sm:text-2xl mt-1.5">
                50% Normal
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">Level layanan minimum darurat</p>
            </div>
          </div>

          {/* Operational Scope & Regulatory Mandates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-600" />
                <span>Aktivitas Utama & Cakupan Operasional</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {selectedProc?.keyActivities || selectedProc?.description}
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>SLA & Regulasi Acuan (ISO 22301 Cl. 8.2.2)</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium space-y-1.5">
                <div>
                  <strong className="text-slate-900 font-bold">Ketentuan SLA: </strong>
                  {selectedProc?.slaRequirement || 'Uptime 99.95%, Response time < 1.5 detik.'}
                </div>
                <div>
                  <strong className="text-slate-900 font-bold">Mandat Regulasi: </strong>
                  <span className="text-cyan-900 font-semibold">{selectedProc?.regulatoryReq || 'POJK No. 11/POJK.03/2022 & Peraturan BI Sistem Pembayaran'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Peak Period, Workaround & SPOF Diagnosis Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Waktu Kritis & Volume Transaksi</span>
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-slate-700 font-medium">
                <div>
                  <strong className="text-slate-900 font-bold">Peak Period: </strong>
                  {selectedProc?.peakPeriod || 'Akhir bulan (25-30), tanggal gajian & cut-off harian 15:00-17:00 WIB'}
                </div>
                <div>
                  <strong className="text-slate-900 font-bold">Jam Operasi: </strong>
                  {selectedProc?.operatingHours || '24 Jam x 7 Hari (24/7 Realtime)'}
                </div>
                <div>
                  <strong className="text-slate-900 font-bold">Estimasi Volume: </strong>
                  {selectedProc?.transactionVolume || '1.200.000 transaksi/hari • Nilai transaksi harian > Rp 85 Triliun'}
                </div>
              </div>
            </div>

            {/* SPOF Diagnosis Card */}
            <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm space-y-2 ${
              selectedProc?.spofFlag ? 'bg-amber-50/70 border-amber-300' : 'bg-emerald-50/50 border-emerald-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${selectedProc?.spofFlag ? 'text-amber-600' : 'text-emerald-600'}`} />
                  <span>Single Point of Failure (SPOF) Risk</span>
                </div>
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                  selectedProc?.spofFlag ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {selectedProc?.spofFlag ? 'Detected (Perlu Mitigasi)' : 'Redundant / Terlindungi'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                {selectedProc?.spofFlag
                  ? 'Ketergantungan tunggal pada link switchover dan core database Silverlake tanpa failover otomatis zero-downtime.'
                  : 'Arsitektur aktif-aktif multi-zona data center telah diterapkan dengan redundansi link switchover.'}
              </p>
              <div className="text-xs font-semibold text-slate-600">
                <strong>Manual Workaround: </strong>
                {selectedProc?.manualWorkaround || 'Tidak ada manual workaround untuk volume tinggi. Wajib failover ke DRC Surabaya.'}
              </div>
            </div>
          </div>

          {/* Time-Horizon Impact Matrix (Matriks Dampak Waktu ISO 22317) */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-600" />
                <span>Matriks Eskalasi Dampak Terhadap Waktu (ISO 22317 Impact Horizon)</span>
              </div>
              <span className="text-xs font-bold text-slate-400">Skala 1 - 5 (Kritis)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Kategori Dampak</th>
                    <th className="py-2.5 px-3 text-center">1 Jam</th>
                    <th className="py-2.5 px-3 text-center">2 Jam (RTO)</th>
                    <th className="py-2.5 px-3 text-center">4 Jam (MTPD)</th>
                    <th className="py-2.5 px-3 text-center">24 Jam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-rose-500" /> Dampak Finansial Langsung
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">Rendah (&lt; Rp 50 Juta)</td>
                    <td className="py-2.5 px-3 text-center font-bold text-amber-700">Sedang (Rp 500 Juta)</td>
                    <td className="py-2.5 px-3 text-center font-bold text-rose-700 bg-rose-50/50">Tinggi (Rp 2 Miliar)</td>
                    <td className="py-2.5 px-3 text-center font-black text-rose-900 bg-rose-100/60">Kritis (&gt; Rp 10 Miliar)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Kepatuhan Regulasi (POJK/BI)
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">Pemantauan Internal</td>
                    <td className="py-2.5 px-3 text-center font-bold text-cyan-800">Batas Toleransi Normal</td>
                    <td className="py-2.5 px-3 text-center font-bold text-rose-700 bg-rose-50/50">Wajib Lapor OJK &amp; BI</td>
                    <td className="py-2.5 px-3 text-center font-black text-rose-900 bg-rose-100/60">Sanksi &amp; Audit Khusus</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-500" /> Reputasi Publik &amp; Nasabah
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">Keluhan Terisolir</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-700">Peningkatan Call Center</td>
                    <td className="py-2.5 px-3 text-center font-bold text-amber-800 bg-amber-50/50">Sorotan Media Sosial</td>
                    <td className="py-2.5 px-3 text-center font-black text-rose-900 bg-rose-100/60">Pemberitaan Nasional</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Minimum Resource Requirements (Clause 8.2.2) */}
          <div className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-700" />
              <span>Kebutuhan Sumber Daya Minimum Pemulihan (Clause 8.2.2 Minimum Resources)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Minimum Personel</span>
                <div className="font-bold text-slate-900 mt-0.5">4 Operator Shift + 2 Lead Systems Engineer</div>
                <div className="text-slate-500 text-xs mt-1">Opsi Remote VPN &amp; Onsite DRC Surabaya</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Work Area Recovery (WAR)</span>
                <div className="font-bold text-slate-900 mt-0.5">DRC Surabaya Lt. 4 &amp; Menara 2 Jakarta</div>
                <div className="text-slate-500 text-xs mt-1">12 Dedicated Seat Workstations</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Konektivitas &amp; Infrastruktur</span>
                <div className="font-bold text-slate-900 mt-0.5">2 Dedicated FO Links (Telkom &amp; Indosat)</div>
                <div className="text-slate-500 text-xs mt-1">Genset Cadangan 48 Jam &amp; Dual UPS</div>
              </div>
            </div>
          </div>
        </main>

        {/* PANEL KANAN (Right): Context Panel & Interactive Triage Inspector */}
        <aside className="w-full lg:w-88 xl:w-96 bg-white flex flex-col shrink-0 overflow-hidden shadow-sm">
          {/* Tabs Bar */}
          <div className="bg-slate-100 p-1.5 border-b border-slate-200 flex items-center justify-between text-xs sm:text-sm shrink-0">
            <button
              onClick={() => setActiveRightTab('docs')}
              className={`flex-1 py-2 font-bold rounded-xl transition-all cursor-pointer text-center ${
                activeRightTab === 'docs' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Docs ({unitDocs.length})
            </button>
            <button
              onClick={() => setActiveRightTab('stk')}
              className={`flex-1 py-2 font-bold rounded-xl transition-all cursor-pointer text-center ${
                activeRightTab === 'stk' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stakeholder ({unitStakeholders.length})
            </button>
            <button
              onClick={() => setActiveRightTab('dep')}
              className={`flex-1 py-2 font-bold rounded-xl transition-all cursor-pointer text-center ${
                activeRightTab === 'dep' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dependencies (4)
            </button>
            <button
              onClick={() => setActiveRightTab('issues')}
              className={`flex-1 py-2 font-bold rounded-xl transition-all cursor-pointer text-center ${
                activeRightTab === 'issues' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Issues ({procIssues.length})
            </button>
          </div>

          {/* Right Panel Body */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3.5">
            {/* DOCS TAB */}
            {activeRightTab === 'docs' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase font-black tracking-wider text-slate-500">
                    Dokumen Terkait Unit Kerja
                  </span>
                  <span className="text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                    {selectedProc?.unitName}
                  </span>
                </div>
                {unitDocs.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    Belum ada dokumen yang terhubung dengan unit ini.
                  </div>
                ) : (
                  unitDocs.map((d) => (
                    <div key={d.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm space-y-1.5 hover:border-cyan-300 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-black text-cyan-800">{d.code}</span>
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {d.status}
                        </span>
                      </div>
                      <div className="font-bold text-sm text-slate-900 leading-snug">{d.name}</div>
                      <div className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                        {d.keyFindings || d.description}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200">
                        <span>v{d.version} • {d.confidentiality}</span>
                        <span className="text-cyan-700 font-bold">Kelengkapan: {d.completeness || 85}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* STAKEHOLDER TAB */}
            {activeRightTab === 'stk' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase font-black tracking-wider text-slate-500">
                    Stakeholder &amp; PIC Insiden
                  </span>
                </div>
                {unitStakeholders.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    Belum ada stakeholder terdaftar untuk unit ini.
                  </div>
                ) : (
                  unitStakeholders.map((s) => (
                    <div key={s.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm space-y-1 hover:border-cyan-300 transition-colors">
                      <div className="font-black text-sm text-slate-900">{s.name}</div>
                      <div className="text-xs font-semibold text-slate-600">{s.position}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-cyan-900 font-bold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                          Peran: {s.bcmRole}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{s.email}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* DEPENDENCIES TAB */}
            {activeRightTab === 'dep' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase font-black tracking-wider text-slate-500">
                    Peta Ketergantungan Kritis
                  </span>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    Upstream &amp; Downstream
                  </span>
                </div>

                <div className="p-3.5 bg-rose-50/80 rounded-2xl border border-rose-300 shadow-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-rose-700">Aplikasi Primer (Hulu)</span>
                    <span className="text-xs font-black text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">SPOF ALERT</span>
                  </div>
                  <div className="font-black text-sm text-rose-950">Core Banking System (Silverlake Axis)</div>
                  <div className="text-xs text-rose-800 font-medium leading-relaxed">
                    Ketergantungan tunggal database transaksi nasabah • Waktu failover teruji: 45 menit.
                  </div>
                </div>

                <div className="p-3.5 bg-cyan-50/70 rounded-2xl border border-cyan-300 shadow-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-cyan-800">Switch Jaringan ATM / Debit</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">Dual Routing</span>
                  </div>
                  <div className="font-black text-sm text-slate-900">Switching Jaringan Prima &amp; ALTO</div>
                  <div className="text-xs text-slate-600 font-medium leading-relaxed">
                    Koneksi redundan melalui dua sirkuit fiber optic terpisah ke Data Center Serpong.
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-500">Layanan Hilir (Downstream)</span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full">Terdampak</span>
                  </div>
                  <div className="font-black text-sm text-slate-900">Mobile Banking, Merchant EDC &amp; Teller</div>
                  <div className="text-xs text-slate-600 font-medium leading-relaxed">
                    Seluruh kanal pembayaran nasabah terhenti jika switch transaksi mengalami outage.
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-500">Kemitraan Vendor Kritis</span>
                    <span className="text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full">SLA 99.9%</span>
                  </div>
                  <div className="font-black text-sm text-slate-900">PT Rintis Sejahtera &amp; Telkom Indonesia</div>
                  <div className="text-xs text-slate-600 font-medium leading-relaxed">
                    SLA response time insiden darurat 15 menit dengan dedicated TAM support.
                  </div>
                </div>
              </div>
            )}

            {/* ISSUES TAB */}
            {activeRightTab === 'issues' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase font-black tracking-wider text-slate-500">
                    Daftar Isu &amp; Rencana Tindak Lanjut
                  </span>
                  <button
                    onClick={() => setShowAddIssue(!showAddIssue)}
                    className="text-xs font-bold text-cyan-700 hover:text-cyan-900 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Catat Temuan</span>
                  </button>
                </div>

                {/* Inline Add Issue Form */}
                {showAddIssue && (
                  <form onSubmit={handleSaveIssue} className="p-3.5 bg-cyan-50/60 rounded-2xl border border-cyan-300 shadow-xs space-y-2.5">
                    <div className="font-bold text-xs text-cyan-950">Catat Temuan Konsultan Baru</div>
                    <input
                      type="text"
                      placeholder="Judul isu / kesenjangan BCM..."
                      value={newIssueTitle}
                      onChange={(e) => setNewIssueTitle(e.target.value)}
                      required
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                    <div className="flex items-center gap-2">
                      <select
                        value={newIssueSeverity}
                        onChange={(e) => setNewIssueSeverity(e.target.value as any)}
                        className="p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                      >
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Rencana tindak lanjut..."
                        value={newIssueAction}
                        onChange={(e) => setNewIssueAction(e.target.value)}
                        className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddIssue(false)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-[#0B1F3A] text-white text-xs font-bold rounded-md shadow-xs"
                      >
                        Simpan Isu
                      </button>
                    </div>
                  </form>
                )}

                {procIssues.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    Tidak ada isu terbuka untuk proses atau unit ini.
                  </div>
                ) : (
                  procIssues.map((i) => (
                    <div key={i.id} className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-300 shadow-sm space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-black text-amber-900">{i.code}</span>
                        <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                          i.severity === 'Critical'
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}>
                          {i.severity}
                        </span>
                      </div>
                      <div className="font-black text-sm text-slate-950 leading-snug">{i.title}</div>
                      <div className="text-xs text-slate-700 leading-relaxed font-medium bg-white/70 p-2.5 rounded-xl border border-amber-200/80">
                        <strong className="text-amber-950 font-bold">Rencana Tindak Lanjut: </strong>
                        {i.actionPlan}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Quick Consultant Audit Note Footer */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-600" />
                  Catatan Telaah Cepat Konsultan
                </span>
                {noteSaved && (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Tersimpan ke Audit Trail!
                  </span>
                )}
              </div>
              <textarea
                rows={2}
                placeholder="Tuliskan catatan konsultasi, temuan wawancara, atau pengingat sesi..."
                value={consultantQuickNote}
                onChange={(e) => setConsultantQuickNote(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:border-[#00A9CE] transition-all"
              />
              <button
                onClick={handleSaveQuickNote}
                className="w-full py-1.5 bg-[#0B1F3A] hover:bg-[#133C67] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Simpan Catatan ke Log
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
