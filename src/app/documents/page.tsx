'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import { DocumentRequestData } from '@/lib/mock-data';
import { exportTablePdf, exportDetailPdf } from '@/lib/pdf-export';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  FileCheck,
  Clock,
  AlertCircle,
  FileUp,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Shield,
  Upload,
  MessageSquare,
  Sparkles,
  Download
} from 'lucide-react';

export default function DocumentsPage() {
  const { documents, updateDocumentReview, addAuditLog, currentRole, currentProject } = useBcm();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedDoc, setSelectedDoc] = useState<DocumentRequestData | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Review Form States
  const [reviewStatus, setReviewStatus] = useState('Accepted');
  const [completeness, setCompleteness] = useState(90);
  const [keyFindings, setKeyFindings] = useState('');
  const [gapIdentified, setGapIdentified] = useState('');
  const [followUp, setFollowUp] = useState('');

  // Upload Simulation States
  const [uploadFileName, setUploadFileName] = useState('');

  // Metrics
  const total = documents.length;
  const accepted = documents.filter((d) => d.status === 'Accepted').length;
  const underReview = documents.filter((d) => d.status === 'Under Review').length;
  const submitted = documents.filter((d) => d.status === 'Submitted').length;
  const pending = documents.filter((d) => d.status === 'Requested' || d.status === 'In Progress').length;

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.unitName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const acceptedDocs = documents.filter((d) => d.status === 'Accepted');

  const handleDownloadAcceptedPdf = () => {
    if (acceptedDocs.length === 0) {
      alert('Belum ada dokumen berstatus "Accepted" untuk diunduh.');
      return;
    }
    exportTablePdf({
      title: 'Daftar Dokumen Diterima (Accepted)',
      subtitle: `${currentProject.name || 'Proyek BCM'} — Document Request List (DRL)`,
      meta: [
        { label: 'Total Accepted', value: String(acceptedDocs.length) },
        { label: 'Klien', value: currentProject.clientName || '-' },
      ],
      columns: [
        { header: 'Kode', key: 'code', width: 20 },
        { header: 'Nama Dokumen', key: 'name', width: 55 },
        { header: 'Kategori', key: 'category', width: 20 },
        { header: 'Unit', key: 'unitName', width: 40 },
        { header: 'Versi', key: 'version', width: 14 },
        { header: 'Completeness', key: 'completeness', width: 22 },
        { header: 'Reviewer', key: 'reviewerName', width: 30 },
        { header: 'Tgl Review', key: 'reviewedAt', width: 24 },
        { header: 'Temuan Kunci', key: 'keyFindings' },
      ],
      rows: acceptedDocs.map((d) => ({
        code: d.code,
        name: d.name,
        category: d.category,
        unitName: d.unitName,
        version: d.version,
        completeness: d.completeness != null ? `${d.completeness}%` : '-',
        reviewerName: d.reviewerName || '-',
        reviewedAt: d.reviewedAt || '-',
        keyFindings: d.keyFindings || '-',
      })),
      fileName: `DRL_Accepted_${currentProject.code || 'BCM'}.pdf`,
    });
    addAuditLog('EXPORT_PDF', 'DRL', 'Accepted Documents', `Mengunduh PDF ${acceptedDocs.length} dokumen diterima`);
  };

  const handleDownloadDocPdf = (doc: DocumentRequestData) => {
    exportDetailPdf(
      `Dokumen Diterima — ${doc.code}`,
      `${currentProject.name || 'Proyek BCM'} — Berita Acara Penerimaan Dokumen`,
      [
        { label: 'Kode Dokumen', value: doc.code },
        { label: 'Nama Dokumen', value: doc.name },
        { label: 'Kategori', value: doc.category },
        { label: 'Unit Kerja', value: doc.unitName },
        { label: 'Deskripsi', value: doc.description },
        { label: 'Konfidensialitas', value: doc.confidentiality },
        { label: 'Prioritas', value: doc.priority },
        { label: 'Status', value: doc.status },
        { label: 'Versi', value: doc.version },
        { label: 'Nama Berkas', value: doc.uploadedFileName || '-' },
        { label: 'Ukuran Berkas', value: doc.uploadedFileSize || '-' },
        { label: 'Tanggal Unggah', value: doc.uploadedAt || '-' },
        { label: 'Completeness', value: doc.completeness != null ? `${doc.completeness}%` : '-' },
        { label: 'Relevansi', value: doc.relevance || '-' },
        { label: 'Temuan Kunci', value: doc.keyFindings || '-' },
        { label: 'Gap Teridentifikasi', value: doc.gapIdentified || '-' },
        { label: 'Tindak Lanjut', value: doc.followUpRequired || '-' },
        { label: 'Reviewer', value: doc.reviewerName || '-' },
        { label: 'Tanggal Review', value: doc.reviewedAt || '-' },
      ],
      `Dokumen_${doc.code}.pdf`
    );
    addAuditLog('EXPORT_PDF', 'DRL', doc.code, `Mengunduh PDF dokumen diterima ${doc.code}`);
  };

  const openReview = (doc: DocumentRequestData) => {
    setSelectedDoc(doc);
    setReviewStatus(doc.reviewStatus || 'Accepted');
    setCompleteness(doc.completeness || 85);
    setKeyFindings(doc.keyFindings || '');
    setGapIdentified(doc.gapIdentified || '');
    setFollowUp(doc.followUpRequired || '');
    setShowReviewModal(true);
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;

    updateDocumentReview(selectedDoc.id, {
      status: reviewStatus as any,
      reviewStatus,
      completeness,
      keyFindings,
      gapIdentified,
      followUpRequired: followUp,
    });

    setShowReviewModal(false);
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !uploadFileName) return;

    updateDocumentReview(selectedDoc.id, {
      status: 'Submitted',
      reviewStatus: 'Pending Consultant Review',
      completeness: 50,
      keyFindings: selectedDoc.keyFindings || '',
      gapIdentified: selectedDoc.gapIdentified || '',
      followUpRequired: selectedDoc.followUpRequired || '',
    });

    addAuditLog('UPLOAD_DOC', 'DRL', selectedDoc.code, `File diunggah: ${uploadFileName} (v${selectedDoc.version})`);
    setShowUploadModal(false);
    setUploadFileName('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="text-xs uppercase tracking-wider font-extrabold text-slate-500">
              Module 3 — Document Collection
            </span>
            <span className="bg-sky-50 text-sky-800 text-xs font-bold px-3 py-1 rounded-full border border-sky-200 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              DRL & Version Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Document Request List & Telaah Bukti Dukung
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Daftar permintaan dokumen pendukung BCM, verifikasi kepatuhan, dan ekstraksi temuan konsultan.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadAcceptedPdf}
            className="px-4 py-2.5 bg-[#0B1F3A] hover:bg-[#133C67] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all hover:shadow cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-300" />
            <span>Download PDF (Accepted)</span>
          </button>
          <button
            onClick={() => alert('Template DRL Excel telah diunduh untuk dibagikan ke BCM Coordinator unit.')}
            className="px-4 py-2.5 bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all hover:shadow cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-600" />
            <span>Download DRL Excel</span>
          </button>
        </div>
      </div>

      {/* Checklist Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">Total Diminta</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">{total}</div>
          <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-2">100% Target Scope</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200 shadow-sm flex flex-col justify-between bg-gradient-to-b from-white to-emerald-50/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-700">Accepted & Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-700 mt-2">{accepted}</div>
          <div className="text-xs sm:text-sm font-bold text-emerald-600 mt-2">
            {total > 0 ? Math.round((accepted / total) * 100) : 0}% Diverifikasi
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sky-200 shadow-sm flex flex-col justify-between bg-gradient-to-b from-white to-sky-50/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-sky-700">Under Review</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-sky-700 mt-2">{underReview}</div>
          <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-2">Oleh Sarah Wijaya</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between bg-gradient-to-b from-white to-amber-50/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-700">Submitted (Baru)</span>
            <FileUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-amber-700 mt-2">{submitted}</div>
          <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-2">Menunggu Telaah</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-200 shadow-sm col-span-2 md:col-span-1 flex flex-col justify-between bg-gradient-to-b from-white to-rose-50/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-700">Outstanding / Pending</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-rose-700 mt-2">{pending}</div>
          <div className="text-xs sm:text-sm font-bold text-rose-600 mt-2">Perlu Follow-up Unit</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4.5 h-4.5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kode DRL, judul dokumen, atau nama unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A9CE]/20 focus:border-[#00A9CE] transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'Organizational', 'BCM', 'IT', 'Risk Management', 'Operational', 'Application', 'Policy'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#0B1F3A] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-4 px-5">Kode & Judul Dokumen</th>
                <th className="py-4 px-4 whitespace-nowrap">Kategori & Kerahasiaan</th>
                <th className="py-4 px-4 whitespace-nowrap">Unit Penanggung Jawab</th>
                <th className="py-4 px-4 whitespace-nowrap">File Terunggah</th>
                <th className="py-4 px-4 whitespace-nowrap">Status Telaah</th>
                <th className="py-4 px-5 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4.5 px-5 min-w-[280px] max-w-md">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                        {doc.code}
                      </span>
                      {doc.mandatory && (
                        <span className="text-xs bg-rose-50 text-rose-700 border border-rose-200 font-extrabold px-2 py-0.5 rounded-md">
                          Mandatory
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-mono font-semibold">v{doc.version}</span>
                    </div>
                    <div className="font-bold text-sm sm:text-base text-slate-900 leading-snug">{doc.name}</div>
                    <div className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-1 leading-relaxed">{doc.description}</div>
                  </td>

                  <td className="py-4.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-sm sm:text-base text-slate-900">{doc.category}</div>
                    <span
                      className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-md mt-1 ${
                        doc.confidentiality === 'Restricted'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {doc.confidentiality}
                    </span>
                  </td>

                  <td className="py-4.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-sm sm:text-base text-slate-900">{doc.unitName}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">Target: {doc.targetDate}</div>
                  </td>

                  <td className="py-4.5 px-4 whitespace-nowrap">
                    {doc.uploadedFileName ? (
                      <div>
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate max-w-[180px]">{doc.uploadedFileName}</span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">
                          {doc.uploadedFileSize} • {doc.uploadedAt}
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedDoc(doc);
                          setShowUploadModal(true);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00A9CE] hover:text-cyan-700 hover:underline cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload File</span>
                      </button>
                    )}
                  </td>

                  <td className="py-4.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs sm:text-sm font-extrabold ${
                        doc.status === 'Accepted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : doc.status === 'Under Review'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : doc.status === 'Submitted'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {doc.status}
                    </span>
                    {doc.completeness && (
                      <div className="text-xs text-slate-500 font-semibold mt-1">Completeness: {doc.completeness}%</div>
                    )}
                  </td>

                  <td className="py-4.5 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {doc.status === 'Accepted' && (
                        <button
                          onClick={() => handleDownloadDocPdf(doc)}
                          title="Download PDF dokumen diterima"
                          className="px-3 py-2.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">PDF</span>
                        </button>
                      )}
                      <button
                        onClick={() => openReview(doc)}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-[#00A9CE] hover:text-slate-950 text-slate-800 font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                      >
                        Telaah Dokumen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Review Modal */}
      {showReviewModal && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs sm:text-sm font-extrabold text-[#00A9CE] uppercase">{selectedDoc.code}</span>
                <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">Telaah Dokumen Konsultan (Review Note)</h3>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-5">
              <div className="font-bold text-sm sm:text-base text-slate-900">{selectedDoc.name}</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1">
                Unit: <span className="font-semibold text-slate-700">{selectedDoc.unitName}</span> • File: <span className="font-semibold text-slate-700">{selectedDoc.uploadedFileName || 'Belum diunggah'}</span> (v{selectedDoc.version})
              </div>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Keputusan Telaah</label>
                  <select
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-[#00A9CE]/20 focus:border-[#00A9CE]"
                  >
                    <option value="Accepted">Accepted (Diterima & Relevan)</option>
                    <option value="Under Review">Under Review (Sedang Ditelusuri)</option>
                    <option value="Need Clarification">Need Clarification (Perlu Klarifikasi Unit)</option>
                    <option value="Incomplete">Incomplete (Tidak Lengkap)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Tingkat Kelengkapan Dokumen ({completeness}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={completeness}
                    onChange={(e) => setCompleteness(Number(e.target.value))}
                    className="w-full mt-3 accent-[#00A9CE]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Temuan Utama Dokumen (Key Findings)</label>
                <textarea
                  rows={2}
                  value={keyFindings}
                  onChange={(e) => setKeyFindings(e.target.value)}
                  placeholder="Contoh: Dokumen BCP eksisting memuat 8 skenario insiden namun belum mencakup kegagalan switch BI-FAST."
                  className="w-full p-3 border border-slate-300 rounded-xl text-sm leading-relaxed focus:ring-2 focus:ring-[#00A9CE]/20 focus:border-[#00A9CE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Kesenjangan yang Teridentifikasi (Gap Identified)</label>
                <textarea
                  rows={2}
                  value={gapIdentified}
                  onChange={(e) => setGapIdentified(e.target.value)}
                  placeholder="Contoh: RTO 6 jam tidak memenuhi toleransi POJK No. 11/2022 (maksimal 2 jam)."
                  className="w-full p-3 border border-slate-300 rounded-xl text-sm leading-relaxed focus:ring-2 focus:ring-[#00A9CE]/20 focus:border-[#00A9CE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Tindak Lanjut yang Diperlukan (Follow-up Required)</label>
                <textarea
                  rows={2}
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  placeholder="Contoh: Verifikasi kembali saat wawancara BIA bersama Process Owner."
                  className="w-full p-3 border border-slate-300 rounded-xl text-sm leading-relaxed focus:ring-2 focus:ring-[#00A9CE]/20 focus:border-[#00A9CE]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0B1F3A] hover:bg-[#133C67] text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Simpan Catatan Telaah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Simulation Modal */}
      {showUploadModal && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mb-1">Upload Bukti Dokumen</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-4 font-medium">{selectedDoc.name}</p>

            <form onSubmit={handleSimulateUpload} className="space-y-4">
              <div>
                <label className="block font-bold text-sm text-slate-800 mb-1.5">Pilih File (PDF, DOCX, XLSX)</label>
                <input
                  type="text"
                  placeholder="e.g. SOP_Kliring_Pembayaran_2024.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00A9CE]/20 focus:border-[#00A9CE]"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 leading-relaxed">
                Format didukung: PDF, DOC/DOCX, XLS/XLSX, JPG, PNG, CSV. Versi lama tidak akan di-overwrite (Version Control diaktifkan).
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 font-bold rounded-xl shadow-sm cursor-pointer"
                >
                  Upload Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
