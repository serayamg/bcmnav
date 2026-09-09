'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import {
  Building2,
  Plus,
  Search,
  Download,
  Upload,
  UserCheck,
  ChevronRight,
  ChevronDown,
  Layers,
  MapPin,
  FileCheck2,
  CheckCircle2,
  FolderTree,
  LayoutGrid
} from 'lucide-react';

export default function OrganizationPage() {
  const { units, setUnits, addAuditLog } = useBcm();
  const [viewMode, setViewMode] = useState<'tree' | 'card'>('tree');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [code, setCode] = useState(`DIV-${Math.floor(Math.random() * 900 + 100)}`);
  const [name, setName] = useState('');
  const [levelName, setLevelName] = useState('Division');
  const [unitHead, setUnitHead] = useState('');
  const [bcmCoord, setBcmCoord] = useState('');
  const [location, setLocation] = useState('');

  const filteredUnits = units.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.unitHeadName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newUnit = {
      id: `unit-${Date.now()}`,
      code,
      name,
      level: levelName === 'Directorate' ? 1 : levelName === 'Division' ? 2 : 3,
      levelName,
      parentId: null,
      unitHeadName: unitHead || 'Belum Ditugaskan',
      bcmCoordName: bcmCoord || 'Belum Ditugaskan',
      location,
      processCount: 0,
      biaCompletedCount: 0,
    };

    setUnits((prev) => [...prev, newUnit]);
    addAuditLog('CREATE_UNIT', 'ORGANIZATION', code, `Menambahkan unit kerja baru: ${name} (${code})`);
    setShowAddModal(false);
    setName('');
    setUnitHead('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-extrabold text-cyan-800 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200 shadow-xs">
              Module 2 — Organization Master
            </span>
            <span className="bg-cyan-50 text-cyan-800 text-xs font-bold px-3 py-1 rounded-full border border-cyan-200 shadow-xs">
              Dynamic Hierarchy
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Struktur Organisasi & Pemetaan Unit Kerja
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Hierarki departemen fleksibel dan penugasan Process Owner & BCM Coordinator per unit.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <button
            onClick={() => alert('Fitur Export Excel: Format XLSX berisi seluruh unit dan PIC telah diunduh.')}
            className="px-4 py-2.5 bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-600" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-[#0B1F3A] hover:bg-[#133C67] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Tambah Unit Kerja</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search & View Toggle */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4.5 h-4.5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kode, nama unit, atau kepala divisi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A9CE]/20 focus:border-[#00A9CE] text-slate-800 placeholder:text-slate-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setViewMode('tree')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              viewMode === 'tree' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderTree className="w-4 h-4 text-cyan-600" />
            <span>Hierarchical Tree</span>
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              viewMode === 'card' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-cyan-600" />
            <span>Card Grid</span>
          </button>
        </div>
      </div>

      {/* View Mode: Tree View */}
      {viewMode === 'tree' ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-4">
          <div className="text-xs sm:text-sm font-extrabold text-slate-500 uppercase tracking-wider mb-3">
            Pohon Struktur Organisasi BCM
          </div>

          <div className="space-y-3.5">
            {filteredUnits.map((unit) => (
              <div
                key={unit.id}
                className={`p-4 sm:p-5 md:p-6 rounded-2xl border transition-all ${
                  unit.level === 1
                    ? 'bg-[#0B1F3A] text-white border-slate-700/80 shadow-lg'
                    : 'bg-white hover:bg-slate-50/90 border-slate-200 ml-3 sm:ml-6 md:ml-10 shadow-2xs'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm shrink-0 shadow-xs ${
                        unit.level === 1 ? 'bg-gradient-to-tr from-[#00A9CE] to-sky-400 text-[#0B1F3A]' : 'bg-cyan-50 text-cyan-900 border border-cyan-200'
                      }`}
                    >
                      L{unit.level}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`font-mono text-xs sm:text-sm font-extrabold px-2.5 py-0.5 rounded-md border ${
                          unit.level === 1 ? 'bg-slate-800 text-cyan-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {unit.code}
                        </span>
                        <h3
                          className={`font-black text-base sm:text-lg md:text-xl leading-snug ${unit.level === 1 ? 'text-white' : 'text-slate-900'}`}
                        >
                          {unit.name}
                        </h3>
                        <span
                          className={`text-xs px-3 py-0.5 rounded-full font-bold ${
                            unit.level === 1 ? 'bg-slate-800 text-cyan-300 border border-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {unit.levelName}
                        </span>
                      </div>

                      <div
                        className={`flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-xs sm:text-sm leading-relaxed ${
                          unit.level === 1 ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <UserCheck className={`w-4 h-4 shrink-0 ${unit.level === 1 ? 'text-cyan-400' : 'text-cyan-700'}`} />
                          <span className={unit.level === 1 ? 'text-slate-400 font-medium' : 'text-slate-500 font-medium'}>Unit Head:</span>
                          <strong className={unit.level === 1 ? 'text-white font-bold' : 'text-slate-900 font-bold'}>{unit.unitHeadName}</strong>
                        </span>
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${unit.level === 1 ? 'text-cyan-400' : 'text-cyan-700'}`} />
                          <span className={unit.level === 1 ? 'text-slate-400 font-medium' : 'text-slate-500 font-medium'}>BCM Coord:</span>
                          <strong className={unit.level === 1 ? 'text-white font-bold' : 'text-slate-900 font-bold'}>{unit.bcmCoordName}</strong>
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className={`w-4 h-4 shrink-0 ${unit.level === 1 ? 'text-cyan-400' : 'text-cyan-700'}`} />
                          <span className={unit.level === 1 ? 'text-slate-300' : 'text-slate-700'}>{unit.location}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
                    <div
                      className={`text-right px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-inner ${
                        unit.level === 1 ? 'bg-slate-800/90 text-white border border-slate-700' : 'bg-slate-50 border border-slate-200'
                      }`}
                    >
                      <div className={`text-xs uppercase font-bold tracking-wider ${unit.level === 1 ? 'text-slate-400' : 'text-slate-500'}`}>BIA Progress</div>
                      <div className={`text-sm sm:text-base md:text-lg font-black mt-0.5 ${unit.level === 1 ? 'text-cyan-300' : 'text-slate-900'}`}>
                        {unit.biaCompletedCount} / {unit.processCount} Selesai
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUnits.map((unit) => (
            <div key={unit.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">{unit.code}</span>
                  <span className="text-xs bg-slate-100 text-slate-800 font-bold px-3 py-1 rounded-full border border-slate-200">
                    {unit.levelName}
                  </span>
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mb-3 leading-snug">{unit.name}</h3>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Head:</span>
                    <span className="font-bold text-slate-900">{unit.unitHeadName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">BCM Coord:</span>
                    <span className="font-bold text-slate-900">{unit.bcmCoordName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Lokasi:</span>
                    <span className="font-medium text-slate-800">{unit.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold text-slate-800">{unit.processCount} Proses Bisnis</span>
                <span className="text-[#00A9CE] font-extrabold">{unit.biaCompletedCount} BIA Validated</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Unit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Tambah Unit Organisasi</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 text-base font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUnit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-sm">Kode Unit</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-sm">Tingkat Level</label>
                  <select
                    value={levelName}
                    onChange={(e) => setLevelName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Directorate">Directorate</option>
                    <option value="Division">Division</option>
                    <option value="Department">Department</option>
                    <option value="Unit">Unit / Sub-team</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-sm">Nama Unit Organisasi</label>
                <input
                  type="text"
                  placeholder="e.g. Divisi Anti-Fraud & Cyber Security"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-sm">Nama Kepala Unit (Unit Head)</label>
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={unitHead}
                    onChange={(e) => setUnitHead(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-sm">BCM Coordinator PIC</label>
                  <input
                    type="text"
                    placeholder="Nama PIC"
                    value={bcmCoord}
                    onChange={(e) => setBcmCoord(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-sm">Lokasi Fisik / Kantor</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 font-bold rounded-xl shadow-sm text-sm transition-all"
                >
                  Simpan Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
