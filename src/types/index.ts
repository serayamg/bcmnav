export type UserRole =
  | 'SUPER_ADMIN'
  | 'CONSULTANT_DIRECTOR'
  | 'PROJECT_MANAGER'
  | 'BCM_CONSULTANT'
  | 'CLIENT_COORDINATOR'
  | 'UNIT_HEAD'
  | 'PROCESS_OWNER'
  | 'BIA_RESPONDENT'
  | 'APPROVER'
  | 'VIEWER';

export interface UserContext {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title?: string;
  avatarUrl?: string;
}

export type UserPermission =
  | 'SYSTEM_CONFIG_MANAGE'
  | 'USER_CREDENTIAL_MANAGE'
  | 'SECURITY_POLICY_MANAGE'
  | 'AUDIT_LOG_EXPORT'
  | 'BIA_APPROVE_FINAL'
  | 'BIA_WORKSHEET_EDIT'
  | 'BIA_WORKSHEET_VIEW'
  | 'TEMPLATE_MANAGE'
  | 'WORKING_PAPER_EDIT'
  | 'PROCESS_REGISTER_EDIT'
  | 'DRL_UPLOAD_RESPONSE'
  | 'INTERVIEW_RESPONDENT'
  | 'EXECUTIVE_HEATMAP_VIEW';

export interface SystemUser {
  id: string;
  username: string;
  fullName: string;
  title: string;
  email: string;
  role: UserRole;
  roleBadge: string;
  roleDescription: string;
  department: string;
  organization: string;
  mfaEnabled: boolean;
  mfaType: 'TOTP Authenticator' | 'Hardware FIDO2' | 'SMS OTP';
  status: 'Active' | 'Locked' | 'Suspended' | 'Password Expired';
  passwordHashSnippet: string; // Argon2id representation
  lastLoginAt: string;
  lastLoginIp: string;
  failedLoginAttempts: number;
  maxFailedAttempts: number;
  sessionTokenMasked: string;
  passwordExpiresDays: number;
  permissions: UserPermission[];
  avatarInitial: string;
  assignedBySuperAdmin: string;
  assignedAt: string;
}

export interface SecurityEventLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  eventType:
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILED'
    | 'LOGOUT_SUCCESS'
    | 'ROLE_SWITCH'
    | 'UNAUTHORIZED_ACCESS_ATTEMPT'
    | 'PASSWORD_RESET'
    | 'ACCOUNT_LOCKED'
    | 'MFA_CHALLENGE'
    | 'CREDENTIAL_CHANGED';
  severity: 'INFO' | 'WARNING' | 'CRITICAL_SECURITY_ALERT';
  ipAddress: string;
  details: string;
  mitigationAction?: string;
}

export interface LoginResult {
  success: boolean;
  requiresMfa?: boolean;
  mfaType?: string;
  user?: SystemUser;
  error?: string;
  remainingAttempts?: number;
}

export type CriticalityTier =
  | 'Tier 1 — Mission Critical'
  | 'Tier 2 — Critical'
  | 'Tier 3 — Important'
  | 'Tier 4 — Non-Critical';

export type RecoveryPriority = 'P1' | 'P2' | 'P3' | 'P4';

// ===========================================================
// CK to CU: WORKING TEMPLATE & BUILDER TYPES
// ===========================================================

export type TemplateCategory =
  | 'Project Initiation Template'
  | 'Document Request List'
  | 'Document Review Worksheet'
  | 'Stakeholder Mapping'
  | 'Stakeholder Interview'
  | 'Business Process Identification'
  | 'Process Mapping'
  | 'BIA Questionnaire'
  | 'BIA Worksheet'
  | 'Dependency Assessment'
  | 'Resource Requirement'
  | 'Application Criticality'
  | 'Vendor Criticality'
  | 'Facility Criticality'
  | 'Business Continuity Risk Assessment'
  | 'Workshop Validation'
  | 'Gap Assessment'
  | 'Issue Register'
  | 'Action Plan'
  | 'Meeting Minutes'
  | 'Consultant Working Paper'
  | 'Management Interview'
  | 'BIA Consolidation'
  | 'Management Report'
  | 'BCM Strategy Worksheet'
  | 'BCP Worksheet'
  | 'Exercise / Testing Worksheet';

