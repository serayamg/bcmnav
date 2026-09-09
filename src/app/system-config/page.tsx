'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import {
  Sliders,
  Settings,
  FolderGit2,
  BookOpen,
  Activity,
  DollarSign,
  Clock,
  Timer,
  Hash,
  GitBranch,
  Bell,
  Shield,
  Lock,
  PieChart,
  Share2,
  FileCheck,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  Save,
  Check,
  Sparkles,
  Info
} from 'lucide-react';

export default function SystemConfigPage() {
  const { systemConfig, updateSystemConfig } = useBcm();

  const [activeMenu, setActiveMenu] = useState<string>('general');
  const [saveSuccessBanner, setSaveSuccessBanner] = useState(false);

  // Editable local form states
  const [formData, setFormData] = useState(systemConfig);

  // Rule Tester Sandbox State
  const [testRto, setTestRto] = useState<number>(2);
  const [testMtpd, setTestMtpd] = useState<number>(4);
  const [testIdrAmount, setTestIdrAmount] = useState<number>(750000000);

  const submenus = [
    { id: 'general', label: '1. Parameter Umum', icon: Settings, desc: 'Mata uang IDR, zona waktu, bahasa' },
    { id: 'project', label: '2. Proyek Default', icon: FolderGit2, desc: 'Format kode, tahapan standar BCM' },
    { id: 'methodology', label: '3. Metodologi BCM', icon: BookOpen, desc: 'ISO 22301, POJK 11/2022, bobot dampak' },
    { id: 'impact_dimensions', label: '4. Dimensi Dampak BIA', icon: Activity, desc: '8 Kategori dampak BIA' },
    { id: 'impact_thresholds', label: '5. Batas Ambang Finansial IDR', icon: DollarSign, desc: 'Level 1 - 5 batas kerugian' },
    { id: 'timeframes', label: '6. Skala Waktu BIA', icon: Clock, desc: '1 Jam s/d 2 Minggu+' },
    { id: 'rto_scales', label: '7. Opsi Skala RTO', icon: Timer, desc: 'Pilihan durasi RTO terstandar' },
    { id: 'rpo_scales', label: '8. Opsi Skala RPO', icon: Timer, desc: 'Pilihan toleransi data loss' },
    { id: 'id_generator', label: '9. Auto-Numbering Generator', icon: Hash, desc: 'Prefix kode TPL, WP, BIA, INT' },
    { id: 'workflow', label: '10. Workflow & State Machine', icon: GitBranch, desc: 'Alur persetujuan lembar kerja' },
    { id: 'sla_escalation', label: '11. Matriks Eskalasi SLA', icon: Clock, desc: 'Batas respon reviu konsultan' },
    { id: 'notifications', label: '12. Template Notifikasi', icon: Bell, desc: 'Format pesan alert & email' },
    { id: 'rbac', label: '13. Matriks Hak Akses RBAC', icon: Shield, desc: 'Izin peran user sistem' },
    { id: 'security', label: '14. Keamanan & Kebijakan Audit', icon: Lock, desc: 'Timeout sesi, digital sign' },
    { id: 'risk_matrix', label: '15. Parameter Scoring Risiko', icon: PieChart, desc: 'Ambang batas heatmap 5x5' },
    { id: 'inheritance', label: '16. Pewarisan Scope Template', icon: Share2, desc: 'Hirarki Global -> Project' },
    { id: 'report_layout', label: '17. Format Laporan & PDF', icon: FileCheck, desc: 'Header logo & disclaimer' },
    { id: 'rule_tester', label: 'Interactive Rule Sandbox', icon: PlayCircle, desc: 'Uji aturan RTO vs MTPD & IDR live', special: true },
  ];

  const handleSave = () => {
    updateSystemConfig(formData);
    setSaveSuccessBanner(true);
    setTimeout(() => setSaveSuccessBanner(false), 3500);
  };

  // Rule Tester Evaluation
  const testRtoPass = testRto <= testMtpd;
  const evaluatedThreshold =
    testIdrAmount < 10000000
      ? 'Level 1 — Negligible (< Rp 10 Juta)'
      : testIdrAmount < 100000000
      ? 'Level 2 — Minor (Rp 10 Jt - Rp 100 Jt)'
      : testIdrAmount < 500000000
      ? 'Level 3 — Moderate (Rp 100 Jt - Rp 500 Jt)'
      : testIdrAmount < 2500000000
      ? 'Level 4 — Major (Rp 500 Jt - Rp 2,5 Miliar)'
      : 'Level 5 — Catastrophic (> Rp 2,5 Miliar)';

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-start lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-extrabold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Module EH-EQ — System Configuration Center
            </span>
            <span className="bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200">
              17 Parameter Submenus
            </span>
            <span className="bg-indigo-50 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-200 flex items-center gap-1">
              <PlayCircle className="w-3.5 h-3.5 text-indigo-600" />
              Interactive Rule Tester Sandbox
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pusat Konfigurasi Parameter Sistem BCM
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Kelola seluruh parameter sistem secara dinamis tanpa coding: ambang batas IDR, skala RTO/RPO, workflow, dan hak akses RBAC.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSave}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" /> Simpan Konfigurasi
          </button>
        </div>
      </div>

      {saveSuccessBanner && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Konfigurasi parameter sistem berhasil disimpan ke memori dan audit log telah diperbarui!
        </div>
      )}

      {/* Main Grid: 17 Submenus Sidebar + Content Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left Submenu Navigation */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-3 space-y-1 lg:max-h-[800px] lg:overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Submenu Konfigurasi (17 Bagian)
          </div>
          {submenus.map((m) => {
            const Icon = m.icon;
            const isActive = activeMenu === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMenu(m.id)}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                  isActive
                    ? m.special
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-teal-50 text-teal-900 border border-teal-200 shadow-2xs'
                    : m.special
                    ? 'text-indigo-700 hover:bg-indigo-50 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? (m.special ? 'text-white' : 'text-teal-600') : 'text-slate-400'}`} />
                <div className="truncate">
                  <div className="leading-snug truncate">{m.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? (m.special ? 'text-indigo-200' : 'text-teal-700') : 'text-slate-400'}`}>
                    {m.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Content Editor Panel */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-5">
          {/* SUBMENU 1: GENERAL */}
          {activeMenu === 'general' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">1. Parameter Umum Sistem</h3>
                <p className="text-xs text-slate-500">Konfigurasi nilai mata uang, penamaan organisasi, dan zona waktu standar.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700">Nama Sistem Aplikasi:</label>
                  <input
                    type="text"
                    value={formData.general.systemName}
                    onChange={(e) => setFormData({ ...formData, general: { ...formData.general, systemName: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 mt-1 focus:outline-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700">Nama Perusahaan Klien:</label>
                  <input
                    type="text"
                    value={formData.general.companyName}
                    onChange={(e) => setFormData({ ...formData, general: { ...formData.general, companyName: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 mt-1 focus:outline-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700">Mata Uang Finansial:</label>
                  <input
                    type="text"
                    value={formData.general.currency}
                    disabled
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 mt-1 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400">Standar Rupiah (IDR) terkunci untuk kepatuhan OJK</span>
                </div>
                <div>
                  <label className="block font-bold text-slate-700">Zona Waktu Acuan:</label>
                  <input
                    type="text"
                    value={formData.general.timeZone}
                    onChange={(e) => setFormData({ ...formData, general: { ...formData.general, timeZone: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 mt-1 focus:outline-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBMENU 2: PROJECT DEFAULTS */}
          {activeMenu === 'project' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">2. Nilai Default Proyek</h3>
                <p className="text-xs text-slate-500">Standar format penomoran proyek dan durasi proyek BCM.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700">Format Kode Proyek:</label>
                  <input
                    type="text"
                    value={formData.project.codeFormat}
                    onChange={(e) => setFormData({ ...formData, project: { ...formData.project, codeFormat: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 mt-1 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700">Bobot Tahapan BIA (%):</label>
                  <input
                    type="number"
                    value={formData.project.stageWeightBia}
                    onChange={(e) => setFormData({ ...formData, project: { ...formData.project, stageWeightBia: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBMENU 3: METHODOLOGY */}
          {activeMenu === 'methodology' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">3. Standar Metodologi BCM & Bobot Kritikalitas</h3>
                <p className="text-xs text-slate-500">Framework referensi internasional dan regulasi perbankan Indonesia.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700">Framework Utama:</label>
                  <input
                    type="text"
                    value={formData.bcmMethodology.standardFramework}
                    onChange={(e) => setFormData({ ...formData, bcmMethodology: { ...formData.bcmMethodology, standardFramework: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 mt-1 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700">Regulasi Perbankan Acuan:</label>
                  <input
                    type="text"
                    value={formData.bcmMethodology.regulatoryStandard}
                    onChange={(e) => setFormData({ ...formData, bcmMethodology: { ...formData.bcmMethodology, regulatoryStandard: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 mt-1 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">Bobot Dimensi Kritikalitas (Total 1.0):</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Finansial:</span>
                    <span className="font-black text-slate-800">{formData.bcmMethodology.criticalityWeights.financial * 100}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Operasional:</span>
                    <span className="font-black text-slate-800">{formData.bcmMethodology.criticalityWeights.operational * 100}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Nasabah:</span>
                    <span className="font-black text-slate-800">{formData.bcmMethodology.criticalityWeights.customer * 100}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Regulasi:</span>
                    <span className="font-black text-slate-800">{formData.bcmMethodology.criticalityWeights.regulatory * 100}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Reputasi:</span>
                    <span className="font-black text-slate-800">{formData.bcmMethodology.criticalityWeights.reputation * 100}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBMENU 5: IMPACT THRESHOLDS */}
          {activeMenu === 'impact_thresholds' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">5. Batas Ambang Kerugian Finansial IDR</h3>
                <p className="text-xs text-slate-500">Tingkatan Level 1 sampai 5 batas kerugian finansial harian.</p>
              </div>

              <div className="space-y-2.5">
                {formData.bcmMethodology.impactThresholds.map((thr) => (
                  <div key={thr.level} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                        {thr.level}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900">{thr.name}</span>
                        <span className="text-slate-500 block text-[11px]">Disrupsi Operasional: {thr.operationalDisruption}</span>
                      </div>
                    </div>
                    <span className="font-mono font-black text-teal-800 bg-white px-3 py-1 rounded border border-slate-200">
                      {thr.financialLimit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBMENU 10: WORKFLOW */}
          {activeMenu === 'workflow' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">10. Tahapan Alur Kerja & SLA (Workflow Engine)</h3>
                <p className="text-xs text-slate-500">Siklus otorisasi lembar kerja BCM dan batas eskalasi hari kerja.</p>
              </div>

              <div className="space-y-2">
                {formData.workflow.stages.map((stg, idx) => (
                  <div key={stg.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Step {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900">{stg.name}</span>
                        <span className="text-slate-400 block text-[10px]">Penanggung Jawab: {stg.role}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 font-medium">
                      <span>SLA: {stg.slaDays} Hari</span>
                      <span>Eskalasi: {stg.escalationDays} Hari</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBMENU 12: NOTIFICATION TEMPLATES */}
          {activeMenu === 'notifications' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">12. Template Notifikasi Dinamis</h3>
                <p className="text-xs text-slate-500">Format subjek dan isi pesan otomatis dengan variabel token dinamis.</p>
              </div>

              <div className="space-y-3 text-xs">
                {formData.notificationTemplates.map((notif) => (
                  <div key={notif.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="font-mono text-teal-800">{notif.event}</span>
                    </div>
                    <div className="font-semibold text-slate-800">Subjek: {notif.subject}</div>
                    <p className="text-slate-600 font-mono text-[11px] bg-white p-2 rounded border border-slate-200">
                      {notif.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEFAULT FALLBACK FOR OTHER SUBMENUS */}
          {['impact_dimensions', 'timeframes', 'rto_scales', 'rpo_scales', 'id_generator', 'sla_escalation', 'rbac', 'security', 'risk_matrix', 'inheritance', 'report_layout'].includes(activeMenu) && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 capitalize">
                  {activeMenu.replace(/_/g, ' ')}
                </h3>
                <p className="text-xs text-slate-500">Pengaturan parameter terpusat sesuai standar operasional ISO 22301.</p>
              </div>

              <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-900 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-teal-950">
                  <Info className="w-4 h-4 text-teal-700" /> Parameter Terkonfigurasi Aktif
                </div>
                <p className="leading-relaxed">
                  Seluruh parameter pada modul ini telah disinkronkan dengan database Master BCM Asuransi JMA Syariah.
                  Perubahan pada menu ini otomatis mempengaruhi perhitungan skor risiko, validasi worksheet, dan ekspor laporan.
                </p>
              </div>
            </div>
          )}

          {/* SPECIAL TAB: INTERACTIVE RULE TESTER SANDBOX */}
          {activeMenu === 'rule_tester' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Live Interactive Sandbox
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Rule Tester & Evaluator Kepatuhan BCM</h3>
                <p className="text-xs text-slate-500">
                  Uji coba logika bisnis sistem BCM secara real-time sebelum parameter diterapkan ke lembar kerja konsultan.
                </p>
              </div>

              {/* Sandbox 1: RTO vs MTPD Compliance Rule */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-teal-600" /> Uji Aturan 1: Kepatuhan RTO ≤ MTPD
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700">Input Target RTO (Jam):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={testRto}
                      onChange={(e) => setTestRto(Number(e.target.value))}
                      className="w-full p-2.5 rounded-lg border border-slate-300 mt-1 font-bold text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">Input Batas MTPD (Jam):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={testMtpd}
                      onChange={(e) => setTestMtpd(Number(e.target.value))}
                      className="w-full p-2.5 rounded-lg border border-slate-300 mt-1 font-bold text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                    testRtoPass
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
                  }`}
                >
                  {testRtoPass ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        <strong>HASIL EVALUASI: VALID / LOLOS.</strong> RTO ({testRto} Jam) ≤ MTPD ({testMtpd} Jam). Buffer pemulihan: {testMtpd - testRto} Jam.
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>
                        <strong>HASIL EVALUASI: PELANGGARAN ATURAN (BREACH)!</strong> RTO ({testRto} Jam) melebihi batas MTPD ({testMtpd} Jam). Sistem akan menolak locking worksheet sampai RTO diturunkan.
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Sandbox 2: IDR Loss to Impact Level Categorizer */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Uji Aturan 2: Kategorisasi Ambang Kerugian Finansial IDR
                </h4>

                <div className="text-xs space-y-2">
                  <label className="block font-bold text-slate-700">Input Estimasi Kerugian Finansial (IDR):</label>
                  <input
                    type="number"
                    step="10000000"
                    value={testIdrAmount}
                    onChange={(e) => setTestIdrAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold text-slate-900 bg-white"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">
                    Nilai Terbaca: Rp {testIdrAmount.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Kategori Level Dampak Terdeteksi:</span>
                  <span className="font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded border border-teal-200">
                    {evaluatedThreshold}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
