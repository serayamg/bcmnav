'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Mail,
  Fingerprint,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
} from 'lucide-react';

export const SecureLoginPortal: React.FC = () => {
  const { login } = useBcm();

  // Login form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Flow states
  const [step, setStep] = useState<'CREDENTIALS' | 'MFA_CHALLENGE'>('CREDENTIALS');
  const [targetUserMfaType, setTargetUserMfaType] = useState<string>('TOTP Authenticator');
  const [targetUserEmail, setTargetUserEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setRemainingAttempts(null);

    if (!identifier.trim()) {
      setErrorMessage('Silakan masukkan username atau alamat email korporat.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Silakan masukkan kata sandi akun.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(async () => {
      const res = await login(identifier, password);
      setIsSubmitting(false);

      if (res.requiresMfa) {
        setStep('MFA_CHALLENGE');
        setTargetUserMfaType(res.mfaType || 'TOTP Authenticator');
        setTargetUserEmail(res.user?.email || identifier);
        setErrorMessage(null);
      } else if (!res.success) {
        setErrorMessage(res.error || 'Autentikasi gagal.');
        if (res.remainingAttempts !== undefined) {
          setRemainingAttempts(res.remainingAttempts);
        }
      }
    }, 450);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!mfaCode.trim()) {
      setErrorMessage('Silakan masukkan 6-digit kode verifikasi MFA atau sentuh kunci keamanan.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(async () => {
      const res = await login(identifier, password, mfaCode);
      setIsSubmitting(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Verifikasi MFA gagal.');
      }
    }, 400);
  };

  const handleSimulateFido2 = () => {
    setMfaCode('123456');
    setIsSubmitting(true);
    setTimeout(async () => {
      await login(identifier, password, '123456');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071527] via-[#0B1F3A] to-[#0A2540] flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Branding Banner */}
        <div className="p-6 sm:p-8 bg-[#071527]/90 border-b border-slate-800 text-center relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00A9CE] to-sky-400 text-slate-950 shadow-lg shadow-cyan-500/20 mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>BCM Navigator</span>
            <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded bg-[#00A9CE]/20 text-cyan-300 border border-[#00A9CE]/40">
              ISO 22301
            </span>
          </h1>

          {/* Security Compliance Pills */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> TLS 1.3 / OWASP Hardened
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
              <Fingerprint className="w-2.5 h-2.5" /> FIDO2 / MFA Enforced
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" /> Brute-Force Shield Active
            </span>
          </div>
        </div>

        {/* Step Indicator Header */}
        <div className="px-6 sm:px-8 py-3.5 border-b border-slate-800/60 bg-slate-900/50 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">
            {step === 'CREDENTIALS' ? 'Langkah 1: Kredensial Pengguna' : 'Langkah 2: Verifikasi Dua Faktor (MFA)'}
          </span>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
            {step === 'CREDENTIALS' ? 'Tahap 1 / 2' : 'Tahap 2 / 2'}
          </span>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mx-6 sm:mx-8 mt-5 p-3.5 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-start gap-2.5 text-red-200 text-xs animate-in fade-in duration-150">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold text-red-300">Autentikasi Ditolak</div>
              <div className="mt-0.5 leading-relaxed">{errorMessage}</div>
              {remainingAttempts !== null && remainingAttempts > 0 && (
                <div className="mt-1 font-bold text-amber-300 text-[11px]">
                  Perhatian: Tersisa {remainingAttempts} percobaan sebelum akun otomatis terkunci.
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 1: CREDENTIALS FORM */}
        {step === 'CREDENTIALS' && (
          <form onSubmit={handleCredentialsSubmit} className="p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Username / Email Korporat
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="contoh: admin@bcm-enterprise.id atau superadmin"
                  required
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00A9CE] focus:ring-2 focus:ring-[#00A9CE]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Kata Sandi (Password)
                </label>
                <span className="text-[11px] text-slate-500">
                  Min. 12 Karakter Terenkripsi
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00A9CE] focus:ring-2 focus:ring-[#00A9CE]/20 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00A9CE] to-sky-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Kredensial...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Masuk ke Sistem BCM</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: MFA CHALLENGE FORM */}
        {step === 'MFA_CHALLENGE' && (
          <form onSubmit={handleMfaSubmit} className="p-6 sm:p-8 space-y-5 animate-in fade-in duration-200">
            {/* User Target Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-black text-sm">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{targetUserEmail}</div>
                  <div className="text-xs text-cyan-400 flex items-center gap-1 font-semibold">
                    <span>MFA Wajib: {targetUserMfaType}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep('CREDENTIALS');
                  setErrorMessage(null);
                }}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Ganti Akun
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Kode Verifikasi 6-Digit (TOTP / FIDO2)
                </label>
                <span className="text-[11px] text-cyan-400 font-mono">
                  Kode Tes Demo: 123456
                </span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Smartphone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  autoFocus
                  required
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-center text-lg tracking-widest font-mono font-bold text-white placeholder-slate-600 focus:outline-none focus:border-[#00A9CE] focus:ring-2 focus:ring-[#00A9CE]/20 transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Buka aplikasi Authenticator Anda (Google Authenticator, Microsoft Authenticator) atau masukkan kode 6-digit di atas.
              </p>
            </div>

            {/* Hardware FIDO2 1-Click Simulation Button */}
            {targetUserMfaType.includes('FIDO2') && (
              <button
                type="button"
                onClick={handleSimulateFido2}
                disabled={isSubmitting}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Fingerprint className="w-4 h-4 text-cyan-400" />
                <span>Simulasikan Sentuhan Kunci Hardware FIDO2 (WebAuthn)</span>
              </button>
            )}

            {/* MFA Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Token MFA...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verifikasi MFA & Buka Sesi Aman</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Security Seal */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-center text-[11px] text-slate-500 px-6 sm:px-8">
          <div className="flex items-center gap-1 text-slate-400 font-mono">
            <span>Argon2id • RBAC Hardened</span>
          </div>
        </div>
      </div>

      {/* Global Security Policy Bottom Footer */}
      <div className="mt-6 text-center text-xs text-slate-500 max-w-lg leading-relaxed">
        Sistem ini dilindungi oleh kebijakan keamanan siber ISO 27001 dan POJK No. 11/2022. Seluruh aktivitas autentikasi, IP address, dan percobaan masuk dicatat dalam Audit Trail yang tidak dapat dimanipulasi.
      </div>
    </div>
  );
};
