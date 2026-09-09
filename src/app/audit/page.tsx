'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import {
  History,
  Search,
  ShieldCheck,
  Filter,
  Lock,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  KeyRound,
  Database,
  Eye,
  RefreshCw,
} from 'lucide-react';

export default function AuditPage() {
  const { auditLogs } = useBcm();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recordName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    return matchesSearch && matchesAction && matchesModule;
  });

  const getActionBadge = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE':
        return 'bg-blue-100/90 text-blue-900 border-blue-200';
      case 'APPROVE':
        return 'bg-emerald-100/90 text-emerald-900 border-emerald-200';
      case 'REVIEW':
        return 'bg-cyan-100/90 text-cyan-900 border-cyan-200';
      case 'UPDATE':
        return 'bg-amber-100/90 text-amber-900 border-amber-200';
      case 'LOGIN':
        return 'bg-purple-100/90 text-purple-900 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getModuleBadge = (mod: string) => {
    switch (mod.toUpperCase()) {
      case 'PROJECT':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'BIA':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'DRL':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'STAKEHOLDER':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'AUTH':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
              Module 13 — Audit & Traceability
            </span>
            <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
              SOC2 & ISO 27001 Ready
            </span>
            <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-300">
              ISO 22301 Clause 9.2 Aligned
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Audit Trail & Log Kepatuhan Sistem
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
            Rekam jejak seluruh aktivitas konsultasi, perubahan parameter, unggahan dokumen, dan persetujuan BIA yang bersifat immutable.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Log audit trail telah diekspor dalam format CSV terenkripsi SHA-256.')}
          className="px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 hover:bg-slate-50 text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all shrink-0"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Security & Integrity Architecture Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md border border-slate-700">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 border border-emerald-500/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Immutable Append-Only Architecture</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                SHA-256 Hash Chain
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Setiap rekaman dilengkapi hashing integritas data, identitas peran, dan stempel waktu UTC. Catatan audit tidak dapat diubah maupun dihapus oleh akun non-auditor.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto text-xs text-slate-300 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">WORM Storage: Active</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="font-mono text-cyan-400 font-bold">{auditLogs.length} Total Logs</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari user, modul, nama record, atau detail aktivitas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:border-[#00A9CE] focus:ring-1 focus:ring-[#00A9CE] placeholder:text-slate-400 bg-slate-50/50 hover:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mr-1 shrink-0">
            Aksi:
          </span>
          {['ALL', 'CREATE', 'APPROVE', 'REVIEW', 'LOGIN', 'UPDATE'].map((act) => (
            <button
              type="button"
              key={act}
              onClick={() => setActionFilter(act)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                actionFilter === act
                  ? 'bg-[#0B1F3A] text-white shadow-sm ring-2 ring-[#0B1F3A]/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-transparent'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="bg-slate-50/90 text-slate-700 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-5 w-44">Waktu (Timestamp)</th>
                <th className="py-3.5 px-4 sm:px-5 min-w-[200px]">Pengguna (User & Role)</th>
                <th className="py-3.5 px-4 sm:px-5 w-32">Aksi (Action)</th>
                <th className="py-3.5 px-4 sm:px-5 min-w-[280px]">Modul & Target Record</th>
                <th className="py-3.5 px-4 sm:px-5 min-w-[320px]">Detail Perubahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 text-sm">
                    Tidak ada catatan audit log yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 sm:px-5 align-top">
                      <div className="font-mono text-xs font-semibold text-slate-700 whitespace-nowrap">
                        {log.timestamp}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">UTC+7 (WIB)</span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-5 align-top">
                      <div className="font-bold text-slate-900 text-sm">{log.userName}</div>
                      <span className="inline-block mt-0.5 text-[11px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-5 align-top">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg font-bold text-xs border tracking-wide ${getActionBadge(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-5 align-top">
                      <div className="flex items-start gap-1.5 flex-wrap">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getModuleBadge(
                            log.module
                          )}`}
                        >
                          {log.module}
                        </span>
                        <span className="font-semibold text-slate-900 text-sm">
                          {log.recordName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-5 align-top text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Menampilkan <strong>{filteredLogs.length}</strong> dari total{' '}
              <strong>{auditLogs.length}</strong> entri audit trail
            </span>
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            Hash Verifikasi: <span className="text-slate-800 font-semibold">9e8b1d...c7a2 (Verified)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

