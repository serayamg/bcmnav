'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import { StakeholderData } from '@/lib/mock-data';
import {
  Users2,
  Plus,
  Search,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  Building,
  UserCheck,
  Shield,
  Layers,
  ArrowRight,
  ChevronRight,
  SlidersHorizontal,
  HelpCircle,
  X,
  Briefcase,
  AlertCircle
} from 'lucide-react';

export default function StakeholdersPage() {
  const { stakeholders, setStakeholders, updateStakeholderPosition, addAuditLog, units } = useBcm();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStakeholder, setSelectedStakeholder] = useState<StakeholderData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [unitId, setUnitId] = useState(units[0]?.id || 'unit-01');
  const [unitName, setUnitName] = useState(units[0]?.name || 'Divisi Settlement & Kliring');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isInternal, setIsInternal] = useState(true);
  const [bcmRole, setBcmRole] = useState('Process Owner');
  const [decisionAuthority, setDecisionAuthority] = useState('Operational');
  const [influence, setInfluence] = useState(4);
  const [interest, setInterest] = useState(4);
  const [recommendedBiaRole, setRecommendedBiaRole] = useState(true);
  const [notes, setNotes] = useState('');

  const filteredStakeholders = stakeholders.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.unitName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Quadrant grouping
  const manageClosely = stakeholders.filter((s) => s.influenceLevel >= 4 && s.interestLevel >= 4);
  const keepSatisfied = stakeholders.filter((s) => s.influenceLevel >= 4 && s.interestLevel < 4);
  const keepInformed = stakeholders.filter((s) => s.influenceLevel < 4 && s.interestLevel >= 4);
  const monitor = stakeholders.filter((s) => s.influenceLevel < 4 && s.interestLevel < 4);

  const calculateQuadrant = (inf: number, int: number): StakeholderData['quadrant'] => {
    if (inf >= 4 && int >= 4) return 'Manage Closely';
    if (inf >= 4 && int < 4) return 'Keep Satisfied';
    if (inf < 4 && int >= 4) return 'Keep Informed';
    return 'Monitor';
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !position.trim()) return;

    const quadrant = calculateQuadrant(influence, interest);

    const newStk: StakeholderData = {
      id: `stk-${Date.now()}`,
      code: `STK-${Math.floor(Math.random() * 900 + 100)}`,
      name: name.trim(),
      unitId,
      unitName,
      position: position.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@bank.co.id`,
      phone: phone.trim() || '+62 812-0000-0000',
      isInternal,
      bcmRole,
      influenceLevel: influence,
      interestLevel: interest,
      criticality: influence >= 4 ? 'High' : influence >= 3 ? 'Medium' : 'Low',
      decisionAuthority,
      recommendedBiaRole,
      notes: notes.trim() || `Stakeholder dipetakan pada kuadran ${quadrant} untuk koordinasi BCMS ISO 22301.`,
      quadrant,
    };

    setStakeholders((prev) => [...prev, newStk]);
    addAuditLog('ADD_STAKEHOLDER', 'STAKEHOLDER', newStk.code, `Menambahkan stakeholder: ${name} (${position}, ${unitName})`);
    setShowAddModal(false);
    
    // Reset form
    setName('');
    setPosition('');
    setEmail('');
    setPhone('');
    setNotes('');
    setInfluence(4);
    setInterest(4);
    setRecommendedBiaRole(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-extrabold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-md border border-cyan-200">
              Module 4 — Stakeholder Management
            </span>
            <span className="bg-cyan-50 text-cyan-800 text-xs font-bold px-2.5 py-0.5 rounded-md border border-cyan-200">
              Power vs Interest Matrix
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pemetaan Stakeholder & Matriks Pengaruh BCM
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Identifikasi peran, tingkat pengaruh (power), kepentingan (interest), dan rekomendasi otomatis responden BIA.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-[#0B1F3A] hover:bg-[#133C67] text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm hover:shadow transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Stakeholder</span>
        </button>
      </div>

      {/* Interactive 2x2 Stakeholder Matrix (J. STAKEHOLDER MATRIX) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-base md:text-lg text-slate-900 flex items-center gap-2 flex-wrap">
              <span>Interactive 2x2 Stakeholder Engagement Matrix</span>
              <span className="text-xs font-normal text-slate-500">(Mendukung Drag/Click Pemindahan Kuadran)</span>
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Sumbu Y: Pengaruh Terhadap Kebijakan / BCM • Sumbu X: Tingkat Kepentingan / Keterlibatan
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-600 shrink-0" /> Responden BIA Direkomendasikan
            </span>
          </div>
        </div>

        {/* The 4 Quadrants Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Top Left: Keep Satisfied */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-wide">
                Keep Satisfied (High Influence, Low Interest)
              </span>
              <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2.5 py-0.5 rounded-full">
                {keepSatisfied.length} Orang
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Direksi / Executive Sponsor — Sampaikan update berkala dan ringkasan eksekutif.
            </p>
            <div className="space-y-2.5">
              {keepSatisfied.map((stk) => (
                <div
                  key={stk.id}
                  onClick={() => setSelectedStakeholder(stk)}
                  className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-[#00A9CE] shadow-sm cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900 group-hover:text-cyan-800 transition-colors">
                      {stk.name}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">{stk.position} • {stk.unitName}</div>
                  </div>
                  {stk.recommendedBiaRole && (
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 shrink-0" title="Responden BIA Kritis" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top Right: Manage Closely */}
          <div className="bg-cyan-50/40 rounded-2xl p-5 border border-cyan-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm font-bold text-cyan-950 uppercase tracking-wide">
                Manage Closely (High Influence, High Interest)
              </span>
              <span className="text-xs bg-cyan-200 text-cyan-900 font-bold px-2.5 py-0.5 rounded-full">
                {manageClosely.length} Responden Utama
              </span>
            </div>
            <p className="text-xs text-cyan-900 mb-3">
              Kepala Divisi & Process Owner Inti — Keterlibatan penuh pada BIA workshop & persetujuan strategi.
            </p>
            <div className="space-y-2.5">
              {manageClosely.map((stk) => (
                <div
                  key={stk.id}
                  onClick={() => setSelectedStakeholder(stk)}
                  className="p-3.5 bg-white rounded-xl border border-cyan-300 hover:border-cyan-500 shadow-sm cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900 group-hover:text-cyan-800 transition-colors">
                      {stk.name}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">{stk.position} • {stk.unitName}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-cyan-100 text-cyan-900 text-xs font-bold rounded-lg shrink-0">
                    BIA Target
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Left: Monitor */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-wide">
                Monitor (Low Influence, Low Interest)
              </span>
              <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2.5 py-0.5 rounded-full">
                {monitor.length} Pihak Terkait
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Staff Operasional Umum — Pantau kebutuhan pelatihan BCM dan sosialisasi awareness.
            </p>
            <div className="space-y-2.5">
              {monitor.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-2">Tidak ada stakeholder di kuadran ini</div>
              ) : (
                monitor.map((stk) => (
                  <div
                    key={stk.id}
                    onClick={() => setSelectedStakeholder(stk)}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm cursor-pointer"
                  >
                    <div className="font-bold text-sm text-slate-900">{stk.name}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{stk.position}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Right: Keep Informed */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-wide">
                Keep Informed (Low Influence, High Interest)
              </span>
              <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2.5 py-0.5 rounded-full">
                {keepInformed.length} Mitra / Vendor
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Vendor IT, Eksternal Service Provider, dan User Operasional — Berikan update reguler mengenai ekspektasi SLA.
            </p>
            <div className="space-y-2.5">
              {keepInformed.map((stk) => (
                <div
                  key={stk.id}
                  onClick={() => setSelectedStakeholder(stk)}
                  className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm cursor-pointer"
                >
                  <div className="font-bold text-sm text-slate-900">{stk.name}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{stk.position} • {stk.unitName}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stakeholder Register Table (K. STAKEHOLDER ANALYSIS) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base md:text-lg text-slate-900">Stakeholder Register & Rekomendasi Responden BIA</h3>
            <p className="text-sm text-slate-600 font-medium mt-0.5">
              Sistem secara otomatis merekomendasikan penugasan kuesioner BIA berdasarkan kepemilikan proses.
            </p>
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau jabatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A9CE] text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Kode & Nama</th>
                <th className="py-3.5 px-4">Unit Kerja & Posisi</th>
                <th className="py-3.5 px-4">Peran BCM</th>
                <th className="py-3.5 px-4">Influence / Interest</th>
                <th className="py-3.5 px-4">Rekomendasi BIA</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredStakeholders.map((stk) => (
                <tr key={stk.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-xs font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {stk.code}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm md:text-base">{stk.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{stk.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900 text-sm">{stk.position}</div>
                    <div className="text-xs text-slate-600 font-medium">{stk.unitName}</div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-bold border border-slate-200">
                      {stk.bcmRole}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">P: {stk.influenceLevel} / 5</span>
                      <span className="text-xs font-bold text-slate-700">I: {stk.interestLevel} / 5</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {stk.quadrant}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    {stk.recommendedBiaRole ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Responden BIA Kritis
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs font-semibold">Pendukung / Approver</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedStakeholder(stk)}
                      className="px-3.5 py-1.5 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-sm"
                    >
                      Detail & Skor
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail / Adjust Influence */}
      {selectedStakeholder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-cyan-700 font-bold text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{selectedStakeholder.code}</span>
                <h3 className="font-bold text-lg text-slate-900 mt-1">{selectedStakeholder.name}</h3>
              </div>
              <button onClick={() => setSelectedStakeholder(null)} className="text-slate-400 hover:text-slate-700 text-base font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3.5 mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Jabatan & Unit</span>
                <div className="font-bold text-slate-900 mt-0.5">{selectedStakeholder.position} ({selectedStakeholder.unitName})</div>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Catatan Konsultan</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-sm mt-0.5 leading-relaxed">
                  {selectedStakeholder.notes}
                </div>
              </div>

              {/* Adjusters */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <label className="block font-bold text-slate-800 mb-1.5 text-xs uppercase tracking-wider">
                    Pengaruh (Influence): <span className="text-cyan-700 text-sm">{selectedStakeholder.influenceLevel} / 5</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={selectedStakeholder.influenceLevel}
                    onChange={(e) =>
                      updateStakeholderPosition(
                        selectedStakeholder.id,
                        Number(e.target.value),
                        selectedStakeholder.interestLevel
                      )
                    }
                    className="w-full accent-[#00A9CE]"
                  />
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <label className="block font-bold text-slate-800 mb-1.5 text-xs uppercase tracking-wider">
                    Kepentingan (Interest): <span className="text-cyan-700 text-sm">{selectedStakeholder.interestLevel} / 5</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={selectedStakeholder.interestLevel}
                    onChange={(e) =>
                      updateStakeholderPosition(
                        selectedStakeholder.id,
                        selectedStakeholder.influenceLevel,
                        Number(e.target.value)
                      )
                    }
                    className="w-full accent-[#00A9CE]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3.5 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedStakeholder(null)}
                className="px-5 py-2.5 bg-[#0B1F3A] hover:bg-[#133C67] text-white font-bold rounded-xl text-sm transition-all"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Stakeholder Modal (Klausul 4.2 ISO 22301 Standard Form) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 text-sm max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-gradient-to-r from-slate-900 via-[#0B1F3A] to-[#133C67] text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00A9CE]/20 border border-[#00A9CE]/40 flex items-center justify-center text-cyan-300 shadow-sm">
                  <Users2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                    Tambah Stakeholder BCM Baru
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    ISO 22301 Klausul 4.2 — Pemetaan Peran, Kewenangan & Matriks Power vs Interest
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form onSubmit={handleAdd} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Bagian 1: Identitas & Organisasi */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="w-2 h-2 rounded-full bg-[#00A9CE]"></span>
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-700">
                    1. Identitas & Unit Kerja
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs sm:text-sm">
                      Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ir. Ahmad Dahlan, MBA"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full p-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A9CE]/30 focus:border-[#00A9CE] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs sm:text-sm">
                      Jabatan / Posisi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Head of IT Security"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      required
                      className="w-full p-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A9CE]/30 focus:border-[#00A9CE] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs sm:text-sm">
                      Unit Kerja / Departemen <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={unitId}
                      onChange={(e) => {
                        const sel = units.find((u) => u.id === e.target.value);
                        if (sel) {
                          setUnitId(sel.id);
                          setUnitName(sel.name);
                        } else {
                          setUnitId(e.target.value);
                          setUnitName(e.target.value);
                        }
                      }}
                      className="w-full p-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A9CE]/30 focus:border-[#00A9CE] transition-all"
                    >
                      {units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.code})
                        </option>
                      ))}
                      <option value="ext-regulator">Regulator / Otoritas Eksternal (BI / OJK)</option>
                      <option value="ext-vendor">Penyedia Jasa Kritis (Third-Party Vendor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs sm:text-sm">
                      Kategori Stakeholder
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIsInternal(true)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isInternal
                            ? 'bg-cyan-50 text-cyan-900 border-[#00A9CE] shadow-2xs font-extrabold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Building className="w-3.5 h-3.5" />
                        <span>Internal Bank</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsInternal(false)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          !isInternal
                            ? 'bg-purple-50 text-purple-900 border-purple-400 shadow-2xs font-extrabold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Eksternal</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bagian 2: Kontak & Call Tree BCM */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-700">
                    2. Kontak Darurat & Call Tree
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs sm:text-sm">
                      Email Korporat
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        placeholder="email@bank.co.id"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A9CE]/30 focus:border-[#00A9CE] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs sm:text-sm">
                      No. Handphone / WhatsApp BCM
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="+62 812-3456-7890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A9CE]/30 focus:border-[#00A9CE] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bagian 3: Peran BCMS & Tata Kelola */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-700">
                    3. Peran BCMS & Otoritas Keputusan
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs sm:text-sm">
                      Peran dalam Struktur BCMS <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={bcmRole}
                      onChange={(e) => setBcmRole(e.target.value)}
                      className="w-full p-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A9CE]/30 focus:border-[#00A9CE] transition-all"
                    >
                      <option value="Process Owner">Process Owner (Pemilik Proses Bisnis)</option>
                      <option value="BCM Coordinator">BCM Coordinator / Champion Unit</option>
                      <option value="Crisis Management Team (CMT)">Crisis Management Team (CMT)</option>
                      <option value="Business Recovery Team (BRT)">Business Recovery Team (BRT)</option>
                      <option value="IT DR Lead / Custodian">IT DR Lead / IT Custodian</option>
                      <option value="Executive Sponsor / BOD">Executive Sponsor / Board of Directors</option>
                      <option value="Risk & Compliance Assessor">Risk & Compliance Assessor</option>
                      <option value="External Regulator / Vendor">External Regulator / Key Vendor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs sm:text-sm">
                      Kewenangan Keputusan (Authority Level)
                    </label>
                    <select
                      value={decisionAuthority}
                      onChange={(e) => setDecisionAuthority(e.target.value)}
                      className="w-full p-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A9CE]/30 focus:border-[#00A9CE] transition-all"
                    >
                      <option value="Strategic">Strategic (Direksi / BOD — Deklarasi Bencana)</option>
                      <option value="Tactical">Tactical (Division Head / VP — Relokasi & Mobilisasi)</option>
                      <option value="Operational">Operational (Unit Head / Supervisor — Eksekusi Prosedur)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bagian 4: Pemetaan Power vs Interest Matrix */}
              <div className="space-y-3.5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#00A9CE]" />
                    <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
                      4. Matriks Pengaruh vs Kepentingan (ISO 22301)
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300">
                    Klausul 4.2
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Slider Influence / Power */}
                  <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800 text-xs sm:text-sm">
                        Tingkat Pengaruh (Power / Influence)
                      </label>
                      <span className="text-xs font-black px-2 py-0.5 rounded-md bg-[#0B1F3A] text-cyan-300">
                        Skor: {influence} / 5
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Otoritas alokasi sumber daya & keputusan darurat
                    </p>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={influence}
                      onChange={(e) => setInfluence(Number(e.target.value))}
                      className="w-full accent-[#00A9CE] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>1: Rendah</span>
                      <span>3: Sedang</span>
                      <span>5: Sangat Tinggi (BOD)</span>
                    </div>
                  </div>

                  {/* Slider Interest */}
                  <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800 text-xs sm:text-sm">
                        Tingkat Kepentingan (Interest)
                      </label>
                      <span className="text-xs font-black px-2 py-0.5 rounded-md bg-[#0B1F3A] text-cyan-300">
                        Skor: {interest} / 5
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Ketergantungan terhadap kelangsungan proses (MBCO)
                    </p>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={interest}
                      onChange={(e) => setInterest(Number(e.target.value))}
                      className="w-full accent-[#00A9CE] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>1: Rendah</span>
                      <span>3: Sedang</span>
                      <span>5: Kritis (Operasional)</span>
                    </div>
                  </div>
                </div>

                {/* Live Quadrant Preview Card */}
                {(() => {
                  const quad = calculateQuadrant(influence, interest);
                  const isManageClosely = quad === 'Manage Closely';
                  const isKeepSatisfied = quad === 'Keep Satisfied';
                  const isKeepInformed = quad === 'Keep Informed';

                  return (
                    <div
                      className={`p-3.5 rounded-xl border transition-all ${
                        isManageClosely
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                          : isKeepSatisfied
                          ? 'bg-sky-50/80 border-sky-300 text-sky-950'
                          : isKeepInformed
                          ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                          : 'bg-slate-100 border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              isManageClosely
                                ? 'bg-emerald-500 animate-pulse'
                                : isKeepSatisfied
                                ? 'bg-sky-500'
                                : isKeepInformed
                                ? 'bg-amber-500'
                                : 'bg-slate-500'
                            }`}
                          ></span>
                          <span className="font-extrabold text-xs uppercase tracking-wider">
                            Hasil Pemetaan: Kuadran {quad}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 border border-current">
                          {isManageClosely
                            ? 'Prioritas Q1'
                            : isKeepSatisfied
                            ? 'Prioritas Q2'
                            : isKeepInformed
                            ? 'Prioritas Q3'
                            : 'Prioritas Q4'}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed font-medium">
                        {isManageClosely &&
                          'Strategi: Kelola Secara Intensif. Libatkan aktif dalam setiap tahapan BIA, validasi parameter RTO/MTPD, dan persetujuan formal strategi BCP.'}
                        {isKeepSatisfied &&
                          'Strategi: Jaga Kepuasan. Konsultasikan kebijakan utama, alokasi anggaran DR, dan sampaikan laporan eksekutif berkala.'}
                        {isKeepInformed &&
                          'Strategi: Tetap Beri Informasi. Berikan update status kesiapan, jadwalkan wawancara BIA teknis, dan undang pada simulasi BCM.'}
                        {quad === 'Monitor' &&
                          'Strategi: Pantau Berkala. Berikan komunikasi minimal melalui buletin kesadaran BCM dan evaluasi jika ada perubahan peran.'}
                      </p>
                    </div>
                  );
                })()}

                {/* BIA Interviewee Recommendation Checkbox */}
                <label className="flex items-start gap-2.5 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={recommendedBiaRole}
                    onChange={(e) => setRecommendedBiaRole(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[#00A9CE] focus:ring-[#00A9CE] accent-[#00A9CE]"
                  />
                  <div>
                    <span className="font-bold text-slate-800 text-xs sm:text-sm block">
                      Rekomendasikan sebagai Narasumber Utama BIA (BIA Interviewee & Sign-Off)
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                      Nama stakeholder ini akan otomatis muncul pada dropdown narasumber wawancara 12-Step BIA Wizard.
                    </span>
                  </div>
                </label>

                {/* Notes */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs">
                    Catatan Khusus / Justifikasi Keterlibatan
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Bertanggung jawab atas otorisasi settlement kliring darurat dan alokasi personel cadangan."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A9CE]/30 focus:border-[#00A9CE] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#00A9CE] to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Simpan Stakeholder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
