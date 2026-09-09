'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import {
  ConsultantWorkingPaper,
  InterviewWorksheet,
  WorkingPaperStatus,
  WorkingPaperCrossReference
} from '@/types';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Layers,
  FileSpreadsheet,
  Users2,
  Activity,
  AlertTriangle,
  Smartphone,
  CheckSquare,
  Sparkles,
  Edit3,
  Eye,
  Save,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Building,
  UserCheck
} from 'lucide-react';

export default function WorkingPapersPage() {
  const {
    workingPapers,
    saveWorkingPaper,
    interviewWorksheets,
    saveInterviewWorksheet,
    createProcessFromInterview,
    processes,
    documents,
    stakeholders
  } = useBcm();

  const [activeTab, setActiveTab] = useState<'working_papers' | 'interviews' | 'cross_matrix'>('working_papers');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected Working Paper Modal
  const [selectedPaper, setSelectedPaper] = useState<ConsultantWorkingPaper | null>(null);
  const [paperModalMode, setPaperModalMode] = useState<'view' | 'edit'>('view');

  // Selected Interview (Mobile Mode)
  const [activeInterview, setActiveInterview] = useState<InterviewWorksheet | null>(null);

  // New Process from Interview Modal
  const [createProcModalOpen, setCreateProcModalOpen] = useState(false);
  const [newProcCode, setNewProcCode] = useState('');
  const [newProcName, setNewProcName] = useState('');
  const [newProcDesc, setNewProcDesc] = useState('');
  const [newProcSla, setNewProcSla] = useState('');
  const [newProcCritical, setNewProcCritical] = useState(true);

  // Filter Working Papers
  const filteredPapers = workingPapers.filter((wp) => {
    const matchSearch =
      wp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wp.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wp.objective.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || wp.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: WorkingPaperStatus) => {
    switch (status) {
      case 'Final':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-0.5 rounded font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Final</span>;
      case 'Reviewed':
        return <span className="bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs px-2 py-0.5 rounded font-semibold flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Reviewed</span>;
      case 'Prepared':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-0.5 rounded font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> Prepared</span>;
      case 'Draft':
        return <span className="bg-slate-100 text-slate-700 border border-slate-300 text-xs px-2 py-0.5 rounded font-medium">Draft</span>;
    }
  };

  const handleLaunchCreateProcess = (interview: InterviewWorksheet) => {
    setActiveInterview(interview);
    setNewProcCode(`PROC-${String(processes.length + 1).padStart(2, '0')}`);
    setNewProcName('');
    setNewProcDesc(interview.topics.map((t) => t.responses).join(' '));
    setNewProcSla('2 Jam');
    setNewProcCritical(true);
    setCreateProcModalOpen(true);
  };

  const handleExecuteCreateProcess = () => {
    if (!activeInterview || !newProcName.trim()) return;
    createProcessFromInterview(activeInterview.id, {
      code: newProcCode,
      name: newProcName,
      description: newProcDesc,
      sla: newProcSla,
      isCritical: newProcCritical
    });
    setCreateProcModalOpen(false);
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-start lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-extrabold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Module CV-CZ — Consultant Working Papers
            </span>
            <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-200 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-purple-600" />
              Mobile Touch-Optimized Interview Mode
            </span>
            <span className="bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200">
              Cross-Reference Tracing Matrix
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Kertas Kerja Konsultan & Wawancara Pemangku Kepentingan
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Dokumentasi audit trail lengkap: WP ↔ Proses Bisnis ↔ DRL ↔ Stakeholder ↔ BIA Worksheet ↔ Isu/Gap.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              const newWp: ConsultantWorkingPaper = {
                id: `WP-${Date.now().toString().slice(-4)}`,
                code: `WP-BIA-${String(workingPapers.length + 1).padStart(3, '0')}`,
                title: 'Working Paper Analisis Kebutuhan Kontinuitas Operasional',
                objective: 'Mengevaluasi kesiapan operasional divisi saat terjadi insiden',
                scope: 'Lingkup Divisi Operasional & TI',
                procedurePerformed: 'Wawancara, telaah dokumen, dan verifikasi silang BIA',
                source: 'Hasil Wawancara Pemilik Proses',
                evidence: 'Lembar Notulensi & Topologi Jaringan',
                analysis: 'Analisis gap kapasitas sistem failover dan kesiapan SDM',
                finding: 'Perlu penambahan prosedur baku saat insiden pemadaman',
                consultantConclusion: 'Sistem operasional memenuhi 70% standar BCM',
                recommendation: 'Lengkapi dokumen SOP penanganan darurat',
                preparedBy: 'Lead BCM Consultant JMA',
                date: new Date().toISOString().slice(0, 10),
                status: 'Draft',
                crossRefs: {}
              };
              saveWorkingPaper(newWp);
              setSelectedPaper(newWp);
              setPaperModalMode('edit');
            }}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Buat Kertas Kerja Baru
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('working_papers')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-lg transition-all flex items-center gap-2 ${
            activeTab === 'working_papers'
              ? 'bg-white border-t-2 border-x border-teal-600 text-teal-800 -mb-px shadow-2xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Kertas Kerja Konsultan ({workingPapers.length})
        </button>
        <button
          onClick={() => setActiveTab('interviews')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-lg transition-all flex items-center gap-2 ${
            activeTab === 'interviews'
              ? 'bg-white border-t-2 border-x border-teal-600 text-teal-800 -mb-px shadow-2xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Smartphone className="w-4 h-4 text-purple-600" />
          Wawancara Lapangan (Mobile Mode) ({interviewWorksheets.length})
        </button>
        <button
          onClick={() => setActiveTab('cross_matrix')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-lg transition-all flex items-center gap-2 ${
            activeTab === 'cross_matrix'
              ? 'bg-white border-t-2 border-x border-teal-600 text-teal-800 -mb-px shadow-2xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-600" />
          Matriks Cross-Reference Tracing
        </button>
      </div>

      {/* TAB 1: WORKING PAPERS LIST */}
      {activeTab === 'working_papers' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari judul kertas kerja, kode, atau kata kunci..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-teal-500"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto text-xs py-1.5 px-3 rounded-lg border border-slate-300 bg-white focus:outline-teal-500"
              >
                <option value="ALL">Semua Status (Draft / Prepared / Reviewed / Final)</option>
                <option value="Final">Final</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Prepared">Prepared</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Working Papers Grid */}
          <div className="space-y-3">
            {filteredPapers.map((wp) => (
              <div
                key={wp.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-4 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {wp.code}
                    </span>
                    {getStatusBadge(wp.status)}
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">Dibuat: {wp.preparedBy}</span>
                    {wp.reviewedBy && (
                      <span className="text-xs text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded font-medium">
                        Direviu: {wp.reviewedBy}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{wp.date}</span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base hover:text-teal-700 transition-colors cursor-pointer" onClick={() => { setSelectedPaper(wp); setPaperModalMode('view'); }}>
                    {wp.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    <strong>Tujuan:</strong> {wp.objective}
                  </p>
                </div>

                {/* Key Finding & Conclusion snippet */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-700">Temuan Konsultan:</span>
                    <p className="text-slate-600 line-clamp-1 mt-0.5">{wp.finding}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Rekomendasi Utama:</span>
                    <p className="text-slate-600 line-clamp-1 mt-0.5">{wp.recommendation}</p>
                  </div>
                </div>

                {/* Cross References Badges */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Terkait:</span>
                    {wp.crossRefs.processName && (
                      <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                        <Layers className="w-3 h-3" /> {wp.crossRefs.processCode || 'Proses'}
                      </span>
                    )}
                    {wp.crossRefs.documentName && (
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                        <FileSpreadsheet className="w-3 h-3" /> {wp.crossRefs.documentCode || 'Dokumen'}
                      </span>
                    )}
                    {wp.crossRefs.stakeholderName && (
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                        <Users2 className="w-3 h-3" /> {wp.crossRefs.stakeholderName}
                      </span>
                    )}
                    {wp.crossRefs.biaCode && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                        <Activity className="w-3 h-3" /> {wp.crossRefs.biaCode}
                      </span>
                    )}
                    {wp.crossRefs.issueCode && (
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {wp.crossRefs.issueCode}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedPaper(wp); setPaperModalMode('edit'); }}
                      className="text-xs text-teal-700 hover:text-teal-900 font-bold px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => { setSelectedPaper(wp); setPaperModalMode('view'); }}
                      className="text-xs text-slate-700 hover:text-slate-900 font-bold px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Detail Lengkap
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MOBILE INTERVIEWS */}
      {activeTab === 'interviews' && (
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-purple-950">Mode Wawancara Pemangku Kepentingan Berbasis Mobile</h3>
              <p className="mt-0.5 text-purple-800 leading-relaxed">
                Dirancang untuk memudahkan konsultan mencatat jawaban wawancara di smartphone saat interview tatap muka dengan
                narasumber bank. Mendukung fitur penandaan instan untuk BIA dan <strong>1-Click Pembuatan Proses Bisnis Baru</strong>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {interviewWorksheets.map((int) => (
              <div
                key={int.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                      {int.code}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{int.date}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{int.stakeholderName}</h3>
                    <p className="text-xs text-slate-500">{int.role}</p>
                    <p className="text-[11px] text-teal-700 font-semibold mt-0.5">{int.unitName}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="text-slate-600 font-medium">Topik Bahasan:</div>
                    <ul className="list-disc list-inside text-slate-500 space-y-0.5 pl-1">
                      {int.topics.map((t) => (
                        <li key={t.id} className="truncate">
                          {t.topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {int.processesDiscovered.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-700 bg-emerald-50/70 p-2 rounded">
                      <span className="font-bold">Proses Teridentifikasi:</span>{' '}
                      {int.processesDiscovered.map((p) => p.name).join(', ')}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleLaunchCreateProcess(int)}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Buat Proses Bisnis
                  </button>
                  <button
                    onClick={() => setActiveInterview(int)}
                    className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Buka Lembar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Touch-optimized active interview drawer/card if selected */}
          {activeInterview && (
            <div className="bg-white rounded-2xl border-2 border-purple-300 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                    Formulir Wawancara Aktif • {activeInterview.code}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeInterview.stakeholderName} ({activeInterview.role})
                  </h3>
                </div>
                <button
                  onClick={() => setActiveInterview(null)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg"
                >
                  Tutup Lembar Wawancara
                </button>
              </div>

              <div className="space-y-4">
                {activeInterview.topics.map((top, idx) => (
                  <div key={top.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      {top.topic}
                    </h4>
                    <div className="pl-7 space-y-2">
                      {top.questions.map((q, qIdx) => (
                        <div key={qIdx} className="text-xs text-slate-700 font-semibold bg-white p-2.5 rounded border border-slate-200">
                          Q{qIdx + 1}: {q}
                        </div>
                      ))}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600">Catatan Jawaban Narasumber:</label>
                        <textarea
                          rows={3}
                          value={top.responses}
                          onChange={(e) => {
                            const newTopics = activeInterview.topics.map((t) =>
                              t.id === top.id ? { ...t, responses: e.target.value } : t
                            );
                            const updated = { ...activeInterview, topics: newTopics };
                            setActiveInterview(updated);
                            saveInterviewWorksheet(updated);
                          }}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500 bg-white leading-relaxed"
                          placeholder="Ketik catatan langsung saat wawancara berlangsung..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CROSS REFERENCE MATRIX */}
      {activeTab === 'cross_matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-900 text-sm">Matriks Pelacakan Cross-Reference (WP ↔ PROC ↔ DOC ↔ STK ↔ BIA ↔ ISSUE)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Menjamin setiap temuan dan keputusan BIA memiliki dasar pembuktian audit yang jelas.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Kode WP</th>
                  <th className="p-3">Judul Kertas Kerja</th>
                  <th className="p-3">Proses Bisnis</th>
                  <th className="p-3">Dokumen Terkait</th>
                  <th className="p-3">Narasumber</th>
                  <th className="p-3">Lembar BIA</th>
                  <th className="p-3">Isu / Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workingPapers.map((wp) => (
                  <tr key={wp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-800">{wp.code}</td>
                    <td className="p-3 font-semibold text-slate-900 max-w-xs truncate">{wp.title}</td>
                    <td className="p-3">
                      {wp.crossRefs.processName ? (
                        <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-medium border border-teal-200">
                          {wp.crossRefs.processName}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      {wp.crossRefs.documentName ? (
                        <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-medium border border-blue-200">
                          {wp.crossRefs.documentName}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      {wp.crossRefs.stakeholderName ? (
                        <span className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded font-medium border border-purple-200">
                          {wp.crossRefs.stakeholderName}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      {wp.crossRefs.biaCode ? (
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium border border-emerald-200">
                          {wp.crossRefs.biaCode}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      {wp.crossRefs.issueCode ? (
                        <span className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded font-medium border border-rose-200">
                          {wp.crossRefs.issueCode}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE PROCESS FROM INTERVIEW MODAL */}
      {createProcModalOpen && activeInterview && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" /> Buat Proses Bisnis Baru dari Wawancara
              </h3>
              <button onClick={() => setCreateProcModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Narasumber: <strong>{activeInterview.stakeholderName}</strong> ({activeInterview.role}) • Unit: {activeInterview.unitName}
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Kode Proses:</label>
                  <input
                    type="text"
                    value={newProcCode}
                    onChange={(e) => setNewProcCode(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono mt-1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Target SLA:</label>
                  <input
                    type="text"
                    value={newProcSla}
                    onChange={(e) => setNewProcSla(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 mt-1"
                    placeholder="e.g. 2 Jam"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Nama Proses Bisnis:</label>
                <input
                  type="text"
                  value={newProcName}
                  onChange={(e) => setNewProcName(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 mt-1 font-semibold"
                  placeholder="e.g. Layanan Notifikasi Transaksi SMS / Push"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Deskripsi Temuan Wawancara:</label>
                <textarea
                  rows={3}
                  value={newProcDesc}
                  onChange={(e) => setNewProcDesc(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 mt-1"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newProcCritical}
                  onChange={(e) => setNewProcCritical(e.target.checked)}
                  className="rounded text-teal-600"
                />
                Tandai sebagai Proses Kritis (Mission Critical Tier 1)
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setCreateProcModalOpen(false)}
                className="text-xs font-semibold px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleExecuteCreateProcess}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Daftarkan ke Register Proses
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WORKING PAPER DETAIL MODAL */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {selectedPaper.code}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">{selectedPaper.title}</h3>
              </div>
              <button onClick={() => setSelectedPaper(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-700">Tujuan Analisis:</span>
                <p className="text-slate-600 mt-0.5">{selectedPaper.objective}</p>
              </div>

              <div>
                <span className="font-bold text-slate-700">Ruang Lingkup:</span>
                <p className="text-slate-600 mt-0.5">{selectedPaper.scope}</p>
              </div>

              <div>
                <span className="font-bold text-slate-700">Prosedur yang Dilakukan:</span>
                <p className="text-slate-600 mt-0.5">{selectedPaper.procedurePerformed}</p>
              </div>

              <div>
                <span className="font-bold text-slate-700">Sumber Data & Bukti (Evidence):</span>
                <p className="text-slate-600 mt-0.5">{selectedPaper.source} • {selectedPaper.evidence}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div>
                  <span className="font-bold text-slate-800">Hasil Analisis:</span>
                  <p className="text-slate-700 mt-0.5">{selectedPaper.analysis}</p>
                </div>
                <div>
                  <span className="font-bold text-rose-800">Temuan Konsultan:</span>
                  <p className="text-slate-700 mt-0.5">{selectedPaper.finding}</p>
                </div>
                <div>
                  <span className="font-bold text-emerald-800">Kesimpulan & Rekomendasi:</span>
                  <p className="text-slate-700 mt-0.5">{selectedPaper.consultantConclusion}</p>
                  <p className="text-slate-700 font-semibold mt-1">• {selectedPaper.recommendation}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>{getStatusBadge(selectedPaper.status)}</div>
              <button
                onClick={() => setSelectedPaper(null)}
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
