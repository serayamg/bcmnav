'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBcm } from '@/lib/store';
import {
  Activity,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  BarChart3,
  Building2,
  User,
  Database
} from 'lucide-react';

export default function BiaDashboardPage() {
  const { processes } = useBcm();
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');

  const filteredProcesses = processes.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.unitName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier =
      tierFilter === 'ALL' || (p.criticalityTier && p.criticalityTier.includes(tierFilter));
    return matchesSearch && matchesTier;
  });

  const getTierCount = (tier: string) => {
    if (tier === 'ALL') return processes.length;
    return processes.filter((p) => p.criticalityTier && p.criticalityTier.includes(tier)).length;
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start lg:items-center justify-between gap-3.5 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2 flex-wrap">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider font-extrabold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 sm:py-1 rounded-full border border-cyan-200 shadow-2xs">
              Module 6 — BIA Engine
            </span>
            <span className="bg-emerald-50 text-emerald-800 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-200 shadow-2xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ISO 22317:2021
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Business Impact Analysis (BIA) Register & Wizard
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Penilaian kuantitatif & kualitatif dampak penghentian proses bisnis, penetapan MTPD, RTO, RPO, dan MBCO.
          </p>
        </div>

        <Link
          href={`/bia/${processes[0]?.id || 'proc-01'}`}
          className="w-full sm:w-auto px-5 py-3 sm:py-3.5 bg-gradient-to-r from-[#00A9CE] to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-extrabold rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-[0.98] shrink-0 cursor-pointer"
        >
          <Activity className="w-4.5 h-4.5 text-slate-950" />
          <span className="text-xs sm:text-sm font-black">Buka 12-Step BIA Wizard</span>
          <ArrowRight className="w-4 h-4 ml-auto sm:ml-0" />
        </Link>
      </div>

      {/* Metric Cards (2x2 on Mobile, 4-Cols on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total BIA */}
        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-slate-500 uppercase">
              Total BIA
            </span>
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <BarChart3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
          <div className="my-1.5 sm:my-2">
            <div className="text-2xl sm:text-4xl font-black text-slate-900 leading-none">
              {processes.length}
            </div>
          </div>
          <div className="text-[10px] sm:text-xs font-semibold text-slate-500 truncate">
            {processes.length} Proses Terdaftar
          </div>
        </div>

        {/* Tier 1 */}
        <div className="bg-gradient-to-b from-white to-rose-50/30 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-rose-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-rose-700 uppercase">
              Tier 1 (P1)
            </span>
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
          <div className="my-1.5 sm:my-2">
            <div className="text-2xl sm:text-4xl font-black text-rose-700 leading-none">
              {processes.filter((p) => p.criticalityTier?.includes('Tier 1')).length}
            </div>
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-rose-600 truncate">
            RTO ≤ 2 Jam (Critical)
          </div>
        </div>

        {/* Tier 2 */}
        <div className="bg-gradient-to-b from-white to-amber-50/30 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-amber-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-amber-700 uppercase">
              Tier 2 (P2)
            </span>
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
          <div className="my-1.5 sm:my-2">
            <div className="text-2xl sm:text-4xl font-black text-amber-700 leading-none">
              {processes.filter((p) => p.criticalityTier?.includes('Tier 2')).length}
            </div>
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-amber-600 truncate">
            RTO 2–4 Jam (High)
          </div>
        </div>

        {/* Validated */}
        <div className="bg-gradient-to-b from-white to-emerald-50/30 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-emerald-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-emerald-700 uppercase">
              Validated
            </span>
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
          <div className="my-1.5 sm:my-2">
            <div className="text-2xl sm:text-4xl font-black text-emerald-700 leading-none">
              {processes.filter((p) => p.status === 'Validated' || p.status === 'Approved').length}
            </div>
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-emerald-600 truncate">
            Siap Strategi BCM
          </div>
        </div>
      </div>

      {/* Search and Tier Filters (Clean horizontal scrolling bar on mobile) */}
      <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama proses, kode, atau unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A9CE]/20 focus:border-[#00A9CE] text-slate-800 placeholder:text-slate-400 transition-all"
          />
        </div>

        {/* Filter Pills with Counts (No awkward line breaks on mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 -mx-1 px-1 scrollbar-none">
          {[
            { id: 'ALL', label: 'Semua Tier' },
            { id: 'Tier 1', label: 'Tier 1' },
            { id: 'Tier 2', label: 'Tier 2' },
            { id: 'Tier 4', label: 'Tier 4' },
          ].map((t) => {
            const count = getTierCount(t.id);
            const active = tierFilter === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTierFilter(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  active
                    ? 'bg-[#0B1F3A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{t.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    active ? 'bg-cyan-400 text-slate-950' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Process List Section */}
      <div className="space-y-3">
        {/* MOBILE VIEW: High-Conversion Process Cards (Hidden on md and larger screens) */}
        <div className="space-y-3 md:hidden">
          {filteredProcesses.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
              Tidak ada proses yang sesuai dengan pencarian atau filter.
            </div>
          ) : (
            filteredProcesses.map((proc) => {
              const isTier1 = proc.criticalityTier?.includes('Tier 1');
              const isTier2 = proc.criticalityTier?.includes('Tier 2');
              const isValidated = proc.status === 'Validated' || proc.status === 'Approved';

              return (
                <div
                  key={proc.id}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 space-y-3 hover:border-[#00A9CE]/60 transition-all"
                >
                  {/* Card Header: Code, Tier Badge & SPOF */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {proc.code}
                      </span>
                      {proc.criticalityTier && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isTier1
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isTier2
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {proc.criticalityTier}
                        </span>
                      )}
                    </div>

                    {proc.spofFlag ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                        SPOF Alert
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Redundant
                      </span>
                    )}
                  </div>

                  {/* Card Title & Owner */}
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm leading-snug">
                      {proc.name}
                    </h2>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-700 font-semibold">{proc.unitName}</span>
                      <span>•</span>
                      <span className="text-slate-500">{proc.processOwnerName}</span>
                    </div>
                  </div>

                  {/* Recovery Metrics Micro Grid (3 columns: MTPD, RTO, RPO) */}
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">MTPD / MAO</div>
                      <div className="text-xs font-black text-slate-800 mt-0.5">{proc.mtpd || '-'}</div>
                    </div>
                    <div className="border-x border-slate-200 px-1">
                      <div className="text-[10px] text-cyan-700 font-bold uppercase">Target RTO</div>
                      <div className="text-xs font-black text-cyan-800 mt-0.5">{proc.rto || '-'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">RPO Limit</div>
                      <div className="text-xs font-black text-slate-800 mt-0.5">{proc.rpo || '-'}</div>
                    </div>
                  </div>

                  {/* Card Footer: Status Pill & Action Button */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                        isValidated
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : proc.status === 'In Assessment'
                          ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {proc.status}
                    </span>

                    <Link
                      href={`/bia/${proc.id}`}
                      className="px-3.5 py-1.5 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs inline-flex items-center gap-1.5 transition-all shadow-2xs active:scale-[0.98]"
                    >
                      <span>{isValidated ? 'Lihat BIA' : 'Buka Wizard'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* DESKTOP VIEW: Full Data Table (Hidden on mobile screens) */}
        <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-800">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Proses & Process Owner</th>
                  <th className="py-3.5 px-4">MTPD / MAO</th>
                  <th className="py-3.5 px-4">RTO Target</th>
                  <th className="py-3.5 px-4">RPO Target</th>
                  <th className="py-3.5 px-4">Criticality Tier</th>
                  <th className="py-3.5 px-4">SPOF Alert</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {filteredProcesses.map((proc) => {
                  return (
                    <tr key={proc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5 max-w-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            {proc.code}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-sm sm:text-base leading-snug">{proc.name}</div>
                        <div className="text-xs sm:text-sm text-slate-500 mt-1">
                          <span className="text-slate-800 font-semibold">{proc.unitName}</span> • Owner: {proc.processOwnerName}
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 text-sm sm:text-base">{proc.mtpd || 'Belum dihitung'}</div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">Max Outage</div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-extrabold text-cyan-800 text-sm sm:text-base">{proc.rto || 'Belum dihitung'}</div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">Recovery Time</div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 text-sm sm:text-base">{proc.rpo || 'Belum dihitung'}</div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">Data Loss Limit</div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        {proc.criticalityTier ? (
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              proc.criticalityTier.includes('Tier 1')
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : proc.criticalityTier.includes('Tier 2')
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {proc.criticalityTier}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">-</span>
                        )}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        {proc.spofFlag ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            SPOF Risk
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-slate-500 px-2 py-0.5">Redundant</span>
                        )}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold ${
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
                          className="px-4 py-2 bg-[#00A9CE] hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm inline-flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-sm cursor-pointer"
                        >
                          <span>{proc.status === 'Validated' ? 'Lihat BIA' : 'Lengkapi Wizard'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