export type TemplateScope = 'GLOBAL' | 'INDUSTRY' | 'CLIENT' | 'PROJECT';
export type TemplateStatus = 'Draft' | 'Review' | 'Approved' | 'Published' | 'Deprecated';

export type FieldDataType =
  | 'Section'
  | 'Sub Section'
  | 'Heading'
  | 'Instruction'
  | 'Text Input'
  | 'Long Text'
  | 'Number'
  | 'Currency'
  | 'Percentage'
  | 'Date'
  | 'Time'
  | 'Dropdown'
  | 'Multi Select'
  | 'Checkbox'
  | 'Radio'
  | 'Yes / No'
  | 'Rating'
  | 'Score'
  | 'Matrix'
  | 'Table'
  | 'File Upload'
  | 'Evidence'
  | 'Signature'
  | 'Approval'
  | 'Comment'
  | 'Calculated Field'
  | 'Read-only Field';

export interface ConditionalRule {
  id: string;
  sourceFieldId: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'GREATER_THAN' | 'LESS_THAN';
  value: string;
  action: 'SHOW' | 'HIDE' | 'REQUIRE' | 'OPTIONAL';
  targetFieldIds: string[];
}

export interface CalculatedFormula {
  id: string;
  targetFieldId: string;
  formulaExpression: string;
  variables: string[];
  description?: string;
}

export interface TemplateField {
  id: string;
  name: string;
  label: string;
  description?: string;
  helpText?: string;
  placeholder?: string;
  dataType: FieldDataType;
  defaultValue?: any;
  mandatory: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  displayOrder: number;
  validationRule?: string;
  scoringWeight?: number;
  unit?: string;
  decimalPlaces?: number;
  minimum?: number;
  maximum?: number;
  options?: string[];
  conditionalRuleId?: string;
  formulaExpression?: string;
}

export interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  isSubSection?: boolean;
  fields: TemplateField[];
}

export interface TemplateVersionHistory {
  version: string;
  changedAt: string;
  changedBy: string;
  changeSummary: string;
  approvalStatus: TemplateStatus;
}

export interface WorkingTemplate {
  id: string;
  code: string;
  name: string;
  category: TemplateCategory;
  description: string;
  framework: string;
  industry: string;
  scope: TemplateScope;
  version: string;
  status: TemplateStatus;
  owner: string;
  createdDate: string;
  lastUpdated: string;
  effectiveDate: string;
  expiryDate?: string;
  createdBy: string;
  approvedBy?: string;
  usageCount: number;
  isDefault: boolean;
  sections: TemplateSection[];
  conditionalRules: ConditionalRule[];
  calculatedFormulas: CalculatedFormula[];
  versionHistory: TemplateVersionHistory[];
}

// ===========================================================
// CV to CZ: CONSULTANT WORKING PAPERS & INTERVIEWS
// ===========================================================

export type WorkingPaperStatus = 'Draft' | 'Prepared' | 'Reviewed' | 'Final';

export interface WorkingPaperCrossReference {
  projectId?: string;
  projectCode?: string;
  unitId?: string;
  unitName?: string;
  processId?: string;
  processCode?: string;
  processName?: string;
  stakeholderId?: string;
  stakeholderName?: string;
  documentId?: string;
  documentCode?: string;
  documentName?: string;
  biaId?: string;
  biaCode?: string;
  workshopId?: string;
  issueId?: string;
  issueCode?: string;
}

export interface ConsultantWorkingPaper {
  id: string;
  code: string; // e.g. WP-BIA-001
  title: string;
  objective: string;
  scope: string;
  procedurePerformed: string;
  source: string;
  evidence: string;
  analysis: string;
  finding: string;
  consultantConclusion: string;
  recommendation: string;
  preparedBy: string;
  reviewedBy?: string;
  date: string;
  status: WorkingPaperStatus;
  crossRefs: WorkingPaperCrossReference;
}

