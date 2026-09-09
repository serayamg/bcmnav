'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import {
  BCP_DISASTER_TYPES,
  BCP_WORKING_ARRANGEMENTS,
  BCP_STATUSES,
  BcpActivationData,
} from '@/lib/mock-data';
import { Siren, Plus, Search, Trash2, X, ShieldAlert, Activity, CheckCircle2, Download } from 'lucide-react';
import { exportTablePdf } from '@/lib/pdf-export';

const DISASTER_CLS: Record<string, string> = {
  Natural: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Human: 'bg-amber-100 text-amber-800 border-amber-300',
  Cyber: 'bg-red-100 text-red-800 border-red-300',
};

function severityCls(level: number): string {
  if (level >= 4) return 'bg-red-100 text-red-800 border-red-300';
  if (level === 3) return 'bg-orange-100 text-orange-800 border-orange-300';
  if (level === 2) return 'bg-amber-100 text-amber-800 border-amber-300';
  return 'bg-slate-100 text-slate-700 border-slate-300';
}

export default function BcpPage() {
  const { bcpActivations, setBcpActivations, addAuditLog } = useBcm();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [disasterType, setDisasterType] = useState<string>(BCP_DISASTER_TYPES[0]);
  const [severityLevel, setSeverityLevel] = useState(1);
  const [activatedChapter, setActivatedChapter] = useState('');
  const [workingArrangement, setWorkingArrangement] = useState<string>(BCP_WORKING_ARRANGEMENTS[0]);
  const [affectedLocation, setAffectedLocation] = useState('');
  const [damageDescription, setDamageDescription] = useState('');
  const [personnelSafety, setPersonnelSafety] = useState('');
  const [affectedSystems, setAffectedSystems] = useState('');
  const [estRecoveryTime, setEstRecoveryTime] = useState('');
  const [authorizedBy, setAuthorizedBy] = useState('');
  const [status, setStatus] = useState<string>(BCP_STATUSES[0]);

  const reset = () => {
    setDisasterType(BCP_DISASTER_TYPES[0]);
    setSeverityLevel(1);
    setActivatedChapter('');
    setWorkingArrangement(BCP_WORKING_ARRANGEMENTS[0]);
    setAffectedLocation('');
    setDamageDescription('');
    setPersonnelSafety('');
    setAffectedSystems('');
    setEstRecoveryTime('');
    setAuthorizedBy('');
    setStatus(BCP_STATUSES[0]);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activatedChapter.trim() && !affectedLocation.trim()) return;
    const now = new Date();
    const newRec: BcpActivationData = {
      id: `bcp-${Date.now()}`,
      code: `BCP-${Math.floor(Math.random() * 900 + 100)}`,
      disasterType,
      severityLevel,
      activatedChapter: activatedChapter.trim(),
      workingArrangement,
      affectedLocation: affectedLocation.trim(),
      damageDescription: damageDescription.trim(),
      personnelSafety: personnelSafety.trim(),
      affectedSystems: affectedSystems.trim(),
      estRecoveryTime: estRecoveryTime.trim(),
      activationTime: now.toISOString().substring(0, 16).replace('T', ' '),
      authorizedBy: authorizedBy.trim(),
      status,
    };
    setBcpActivations((prev) => [newRec, ...prev]);
    addAuditLog('BCP_ACTIVATION', 'BCP', newRec.code, `Aktivasi BCP (${disasterType}, Severity ${severityLevel}) di ${affectedLocation}`);
    setShowModal(false);
    reset();
  };

  const handleDelete = (id: string, code: string) => {
    setBcpActivations((prev) => prev.filter((b) => b.id !== id));
    addAuditLog('DELETE_BCP', 'BCP', code, `Menghapus catatan aktivasi BCP ${code}`);
  };

  const filtered = bcpActivations.filter(
    (b) =>
      b.activatedChapter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.affectedLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.disasterType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.authorizedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = bcpActivations.length;
  const active = bcpActivations.filter((b) => b.status === 'Aktif').length;
  const highSev = bcpActivations.filter((b) => b.severityLevel >= 3).length;

  const handleDownloadPdf = () => {
    if (bcpActivations.length === 0) {
      alert('Belum ada catatan aktivasi BCP untuk diunduh.');
      return;
    }
    exportTablePdf({
      title: 'BCP Activation & Incident Register',
      subtitle: 'Catatan Aktivasi BCP & Asesmen Kerusakan (Pedoman BCP §9.B / §9.C)',
      meta: [
        { label: 'Total Catatan', value: String(bcpActivations.length) },
        { label: 'Sedang Aktif', value: String(active) },
      ],
      columns: [
        { header: 'Kode', key: 'code', width: 20 },
        { header: 'Jenis Bencana', key: 'disasterType', width: 22 },
        { header: 'Severity', key: 'severityLevel', width: 16 },
        { header: 'Bab BCP', key: 'activatedChapter', width: 45 },
        { header: 'Working Arr.', key: 'workingArrangement', width: 24 },
        { header: 'Lokasi', key: 'affectedLocation', width: 32 },
        { header: 'Sistem/Proses', key: 'affectedSystems', width: 35 },
        { header: 'Est. Pemulihan', key: 'estRecoveryTime', width: 24 },
        { header: 'Waktu Aktivasi', key: 'activationTime', width: 28 },
        { header: 'Diotorisasi', key: 'authorizedBy', width: 28 },
        { header: 'Status', key: 'status', width: 20 },
      ],
      rows: bcpActivations.map((b) => ({
        code: b.code,
        disasterType: b.disasterType,
        severityLevel: `Level ${b.severityLevel}`,
        activatedChapter: b.activatedChapter || '-',
        workingArrangement: b.workingArrangement || '-',
        affectedLocation: b.affectedLocation || '-',
        affectedSystems: b.affectedSystems || '-',
        estRecoveryTime: b.estRecoveryTime || '-',
        activationTime: b.activationTime || '-',
        authorizedBy: b.authorizedBy || '-',
        status: b.status,
      })),
      fileName: 'BCP_Activation_Register.pdf',
    });
    addAuditLog('EXPORT_PDF', 'BCP', 'BCP Register', `Mengunduh PDF ${bcpActivations.length} catatan aktivasi BCP`);
  };

  return (
    <div className="p-3.5 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 max-w-7xl mx-auto w-full">
      <div className="bg-gradient-to-br from-[#0B1F3A] to-[#133C67] rounded-2xl p-5 sm:p-6 text-white shadow-lg">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#00A9CE] to-sky-400 flex items-center justify-center shadow-md">
              <Siren className="w-5 h-5 text-[#04283a]" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-cyan-200 font-semibold">Module — Business Continuity Plan</div>
              <h1 className="text-xl sm:text-2xl font-extrabold">BCP Activation &amp; Incident Register</h1>
              <p className="text-cyan-100 text-[13px] mt-0.5">
                Formulir Aktivasi BCP &amp; Asesmen Kerusakan (Pedoman BCP &sect;9.B / &sect;9.C).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDownloadPdf} className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 text-sm font-bold rounded-xl flex items-center gap-2 transition-all">
              <Download className="w-4 h-4" /> PDF
            </button>
            <button onClick={() => setShowModal(true)} className="px-4 py-2.5 bg-[#00A9CE] hover:bg-cyan-400 text-[#04283a] text-sm font-bold rounded-xl flex items-center gap-2 shadow transition-all">
              <Plus className="w-4 h-4" /> Aktivasi / Catat Insiden
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-[12px] font-semibold"><Activity className="w-4 h-4" /> Total Catatan</div>
          <div className="text-2xl font-extrabold text-[#0B1F3A] mt-1">{total}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-[12px] font-semibold"><ShieldAlert className="w-4 h-4 text-red-500" /> Sedang Aktif</div>
          <div className="text-2xl font-extrabold text-red-600 mt-1">{active}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-[12px] font-semibold"><CheckCircle2 className="w-4 h-4 text-orange-500" /> Severity ≥ 3</div>
          <div className="text-2xl font-extrabold text-orange-600 mt-1">{highSev}</div>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari bab BCP, lokasi, jenis bencana, atau otorisasi..." className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-[13px] border-collapse min-w-[1000px]">
          <thead>
            <tr>
              {['Kode', 'Jenis Bencana', 'Severity', 'Bab BCP Diaktifkan', 'Working Arrangement', 'Lokasi Terdampak', 'Sistem/Proses', 'Est. Pemulihan', 'Waktu Aktivasi', 'Diotorisasi', 'Status', ''].map((h, i) => (
                <th key={i} className="bg-[#0B1F3A] text-white text-left px-3 py-2.5 font-semibold whitespace-nowrap text-[12px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={12} className="text-center text-slate-400 py-10">Belum ada catatan aktivasi BCP. Klik <b>Aktivasi / Catat Insiden</b> untuk mengisi.</td></tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50/70 align-top">
                  <td className="px-3 py-2.5 font-mono text-[11px] text-slate-500">{b.code}</td>
                  <td className="px-3 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${DISASTER_CLS[b.disasterType] || 'bg-slate-100 text-slate-700 border-slate-300'}`}>{b.disasterType}</span></td>
                  <td className="px-3 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${severityCls(b.severityLevel)}`}>Level {b.severityLevel}</span></td>
                  <td className="px-3 py-2.5 text-slate-700 max-w-[200px]">{b.activatedChapter || '—'}</td>
                  <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{b.workingArrangement || '—'}</td>
                  <td className="px-3 py-2.5 text-slate-600 max-w-[160px]">{b.affectedLocation || '—'}</td>
                  <td className="px-3 py-2.5 text-slate-600 max-w-[160px]">{b.affectedSystems || '—'}</td>
                  <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{b.estRecoveryTime || '—'}</td>
                  <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{b.activationTime || '—'}</td>
                  <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{b.authorizedBy || '—'}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap"><span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">{b.status}</span></td>
                  <td className="px-3 py-2.5"><button onClick={() => handleDelete(b.id, b.code)} className="text-slate-400 hover:text-red-500" title="Hapus"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[11.5px] text-slate-400">
        Jenis Bencana: Natural / Human / Cyber. Severity Level 1–4 (1–2 ditangani IMT/BCM Manager; 3–4 eskalasi ke Crisis Coordinator/Director). Sesuai Pedoman BCP &sect;2.
      </p>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-[#0B1F3A]">Formulir Aktivasi BCP &amp; Asesmen Kerusakan</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-slate-600">Jenis Bencana</label>
                  <select value={disasterType} onChange={(e) => setDisasterType(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    {BCP_DISASTER_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-slate-600">Severity (1–4)</label>
                  <select value={severityLevel} onChange={(e) => setSeverityLevel(Number(e.target.value))} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    {[1, 2, 3, 4].map((v) => <option key={v} value={v}>Level {v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-slate-600">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    {BCP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-slate-600">Bab BCP yang Diaktifkan</label>
                <input value={activatedChapter} onChange={(e) => setActivatedChapter(e.target.value)} placeholder="mis. BCP Bab 4 — Cyber Disaster Response" className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-slate-600">Alternate Working Arrangement</label>
                  <select value={workingArrangement} onChange={(e) => setWorkingArrangement(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    {BCP_WORKING_ARRANGEMENTS.map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-slate-600">Lokasi Terdampak</label>
                  <input value={affectedLocation} onChange={(e) => setAffectedLocation(e.target.value)} placeholder="mis. Kantor Pusat Lt. 5" className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-slate-600">Deskripsi Kerusakan (Damage Assessment)</label>
                <textarea value={damageDescription} onChange={(e) => setDamageDescription(e.target.value)} rows={2} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-slate-600">Status Keselamatan Personel</label>
                  <input value={personnelSafety} onChange={(e) => setPersonnelSafety(e.target.value)} placeholder="mis. Seluruh personel aman" className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-slate-600">Estimasi Waktu Pemulihan</label>
                  <input value={estRecoveryTime} onChange={(e) => setEstRecoveryTime(e.target.value)} placeholder="mis. 4 jam" className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-slate-600">Sistem / Proses Terdampak (Tier)</label>
                <input value={affectedSystems} onChange={(e) => setAffectedSystems(e.target.value)} placeholder="mis. Core Insurance System (Tier 1)" className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-slate-600">Diotorisasi oleh</label>
                <input value={authorizedBy} onChange={(e) => setAuthorizedBy(e.target.value)} placeholder="mis. Crisis Director" className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-[#0B1F3A] text-white text-sm font-bold">Simpan Aktivasi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
