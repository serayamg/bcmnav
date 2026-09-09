'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  ShieldCheck,
  LogIn,
  ListChecks,
  LayoutGrid,
  KeyRound,
  UserCircle2,
  CheckCircle2,
  Workflow,
  ChevronRight,
} from 'lucide-react';
import {
  MANUAL_MODULES,
  MANUAL_ROLES,
  ROLE_PERMS,
  PERMISSION_LABEL,
  accessibleModules,
  BCM_LIFECYCLE,
  ManualRole,
} from '@/lib/manual-data';

const BADGE_STYLE: Record<string, string> = {
  Admin: 'bg-rose-100 text-rose-800 border-rose-200',
  Consultant: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  Client: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Management: 'bg-violet-100 text-violet-800 border-violet-200',
};

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#0B1F3A] text-cyan-300 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-[#0B1F3A]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function RoleOverview({ role }: { role: ManualRole }) {
  const mods = accessibleModules(role.key);
  const perms = ROLE_PERMS[role.key] ?? [];

  return (
    <div className="space-y-4">
      {/* Overview */}
      <SectionCard icon={UserCircle2} title={`Ikhtisar Peran — ${role.title}`}>
        <p className="text-slate-700 text-[15px] mb-4">{role.tagline}</p>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="flex gap-2">
            <span className="text-slate-500 font-semibold w-32 shrink-0">Persona</span>
            <span className="text-slate-800">
              {role.persona}{' '}
              <span className={`ml-1 inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${BADGE_STYLE[role.badge] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                {role.badge}
              </span>
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500 font-semibold w-32 shrink-0">Username contoh</span>
            <code className="text-cyan-700 font-mono text-xs bg-cyan-50 px-1.5 py-0.5 rounded">{role.login.username}</code>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500 font-semibold w-32 shrink-0">Metode MFA</span>
            <span className="text-slate-800">{role.login.mfa}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500 font-semibold w-32 shrink-0">Organisasi</span>
            <span className="text-slate-800">{role.org}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500 font-semibold w-32 shrink-0">Modul akses</span>
            <span className="text-slate-800">
              {mods.length} dari {Object.keys(MANUAL_MODULES).length} modul
            </span>
          </div>
        </div>
      </SectionCard>

      {/* Responsibilities */}
      <SectionCard icon={ShieldCheck} title="Tanggung Jawab Utama">
        <ul className="space-y-2">
          {role.responsibilities.map((r, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Login */}
      <SectionCard icon={LogIn} title="Cara Masuk (Login)">
        <ol className="space-y-2.5">
          {[
            <>Buka halaman <b>Login</b> (<code className="text-xs">/login</code>).</>,
            <>Masukkan <b>username</b> (<code className="text-xs">{role.login.username}</code>) atau email dan kata sandi (min. 6 karakter).</>,
            <>Jika MFA aktif ({role.login.mfa}), masukkan kode 6-digit yang diminta.</>,
            <>Setelah berhasil, Anda diarahkan ke <b>Command Center</b> sesuai hak akses peran ini.</>,
          ].map((node, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-700">
              <span className="w-6 h-6 rounded-full bg-cyan-500 text-[#04283a] text-xs font-extrabold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="pt-0.5">{node}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-[13px] text-amber-800">
          <b>Keamanan:</b> 5 kali gagal login akan mengunci akun secara otomatis. Hubungi Super Admin untuk membuka kunci atau reset sandi.
        </div>
      </SectionCard>

      {/* Accessible modules */}
      <SectionCard icon={LayoutGrid} title="Modul yang Dapat Diakses">
        <div className="grid sm:grid-cols-2 gap-3">
          {mods.map((m) => {
            const mo = MANUAL_MODULES[m];
            return (
              <div key={m} className="border border-slate-200 rounded-xl p-3.5 hover:border-cyan-400 transition-colors">
                <div className="font-bold text-[#0B1F3A] text-[13.5px]">{mo.name}</div>
                <div className="font-mono text-[11.5px] text-cyan-600">{mo.href}</div>
                <div className="text-xs text-slate-500 mt-1">{mo.desc}</div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Tasks */}
      <SectionCard icon={ListChecks} title="Panduan Tugas Utama (Langkah demi Langkah)">
        <div className="space-y-4">
          {role.tasks.map((tk, i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-4">
              <div className="font-bold text-[#133C67] text-sm mb-2">{tk.t}</div>
              <ol className="space-y-1.5">
                {tk.s.map((step, j) => (
                  <li key={j} className="flex gap-3 text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-cyan-500 text-[#04283a] text-[11px] font-extrabold flex items-center justify-center shrink-0">
                      {j + 1}
                    </span>
                    <span className="pt-px">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* RBAC */}
      <SectionCard icon={KeyRound} title="Matriks Hak Akses (RBAC)">
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px] border-collapse">
            <thead>
              <tr>
                <th className="border border-slate-200 bg-[#0B1F3A] text-white text-left px-3 py-2 font-semibold">Izin</th>
                <th className="border border-slate-200 bg-[#0B1F3A] text-white text-left px-3 py-2 font-semibold">Kode</th>
                <th className="border border-slate-200 bg-[#0B1F3A] text-white text-left px-3 py-2 font-semibold">Dimiliki</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(PERMISSION_LABEL).map((p) => {
                const has = perms.includes(p);
                return (
                  <tr key={p} className="even:bg-slate-50/70">
                    <td className="border border-slate-200 px-3 py-2 text-slate-700">{PERMISSION_LABEL[p]}</td>
                    <td className="border border-slate-200 px-3 py-2">
                      <code className="text-[11px] text-slate-500">{p}</code>
                    </td>
                    <td className="border border-slate-200 px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${has ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                        {has ? 'YA' : '—'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

export default function ManualPage() {
  const [activeKey, setActiveKey] = useState<string>('home');
  const activeRole = MANUAL_ROLES.find((r) => r.key === activeKey);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0B1F3A] to-[#133C67] rounded-2xl p-6 text-white shadow-lg mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#00A9CE] to-sky-400 flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5 text-[#04283a]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold">User Manual &amp; Guide</h1>
            <p className="text-cyan-100 text-[13px]">
              Panduan penggunaan BCM Navigator per peran · ISO 22301:2019 &amp; ISO 22317:2021
            </p>
          </div>
        </div>
      </div>

      {/* Role tab bar */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setActiveKey('home')}
          className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold border transition-colors ${
            activeKey === 'home'
              ? 'bg-[#00A9CE] text-[#04283a] border-cyan-400'
              : 'bg-white text-slate-600 border-slate-200 hover:border-cyan-400'
          }`}
        >
          🏠 Beranda
        </button>
        {MANUAL_ROLES.map((r) => (
          <button
            key={r.key}
            onClick={() => setActiveKey(r.key)}
            className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold border transition-colors ${
              activeKey === r.key
                ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                : 'bg-white text-slate-600 border-slate-200 hover:border-cyan-400'
            }`}
          >
            {r.title}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeKey === 'home' || !activeRole ? (
        <div className="space-y-4">
          <SectionCard icon={BookOpen} title="Tentang Dokumen Ini">
            <p className="text-slate-700 text-[15px]">
              Manual ini menjelaskan cara penggunaan sistem <b>BCM Navigator</b> untuk setiap peran pengguna. Sistem
              membantu konsultan dan klien menjalankan program Business Continuity Management (BCM) dan Business Impact
              Analysis (BIA) sesuai ISO 22301 &amp; ISO 22317, dari setup proyek, pengumpulan dokumen, pemetaan
              stakeholder, registrasi proses, asesmen BIA, hingga validasi, pelaporan, dan tata kelola.
            </p>
            <p className="text-slate-600 text-sm mt-2">
              Pilih peran Anda pada tab di atas atau kartu di bawah untuk membuka panduan khusus (login, modul yang dapat
              diakses, tugas langkah demi langkah, dan matriks hak akses).
            </p>
          </SectionCard>

          <SectionCard icon={UserCircle2} title="Pilih Peran Pengguna">
            <div className="grid sm:grid-cols-2 gap-3.5">
              {MANUAL_ROLES.map((r) => {
                const n = accessibleModules(r.key).length;
                return (
                  <button
                    key={r.key}
                    onClick={() => setActiveKey(r.key)}
                    className="text-left border border-slate-200 rounded-2xl p-4 bg-white hover:border-cyan-400 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-[#0B1F3A] text-[15px]">{r.title}</div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-500 transition-colors" />
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {r.persona} ·{' '}
                      <span className={`inline-block px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${BADGE_STYLE[r.badge] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {r.badge}
                      </span>
                    </div>
                    <div className="text-[13px] text-slate-600 mt-2">{r.tagline}</div>
                    <div className="mt-2 flex gap-2">
                      <span className="text-[11px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-100 rounded-lg px-2 py-0.5">
                        {n} modul akses
                      </span>
                      <span className="text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200 rounded-lg px-2 py-0.5">
                        {(ROLE_PERMS[r.key] ?? []).length} izin
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard icon={LayoutGrid} title="Daftar Modul Sistem">
            <div className="overflow-x-auto">
              <table className="w-full text-[13.5px] border-collapse">
                <thead>
                  <tr>
                    <th className="border border-slate-200 bg-[#0B1F3A] text-white text-left px-3 py-2 font-semibold">Modul</th>
                    <th className="border border-slate-200 bg-[#0B1F3A] text-white text-left px-3 py-2 font-semibold">Rute</th>
                    <th className="border border-slate-200 bg-[#0B1F3A] text-white text-left px-3 py-2 font-semibold">Deskripsi</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(MANUAL_MODULES).map((m) => (
                    <tr key={m} className="even:bg-slate-50/70">
                      <td className="border border-slate-200 px-3 py-2 font-semibold text-[#0B1F3A]">{MANUAL_MODULES[m].name}</td>
                      <td className="border border-slate-200 px-3 py-2">
                        <code className="text-[11.5px] text-cyan-600">{MANUAL_MODULES[m].href}</code>
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-600">{MANUAL_MODULES[m].desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard icon={Workflow} title="Alur Kerja Umum (BCM Lifecycle)">
            <ol className="space-y-2">
              {BCM_LIFECYCLE.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-cyan-500 text-[#04283a] text-xs font-extrabold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </SectionCard>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setActiveKey('home')}
            className="text-cyan-600 text-[13px] font-semibold mb-3 hover:underline"
          >
            ← Kembali ke Daftar Manual
          </button>
          <RoleOverview role={activeRole} />
        </div>
      )}
    </div>
  );
}
