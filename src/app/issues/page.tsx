'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  Building,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Flame,
  FileEdit,
  Check,
  X,
  Sparkles,
  Layers,
} from 'lucide-react';

export default function IssuesPage() {
  const { issues, setIssues, addAuditLog } = useBcm();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [owner, setOwner] = useState('');
  const [unitName, setUnitName] = useState('Divisi Operasi & IT');
  const [actionPlan, setActionPlan] = useState('');
  const [consultantNotes, setConsultantNotes] = useState('');
  const [targetDate, setTargetDate] = useState('2025-04-15');

  const filteredIssues = issues.filter((i) => {
    const matchesSearch =
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;
    const matchesSeverity = severityFilter === 'ALL' || i.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const handleAddIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newIssue = {
      id: `iss-${Date.now()}`,
      code: `ISS-${Math.floor(Math.random() * 900 + 100)}`,
      unitName: unitName || '',
      processName: '',
      title,
      description,
      severity,
      owner: owner || 'PIC Unit Terkait',
      targetDate: targetDate || '2025-04-15',
      status: 'Open',
      actionPlan: actionPlan || 'Rencana perbaikan belum dirumuskan.',
      consultantNotes: consultantNotes || 'Dicatat dari temuan wawancara BIA konsultan.',
    };

    setIssues((prev) => [newIssue, ...prev]);
    addAuditLog('CREATE_ISSUE', 'ISSUE', newIssue.code, `Mendaftarkan temuan/issue: ${title} (${severity})`);
    setShowAddModal(false);
    setTitle('');
    setDescription('');
    setActionPlan('');
    setConsultantNotes('');
    setOwner('');
  };

  const updateIssueStatus = (issueId: string, newStatus: string) => {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === issueId ? { ...iss, status: newStatus } : iss))
    );
    addAuditLog('UPDATE_ISSUE', 'ISSUE', issueId, `Status temuan diubah menjadi ${newStatus}`);
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-lg bg-rose-100 text-rose-950 border border-rose-300 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            Critical Severity
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-lg bg-amber-100 text-amber-950 border border-amber-300 shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            High Severity
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-blue-100 text-blue-950 border border-blue-300">
            Medium Severity
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-300">
            Low Severity
          </span>
        );
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300';
      case 'In Progress':
        return 'bg-sky-100 text-sky-950 border-sky-300';
      case 'Waiting Client':
        return 'bg-purple-100 text-purple-950 border-purple-300';
      default:
        return 'bg-amber-100 text-amber-950 border-amber-300';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
              Module 10 — Remediation & Governance
            </span>
            <span className="bg-amber-100 text-amber-950 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
              Issue & Action Tracker
            </span>
            <span className="bg-blue-100 text-blue-950 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-300">
              ISO 22301 Clause 10.1
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Register Temuan, Kesenjangan & Rencana Tindak Lanjut
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
            Pencatatan gap operasional, risiko SPOF, dan tindakan korektif yang wajib diselesaikan sebelum BCM Strategy sign-off.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-[#0B1F3A] hover:bg-[#133C67] text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-md transition-all shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          <span>Tambah Issue / Temuan</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari issue, kode, deskripsi gap, atau PIC penanggung jawab..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:border-[#00A9CE] focus:ring-1 focus:ring-[#00A9CE] placeholder:text-slate-400 bg-slate-50/50 hover:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mr-1">
              Status:
            </span>
            {['ALL', 'Open', 'In Progress', 'Waiting Client', 'Resolved'].map((st) => (
              <button
                type="button"
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  statusFilter === st
                    ? 'bg-[#0B1F3A] text-white shadow-sm ring-2 ring-[#0B1F3A]/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block shrink-0" />

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mr-1">
              Severity:
            </span>
            {['ALL', 'Critical', 'High'].map((sev) => (
              <button
                type="button"
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  severityFilter === sev
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Issues Cards List */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
            Tidak ada temuan atau rencana perbaikan yang cocok dengan kriteria filter saat ini.
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Header row of card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-black text-amber-950 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-300 shadow-sm">
                    {issue.code}
                  </span>
                  {getSeverityBadge(issue.severity)}
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    {issue.unitName}
                  </span>
                </div>

                {/* Status Dropdown / Action */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-slate-500">Ubah Status:</span>
                  <select
                    value={issue.status}
                    onChange={(e) => updateIssueStatus(issue.id, e.target.value)}
                    className={`text-xs font-extrabold px-3 py-1 rounded-xl border focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer ${getStatusBadge(
                      issue.status
                    )}`}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Waiting Client">Waiting Client</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                  {issue.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {issue.description}
                </p>
              </div>

              {/* Action Plan & Consultant Notes Split Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <FileEdit className="w-3.5 h-3.5 text-slate-700" />
                    <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">
                      Rencana Tindak Lanjut (Action Plan):
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {issue.actionPlan}
                  </p>
                </div>

                <div className="p-4 bg-cyan-50/60 rounded-2xl border border-cyan-200/90 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-800" />
                    <span className="font-extrabold text-cyan-950 text-xs uppercase tracking-wide">
                      Catatan Rekomendasi Konsultan BCM:
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-cyan-950 leading-relaxed font-medium">
                    {issue.consultantNotes}
                  </p>
                </div>
              </div>

              {/* Card Meta Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-400">Penanggung Jawab (Owner):</span>
                  <strong className="text-slate-900 font-bold text-sm">{issue.owner}</strong>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400 font-sans font-semibold">Target Selesai:</span>
                  <strong className="text-slate-900 font-bold">{issue.targetDate}</strong>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Issue Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-xs sm:text-sm space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Tambah Temuan / Kesenjangan BCM Baru
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Catat gap operasional, temuan audit BIA, atau risiko SPOF vendor.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddIssue} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-800 text-xs mb-1">
                  Judul Temuan / Issue:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Belum ada kontrak SLA DRC Surabaya dengan vendor jaringan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#00A9CE]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1">
                    Tingkat Severity:
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white font-semibold"
                  >
                    <option value="Critical">Critical (Blocker Pemulihan)</option>
                    <option value="High">High (Perlu Mitigasi Segera)</option>
                    <option value="Medium">Medium (Peningkatan Operasional)</option>
                    <option value="Low">Low (Pemberitahuan Minor)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1">
                    Unit Kerja Terdampak:
                  </label>
                  <input
                    type="text"
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    placeholder="e.g. Divisi IT Infrastructure"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1">
                    Penanggung Jawab (Owner PIC):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Eko Prasetyo (VP IT Infrastructure)"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1">
                    Target Tanggal Penyelesaian:
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 text-xs mb-1">
                  Deskripsi Faktual Gap / Kesenjangan:
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan kondisi riil di lapangan, hasil load test, atau dampak potensial jika insiden terjadi..."
                  className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#00A9CE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 text-xs mb-1">
                  Rencana Tindak Lanjut (Action Plan Perbaikan):
                </label>
                <textarea
                  rows={2}
                  value={actionPlan}
                  onChange={(e) => setActionPlan(e.target.value)}
                  placeholder="Langkah teknis atau kebijakan yang disepakati untuk menutup gap..."
                  className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#00A9CE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 text-xs mb-1">
                  Catatan Rekomendasi Konsultan:
                </label>
                <textarea
                  rows={2}
                  value={consultantNotes}
                  onChange={(e) => setConsultantNotes(e.target.value)}
                  placeholder="Rekomendasi independen dari konsultan BCM pendamping..."
                  className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#00A9CE]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-sm shadow-md transition-all active:scale-95"
                >
                  Simpan Temuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