export interface InterviewTopic {
  id: string;
  topic: string;
  questions: string[];
  responses: string;
  keyFindings?: string;
}

export interface InterviewWorksheet {
  id: string;
  code: string;
  stakeholderId: string;
  stakeholderName: string;
  unitId: string;
  unitName: string;
  role: string;
  date: string;
  interviewer: string;
  topics: InterviewTopic[];
  issuesIdentified: string[];
  processesDiscovered: Array<{
    code: string;
    name: string;
    description: string;
    sla?: string;
    isCritical?: boolean;
  }>;
  identifiedApps: string[];
  identifiedVendors: string[];
  followUp: string;
  evidence: string;
  status: 'Draft' | 'Completed' | 'Verified';
}

// ===========================================================
// DA to ED: ADVANCED BIA WORKSHEET TYPES
// ===========================================================

export interface ImpactMatrixCell {
  score: number;
  comment: string;
  evidence?: string;
}

export interface FinancialImpactLossItem {
  category: string;
  hourlyLoss: number;
  dailyLoss: number;
  weeklyLoss: number;
  description: string;
}

export interface ResourceTimeHorizonItem {
  resourceType: 'People' | 'Laptop / PC' | 'Application' | 'Network' | 'Workspace' | 'Communication' | 'Equipment' | 'Data' | 'Vendor';
  normalCapacity: string;
  h0to2: string;
  h2to4: string;
  h4to8: string;
  h8to24: string;
  day2: string;
  day3: string;
  notes?: string;
}

export interface RecoveryCapabilityEvaluation {
  requiredRto: string;
  existingCapabilityRto: string;
  rtoAssessment: 'MET' | 'PARTIALLY MET' | 'NOT MET';
  requiredRpo: string;
  existingCapabilityRpo: string;
  rpoAssessment: 'MET' | 'PARTIALLY MET' | 'NOT MET';
  requiredStaff: number;
  availableStaff: number;
  staffAssessment: 'MET' | 'PARTIALLY MET' | 'NOT MET';
  requiredWorkspace: string;
  alternateCapacity: string;
  workspaceAssessment: 'MET' | 'PARTIALLY MET' | 'NOT MET';
}

export interface DetailedBiaWorksheet {
  id: string;
  code: string;
  projectId: string;
  unitId: string;
  unitName: string;
  processId: string;
  processCode: string;
  processName: string;
  processOwnerName: string;
  respondentName: string;
  reviewerName: string;
  assessmentDate: string;
  templateVersion: string;
  assessmentStatus: 'Draft' | 'In Progress' | 'Under Review' | 'Validated' | 'Approved';
  validationStatus: string;
  approvalStatus: string;
  isLocked: boolean;
  currentRevision: string;
  
  // Section 1: Process Profile
  processProfile: {
    description: string;
    objective: string;
    productService: string;
    customer: string;
    operatingHours: string;
    peakPeriod: string;
    transactionVolume: string;
    financialValue: string;
    sla: string;
    regulatoryReq: string;
    criticalPeriod: string;
  };

  // Section 2: Process Activities (Process -> Sub-process -> Activity)
  activities: Array<{
    id: string;
    subProcess: string;
    activityName: string;
    responsibleRole: string;
    input: string;
    output: string;
    application: string;
    duration: string;
    dependency: string;
  }>;

  // Section 3: Impact Matrix (8 Categories x 6 Durations)
  impactMatrix: Record<string, Record<string, ImpactMatrixCell>>;

  // Section 4: Financial Impact Worksheet
  financialImpact: {
    items: FinancialImpactLossItem[];
    totalFinancialImpact: number;
  };

  // Section 5: Non-Financial Impact
  nonFinancialImpact: {
    customerImpact: string;
    regulatoryBreach: string;
    reputationDamage: string;
    legalLiability: string;
  };

