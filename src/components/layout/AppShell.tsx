'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBcm } from '@/lib/store';
import { UserRole } from '@/types';
import { UserSecurityCenterModal } from '@/components/security/UserSecurityCenterModal';
import { SecureLoginPortal } from '@/components/security/SecureLoginPortal';
import {
  Shield,
  ShieldAlert,
  KeyRound,
  Fingerprint,
  Lock,
  Unlock,
  UserCheck,
  ShieldCheck,
  LayoutDashboard,
  FolderGit2,
  Building2,
  FileSpreadsheet,
  Users2,
  Layers3,
  Activity,
  CheckCircle2,
  Columns3,
  Network,
  AlertTriangle,
  FileText,
  Sliders,
  History,
  BookOpen,
  Siren,
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  Check,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

const ROLE_DEFINITIONS: Array<{ role: UserRole; title: string; badge: string; desc: string }> = [
  { role: 'SUPER_ADMIN', title: 'Super Admin', badge: 'Admin', desc: 'Full system configuration & multi-client access' },
  { role: 'CONSULTANT_DIRECTOR', title: 'Dr. Hendra Gunawan (Director)', badge: 'Consultant', desc: 'Project Director & Final Sign-off' },
  { role: 'BCM_CONSULTANT', title: 'Sarah Wijaya, MBCI (Senior Consultant)', badge: 'Consultant', desc: 'Active Lead BCM & BIA Assessor' },
  { role: 'CLIENT_COORDINATOR', title: 'Rian Pratama, CRISC', badge: 'Client', desc: 'Client BCM Coordinator & Progress Monitor' },
  { role: 'UNIT_HEAD', title: 'Bambang Soediro (Unit Head)', badge: 'Client', desc: 'Director of Ops & IT Approver' },
  { role: 'PROCESS_OWNER', title: 'Budi Santoso (Process Owner)', badge: 'Client', desc: 'Payment Settlement Owner & Respondent' },
  { role: 'VIEWER', title: 'Executive Management', badge: 'Management', desc: 'Read-only Executive Heatmaps & Reports' },
];

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const {
    currentRole,
    setCurrentRole,
    currentProject,
    searchQuery,
    setSearchQuery,
    currentUser,
    isAuthenticated,
    authChecked,
    logout,
  } = useBcm();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [securityCenterOpen, setSecurityCenterOpen] = useState(false);

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { href: '/dashboard', label: 'Command Center', icon: LayoutDashboard, badge: null },
    { href: '/projects', label: 'Project Setup Wizard', icon: FolderGit2, badge: null },
    { href: '/organization', label: 'Organization Master', icon: Building2, badge: '5 Units' },
    { href: '/documents', label: 'Document Collection (DRL)', icon: FileSpreadsheet, badge: '6 Req' },
    { href: '/stakeholders', label: 'Stakeholder 2x2 Matrix', icon: Users2, badge: '5 Mapped' },
    { href: '/processes', label: 'Business Process Register', icon: Layers3, badge: '4 Procs' },
    { href: '/bia', label: 'BIA Assessment & Wizard', icon: Activity, badge: 'Active' },
    { href: '/workshop', label: 'Validation Workshop', icon: CheckCircle2, badge: '1 Done' },
    { href: '/workspace', label: 'Consultant 3-Pane View', icon: Columns3, badge: 'Pro' },
    { href: '/dependencies', label: 'Dependency & SPOF Radar', icon: Network, badge: 'Alerts' },
    { href: '/risk-assessment', label: 'Risk Assessment Register', icon: ShieldAlert, badge: 'Risk' },
    { href: '/bcp', label: 'BCP Activation & Incident', icon: Siren, badge: 'BCP' },
    { href: '/issues', label: 'Issue & Action Tracker', icon: AlertTriangle, badge: '3 Issues' },
    { href: '/templates', label: 'Template Management', icon: FileSpreadsheet, badge: '27 Lib' },
    { href: '/working-papers', label: 'Working Papers & Interviews', icon: FileText, badge: 'WP/INT' },
    { href: '/bia-worksheets', label: 'Advanced BIA Worksheets', icon: Activity, badge: 'Grid BIA' },
    { href: '/reports', label: 'Reports & Consolidated BIA', icon: FileText, badge: null },
    { href: '/system-config', label: 'System Configuration', icon: Sliders, badge: '17 Menu' },
    { href: '/admin', label: 'Parameters & Governance', icon: Sliders, badge: 'Config' },
    { href: '/audit', label: 'Audit Trail & Compliance', icon: History, badge: null },
    { href: '/manual', label: 'User Manual & Guide', icon: BookOpen, badge: 'Docs' },
  ];

  const currentRoleInfo = ROLE_DEFINITIONS.find((r) => r.role === currentRole) || ROLE_DEFINITIONS[2];

  // Redirect to dashboard if authenticated and on /login
  useEffect(() => {
    if (authChecked && isAuthenticated && pathname === '/login') {
      window.location.href = '/dashboard';
    }
  }, [authChecked, isAuthenticated, pathname]);

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col text-slate-900 antialiased selection:bg-cyan-100 selection:text-cyan-900">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#0B1F3A] text-white border-b border-slate-800 shadow-sm">
        <div className="flex items-center justify-between px-3 md:px-6 py-2.5 h-16">
          <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-2xl">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800/80 text-slate-200 hover:text-white shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>


            <Link href="/dashboard" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#00A9CE] to-sky-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B1F3A]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white whitespace-nowrap">BCM Navigator</span>
                <span className="hidden sm:inline-block text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-[#00A9CE]/20 text-cyan-300 border border-[#00A9CE]/40 whitespace-nowrap">
                  ISO 22301
                </span>
              </div>
            </Link>

            {/* Left-aligned Global Search next to ISO 22301 */}
            <div className="hidden md:flex items-center flex-1 max-w-md ml-1 lg:ml-2">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari proses, DRL, stakeholder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#00A9CE] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Right: Security Center (Super Admin only) & Log Out */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Access to Security Center for SUPER_ADMIN only */}
            {currentUser?.role === 'SUPER_ADMIN' && (
              <button
                onClick={() => setSecurityCenterOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm cursor-pointer bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-cyan-500/60 text-cyan-300 hover:border-cyan-400 hover:text-white hover:shadow-cyan-500/20"
                title="Pusat Kredensial, Hak Akses & Audit Log Keamanan"
                aria-label="Security Center"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">Security Center</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              </button>
            )}

            {/* Dedicated Log Out Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 hover:border-red-400 text-red-300 hover:text-white text-xs font-bold transition-all shadow-sm cursor-pointer ml-1"
              title="Keluar dari Sesi Sistem (Log Out)"
              aria-label="Log Out"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body: Sticky Sidebar + Naturally Scrollable Content Area */}
      <div className="flex-1 flex w-full relative">
        {/* Floating Quick Re-open Button when Sidebar is Hidden (docked at vertical center edge so it NEVER overlaps titles) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 z-40 items-center justify-center pl-1.5 pr-2 py-3.5 rounded-r-xl bg-[#0B1F3A]/95 hover:bg-[#133C67] text-cyan-300 border-y border-r-2 border-[#00A9CE] shadow-2xl transition-all duration-200 hover:scale-105 hover:pr-2.5 group cursor-pointer"
            title="Tampilkan Sidebar (Ctrl+B)"
            aria-label="Tampilkan Sidebar"
          >
            <div className="flex flex-col items-center gap-1.5">
              <PanelLeftOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black tracking-widest text-cyan-300 [writing-mode:vertical-lr] rotate-180">
                MENU
              </span>
            </div>
          </button>
        )}

        {/* Desktop Sidebar: Pinned and independently scrollable with smooth collapse */}
        <aside
          className={`hidden lg:flex flex-col bg-[#0B1F3A] text-slate-200 border-r border-slate-800 shrink-0 select-none sticky top-16 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out relative ${
            sidebarOpen
              ? 'w-72 opacity-100'
              : 'w-0 opacity-0 overflow-hidden border-r-0 pointer-events-none'
          }`}
        >
          {/* Quick Collapse Floating Pill on Sidebar Border */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute -right-3.5 top-3.5 z-30 w-7 h-7 rounded-full bg-[#0B1F3A] border-2 border-[#00A9CE] text-cyan-400 hover:bg-[#00A9CE] hover:text-[#0B1F3A] shadow-xl flex items-center justify-center transition-all cursor-pointer group hover:scale-110"
            title="Sembunyikan Sidebar (Ctrl+B)"
            aria-label="Sembunyikan Sidebar"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="w-72 flex flex-col h-full shrink-0">
            <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                      active
                        ? 'bg-gradient-to-r from-[#133C67] to-[#00A9CE]/35 text-white font-bold shadow-sm border border-cyan-500/40'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate pr-2">
                      <Icon
                        className={`w-4.5 h-4.5 shrink-0 transition-colors ${
                          active ? 'text-[#00A9CE]' : 'text-slate-400 group-hover:text-cyan-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold shrink-0 ${
                          active
                            ? 'bg-[#00A9CE] text-slate-950'
                            : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Persona & Security Credential Switcher pinned at bottom of sidebar */}
            <div className="p-3 border-t border-slate-800/80 bg-[#071527] shrink-0 relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 transition-all duration-150 group cursor-pointer shadow-sm text-left"
                title="Lihat Profil Akun & Status Sesi"
                aria-label="Lihat Profil Akun & Status Sesi"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00A9CE] to-sky-500 text-slate-950 flex items-center justify-center font-extrabold text-xs shadow-md group-hover:scale-105 transition-transform">
                      {currentUser ? currentUser.fullName[0] : currentRoleInfo.title[0]}
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full border border-[#0B1F3A] absolute -bottom-0.5 -right-0.5 ${
                        currentUser?.status === 'Locked' ? 'bg-red-500' : 'bg-emerald-400'
                      }`}
                    ></span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-white font-bold text-xs leading-tight truncate group-hover:text-cyan-300 transition-colors">
                      {currentUser ? currentUser.fullName : currentRoleInfo.title}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-semibold leading-tight truncate mt-0.5 flex items-center gap-1">
                      <span className="truncate">{currentUser?.title || currentRoleInfo.badge}</span>
                      {currentUser?.mfaEnabled && (
                        <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-[9px] px-1 rounded shrink-0">
                          MFA
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-transform duration-200 shrink-0 ${
                    roleDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Profile & Active Session Popup (Strictly Non-Switchable for Audit Integrity) */}
              {roleDropdownOpen && (
                <div className="absolute bottom-full left-2 right-2 mb-2 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 w-76">
                  <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 rounded-t-2xl">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Profil Akun Terautentikasi
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Sesi Aktif
                    </span>
                  </div>

                  {/* Current Authenticated User Detail Card */}
                  <div className="p-3.5 space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00A9CE] to-sky-500 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow-md shrink-0">
                        {currentUser?.fullName[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-slate-900 leading-snug truncate">
                          {currentUser?.fullName}
                        </div>
                        <div className="text-[10px] text-cyan-700 font-semibold truncate mt-0.5">
                          {currentUser?.title || currentUser?.role}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                          {currentUser?.email}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1.5 text-[10px]">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Departemen:</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                          {currentUser?.department}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Otorisasi Role:</span>
                        <span className="font-bold text-cyan-700 bg-cyan-50 px-1.5 py-0.2 rounded border border-cyan-100">
                          {currentUser?.role.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Proteksi MFA:</span>
                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                          <Fingerprint className="w-2.5 h-2.5" /> {currentUser?.mfaType?.split(' ')[0] || 'Enforced'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Token Sesi:</span>
                        <span className="font-mono text-[9px] text-slate-500 truncate max-w-[140px]">
                          {currentUser?.sessionTokenMasked || 'sess_sec_auth'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="p-2 bg-slate-50 border-t border-slate-100 rounded-b-2xl space-y-1.5">
                    {currentUser?.role === 'SUPER_ADMIN' && (
                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          setSecurityCenterOpen(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-1.5 px-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#133C67] text-white text-[11px] font-bold transition-all shadow-sm group cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                        <span>Security Center & Kredensial</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-1.5 px-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold transition-all border border-red-200 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-600" />
                      <span>Keluar Sistem (Log Out)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Slide-over Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-4/5 max-w-sm bg-[#0B1F3A] text-slate-200 h-full flex flex-col shadow-2xl z-10">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#00A9CE] flex items-center justify-center text-[#0B1F3A] font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-white text-base">BCM Navigator</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-slate-800/60 border-b border-slate-800 text-xs">
                <div className="text-[10px] text-cyan-400 uppercase font-bold">Active Project</div>
                <div className="font-semibold text-white truncate">{currentProject.name}</div>
                <div className="text-[11px] text-slate-400">{currentProject.code}</div>
              </div>

              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                        active ? 'bg-[#133C67] text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-[#00A9CE]' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile User Profile pinned at bottom of mobile drawer */}
              <div className="p-3.5 border-t border-slate-800 bg-[#071527] shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Akun Terotentikasi
                  </span>
                  {currentUser?.role === 'SUPER_ADMIN' && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setSecurityCenterOpen(true);
                      }}
                      className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <ShieldCheck className="w-3 h-3" /> Security Center
                    </button>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00A9CE] to-sky-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                      {currentUser?.fullName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-xs truncate">{currentUser?.fullName}</div>
                      <div className="text-[10px] text-slate-400 truncate">{currentUser?.email}</div>
                    </div>
                    <span className="text-[9px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.5 rounded">
                      {currentUser?.role.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-700/50 pt-1.5">
                    <span>Divisi: {currentUser?.department}</span>
                    <span className="text-emerald-400 flex items-center gap-0.5 font-bold">
                      <Fingerprint className="w-2.5 h-2.5" /> MFA Aktif
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full mt-2.5 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span>Keluar dari Sistem (Log Out)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area: Fully responsive and naturally scrollable */}
        <main className="flex-1 min-w-0 flex flex-col pb-28 lg:pb-12 focus:outline-none">
          {children}
        </main>
      </div>

      {/* Mobile Dedicated Bottom Navigation (AO. MOBILE UX) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1 shadow-lg">
        <div className="grid grid-cols-5 gap-1">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-medium transition-colors ${
              pathname === '/dashboard' ? 'text-[#00A9CE] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>Home</span>
          </Link>

          <Link
            href="/issues"
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-medium transition-colors ${
              pathname === '/issues' ? 'text-[#00A9CE] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-5 h-5 mb-0.5" />
            <span>Tasks</span>
          </Link>

          <Link
            href="/bia"
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-medium transition-colors ${
              pathname.startsWith('/bia') ? 'text-[#00A9CE] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="w-7 h-7 -mt-3 rounded-full bg-[#00A9CE] text-[#0B1F3A] flex items-center justify-center shadow-md">
              <Activity className="w-4 h-4 font-bold" />
            </div>
            <span className="mt-0.5">BIA</span>
          </Link>

          <Link
            href="/documents"
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-medium transition-colors ${
              pathname === '/documents' ? 'text-[#00A9CE] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-5 h-5 mb-0.5" />
            <span>Docs</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-medium text-slate-500"
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Super Admin User & Security Access Center Modal */}
      <UserSecurityCenterModal
        isOpen={securityCenterOpen}
        onClose={() => setSecurityCenterOpen(false)}
      />
    </div>
  );
};
