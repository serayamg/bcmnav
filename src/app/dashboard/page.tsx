'use client';

import React from 'react';
import Link from 'next/link';
import { useBcm } from '@/lib/store';
import {
  FileSpreadsheet,
  Users2,
  Layers3,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Building,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function DashboardPage() {
  const { currentProject, documents, stakeholders, processes, issues } = useBcm();

  // Metrics
  const totalDocs = documents.length;
  const acceptedDocs = documents.filter((d) => d.status === 'Accepted').length;
  const docPercent = totalDocs > 0 ? Math.round((acceptedDocs / totalDocs) * 100) : 0;

  const totalProcs = processes.length;
  const validatedProcs = processes.filter((p) => p.status === 'Validated' || p.status === 'Approved').length;
  const inAssessmentProcs = processes.filter((p) => {
    const status = p.status as string;
    return status === 'In Assessment' || status === 'Draft' || status === 'In Progress';
  }).length;
  const readyForBiaProcs = processes.filter((p) => p.status === 'Ready for BIA' || p.status === 'Identified' || !p.status).length;
  const biaPercent = totalProcs > 0 ? Math.round((validatedProcs / totalProcs) * 100) : 0;

  const criticalProcs = processes.filter((p) => p.isCriticalFlag).length;
  const openIssues = issues.filter((i) => i.status === 'Open' || i.status === 'In Progress').length;
  const revisionDoc = documents.find((d) => {
    const status = d.status as string;
    return status === 'Needs Revision' || status === 'Rejected';
  });

  // Chart Data: BIA Status Breakdown (Dynamically derived from database processes)
  const biaStatusData = [
    { name: 'Validated / Approved', value: validatedProcs, color: '#10B981' },
    { name: 'In Assessment', value: inAssessmentProcs, color: '#00A9CE' },
    { name: 'Ready for BIA', value: readyForBiaProcs, color: '#F59E0B' },
  ];

  // Helper for categorizing RTO from database
  const getRtoCategory = (rto?: string): '≤ 1 Jam' | '2 Jam' | '4 Jam' | '24 Jam' | '≥ 48 Jam' | null => {
    if (!rto) return null;
    const s = rto.toLowerCase().trim();
    if (
      s.includes('15 min') ||
      s.includes('30 min') ||
      s.includes('1 hour') ||
      s.includes('1 jam') ||
      s.startsWith('≤ 1') ||
      s.startsWith('<= 1') ||
      s === '1h' ||
      s === '<1h'
    ) {
      return '≤ 1 Jam';
    }
    if (s.includes('2 hour') || s.includes('2 jam') || s === '2h') {
      return '2 Jam';
    }
    if (s.includes('4 hour') || s.includes('4 jam') || s === '4h') {
      return '4 Jam';
    }
    if (
      s.includes('8 hour') ||
      s.includes('8 jam') ||
      s.includes('24 hour') ||
      s.includes('24 jam') ||
      s.includes('1 day') ||
      s.includes('1 hari') ||
      s === '8h' ||
      s === '24h'
    ) {
      return '24 Jam';
    }
    if (
      s.includes('day') ||
      s.includes('hari') ||
      s.includes('week') ||
      s.includes('minggu') ||
      s.includes('48') ||
      s.includes('≥ 48') ||
      s.includes('>= 48')
    ) {
      return '≥ 48 Jam';
    }
    return null;
  };

  const rtoCounts: Record<string, number> = {
    '≤ 1 Jam': 0,
    '2 Jam': 0,
    '4 Jam': 0,
    '24 Jam': 0,
    '≥ 48 Jam': 0,
  };

  processes.forEach((p) => {
    const cat = getRtoCategory(p.rto);
    if (cat && cat in rtoCounts) {
      rtoCounts[cat]++;
    }
  });

  // Chart Data: RTO Distribution (Dynamically aggregated from database processes)
  const rtoDistribution = [
    { range: '≤ 1 Jam', count: rtoCounts['≤ 1 Jam'], color: '#DC2626' },
    { range: '2 Jam', count: rtoCounts['2 Jam'], color: '#EA580C' },
    { range: '4 Jam', count: rtoCounts['4 Jam'], color: '#F59E0B' },
    { range: '24 Jam', count: rtoCounts['24 Jam'], color: '#00A9CE' },
    { range: '≥ 48 Jam', count: rtoCounts['≥ 48 Jam'], color: '#64748B' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Project Header Banner (BY. PROJECT HOME PAGE) */}
      <div className="bg-gradient-to-r from-[#0B1F3A] via-[#133C67] to-[#0B1F3A] text-white rounded-2xl p-5 md:p-7 shadow-lg border border-slate-700/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-[#00A9CE]/20 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-cyan-400/30">
                Active BCM Engagement
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {currentProject.clientName}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1">
              {currentProject.name}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-700/80 backdrop-blur-sm">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-medium">Overall Progress</div>
              <div className="text-2xl font-bold text-cyan-400">{currentProject.completionPercent}%</div>
            </div>
            <div className="w-20 bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${currentProject.completionPercent}%` }}
              />
            </div>
            <Link
              href="/workspace"
              className="px-4 py-2 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <span>Consultant Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Milestone Stepper */}
        <div className="mt-6 pt-5 border-t border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-300">1. Setup & Org</div>
              <div className="font-bold text-emerald-300 text-xs">100% Complete</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-300">2. Stakeholder</div>
              <div className="font-bold text-emerald-300 text-xs">100% Complete</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
            <div>
              <div className="text-xs font-semibold text-slate-300">3. Document DRL</div>
              <div className="font-bold text-cyan-300 text-xs">{docPercent}% Received</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
            <div>
              <div className="text-xs font-semibold text-slate-300">4. Process & BIA</div>
              <div className="font-bold text-cyan-300 text-xs">{biaPercent}% Validated</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-300">5. Workshop</div>
              <div className="font-bold text-amber-300 text-xs">1 In Progress</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full border border-slate-500 shrink-0 flex items-center justify-center text-xs font-bold text-slate-400">
              6
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-300">6. BCM Strategy</div>
              <div className="font-bold text-slate-400 text-xs">Next Phase</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Documents */}
        <Link
          href="/documents"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Document Collection</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {acceptedDocs} <span className="text-xs text-slate-500 font-semibold">/ {totalDocs} items</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>{docPercent}% accepted by consultant</span>
          </div>
        </Link>

        {/* Card 2: Stakeholders */}
        <Link
          href="/stakeholders"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Stakeholder Register</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stakeholders.length}</div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span>{stakeholders.filter((s) => s.influenceLevel >= 4 && s.interestLevel >= 4).length} Key Decision Makers mapped</span>
          </div>
        </Link>

        {/* Card 3: Business Processes */}
        <Link
          href="/processes"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Business Processes</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers3 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {totalProcs} <span className="text-xs text-slate-500 font-semibold">processes</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-700 font-bold">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>{criticalProcs} Mission Critical (Tier 1-2)</span>
          </div>
        </Link>

        {/* Card 4: Open Issues */}
        <Link
          href="/issues"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Open Action Issues</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{openIssues}</div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-amber-800 font-bold">
            <span>{issues.filter((i) => i.severity === 'Critical').length} Critical SPOF Blocker</span>
          </div>
        </Link>
      </div>

      {/* Rules-Based Smart Consultant Insights */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Smart Consultant Advisory & Gap Findings
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">Rules Engine ISO 22301 Aligned</span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {processes.find((p) => p.spofFlag) ? (
            <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200/80">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-red-950">Single Point of Failure (SPOF) Terdeteksi</div>
                  <p className="text-xs text-red-900 mt-1.5 leading-relaxed font-normal">
                    Proses <strong>{processes.find((p) => p.spofFlag)?.code} ({processes.find((p) => p.spofFlag)?.name})</strong> memiliki ketergantungan kritis tanpa redundansi failover otomatis.
                  </p>
                  <Link
                    href="/dependencies"
                    className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-red-800 hover:underline"
                  >
                    Lihat Analisis SPOF &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-emerald-950">Status SPOF Bersih</div>
                  <p className="text-xs text-emerald-900 mt-1.5 leading-relaxed font-normal">
                    {totalProcs > 0
                      ? 'Seluruh proses bisnis yang terdaftar memiliki redundansi memadai atau tidak ada flag SPOF.'
                      : 'Belum ada proses bisnis terdaftar. Tambahkan proses untuk menjalankan analisis SPOF otomatis.'}
                  </p>
                  <Link
                    href="/processes"
                    className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline"
                  >
                    Kelola Proses &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

          {revisionDoc ? (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-amber-950">Gap Dokumen BCP vs Regulasi</div>
                  <p className="text-xs text-amber-900 mt-1.5 leading-relaxed font-normal">
                    Dokumen {revisionDoc?.code} membutuhkan revisi untuk memenuhi standar regulasi.
                  </p>
                  <Link
                    href="/documents"
                    className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:underline"
                  >
                    Lihat Review Dokumen &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-start gap-3">
                <FileSpreadsheet className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-slate-900">Kepatuhan Dokumen DRL</div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">
                    {totalDocs > 0
                      ? `${acceptedDocs} dari ${totalDocs} dokumen telah divalidasi konsultan tanpa temuan gap terbuka.`
                      : 'Belum ada daftar permintaan dokumen (DRL) aktif di database.'}
                  </p>
                  <Link
                    href="/documents"
                    className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:underline"
                  >
                    Buka Modul Dokumen &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

          {validatedProcs > 0 ? (
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-blue-950">Kesiapan Validation Workshop</div>
                  <p className="text-xs text-blue-900 mt-1.5 leading-relaxed font-normal">
                    {validatedProcs} proses telah selesai dinilai dan siap diajukan ke sesi validasi bersama Process Owner.
                  </p>
                  <Link
                    href="/workshop"
                    className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-blue-800 hover:underline"
                  >
                    Buka Workshop Board &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200/80">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-cyan-950">Kesiapan Validation Workshop</div>
                  <p className="text-xs text-cyan-900 mt-1.5 leading-relaxed font-normal">
                    Sesi validasi workshop akan dijadwalkan setelah proses bisnis dinilai melalui modul BIA Wizard.
                  </p>
                  <Link
                    href="/bia"
                    className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-cyan-800 hover:underline"
                  >
                    Buka Modul BIA &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Visual Charts: BIA Progress & RTO Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Chart 1: BIA Status */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900">Status Penyelesaian BIA</h3>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{totalProcs} Total Proses</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Progres identifikasi hingga validasi BIA</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            {totalProcs > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={biaStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {biaStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                  <Layers3 className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-700">Belum Ada Data BIA</p>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs">Grafik akan terisi otomatis setelah proses bisnis ditambahkan ke database</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3.5 border-t border-slate-100 text-xs">
            {biaStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate font-medium">{item.name}:</span>
                <span className="font-extrabold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: RTO Distribution */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900">Distribusi Recovery Time Objective (RTO)</h3>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Target Pemulihan</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Klasifikasi proses berdasarkan urgensi pemulihan</p>
          </div>

          <div className="h-48 w-full">
            {totalProcs > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rtoDistribution}>
                  <XAxis dataKey="range" tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Jumlah Proses" fill="#00A9CE" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-700">Belum Ada Distribusi RTO</p>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs">Target RTO akan terpetakan setelah pengisian BIA pada proses bisnis</p>
              </div>
            )}
          </div>

          <div className="pt-3.5 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between font-medium">
            <span>Proses dengan RTO ≤ 2 jam wajib memiliki arsitektur High Availability / DRC.</span>
            <Link href="/bia" className="text-[#00A9CE] font-bold hover:underline flex items-center gap-1 shrink-0">
              Lihat Register &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Critical Business Processes Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base md:text-lg font-bold text-slate-900">Proses Bisnis Kritis & Status BIA</h3>
            <p className="text-xs text-slate-500 mt-0.5">Daftar proses teratas yang dinilai dalam project ini</p>
          </div>
          <Link
            href="/processes"
            className="text-sm font-bold text-[#00A9CE] hover:text-cyan-600 flex items-center gap-1"
          >
            <span>Lihat Semua ({processes.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Kode & Nama Proses</th>
                <th className="py-3.5 px-4">Unit Kerja</th>
                <th className="py-3.5 px-4">Process Owner</th>
                <th className="py-3.5 px-4">RTO / MTPD</th>
                <th className="py-3.5 px-4">Criticality</th>
                <th className="py-3.5 px-4">Status BIA</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {processes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <Layers3 className="w-8 h-8 text-slate-300 mb-2" />
                      <span className="text-xs font-bold text-slate-700">Belum Ada Data Proses Bisnis</span>
                      <span className="text-[11px] text-slate-400 mt-0.5 max-w-sm">
                        Database telah dikosongkan. Silakan tambahkan proses bisnis melalui menu Proses Bisnis atau DRL.
                      </span>
                      <Link
                        href="/processes"
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs transition-colors"
                      >
                        <span>Tambah Proses Baru</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                processes.map((proc) => (
                  <tr key={proc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900 text-sm md:text-base">{proc.name}</div>
                      <div className="text-xs text-slate-600 font-mono font-bold mt-0.5">{proc.code}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-medium">{proc.unitName}</td>
                    <td className="py-4 px-4 font-bold text-slate-900">{proc.processOwnerName}</td>
                    <td className="py-4 px-4">
                      {proc.rto ? (
                        <div>
                          <div className="font-bold text-cyan-800 text-sm">RTO: {proc.rto}</div>
                          <div className="text-xs text-slate-500 font-medium">MTPD: {proc.mtpd}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic font-medium">Belum di-assess</span>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {proc.criticalityTier ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                            proc.criticalityTier.includes('Tier 1')
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : proc.criticalityTier.includes('Tier 2')
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {proc.criticalityTier.split('—')[0]}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                          proc.status === 'Validated' || proc.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : proc.status === 'In Assessment'
                            ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {proc.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <Link
                        href={`/bia/${proc.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-sm"
                      >
                        <span>{proc.status === 'Validated' ? 'Review BIA' : 'Lengkapi BIA'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
