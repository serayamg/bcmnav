'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  INITIAL_CLIENT,
  INITIAL_PROJECT,
  INITIAL_UNITS,
  INITIAL_STAKEHOLDERS,
  INITIAL_PROCESSES,
  INITIAL_DRL,
  INITIAL_ISSUES,
  ProjectData,
  OrganizationUnitData,
  StakeholderData,
  BusinessProcessData,
  DocumentRequestData,
  RiskAssessmentData,
  INITIAL_RISKS,
  BcpActivationData,
  INITIAL_BCP,
  INITIAL_SYSTEM_USERS,
  INITIAL_SECURITY_LOGS,
  INITIAL_AUDIT_LOGS,
} from './mock-data';
import {
  UserRole,
  WorkingTemplate,
  ConsultantWorkingPaper,
  InterviewWorksheet,
  DetailedBiaWorksheet,
  SystemParameterConfig,
  TemplateScope,
  TemplateStatus,
  SystemUser,
  SecurityEventLog,
  UserPermission,
  LoginResult,
} from '@/types';
import {
  INITIAL_TEMPLATES,
  INITIAL_WORKING_PAPERS,
  INITIAL_INTERVIEWS,
  INITIAL_DETAILED_BIA,
  INITIAL_SYSTEM_CONFIG,
} from './mock-templates-data';

export interface AuditRecord {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  recordName: string;
  details: string;
  timestamp: string;
}

export interface BiaDraft {
  processId: string;
  step: number;
  normalCapacity: string;
  minimumCapacity: string;
  peakPeriodDetails: string;
  impactScores: Record<string, Record<string, number>>;
  suggestedMtpd: string;
  approvedMtpd: string;
  targetRto: string;
  targetRpo: string;
  workaroundStrategy: string;
  evidenceNotes: string;
  resourceRequirements: Array<{
    timeHorizon: string;
    minimumStaff: number;
    applications: string;
    workstations: number;
    workspaceLocation: string;
  }>;
  criticalityScore: number;
  criticalityTier: string;
  recoveryPriority: string;
  spofDetected: boolean;
  spofReasons: string[];
  completenessScore: number;
  lastSavedAt: string;
  status: string;
}

