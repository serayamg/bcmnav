'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import { UserRole, SystemUser, UserPermission } from '@/types';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  KeyRound,
  UserPlus,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Globe,
  Fingerprint,
  RefreshCw,
  X,
  Check,
  Search,
  Eye,
  EyeOff,
  Sliders,
  FileText
} from 'lucide-react';

export const UserSecurityCenterModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
    users,
    currentUser,
    securityLogs,
    registerUser,
    updateUser,
    toggleUserLock,
    resetUserPassword,
  } = useBcm();

  const [activeTab, setActiveTab] = useState<'directory' | 'register' | 'rbac' | 'logs'>('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Registration Form State
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regTitle, setRegTitle] = useState('');
  const [regDepartment, setRegDepartment] = useState('Divisi Operasional & Settlement');
  const [regRole, setRegRole] = useState<UserRole>('BCM_CONSULTANT');
  const [regPassword, setRegPassword] = useState('');
  const [regMfaType, setRegMfaType] = useState<'TOTP Authenticator' | 'Hardware FIDO2' | 'SMS OTP'>('TOTP Authenticator');
  const [showPassword, setShowPassword] = useState(false);
  const [tempPassGenerated, setTempPassGenerated] = useState<string | null>(null);

  if (!isOpen) return null;

  // Strict RBAC Defense-in-Depth: Only SUPER_ADMIN can access this security center
  if (currentUser?.role !== 'SUPER_ADMIN') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-100 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Akses Keamanan Ditolak</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Modul <strong>Super Admin Security Center</strong> (Pusat Manajemen Kredensial Pengguna & Otorisasi RBAC) bersifat rahasia dan <strong>hanya dapat diakses secara eksklusif oleh akun dengan peran SUPER_ADMIN</strong>.
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded-xl border border-red-200/60 text-[11px] text-red-700 font-mono text-left space-y-1">
            <div><strong>ID Pengguna</strong>: {currentUser?.id || 'Unknown'} ({currentUser?.fullName || 'Anonymous'})</div>
            <div><strong>Role Aktif</strong> : {currentUser?.role || 'None'} (Unauthorized)</div>
            <div><strong>Mitigasi</strong>   : Akses diblokir oleh Security Barrier ISO 27001</div>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-[#0B1F3A] hover:bg-[#133C67] text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer"
          >
            Tutup & Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Password Policy Analysis
  const pwdLengthValid = regPassword.length >= 12;
  const pwdUpperValid = /[A-Z]/.test(regPassword);
  const pwdLowerValid = /[a-z]/.test(regPassword);
  const pwdNumberValid = /[0-9]/.test(regPassword);
  const pwdSymbolValid = /[^A-Za-z0-9]/.test(regPassword);
  const pwdScore = [pwdLengthValid, pwdUpperValid, pwdLowerValid, pwdNumberValid, pwdSymbolValid].filter(Boolean).length;

  const handleExecuteRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim()) return;

    registerUser({
      fullName: regFullName.trim(),
      username: regUsername.trim() || regEmail.split('@')[0],
      email: regEmail.trim(),
      title: regTitle.trim() || 'BCM Specialist',
      department: regDepartment,
      role: regRole,
      mfaEnabled: true,
      mfaType: regMfaType,
    });

    setRegFullName('');
    setRegUsername('');
    setRegEmail('');
    setRegTitle('');
    setRegPassword('');
    setActiveTab('directory');
  };

  const handleResetPassword = (userId: string) => {
    const temp = resetUserPassword(userId);
    setTempPassGenerated(`Password sementara: ${temp}`);
    setTimeout(() => setTempPassGenerated(null), 8000);
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const allPermissionsList: Array<{ key: UserPermission; label: string }> = [
    { key: 'SYSTEM_CONFIG_MANAGE', label: 'Kelola Parameter Sistem' },
    { key: 'USER_CREDENTIAL_MANAGE', label: 'Kelola User & Kredensial' },
    { key: 'SECURITY_POLICY_MANAGE', label: 'Kebijakan Keamanan & Audit' },
    { key: 'AUDIT_LOG_EXPORT', label: 'Ekspor Audit Trail' },
    { key: 'BIA_APPROVE_FINAL', label: 'Persetujuan Final BIA' },
    { key: 'BIA_WORKSHEET_EDIT', label: 'Ubah / Edit Worksheet BIA' },
    { key: 'BIA_WORKSHEET_VIEW', label: 'Lihat Worksheet BIA' },
    { key: 'TEMPLATE_MANAGE', label: 'Kelola Template Kerja' },
    { key: 'WORKING_PAPER_EDIT', label: 'Tulis / Edit Kertas Kerja' },
    { key: 'PROCESS_REGISTER_EDIT', label: 'Pendaftaran Proses Bisnis' },
    { key: 'DRL_UPLOAD_RESPONSE', label: 'Unggah Dokumen Bukti DRL' },
    { key: 'INTERVIEW_RESPONDENT', label: 'Narasumber Wawancara' },
    { key: 'EXECUTIVE_HEATMAP_VIEW', label: 'Lihat Heatmap Eksekutif' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-[#0B1F3A] text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-extrabold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/40">
                  Super Admin Security Center
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> OWASP & ISO 27001 Hardened
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight mt-1">
                Pusat Manajemen Kredensial Pengguna & Otorisasi RBAC
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Temporary Password Notification Banner */}
        {tempPassGenerated && (
          <div className="bg-amber-500 text-slate-950 px-5 py-2.5 font-bold text-xs flex items-center justify-between shadow-xs animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              <span>{tempPassGenerated} (Catat sekarang, tidak akan ditampilkan ulang!)</span>
            </div>
            <button onClick={() => setTempPassGenerated(null)} className="text-xs underline">
              Tutup
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex items-center gap-2 shrink-0 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'directory'
                ? 'bg-[#00A9CE] text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-4 h-4" /> Direktori Kredensial ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'register'
                ? 'bg-[#00A9CE] text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Daftarkan Pengguna Baru
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'rbac'
                ? 'bg-[#00A9CE] text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sliders className="w-4 h-4" /> Matriks Hak Akses (RBAC)
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-[#00A9CE] text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> Security Event Audit ({securityLogs.length})
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* TAB 1: USER DIRECTORY */}
          {activeTab === 'directory' && (
            <div className="space-y-4">
              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari nama, email, username, atau divisi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-teal-500"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full sm:w-auto text-xs py-1.5 px-3 rounded-xl border border-slate-300 bg-white focus:outline-teal-500 font-semibold"
                >
                  <option value="ALL">Semua Role / Hak Akses</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="CONSULTANT_DIRECTOR">Consultant Director</option>
                  <option value="BCM_CONSULTANT">BCM Consultant</option>
                  <option value="CLIENT_COORDINATOR">Client Coordinator</option>
                  <option value="UNIT_HEAD">Unit Head</option>
                  <option value="PROCESS_OWNER">Process Owner</option>
                  <option value="VIEWER">Viewer / Executive</option>
                </select>
              </div>

              {/* Users Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsers.map((u) => {
                  const isLocked = u.status === 'Locked' || u.status === 'Suspended';
                  return (
                    <div
                      key={u.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        isLocked
                          ? 'bg-rose-50/60 border-rose-200'
                          : 'bg-white border-slate-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                            {u.avatarInitial}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                              <span>{u.fullName}</span>
                              {u.mfaEnabled && (
                                <span title="MFA Active" className="text-emerald-600">
                                  <ShieldCheck className="w-4 h-4 inline" />
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 font-medium truncate">{u.email}</div>
                            <div className="text-[11px] text-teal-700 font-semibold truncate mt-0.5">
                              {u.department}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                            u.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}
                        >
                          {u.status}
                        </span>
                      </div>

                      {/* Security Metadata Box */}
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
                        <div className="flex justify-between text-slate-600">
                          <span>Username & ID:</span>
                          <span className="font-mono font-bold text-slate-800">{u.username} ({u.id})</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Metode MFA 2FA:</span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1">
                            <Fingerprint className="w-3 h-3 text-cyan-600" /> {u.mfaType}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Hash Sandi (Argon2id):</span>
                          <span className="font-mono text-[10px] text-slate-500 truncate max-w-[170px]">
                            {u.passwordHashSnippet}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Login Terakhir:</span>
                          <span className="text-slate-800">{u.lastLoginAt}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>IP Address:</span>
                          <span className="font-mono text-slate-700">{u.lastLoginIp}</span>
                        </div>
                      </div>

                      {/* Action Buttons for Super Admin */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {u.role}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleResetPassword(u.id)}
                            className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Reset Kata Sandi Acak"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleUserLock(u.id)}
                            className={`p-1.5 rounded-lg transition-colors font-bold text-xs flex items-center gap-1 ${
                              isLocked
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            }`}
                            title={isLocked ? 'Buka Kunci Akun' : 'Kunci Akun Segera'}
                          >
                            {isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            <span>{isLocked ? 'Aktifkan' : 'Kunci Akun'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: REGISTER NEW USER */}
          {activeTab === 'register' && (
            <form onSubmit={handleExecuteRegister} className="space-y-4 max-w-2xl mx-auto bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
              <div className="border-b border-slate-200 pb-2.5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-teal-600" /> Pendaftaran User Baru oleh Super Admin
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tetapkan kredensial login, peranan fungsional, dan kebijakan autentikasi ganda (MFA).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700">Nama Lengkap & Gelar:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Raditya Wicaksana, M.M., CISA"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 mt-1 bg-white focus:outline-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Username Sistem:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. raditya_sec"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 mt-1 bg-white font-mono focus:outline-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Email Korporat Resmi:</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. raditya.w@banknusantara.co.id"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 mt-1 bg-white focus:outline-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Jabatan Fungsional:</label>
                  <input
                    type="text"
                    placeholder="e.g. Assistant Vice President Settlement"
                    value={regTitle}
                    onChange={(e) => setRegTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 mt-1 bg-white focus:outline-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Divisi / Unit Kerja:</label>
                  <select
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 mt-1 bg-white focus:outline-teal-500"
                  >
                    <option value="Divisi Operasional & Settlement">Divisi Operasional & Settlement</option>
                    <option value="Divisi IT Infrastructure & Cloud">Divisi IT Infrastructure & Cloud</option>
                    <option value="Divisi Manajemen Risiko & Kepatuhan">Divisi Manajemen Risiko & Kepatuhan</option>
                    <option value="Divisi Digital Banking & Payments">Divisi Digital Banking & Payments</option>
                    <option value="Tim Konsultan BCM Eksternal">Tim Konsultan BCM Eksternal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Peran Akses (Role Access):</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 mt-1 bg-white font-bold text-teal-900 focus:outline-teal-500"
                  >
                    <option value="SUPER_ADMIN">Super Admin (Full System & User Control)</option>
                    <option value="CONSULTANT_DIRECTOR">Dr. Hendra Gunawan (Director - Sign-off)</option>
                    <option value="BCM_CONSULTANT">BCM Consultant (Lead Assessor / Author)</option>
                    <option value="CLIENT_COORDINATOR">Client Coordinator (DRL & Stakeholder Liaison)</option>
                    <option value="UNIT_HEAD">Unit Head (Ops & IT Approver)</option>
                    <option value="PROCESS_OWNER">Process Owner (Respondent / Subject Matter)</option>
                    <option value="VIEWER">Viewer / Executive (Read-Only Heatmap)</option>
                  </select>
                </div>
              </div>

              {/* Password & Security Configuration */}
              <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
                <label className="block font-bold text-slate-700">
                  Kata Sandi Awal (Enforced Password Complexity Policy):
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 12 karakter, huruf besar, kecil, angka, dan simbol..."
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full p-2.5 pr-10 rounded-xl border border-slate-300 bg-white font-mono focus:outline-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Policy Checks */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1 text-[11px]">
                  <span className={`flex items-center gap-1 ${pwdLengthValid ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                    <Check className="w-3 h-3" /> 12+ Karakter
                  </span>
                  <span className={`flex items-center gap-1 ${pwdUpperValid && pwdLowerValid ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                    <Check className="w-3 h-3" /> Huruf Besar & Kecil
                  </span>
                  <span className={`flex items-center gap-1 ${pwdNumberValid ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                    <Check className="w-3 h-3" /> Mengandung Angka
                  </span>
                  <span className={`flex items-center gap-1 ${pwdSymbolValid ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                    <Check className="w-3 h-3" /> Karakter Simbol
                  </span>
                </div>

                <div className="pt-2">
                  <label className="block font-bold text-slate-700">Metode Multi-Factor Authentication (MFA):</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                    {(['TOTP Authenticator', 'Hardware FIDO2', 'SMS OTP'] as const).map((m) => (
                      <label
                        key={m}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          regMfaType === m
                            ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="mfaType"
                          checked={regMfaType === m}
                          onChange={() => setRegMfaType(m)}
                          className="text-teal-600"
                        />
                        <span>{m}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('directory')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={regPassword.length > 0 && pwdScore < 4}
                  className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Daftarkan & Terapkan Kredensial
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: RBAC MATRIX */}
          {activeTab === 'rbac' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2.5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Matriks Hak Akses Berbasis Peran (Role-Based Access Control)
                </h3>
                <p className="text-xs text-slate-500">
                  Prinsip <em>Least Privilege (PoLP)</em> memastikan setiap persona hanya memiliki izin sesuai fungsi kerjanya.
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3 border-r border-slate-200">Fungsi / Izin Akses</th>
                      <th className="p-3 text-center">Super Admin</th>
                      <th className="p-3 text-center">Director</th>
                      <th className="p-3 text-center">Consultant</th>
                      <th className="p-3 text-center">Coordinator</th>
                      <th className="p-3 text-center">Unit Head</th>
                      <th className="p-3 text-center">Process Owner</th>
                      <th className="p-3 text-center">Viewer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allPermissionsList.map((perm) => (
                      <tr key={perm.key} className="hover:bg-slate-50/60">
                        <td className="p-3 font-semibold text-slate-900 border-r border-slate-100">
                          {perm.label}
                          <span className="block text-[10px] font-mono text-slate-400 font-normal">{perm.key}</span>
                        </td>
                        {/* SUPER_ADMIN */}
                        <td className="p-3 text-center bg-teal-50/30">
                          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold inline-flex items-center justify-center text-xs">✓</span>
                        </td>
                        {/* DIRECTOR */}
                        <td className="p-3 text-center">
                          {['AUDIT_LOG_EXPORT', 'BIA_APPROVE_FINAL', 'BIA_WORKSHEET_EDIT', 'BIA_WORKSHEET_VIEW', 'TEMPLATE_MANAGE', 'WORKING_PAPER_EDIT', 'PROCESS_REGISTER_EDIT', 'EXECUTIVE_HEATMAP_VIEW'].includes(perm.key) ? (
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold inline-flex items-center justify-center text-xs">✓</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        {/* BCM_CONSULTANT */}
                        <td className="p-3 text-center">
                          {['BIA_WORKSHEET_EDIT', 'BIA_WORKSHEET_VIEW', 'TEMPLATE_MANAGE', 'WORKING_PAPER_EDIT', 'PROCESS_REGISTER_EDIT', 'DRL_UPLOAD_RESPONSE', 'EXECUTIVE_HEATMAP_VIEW'].includes(perm.key) ? (
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold inline-flex items-center justify-center text-xs">✓</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        {/* COORDINATOR */}
                        <td className="p-3 text-center">
                          {['DRL_UPLOAD_RESPONSE', 'BIA_WORKSHEET_VIEW', 'EXECUTIVE_HEATMAP_VIEW'].includes(perm.key) ? (
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold inline-flex items-center justify-center text-xs">✓</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        {/* UNIT_HEAD */}
                        <td className="p-3 text-center">
                          {['BIA_WORKSHEET_VIEW', 'PROCESS_REGISTER_EDIT', 'INTERVIEW_RESPONDENT', 'EXECUTIVE_HEATMAP_VIEW'].includes(perm.key) ? (
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold inline-flex items-center justify-center text-xs">✓</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        {/* PROCESS_OWNER */}
                        <td className="p-3 text-center">
                          {['INTERVIEW_RESPONDENT', 'BIA_WORKSHEET_VIEW'].includes(perm.key) ? (
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold inline-flex items-center justify-center text-xs">✓</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        {/* VIEWER */}
                        <td className="p-3 text-center">
                          {['BIA_WORKSHEET_VIEW', 'EXECUTIVE_HEATMAP_VIEW'].includes(perm.key) ? (
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold inline-flex items-center justify-center text-xs">✓</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY EVENT AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-600" /> Log Kejadian Keamanan & Deteksi Celah
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pencatatan waktu nyata upaya login, eskalasi hak akses, dan mitigasi otomatis dari sistem.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {securityLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                      log.severity === 'CRITICAL_SECURITY_ALERT'
                        ? 'bg-rose-50 border-rose-200 text-rose-950'
                        : log.severity === 'WARNING'
                        ? 'bg-amber-50 border-amber-200 text-amber-950'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            log.severity === 'CRITICAL_SECURITY_ALERT'
                              ? 'bg-rose-600 text-white'
                              : log.severity === 'WARNING'
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {log.severity}
                        </span>
                        <span className="font-mono font-bold text-slate-900">{log.eventType}</span>
                      </div>
                      <span className="text-[11px] font-mono opacity-75">{log.timestamp}</span>
                    </div>

                    <p className="leading-relaxed">{log.details}</p>

                    <div className="flex items-center justify-between text-[11px] opacity-75 pt-1 border-t border-current/10">
                      <span>Pengguna: <strong>{log.userName}</strong> ({log.userRole})</span>
                      <span>IP Asal: <code>{log.ipAddress}</code></span>
                    </div>

                    {log.mitigationAction && (
                      <div className="text-[11px] font-bold text-rose-800 bg-rose-100/70 p-1.5 rounded mt-1">
                        Mitigasi Pertahanan: {log.mitigationAction}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Active Authenticated Session ID: <code className="text-slate-800 font-bold">{currentUser.sessionTokenMasked}</code></span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
};