  // Section 6: MTPD Analysis
  mtpdAnalysis: {
    suggestedMtpd: string;
    proposedMtpd: string;
    approvedMtpd: string;
    reasoning: string;
    intervals: Array<{ time: string; maxImpact: number; category: string; breached: boolean }>;
  };

  // Section 7: RTO Determination
  rtoDetermination: {
    mptdReference: string;
    suggestedRto: string;
    approvedRto: string;
    compliesWithMtpd: boolean;
    justification: string;
  };

  // Section 8: RPO Determination
  rpoDetermination: {
    requiredRpo: string;
    existingBackupRpo: string;
    hasGap: boolean;
    gapDuration: string;
    mitigationStrategy: string;
  };

  // Section 9: MBCO
  mbcoAnalysis: {
    normalCapacity: string;
    minimumRequiredCapacity: string;
    minimumPercentage: number;
    minimumTransactions: string;
    operatingMode: string;
  };

  // Section 10: Resource Requirements
  resourceMatrix: ResourceTimeHorizonItem[];

  // Section 11: Dependencies
  dependencies: {
    applications: Array<{ name: string; criticality: string; rto: string; isSpof: boolean }>;
    vendors: Array<{ name: string; service: string; sla: string; hasBcp: boolean; isCritical: boolean; isSpof: boolean }>;
    facilities: Array<{ primary: string; alternate: string; minSeats: number; type: string }>;
    upstreamProcesses: string[];
    downstreamProcesses: string[];
  };

  // Section 12: Workaround
  workaround: {
    available: boolean;
    description: string;
    maxDuration: string;
    capacityCoveragePercent: number;
    knownLimitations: string;
    lastTested: string;
  };

  // Section 13: Capability Assessment & Gap Analysis
  recoveryCapability: RecoveryCapabilityEvaluation;
  identifiedGaps: Array<{
    id: string;
    code: string;
    title: string;
    gapType: string;
    severity: 'Critical' | 'High' | 'Medium';
    actionPlan: string;
    owner: string;
    targetDate: string;
  }>;

  // Section 14: Criticality & Summary
  criticalityScore: number;
  criticalityTier: CriticalityTier;
  recoveryPriority: RecoveryPriority;

  // Section 15: Recommendations & Sign-off
  consultantRecommendation: {
    assessment: string;
    conclusion: string;
    recommendedAction: string;
    priority: 'High' | 'Medium' | 'Low';
    targetDate: string;
  };

  validationLog: Array<{
    stage: string;
    date: string;
    user: string;
    action: string;
    comment: string;
  }>;

  revisions: Array<{
    revisionNumber: string;
    date: string;
    changedBy: string;
    changes: Array<{ field: string; prevValue: string; newValue: string; reason: string }>;
  }>;
}

// ===========================================================
// EH to EQ: SYSTEM PARAMETER CONFIGURATION TYPES
// ===========================================================

export interface SystemParameterConfig {
  general: {
    systemName: string;
    companyName: string;
    defaultLanguage: 'id' | 'en';
    timeZone: string;
    currency: string;
    dateFormat: string;
    theme: string;
  };
  project: {
    codeFormat: string;
    defaultStage: string;
    stageWeightBia: number;
    defaultDurationDays: number;
  };
  bcmMethodology: {
    standardFramework: string;
    regulatoryStandard: string;
    criticalityWeights: {
      financial: number;
      operational: number;
      customer: number;
      regulatory: number;
      reputation: number;
    };
    impactThresholds: Array<{
      level: number;
      name: string;
      financialLimit: string;
      operationalDisruption: string;
      customerLossCount: string;
    }>;
    rtoScaleOptions: string[];
    rpoScaleOptions: string[];
  };
  workflow: {
    stages: Array<{
      id: string;
      name: string;
      role: string;
      slaDays: number;
      escalationDays: number;
    }>;
  };
  notificationTemplates: Array<{
    id: string;
    event: string;
    subject: string;
    body: string;
  }>;
}