interface BcmContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentProject: ProjectData;
  setProject: (proj: ProjectData) => void;
  units: OrganizationUnitData[];
  setUnits: React.Dispatch<React.SetStateAction<OrganizationUnitData[]>>;
  stakeholders: StakeholderData[];
  setStakeholders: React.Dispatch<React.SetStateAction<StakeholderData[]>>;
  processes: BusinessProcessData[];
  setProcesses: React.Dispatch<React.SetStateAction<BusinessProcessData[]>>;
  documents: DocumentRequestData[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentRequestData[]>>;
  issues: typeof INITIAL_ISSUES;
  setIssues: React.Dispatch<React.SetStateAction<typeof INITIAL_ISSUES>>;
  riskAssessments: RiskAssessmentData[];
  setRiskAssessments: React.Dispatch<React.SetStateAction<RiskAssessmentData[]>>;
  bcpActivations: BcpActivationData[];
  setBcpActivations: React.Dispatch<React.SetStateAction<BcpActivationData[]>>;
  auditLogs: AuditRecord[];
  addAuditLog: (action: string, module: string, recordName: string, details: string) => void;
  updateDocumentReview: (id: string, review: {
    status: DocumentRequestData['status'];
    reviewStatus: string;
    completeness: number;
    keyFindings: string;
    gapIdentified: string;
    followUpRequired: string;
  }) => void;
  updateStakeholderPosition: (id: string, influence: number, interest: number) => void;
  updateBiaDraft: (draft: Partial<BiaDraft> & { processId: string }) => void;
  getBiaDraft: (processId: string) => BiaDraft | undefined;
  saveBiaAssessment: (bia: BiaDraft) => void;
  submitBiaApproval: (processId: string, stage: string, comment: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // CK to CU: Template Management
  templates: WorkingTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<WorkingTemplate[]>>;
  saveTemplate: (template: WorkingTemplate) => void;
  cloneTemplate: (templateId: string, newScope: TemplateScope) => WorkingTemplate | undefined;
  updateTemplateStatus: (templateId: string, status: TemplateStatus) => void;

  // CV to CZ: Working Papers & Interviews
  workingPapers: ConsultantWorkingPaper[];
  setWorkingPapers: React.Dispatch<React.SetStateAction<ConsultantWorkingPaper[]>>;
  saveWorkingPaper: (paper: ConsultantWorkingPaper) => void;
  interviewWorksheets: InterviewWorksheet[];
  setInterviewWorksheets: React.Dispatch<React.SetStateAction<InterviewWorksheet[]>>;
  saveInterviewWorksheet: (interview: InterviewWorksheet) => void;
  createProcessFromInterview: (interviewId: string, processData: { code: string; name: string; description: string; sla?: string; isCritical?: boolean }) => void;

  // DA to ED: Detailed BIA Worksheets
  detailedBiaWorksheets: DetailedBiaWorksheet[];
  setDetailedBiaWorksheets: React.Dispatch<React.SetStateAction<DetailedBiaWorksheet[]>>;
  saveDetailedBiaWorksheet: (bia: DetailedBiaWorksheet) => void;
  lockDetailedBiaWorksheet: (biaId: string, lockedBy: string) => void;

  // EH to EQ: System Config
  systemConfig: SystemParameterConfig;
  setSystemConfig: React.Dispatch<React.SetStateAction<SystemParameterConfig>>;
  updateSystemConfig: (config: Partial<SystemParameterConfig>) => void;

  // Enterprise User Credentials & Security RBAC
  users: SystemUser[];
  setUsers: React.Dispatch<React.SetStateAction<SystemUser[]>>;
  currentUser: SystemUser;
  securityLogs: SecurityEventLog[];
  isAuthenticated: boolean;
  authChecked: boolean;
  login: (usernameOrEmail: string, passwordPlain: string, mfaToken?: string) => Promise<LoginResult>;
  logout: () => void;
  registerUser: (newUser: Partial<SystemUser> & { passwordPlain?: string }) => SystemUser;
  updateUser: (userId: string, updates: Partial<SystemUser>) => void;
  toggleUserLock: (userId: string) => void;
  resetUserPassword: (userId: string) => string;
  switchUser: (userId: string) => void;
  hasPermission: (permission: UserPermission) => boolean;
  addSecurityLog: (event: Omit<SecurityEventLog, 'id' | 'timestamp'>) => void;
}

const BcmContext = createContext<BcmContextType | null>(null);

export const BcmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('BCM_CONSULTANT');
  const [currentProject, setProject] = useState<ProjectData>({
    id: 'prj-01',
    code: 'PRJ-2025-01',
    name: '',
    clientId: 'clt-01',
    clientName: '',
    framework: 'ISO 22301:2019',
    sponsorName: '',
    bcmCoordinatorName: '',
    consultingPmName: '',
    startDate: new Date().toISOString().substring(0, 10),
    targetDate: '',
    status: 'Draft',
    scopeDescription: '',
    location: '',
    completionPercent: 0,
  });
  const [units, setUnits] = useState<OrganizationUnitData[]>([]);
  const [stakeholders, setStakeholders] = useState<StakeholderData[]>([]);
  const [processes, setProcesses] = useState<BusinessProcessData[]>([]);
  const [documents, setDocuments] = useState<DocumentRequestData[]>([]);
  const [issues, setIssues] = useState<typeof INITIAL_ISSUES>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessmentData[]>(INITIAL_RISKS);
  const [bcpActivations, setBcpActivations] = useState<BcpActivationData[]>(INITIAL_BCP);
  const [searchQuery, setSearchQuery] = useState('');

  // Modules CK to EQ States
  const [templates, setTemplates] = useState<WorkingTemplate[]>(INITIAL_TEMPLATES);
  const [workingPapers, setWorkingPapers] = useState<ConsultantWorkingPaper[]>([]);
  const [interviewWorksheets, setInterviewWorksheets] = useState<InterviewWorksheet[]>([]);
  const [detailedBiaWorksheets, setDetailedBiaWorksheets] = useState<DetailedBiaWorksheet[]>([]);
  const [systemConfig, setSystemConfig] = useState<SystemParameterConfig>(INITIAL_SYSTEM_CONFIG);

  // Enterprise Security & Identity States (Preserved)
  const [users, setUsers] = useState<SystemUser[]>(INITIAL_SYSTEM_USERS);
  const [currentUser, setCurrentUser] = useState<SystemUser>(INITIAL_SYSTEM_USERS[2]); // Sarah Wijaya default
  // SECURITY: default MUST be false. Authentication is only granted after a
  // successful login() call (or a rehydration check confirming a valid signed
  // session cookie issued by /api/auth/session). Never default this to true.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // Tracks whether the initial session-cookie rehydration check (see the
  // effect below) has finished, so the UI can show a neutral loading state
  // instead of flashing the login form for users who are already logged in.
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [securityLogs, setSecurityLogs] = useState<SecurityEventLog[]>(INITIAL_SECURITY_LOGS);

  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);

  const [biaDrafts, setBiaDrafts] = useState<Record<string, BiaDraft>>({});

  const addAuditLog = (action: string, module: string, recordName: string, details: string) => {
    const newLog: AuditRecord = {
      id: 'aud-' + Date.now(),
      userName: currentRole === 'BCM_CONSULTANT' ? 'Sarah Wijaya, MBCI' : 'Dr. Hendra Gunawan',
      userRole: currentRole,
      action,
      module,
      recordName,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const updateDocumentReview = (id: string, review: {
    status: DocumentRequestData['status'];
    reviewStatus: string;
    completeness: number;
    keyFindings: string;
    gapIdentified: string;
    followUpRequired: string;
  }) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              ...review,
              reviewerName: 'Sarah Wijaya, MBCI',
              reviewedAt: new Date().toISOString().substring(0, 10),
            }
          : d
      )
    );
    addAuditLog('REVIEW', 'DRL', `Doc ID: ${id}`, `Status diperbarui menjadi ${review.status}`);
  };

  const updateStakeholderPosition = (id: string, influence: number, interest: number) => {
    let quadrant: StakeholderData['quadrant'] = 'Monitor';
    if (influence >= 4 && interest >= 4) quadrant = 'Manage Closely';
    else if (influence >= 4 && interest < 4) quadrant = 'Keep Satisfied';
    else if (influence < 4 && interest >= 4) quadrant = 'Keep Informed';

    setStakeholders((prev) =>
      prev.map((s) => (s.id === id ? { ...s, influenceLevel: influence, interestLevel: interest, quadrant } : s))
    );
    addAuditLog('UPDATE', 'STAKEHOLDER', `Stakeholder ${id}`, `Dipindahkan ke kuadran ${quadrant}`);
  };

  const updateBiaDraft = (draft: Partial<BiaDraft> & { processId: string }) => {
    setBiaDrafts((prev) => ({
      ...prev,
      [draft.processId]: {
        ...(prev[draft.processId] || {}),
        ...draft,
        lastSavedAt: new Date().toLocaleTimeString(),
      } as BiaDraft,
    }));
  };

  const getBiaDraft = (processId: string) => biaDrafts[processId];

  const saveBiaAssessment = (bia: BiaDraft) => {
    updateBiaDraft(bia);
    setProcesses((prev) =>
      prev.map((p) =>
        p.id === bia.processId
          ? {
              ...p,
              rto: bia.targetRto,
              rpo: bia.targetRpo,
              mtpd: bia.approvedMtpd,
              criticalityTier: bia.criticalityTier,
              status: bia.status === 'Draft' ? 'In Assessment' : (bia.status as any),
              spofFlag: bia.spofDetected,
            }
          : p
      )
    );
    addAuditLog('SAVE_BIA', 'BIA', `Process: ${bia.processId}`, `BIA disimpan dengan Tier: ${bia.criticalityTier}`);
  };

  const submitBiaApproval = (processId: string, stage: string, comment: string) => {
    setProcesses((prev) =>
      prev.map((p) => (p.id === processId ? { ...p, status: 'Validated' } : p))
    );
    if (biaDrafts[processId]) {
      setBiaDrafts((prev) => ({
        ...prev,
        [processId]: { ...prev[processId], status: 'Validated' },
      }));
    }
    addAuditLog('APPROVAL', 'BIA', `Process: ${processId}`, `Approval Stage: ${stage}`);
  };

  // CK to CU: Working Template Handlers
  const saveTemplate = (template: WorkingTemplate) => {
    setTemplates((prev) => {
      const idx = prev.findIndex((t) => t.id === template.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...template, lastUpdated: new Date().toISOString() };
        return copy;
      }
      return [template, ...prev];
    });
    addAuditLog('SAVE_TEMPLATE', 'TEMPLATE', template.code, `Template ${template.name} disimpan (${template.status})`);
  };

  const cloneTemplate = (templateId: string, newScope: TemplateScope): WorkingTemplate | undefined => {
    const existing = templates.find((t) => t.id === templateId);
    if (!existing) return undefined;
    const newId = `TMP-${Date.now().toString().slice(-4)}`;
    const cloned: WorkingTemplate = {
      ...existing,
      id: newId,
      code: `${existing.code}-COPY`,
      name: `${existing.name} (Copy)`,
      scope: newScope,
      version: '1.0.0',
      status: 'Draft',
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      usageCount: 0,
      isDefault: false,
      versionHistory: [
        {
          version: '1.0.0',
          changedAt: new Date().toISOString(),
          changedBy: 'BCM Consultant',
          changeSummary: `Cloned from ${existing.code} with scope ${newScope}`,
          approvalStatus: 'Draft',
        },
      ],
    };
    setTemplates((prev) => [cloned, ...prev]);
    addAuditLog('CLONE_TEMPLATE', 'TEMPLATE', cloned.code, `Template di-clone dari ${existing.code}`);
    return cloned;
  };

  const updateTemplateStatus = (templateId: string, status: TemplateStatus) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId
          ? {
              ...t,
              status,
              lastUpdated: new Date().toISOString(),
              versionHistory: [
                ...t.versionHistory,
                {
                  version: t.version,
                  changedAt: new Date().toISOString(),
                  changedBy: 'BCM Consultant',
                  changeSummary: `Status diubah menjadi ${status}`,
                  approvalStatus: status,
                },
              ],
            }
          : t
      )
    );
    addAuditLog('STATUS_CHANGE', 'TEMPLATE', templateId, `Status template diubah ke ${status}`);
  };

  // CV to CZ: Working Paper & Interview Handlers
  const saveWorkingPaper = (paper: ConsultantWorkingPaper) => {
    setWorkingPapers((prev) => {
      const idx = prev.findIndex((p) => p.id === paper.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = paper;
        return copy;
      }
      return [paper, ...prev];
    });
    addAuditLog('SAVE_WP', 'WORKING_PAPER', paper.code, `Kertas kerja ${paper.title} disimpan (${paper.status})`);
  };

  const saveInterviewWorksheet = (interview: InterviewWorksheet) => {
    setInterviewWorksheets((prev) => {
      const idx = prev.findIndex((i) => i.id === interview.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = interview;
        return copy;
      }
      return [interview, ...prev];
    });
    addAuditLog('SAVE_INTERVIEW', 'INTERVIEW', interview.code, `Lembar wawancara ${interview.stakeholderName} disimpan`);
  };

  const createProcessFromInterview = (
    interviewId: string,
    processData: { code: string; name: string; description: string; sla?: string; isCritical?: boolean }
  ) => {
    const newProcessId = `PROC-${Date.now().toString().slice(-3)}`;
    const newProcess: BusinessProcessData = {
      id: newProcessId,
      code: processData.code,
      name: processData.name,
      unitId: 'unt-02',
      unitName: 'Divisi Operasional & Settlement',
      level: 1,
      levelName: 'L1 - Core Service',
      processOwnerId: 'stk-02',
      processOwnerName: 'Ratna Kusuma Dewi',
      description: processData.description,
      objective: 'Memastikan kelancaran operasional layanan sesuai target BCM',
      productService: processData.name,
      customers: 'Nasabah & Mitra Institusi',
      inputs: 'Instruksi transaksi & permintaan nasabah',
      keyActivities: 'Pemrosesan, verifikasi, rekonsiliasi',
      outputs: 'Transaksi sukses & laporan audit',
      frequency: 'Harian (Real-Time)',
      operatingHours: '08:00 - 17:00 WIB',
      peakPeriod: 'Akhir Bulan',
      transactionVolume: '1.000+ per hari',
      financialValue: 'Signifikan',
      slaRequirement: processData.sla || 'Maksimal 2 Jam',
      regulatoryReq: 'POJK 11/2022 & ISO 22301:2019',
      manualWorkaround: 'Prosedur manual darurat',
      existingBcp: 'Tersedia draft panduan',
      criticalityTier: processData.isCritical ? 'Tier 1 — Mission Critical' : 'Tier 3 — Important',
      rto: '4 Jam',
      rpo: '1 Jam',
      mtpd: '8 Jam',
      status: 'In Assessment',
      isCriticalFlag: !!processData.isCritical,
      spofFlag: false,
    };
    setProcesses((prev) => [...prev, newProcess]);

    setInterviewWorksheets((prev) =>
      prev.map((i) =>
        i.id === interviewId
          ? {
              ...i,
              processesDiscovered: [
                ...i.processesDiscovered,
                {
                  code: processData.code,
                  name: processData.name,
                  description: processData.description,
                  sla: processData.sla,
                  isCritical: processData.isCritical,
                },
              ],
            }
          : i
      )
    );

    addAuditLog(
      'CREATE_PROCESS',
      'BUSINESS_PROCESS',
      processData.code,
      `Proses bisnis baru dibuat otomatis dari Wawancara ${interviewId}: ${processData.name}`
    );
  };

  // DA to ED: Detailed BIA Handlers
  const saveDetailedBiaWorksheet = (bia: DetailedBiaWorksheet) => {
    setDetailedBiaWorksheets((prev) => {
      const idx = prev.findIndex((b) => b.id === bia.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = bia;
        return copy;
      }
      return [bia, ...prev];
    });

    // Synchronize process RTO and MTPD if matching
    setProcesses((prev) =>
      prev.map((p) =>
        p.id === bia.processId
          ? {
              ...p,
              rto: bia.rtoDetermination.approvedRto || bia.rtoDetermination.suggestedRto,
              mtpd: bia.mtpdAnalysis.approvedMtpd || bia.mtpdAnalysis.proposedMtpd,
              criticalityTier: bia.criticalityTier,
              status: bia.assessmentStatus as any,
            }
          : p
      )
    );

    addAuditLog('SAVE_DETAILED_BIA', 'BIA', bia.code, `Detailed BIA ${bia.processName} disimpan (${bia.assessmentStatus})`);
  };

  const lockDetailedBiaWorksheet = (biaId: string, lockedBy: string) => {
    setDetailedBiaWorksheets((prev) =>
      prev.map((b) =>
        b.id === biaId
          ? {
              ...b,
              isLocked: true,
              assessmentStatus: 'Approved',
              approvalStatus: `Locked and approved by ${lockedBy}`,
              revisions: [
                ...b.revisions,
                {
                  revisionNumber: `Rev ${(b.revisions.length + 1).toFixed(1)}`,
                  date: new Date().toISOString().slice(0, 10),
                  changedBy: lockedBy,
                  changes: [{ field: 'isLocked', prevValue: 'false', newValue: 'true', reason: 'Final executive lock' }],
                },
              ],
            }
          : b
      )
    );
    addAuditLog('LOCK_BIA', 'BIA', biaId, `Lembar kerja BIA resmi dikunci (Locked) oleh ${lockedBy}`);
  };

  // EH to EQ: System Config Handler
  const updateSystemConfig = (config: Partial<SystemParameterConfig>) => {
    setSystemConfig((prev) => ({
      ...prev,
      ...config,
      general: { ...prev.general, ...(config.general || {}) },
      project: { ...prev.project, ...(config.project || {}) },
      bcmMethodology: { ...prev.bcmMethodology, ...(config.bcmMethodology || {}) },
      workflow: { ...prev.workflow, ...(config.workflow || {}) },
    }));
    addAuditLog('UPDATE_CONFIG', 'SYSTEM_CONFIG', 'Global Parameters', 'Konfigurasi parameter sistem diperbarui');
  };

  // Enterprise Security & Identity Handlers
  const addSecurityLog = (event: Omit<SecurityEventLog, 'id' | 'timestamp'>) => {
    const newLog: SecurityEventLog = {
      ...event,
      id: `sec-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB',
    };
    setSecurityLogs((prev) => [newLog, ...prev]);
  };

  const registerUser = (newUser: Partial<SystemUser> & { passwordPlain?: string }): SystemUser => {
    const newId = `usr-${Date.now().toString().slice(-4)}`;
    const initials = newUser.fullName
      ? newUser.fullName
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : 'U';

    const role = newUser.role || 'VIEWER';
    const defaultPermissions: Record<UserRole, UserPermission[]> = {
      SUPER_ADMIN: [
        'SYSTEM_CONFIG_MANAGE',
        'USER_CREDENTIAL_MANAGE',
        'SECURITY_POLICY_MANAGE',
        'AUDIT_LOG_EXPORT',
        'BIA_APPROVE_FINAL',
        'BIA_WORKSHEET_EDIT',
        'BIA_WORKSHEET_VIEW',
        'TEMPLATE_MANAGE',
        'WORKING_PAPER_EDIT',
        'PROCESS_REGISTER_EDIT',
        'DRL_UPLOAD_RESPONSE',
        'INTERVIEW_RESPONDENT',
        'EXECUTIVE_HEATMAP_VIEW',
      ],
      CONSULTANT_DIRECTOR: [
        'AUDIT_LOG_EXPORT',
        'BIA_APPROVE_FINAL',
        'BIA_WORKSHEET_EDIT',
        'BIA_WORKSHEET_VIEW',
        'TEMPLATE_MANAGE',
        'WORKING_PAPER_EDIT',
        'PROCESS_REGISTER_EDIT',
        'EXECUTIVE_HEATMAP_VIEW',
      ],
      PROJECT_MANAGER: [
        'AUDIT_LOG_EXPORT',
        'BIA_WORKSHEET_VIEW',
        'TEMPLATE_MANAGE',
        'WORKING_PAPER_EDIT',
        'PROCESS_REGISTER_EDIT',
        'DRL_UPLOAD_RESPONSE',
        'EXECUTIVE_HEATMAP_VIEW',
      ],
      BCM_CONSULTANT: [
        'BIA_WORKSHEET_EDIT',
        'BIA_WORKSHEET_VIEW',
        'TEMPLATE_MANAGE',
        'WORKING_PAPER_EDIT',
        'PROCESS_REGISTER_EDIT',
        'DRL_UPLOAD_RESPONSE',
        'EXECUTIVE_HEATMAP_VIEW',
      ],
      CLIENT_COORDINATOR: ['DRL_UPLOAD_RESPONSE', 'BIA_WORKSHEET_VIEW', 'EXECUTIVE_HEATMAP_VIEW'],
      UNIT_HEAD: [
        'BIA_WORKSHEET_VIEW',
        'PROCESS_REGISTER_EDIT',
        'INTERVIEW_RESPONDENT',
        'EXECUTIVE_HEATMAP_VIEW',
      ],
      PROCESS_OWNER: ['INTERVIEW_RESPONDENT', 'BIA_WORKSHEET_VIEW'],
      BIA_RESPONDENT: ['INTERVIEW_RESPONDENT', 'BIA_WORKSHEET_VIEW'],
      APPROVER: ['BIA_APPROVE_FINAL', 'BIA_WORKSHEET_VIEW', 'EXECUTIVE_HEATMAP_VIEW'],
      VIEWER: ['BIA_WORKSHEET_VIEW', 'EXECUTIVE_HEATMAP_VIEW'],
    };

    const userRecord: SystemUser = {
      id: newId,
      username: newUser.username || `user_${newId}`,
      fullName: newUser.fullName || 'New User',
      title: newUser.title || 'Specialist Staff',
      email: newUser.email || `user.${newId}@banknusantara.co.id`,
      role,
      roleBadge: role === 'SUPER_ADMIN' ? 'Admin' : (role.includes('CONSULTANT') ? 'Consultant' : 'Client'),
      roleDescription: newUser.roleDescription || 'Registered user with customized security permissions',
      department: newUser.department || 'Operations',
      organization: newUser.organization || 'PT Bank Nusantara Sejahtera Tbk',
      mfaEnabled: newUser.mfaEnabled !== undefined ? newUser.mfaEnabled : true,
      mfaType: newUser.mfaType || 'TOTP Authenticator',
      status: 'Active',
      passwordHashSnippet: '$argon2id$v=19$m=65536,t=3,p=4$' + Math.random().toString(36).substring(2, 8) + '...$' + Math.random().toString(36).substring(2, 8),
      lastLoginAt: 'Belum pernah login',
      lastLoginIp: '127.0.0.1 (Local Provisioning)',
      failedLoginAttempts: 0,
      maxFailedAttempts: 5,
      sessionTokenMasked: 'sess_init_' + Math.random().toString(36).substring(2, 10) + '****',
      passwordExpiresDays: 90,
      permissions: defaultPermissions[role] || ['BIA_WORKSHEET_VIEW'],
      avatarInitial: initials,
      assignedBySuperAdmin: currentUser.id,
      assignedAt: new Date().toISOString().slice(0, 10),
    };

    setUsers((prev) => [...prev, userRecord]);
    addSecurityLog({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      eventType: 'CREDENTIAL_CHANGED',
      severity: 'INFO',
      ipAddress: currentUser.lastLoginIp,
      details: `Super Admin mendaftarkan akun baru: ${userRecord.fullName} (${userRecord.role}) dengan password policy aktif dan MFA.`,
    });
    addAuditLog('CREATE_USER', 'SECURITY_RBAC', userRecord.username, `User baru didaftarkan: ${userRecord.fullName} (${userRecord.role})`);
    return userRecord;
  };

  const updateUser = (userId: string, updates: Partial<SystemUser>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...updates };
          if (currentUser.id === userId) {
            setCurrentUser(updated);
            if (updates.role) setCurrentRole(updates.role);
          }
          return updated;
        }
        return u;
      })
    );
    addSecurityLog({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      eventType: 'CREDENTIAL_CHANGED',
      severity: 'INFO',
      ipAddress: currentUser.lastLoginIp,
      details: `Profil kredensial user ${userId} diperbarui oleh ${currentUser.fullName}`,
    });
  };

  const toggleUserLock = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'Locked' ? 'Active' : 'Locked';
          addSecurityLog({
            userId: currentUser.id,
            userName: currentUser.fullName,
            userRole: currentUser.role,
            eventType: newStatus === 'Locked' ? 'ACCOUNT_LOCKED' : 'CREDENTIAL_CHANGED',
            severity: newStatus === 'Locked' ? 'WARNING' : 'INFO',
            ipAddress: currentUser.lastLoginIp,
            details: `Status akun ${u.fullName} diubah menjadi ${newStatus}.`,
            mitigationAction: newStatus === 'Locked' ? 'Sesi login dicabut segera untuk mitigasi kompromi kredensial.' : undefined,
          });
          return { ...u, status: newStatus, failedLoginAttempts: 0 };
        }
        return u;
      })
    );
  };

  const resetUserPassword = (userId: string): string => {
    const tempPass = 'BcmPass#' + Math.floor(100000 + Math.random() * 900000) + '!';
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'Password Expired',
            failedLoginAttempts: 0,
            passwordHashSnippet: '$argon2id$v=19$m=65536,t=3,p=4$tmpRst...$99xP',
          };
        }
        return u;
      })
    );
    addSecurityLog({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      eventType: 'PASSWORD_RESET',
      severity: 'WARNING',
      ipAddress: currentUser.lastLoginIp,
      details: `Password user ${userId} di-reset oleh Super Admin. Wajib ganti sandi pada login berikutnya.`,
    });
    return tempPass;
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    if (target.status === 'Locked' || target.status === 'Suspended') {
      addSecurityLog({
        userId: target.id,
        userName: target.fullName,
        userRole: target.role,
        eventType: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        severity: 'CRITICAL_SECURITY_ALERT',
        ipAddress: target.lastLoginIp,
        details: `Upaya login/switch ke akun terblokir (${target.status}) digagalkan oleh Security Barrier.`,
        mitigationAction: 'Akses ditolak. Hubungi Super Administrator untuk investigasi keamanan.',
      });
      alert(`[SECURITY ALERT] Akun ${target.fullName} dalam status ${target.status}. Akses ditolak!`);
      return;
    }
    setCurrentUser(target);
    setCurrentRole(target.role);
    addSecurityLog({
      userId: target.id,
      userName: target.fullName,
      userRole: target.role,
      eventType: 'ROLE_SWITCH',
      severity: 'INFO',
      ipAddress: target.lastLoginIp,
      details: `Autentikasi persona aktif beralih ke ${target.fullName} (${target.role}). Kredensial & otorisasi RBAC disesuaikan.`,
    });
  };

  const hasPermission = (permission: UserPermission): boolean => {
    if (currentUser.role === 'SUPER_ADMIN') return true;
    return currentUser.permissions.includes(permission);
  };

  const logout = () => {
    if (currentUser) {
      addSecurityLog({
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUser.role,
        eventType: 'LOGOUT_SUCCESS',
        severity: 'INFO',
        ipAddress: currentUser.lastLoginIp,
        details: `Pengguna ${currentUser.fullName} (${currentUser.email}) telah keluar dari sistem (Log Out). Sesi aktif ${currentUser.sessionTokenMasked} telah dimusnahkan.`,
      });
    }
    setIsAuthenticated(false);
    // Destroy the server-side signed session cookie (defense-in-depth: the
    // middleware and every /api/* route rely on this cookie, not on client
    // React state). Navigate to /login afterwards so the address bar and the
    // middleware-enforced route both reflect the logged-out state.
    fetch('/api/auth/session', { method: 'DELETE' })
      .catch((e) => console.error('[store] session cookie removal failed:', e))
      .finally(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      });
  };

  const login = async (usernameOrEmail: string, passwordPlain: string, mfaToken?: string): Promise<LoginResult> => {
    const cleanId = usernameOrEmail.trim().toLowerCase();
    const target = users.find(
      (u) => u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
    );

    if (!target) {
      addSecurityLog({
        userId: 'usr-unknown',
        userName: usernameOrEmail,
        userRole: 'VIEWER',
        eventType: 'LOGIN_FAILED',
        severity: 'WARNING',
        ipAddress: '182.253.119.45',
        details: `Percobaan login gagal: Akun '${usernameOrEmail}' tidak terdaftar pada direktori.`,
        mitigationAction: 'Rate limiting dan deteksi brute-force aktif.',
      });
      return { success: false, error: 'Kredensial pengguna tidak ditemukan atau tidak valid.' };
    }

    if (target.status === 'Locked' || target.status === 'Suspended') {
      addSecurityLog({
        userId: target.id,
        userName: target.fullName,
        userRole: target.role,
        eventType: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        severity: 'CRITICAL_SECURITY_ALERT',
        ipAddress: target.lastLoginIp,
        details: `Upaya login ke akun yang sedang DIBEKUKAN/TERKUNCI (${target.status}) digagalkan oleh Security Barrier.`,
        mitigationAction: 'Akses diblokir. Hubungi Super Administrator untuk investigasi keamanan.',
      });
      return {
        success: false,
        error: `Akun Anda sedang dalam status '${target.status}' demi alasan keamanan. Hubungi Super Administrator untuk membuka blokir.`,
      };
    }

    // Password validation logic:
    // Accept standard corporate password or anything with length >= 6 except simulated "wrongpass"
    const isPasswordValid = passwordPlain.trim().length >= 6 && passwordPlain !== 'wrongpass';

    if (!isPasswordValid) {
      const newAttempts = target.failedLoginAttempts + 1;
      const isNowLocked = newAttempts >= target.maxFailedAttempts;

      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === target.id) {
            return {
              ...u,
              failedLoginAttempts: newAttempts,
              status: isNowLocked ? 'Locked' : u.status,
            };
          }
          return u;
        })
      );

      if (isNowLocked) {
        addSecurityLog({
          userId: target.id,
          userName: target.fullName,
          userRole: target.role,
          eventType: 'ACCOUNT_LOCKED',
          severity: 'CRITICAL_SECURITY_ALERT',
          ipAddress: target.lastLoginIp,
          details: `AKUN TERKUNCI OTOMATIS: Terdeteksi ${newAttempts} kali kegagalan autentikasi berturut-turut pada akun ${target.email}.`,
          mitigationAction: 'Account Locked. Memerlukan intervensi Super Admin untuk pembukaan kunci.',
        });
        return {
          success: false,
          error: `Akun Anda telah DIBEKUKAN/TERKUNCI secara otomatis karena ${newAttempts} kali kegagalan autentikasi berturut-turut. Hubungi Super Admin.`,
          remainingAttempts: 0,
        };
      }

      addSecurityLog({
        userId: target.id,
        userName: target.fullName,
        userRole: target.role,
        eventType: 'LOGIN_FAILED',
        severity: 'WARNING',
        ipAddress: target.lastLoginIp,
        details: `Autentikasi gagal: Kata sandi salah untuk akun ${target.email}. Percobaan ke-${newAttempts} dari ${target.maxFailedAttempts}.`,
        mitigationAction: 'Penambahan counter kegagalan dan peringatan lockout.',
      });

      const remaining = target.maxFailedAttempts - newAttempts;
      return {
        success: false,
        error: `Kata sandi tidak valid. Sisa percobaan sebelum akun dikunci: ${remaining} kali.`,
        remainingAttempts: remaining,
      };
    }

    // MFA Challenge Verification
    if (target.mfaEnabled) {
      if (!mfaToken || mfaToken.trim().length === 0) {
        addSecurityLog({
          userId: target.id,
          userName: target.fullName,
          userRole: target.role,
          eventType: 'MFA_CHALLENGE',
          severity: 'INFO',
          ipAddress: target.lastLoginIp,
          details: `Tantangan MFA (${target.mfaType}) dipicu untuk login pengguna ${target.email}.`,
        });
        return {
          success: false,
          requiresMfa: true,
          mfaType: target.mfaType,
          user: target,
        };
      }

      const cleanToken = mfaToken.trim();
      const isMfaValid =
        cleanToken.length === 6 ||
        cleanToken === 'fido2-verified' ||
        cleanToken === '999888' ||
        cleanToken === '123456';

      if (!isMfaValid) {
        addSecurityLog({
          userId: target.id,
          userName: target.fullName,
          userRole: target.role,
          eventType: 'LOGIN_FAILED',
          severity: 'WARNING',
          ipAddress: target.lastLoginIp,
          details: `Verifikasi kode MFA 2-faktor gagal untuk akun ${target.email}. Token verifikasi tidak sesuai.`,
        });
        return {
          success: false,
          requiresMfa: true,
          mfaType: target.mfaType,
          user: target,
          error: 'Kode verifikasi MFA 6-digit tidak valid atau telah kedaluwarsa.',
        };
      }
    }

    // Successful authentication
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newToken = `sess_sec_${Math.random().toString(36).substring(2, 6)}****${Math.random().toString(36).substring(2, 6)}`;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === target.id) {
          return {
            ...u,
            failedLoginAttempts: 0,
            lastLoginAt: now,
            sessionTokenMasked: newToken,
          };
        }
        return u;
      })
    );

    const updatedUser: SystemUser = {
      ...target,
      failedLoginAttempts: 0,
      lastLoginAt: now,
      sessionTokenMasked: newToken,
    };

    setCurrentUser(updatedUser);
    setCurrentRole(updatedUser.role);
    setIsAuthenticated(true);

    // Issue the server-side signed session cookie so that src/middleware.ts
    // and every /api/* route can independently verify this session — the
    // client-side `isAuthenticated` state above is only a UI convenience,
    // never the actual security boundary.
    try {
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sub: updatedUser.id }),
      });
    } catch (e) {
      console.error('[store] failed to establish server session cookie:', e);
    }

    addSecurityLog({
      userId: updatedUser.id,
      userName: updatedUser.fullName,
      userRole: updatedUser.role,
      eventType: 'LOGIN_SUCCESS',
      severity: 'INFO',
      ipAddress: updatedUser.lastLoginIp,
      details: `Login berhasil. Autentikasi ${updatedUser.mfaEnabled ? `2-Faktor (${updatedUser.mfaType})` : 'Standar'} terverifikasi. Sesi aktif: ${newToken}.`,
    });

    return { success: true, user: updatedUser };
  };

  // ── Session rehydration ─────────────────────────────────────────────────
  // isAuthenticated is plain client React state, so it resets to `false` on
  // every full page load/reload. The HttpOnly signed session cookie is the
  // real security boundary (enforced by src/middleware.ts), but we still
  // need to read it back on mount so a legitimately logged-in user isn't
  // forced to re-authenticate on every browser refresh. This only restores
  // UI state; it can never grant access the server didn't already verify.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const json = await res.json();
          if (!cancelled && json.status === 'success' && typeof json.sub === 'string') {
            const matchedUser = INITIAL_SYSTEM_USERS.find((u) => u.id === json.sub);
            if (matchedUser) {
              setCurrentUser(matchedUser);
              setCurrentRole(matchedUser.role);
              setIsAuthenticated(true);
            }
          }
        }
      } catch (e) {
        console.error('[store] session rehydration check failed:', e);
      } finally {
        if (!cancelled) setAuthChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Database connectivity ──────────────────────────────────────────────
  // Hydrate the core dataset from the SQLite database on mount, then persist
  // any change back (debounced). This replaces the previous in-memory-only
  // behaviour so data survives reloads and is shared across sessions.
  const [hydrated, setHydrated] = useState(false);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [coreRes, appRes] = await Promise.all([
          fetch('/api/bootstrap'),
          fetch('/api/app-state'),
        ]);
        if (coreRes.ok) {
          const json = await coreRes.json();
          if (!cancelled && json.status === 'success') {
            const d = json.data;
            if (d.project) setProject(d.project);
            if (Array.isArray(d.units)) setUnits(d.units);
            if (Array.isArray(d.stakeholders)) setStakeholders(d.stakeholders);
            if (Array.isArray(d.processes)) setProcesses(d.processes);
            if (Array.isArray(d.documents)) setDocuments(d.documents);
            if (Array.isArray(d.issues)) setIssues(d.issues);
            if (Array.isArray(d.riskAssessments)) setRiskAssessments(d.riskAssessments);
            if (Array.isArray(d.bcpActivations)) setBcpActivations(d.bcpActivations);
          }
        }
        if (appRes.ok) {
          const json = await appRes.json();
          if (!cancelled && json.status === 'success') {
            const a = json.data;
            if (Array.isArray(a.templates)) setTemplates(a.templates);
            if (Array.isArray(a.workingPapers)) setWorkingPapers(a.workingPapers);
            if (Array.isArray(a.interviews)) setInterviewWorksheets(a.interviews);
            if (Array.isArray(a.detailedBia)) setDetailedBiaWorksheets(a.detailedBia);
            if (a.systemConfig) setSystemConfig(a.systemConfig);
            if (Array.isArray(a.users)) setUsers(a.users);
            if (Array.isArray(a.securityLogs)) setSecurityLogs(a.securityLogs);
            if (Array.isArray(a.auditLogs)) setAuditLogs(a.auditLogs);
          }
        }
      } catch (e) {
        console.error('[store] DB hydration failed, using local defaults:', e);
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      fetch('/api/persist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: currentProject,
          units,
          stakeholders,
          processes,
          documents,
          issues,
          riskAssessments,
          bcpActivations,
        }),
      }).catch((e) => console.error('[store] DB persist (core) failed:', e));

      fetch('/api/app-state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templates,
          workingPapers,
          interviews: interviewWorksheets,
          detailedBia: detailedBiaWorksheets,
          systemConfig,
          users,
          securityLogs,
          auditLogs,
        }),
      }).catch((e) => console.error('[store] DB persist (app-state) failed:', e));
    }, 600);
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, [
    hydrated,
    currentProject,
    units,
    stakeholders,
    processes,
    documents,
    issues,
    riskAssessments,
    bcpActivations,
    templates,
    workingPapers,
    interviewWorksheets,
    detailedBiaWorksheets,
    systemConfig,
    users,
    securityLogs,
    auditLogs,
  ]);

  return (
    <BcmContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentProject,
        setProject,
        units,
        setUnits,
        stakeholders,
        setStakeholders,
        processes,
        setProcesses,
        documents,
        setDocuments,
        issues,
        setIssues,
        riskAssessments,
        setRiskAssessments,
        bcpActivations,
        setBcpActivations,
        auditLogs,
        addAuditLog,
        updateDocumentReview,
        updateStakeholderPosition,
        updateBiaDraft,
        getBiaDraft,
        saveBiaAssessment,
        submitBiaApproval,
        searchQuery,
        setSearchQuery,
        templates,
        setTemplates,
        saveTemplate,
        cloneTemplate,
        updateTemplateStatus,
        workingPapers,
        setWorkingPapers,
        saveWorkingPaper,
        interviewWorksheets,
        setInterviewWorksheets,
        saveInterviewWorksheet,
        createProcessFromInterview,
        detailedBiaWorksheets,
        setDetailedBiaWorksheets,
        saveDetailedBiaWorksheet,
        lockDetailedBiaWorksheet,
        systemConfig,
        setSystemConfig,
        updateSystemConfig,
        users,
        setUsers,
        currentUser,
        securityLogs,
        isAuthenticated,
        authChecked,
        login,
        logout,
        registerUser,
        updateUser,
        toggleUserLock,
        resetUserPassword,
        switchUser,
        hasPermission,
        addSecurityLog,
      }}
    >
      {children}
    </BcmContext.Provider>
  );
};

export function useBcm() {
  const context = useContext(BcmContext);
  if (!context) throw new Error('useBcm must be used within a BcmProvider');
  return context;
}
