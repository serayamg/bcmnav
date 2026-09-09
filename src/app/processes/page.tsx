'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBcm } from '@/lib/store';
import { BusinessProcessData } from '@/lib/mock-data';
import {
  Layers3,
  Plus,
  Search,
  Filter,
  ShieldAlert,
  ArrowRight,
  Clock,
  Coins,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  FolderTree,
  Building,
  UserCheck
} from 'lucide-react';

export default function ProcessesPage() {
  const { processes, setProcesses, units, stakeholders, addAuditLog } = useBcm();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewTab, setViewTab] = useState<'register' | 'hierarchy'>('register');

  // New Process Form
  const [code, setCode] = useState(`PROC-${Math.floor(Math.random() * 900 + 100)}`);
  const [name, setName] = useState('');
  const [unitId, setUnitId] = useState('unit-02');
  const [description, setDescription] = useState('');
  const [volume, setVolume] = useState('');
  const [financialVal, setFinancialVal] = useState('');
  const [sla, setSla] = useState('');

  const filteredProcesses = processes.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.processOwnerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnit = selectedUnit === 'ALL' || p.unitId === selectedUnit;
    return matchesSearch && matchesUnit;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const unitObj = units.find((u) => u.id === unitId) || units[0];
    if (!unitObj) {
      alert('Tambahkan minimal satu Unit Kerja pada Organization Master sebelum mendaftarkan proses bisnis.');
      return;
    }
    const newProc: BusinessProcessData = {
      id: `proc-${Date.now()}`,
      code,
      name,
      unitId: unitObj.id,
      unitName: unitObj.name,
      level: 2,
      levelName: 'Business Process',
      processOwnerId: '',
      processOwnerName: unitObj.unitHeadName,
      description,
      objective: 'Memastikan operasional proses berjalan konsisten sesuai SLA.',
      productService: 'Layanan Finansial & Operasi',
      customers: 'Nasabah & Internal Bank',
      inputs: 'Instruksi sistem / nasabah',
      keyActivities: 'Verifikasi, validasi, otorisasi transaksi',
      outputs: 'Pencatatan saldo & konfirmasi selesai',
      frequency: 'Harian',
      operatingHours: '24/7',
      peakPeriod: 'Akhir bulan',
      transactionVolume: volume || '50.000 / hari',
      financialValue: financialVal || 'Rp 100 Miliar / hari',
      slaRequirement: sla || 'Maksimal 2 jam',
      regulatoryReq: 'POJK No. 11/2022',
      manualWorkaround: 'Prosedur darurat manual dengan verifikasi fisik',
      existingBcp: 'Draf Dokumen Kontingensi 2024',
      status: 'Ready for BIA',
      isCriticalFlag: true,
      criticalityTier: 'Tier 2 — Critical',
    };

    setProcesses((prev) => [...prev, newProc]);
    addAuditLog('ADD_PROCESS', 'PROCESS', newProc.code, `Menambahkan proses bisnis: ${name} (${newProc.code})`);
    setShowAddModal(false);
    setName('');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-extrabold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-md border border-cyan-200">
              Module 5 — Business Process Register
            </span>
            <span className="bg-purple-50 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-md border border-purple-200">
              Level 0–4 Hierarchy
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Register Proses Bisnis & Pemilik Proses (Process Owner)
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Inventarisasi seluruh proses bisnis per unit kerja sebagai fondasi pelaksanaan Business Impact Analysis (BIA).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-[#0B1F3A] hover:bg-[#133C67] text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm hover:shadow transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Proses Bisnis</span>
        </button>
      </div>

      {/* View Tabs & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kode, nama proses bisnis, atau process owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A9CE] focus:border-transparent text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="py-2.5 px-3.5 text-sm border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A9CE]"
          >
            <option value="ALL">Semua Unit Kerja</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setViewTab('register')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              viewTab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register List
          </button>
          <button
            onClick={() => setViewTab('hierarchy')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              viewTab === 'hierarchy' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hierarchy Tree
          </button>
        </div>
      </div>

      {/* Register Tab */}
      {viewTab === 'register' ? (
        <div className="grid gap-4">
          {filteredProcesses.map((proc) => (
            <div
              key={proc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-2.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-slate-800 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md">
                    {proc.code}
                  </span>
                  <span className="text-xs bg-purple-50 text-purple-800 border border-purple-200 font-bold px-2.5 py-1 rounded-md">
                    {proc.levelName} (L{proc.level})
                  </span>
                  {proc.isCriticalFlag && (
                    <span className="text-xs bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>Critical Process</span>
                    </span>
                  )}
                  {proc.spofFlag && (
                    <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2.5 py-1 rounded-md">
                      SPOF Advisory
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-lg md:text-xl text-slate-900 leading-snug">
                  {proc.name}
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed max-w-4xl font-normal">
                  {proc.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 text-sm text-slate-700 border-t border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-cyan-700 shrink-0" />
                    <span className="text-slate-500 font-medium">Unit:</span>
                    <strong className="font-bold text-slate-900">{proc.unitName}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-cyan-700 shrink-0" />
                    <span className="text-slate-500 font-medium">Owner:</span>
                    <strong className="font-bold text-slate-900">{proc.processOwnerName}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-cyan-700 shrink-0" />
                    <span className="text-slate-500 font-medium">Jam Operasi:</span>
                    <strong className="font-bold text-slate-900">{proc.operatingHours}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-cyan-700 shrink-0" />
                    <span className="text-slate-500 font-medium">Nilai Transaksi:</span>
                    <strong className="font-bold text-slate-900">{proc.financialValue}</strong>
                  </span>
                </div>
              </div>

              {/* BIA Status & Action CTA */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <div className="text-left lg:text-right">
                  <div className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-0.5">Target Pemulihan</div>
                  <div className="font-extrabold text-slate-900 text-base md:text-lg">
                    {proc.rto ? `RTO: ${proc.rto}` : 'Belum di-assess'}
                  </div>
                  {proc.mtpd && <div className="text-xs font-semibold text-slate-600 mt-0.5">MTPD: {proc.mtpd}</div>}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/bia/${proc.id}`}
                    className="px-5 py-2.5 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
                  >
                    <span>{proc.status === 'Validated' ? 'Lihat BIA Validated' : 'Buka 12-Step BIA'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Hierarchy Tree View */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="p-4 bg-slate-900 text-white rounded-xl">
            <div className="text-xs uppercase font-bold text-cyan-400">Level 0: Enterprise</div>
            <div className="text-base font-bold mt-1">PT Bank Nusantara Sejahtera Tbk — Layanan Perbankan Inti</div>
          </div>

          <div className="ml-4 md:ml-8 space-y-3">
            <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 font-bold text-sm text-slate-800">
              Level 1: Business Function — Operasional Pembayaran, Kliring & Treasury
            </div>

            <div className="ml-4 md:ml-8 space-y-2.5">
              {processes.map((proc) => (
                <div
                  key={proc.id}
                  className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between text-sm hover:border-cyan-300 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs bg-slate-100 border border-slate-200 text-cyan-800 px-2 py-0.5 rounded">{proc.code}</span>
                    <span className="font-semibold text-slate-900">{proc.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">{proc.unitName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Process Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Identifikasi Proses Bisnis Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 text-base font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-sm">Kode Proses</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-sm">Unit Organisasi</label>
                  <select
                    value={unitId}
                    onChange={(e) => setUnitId(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-sm">Nama Proses Bisnis</label>
                <input
                  type="text"
                  placeholder="e.g. Kliring Cek & Bilyet Giro Elektronik"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-sm">Deskripsi Singkat Aktivitas</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan alur input, pemrosesan transaksi, dan output yang dihasilkan..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-sm">Volume Transaksi / Hari</label>
                  <input
                    type="text"
                    placeholder="e.g. 150.000 transaksi"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-sm">Nilai Finansial / Hari</label>
                  <input
                    type="text"
                    placeholder="e.g. Rp 2.5 Triliun"
                    value={financialVal}
                    onChange={(e) => setFinancialVal(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-sm transition-all"
                >
                  Simpan ke Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
