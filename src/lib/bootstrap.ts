import { prisma } from '@/lib/db';
import {
  INITIAL_CLIENT,
  INITIAL_PROJECT,
  INITIAL_UNITS,
  INITIAL_STAKEHOLDERS,
  INITIAL_PROCESSES,
  INITIAL_DRL,
  INITIAL_ISSUES,
  ClientData,
  ProjectData,
  OrganizationUnitData,
  StakeholderData,
  BusinessProcessData,
  DocumentRequestData,
  RiskAssessmentData,
  BcpActivationData,
} from '@/lib/mock-data';

const UNIT_LEVEL_NAME: Record<number, string> = {
  1: 'Directorate',
  2: 'Division',
  3: 'Department',
  4: 'Section',
};

const PROCESS_LEVEL_NAME: Record<number, string> = {
  1: 'Core Service (L1)',
  2: 'Business Process',
  3: 'Activity (L3)',
};

function toDate(value?: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export function quadrantFor(influence: number, interest: number): StakeholderData['quadrant'] {
  if (influence >= 4 && interest >= 4) return 'Manage Closely';
  if (influence >= 4 && interest < 4) return 'Keep Satisfied';
  if (influence < 4 && interest >= 4) return 'Keep Informed';
  return 'Monitor';
}

/**
 * Populate the database from the reference dataset the first time it is used.
 * Idempotent: it only seeds when the Project table is empty.
 */
export async function ensureSeeded(): Promise<void> {
  const projectCount = await prisma.project.count();
  if (projectCount > 0) return;

  const client = await prisma.client.create({
    data: {
      id: 'clt-01',
      code: 'CLT-001',
      name: '',
      industry: '',
      country: 'Indonesia',
      address: '',
    },
  });

  await prisma.project.create({
    data: {
      id: 'prj-01',
      code: 'PRJ-2025-01',
      name: '',
      clientId: client.id,
      framework: 'ISO 22301:2019',
      sponsorName: '',
      bcmCoordinatorName: '',
      consultingPmName: '',
      startDate: new Date(),
      status: 'Draft',
      scopeDescription: '',
      location: '',
    },
  });
}

export interface BootstrapPayload {
  client: ClientData;
  project: ProjectData;
  units: OrganizationUnitData[];
  stakeholders: StakeholderData[];
  processes: BusinessProcessData[];
  documents: DocumentRequestData[];
  issues: typeof INITIAL_ISSUES;
  riskAssessments: RiskAssessmentData[];
  bcpActivations: BcpActivationData[];
}

export const EMPTY_CLIENT: ClientData = {
  id: 'clt-01',
  code: 'CLT-001',
  name: '',
  industry: '',
  country: 'Indonesia',
  address: '',
};

export const EMPTY_PROJECT: ProjectData = {
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
};

/**
 * Read every core entity from the database and reassemble the denormalized
 * shapes the client store consumes (unit names, quadrants, computed counts…).
 */
export async function getBootstrapData(): Promise<BootstrapPayload> {
  const [clientRow, projectRow, unitRows, stakeholderRows, processRows, documentRows, issueRows, riskRows, bcpRows] =
    await Promise.all([
      prisma.client.findFirst(),
      prisma.project.findFirst(),
      prisma.organizationUnit.findMany(),
      prisma.stakeholder.findMany(),
      prisma.businessProcess.findMany(),
      prisma.documentRequest.findMany(),
      prisma.issue.findMany(),
      prisma.riskAssessment.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.bcpActivation.findMany({ orderBy: { createdAt: 'asc' } }),
    ]);

  const unitName = (id?: string | null) => unitRows.find((u) => u.id === id)?.name ?? '';
  const stakeholderName = (id?: string | null) => stakeholderRows.find((s) => s.id === id)?.name ?? '';

  const client: ClientData = clientRow
    ? {
        id: clientRow.id,
        code: clientRow.code,
        name: clientRow.name,
        industry: clientRow.industry,
        country: clientRow.country,
        address: clientRow.address ?? '',
      }
    : EMPTY_CLIENT;

  const totalProcesses = processRows.length;
  const validatedProcesses = processRows.filter((p) => p.status === 'Validated' || p.status === 'Approved').length;
  const completionPercent = totalProcesses > 0 ? Math.round((validatedProcesses / totalProcesses) * 100) : 0;

  const project: ProjectData = projectRow
    ? {
        id: projectRow.id,
        code: projectRow.code,
        name: projectRow.name,
        clientId: projectRow.clientId,
        clientName: client.name,
        framework: projectRow.framework,
        sponsorName: projectRow.sponsorName ?? '',
        bcmCoordinatorName: projectRow.bcmCoordinatorName ?? '',
        consultingPmName: projectRow.consultingPmName ?? '',
        startDate: projectRow.startDate.toISOString().substring(0, 10),
        targetDate: projectRow.targetDate ? projectRow.targetDate.toISOString().substring(0, 10) : '',
        status: projectRow.status,
        scopeDescription: projectRow.scopeDescription ?? '',
        location: projectRow.location ?? '',
        completionPercent,
      }
    : EMPTY_PROJECT;

  const units: OrganizationUnitData[] = unitRows.map((u) => {
    const unitProcesses = processRows.filter((p) => p.unitId === u.id);
    return {
      id: u.id,
      code: u.code,
      name: u.name,
      level: u.level,
      levelName: UNIT_LEVEL_NAME[u.level] ?? `Level ${u.level}`,
      parentId: u.parentId,
      unitHeadName: u.unitHeadName ?? '',
      bcmCoordName: u.bcmCoordName ?? '',
      location: u.location ?? '',
      processCount: unitProcesses.length,
      biaCompletedCount: unitProcesses.filter((p) => p.status === 'Validated' || p.status === 'Approved').length,
    };
  });

  const stakeholders: StakeholderData[] = stakeholderRows.map((s) => ({
    id: s.id,
    code: s.code,
    name: s.name,
    unitId: s.unitId ?? '',
    unitName: unitName(s.unitId),
    position: s.position,
    email: s.email ?? '',
    phone: s.phone ?? '',
    isInternal: s.isInternal,
    bcmRole: s.bcmRole,
    influenceLevel: s.influenceLevel,
    interestLevel: s.interestLevel,
    criticality: s.criticality as StakeholderData['criticality'],
    decisionAuthority: s.decisionAuthority ?? '',
    recommendedBiaRole: s.recommendedBiaRole,
    notes: s.notes ?? '',
    quadrant: quadrantFor(s.influenceLevel, s.interestLevel),
  }));

  const processes: BusinessProcessData[] = processRows.map((p) => ({
    id: p.id,
    code: p.code,
    name: p.name,
    unitId: p.unitId,
    unitName: unitName(p.unitId),
    level: p.level,
    levelName: PROCESS_LEVEL_NAME[p.level] ?? `Level ${p.level}`,
    processOwnerId: p.processOwnerId ?? '',
    processOwnerName: stakeholderName(p.processOwnerId),
    description: p.description ?? '',
    objective: p.objective ?? '',
    productService: p.productService ?? '',
    customers: p.customers ?? '',
    inputs: p.inputs ?? '',
    keyActivities: p.keyActivities ?? '',
    outputs: p.outputs ?? '',
    frequency: p.frequency ?? '',
    operatingHours: p.operatingHours ?? '',
    peakPeriod: p.peakPeriod ?? '',
    transactionVolume: p.transactionVolume ?? '',
    financialValue: p.financialValue ?? '',
    slaRequirement: p.slaRequirement ?? '',
    regulatoryReq: p.regulatoryReq ?? '',
    manualWorkaround: p.manualWorkaround ?? '',
    existingBcp: p.existingBcp ?? '',
    status: p.status as BusinessProcessData['status'],
    isCriticalFlag: p.isCriticalFlag,
    rto: p.rto ?? undefined,
    rpo: p.rpo ?? undefined,
    mtpd: p.mtpd ?? undefined,
    criticalityTier: p.criticalityTier ?? undefined,
    spofFlag: p.spofFlag,
  }));

  const documents: DocumentRequestData[] = documentRows.map((d) => ({
    id: d.id,
    code: d.code,
    unitId: d.unitId ?? '',
    unitName: unitName(d.unitId),
    category: d.category,
    name: d.name,
    description: d.description ?? '',
    mandatory: d.mandatory,
    confidentiality: d.confidentiality as DocumentRequestData['confidentiality'],
    priority: d.priority as DocumentRequestData['priority'],
    status: d.status as DocumentRequestData['status'],
    targetDate: d.targetDate ? d.targetDate.toISOString().substring(0, 10) : '',
    uploadedFileName: d.uploadedFileName ?? undefined,
    uploadedFileSize: d.uploadedFileSize ?? undefined,
    uploadedAt: d.uploadedAt ? d.uploadedAt.toISOString().substring(0, 10) : undefined,
    version: d.version,
    reviewStatus: d.reviewStatus ?? undefined,
    completeness: d.completeness ?? undefined,
    relevance: d.relevance ?? undefined,
    keyFindings: d.keyFindings ?? undefined,
    gapIdentified: d.gapIdentified ?? undefined,
    followUpRequired: d.followUpRequired ?? undefined,
    reviewerName: d.reviewerName ?? undefined,
    reviewedAt: d.reviewedAt ? d.reviewedAt.toISOString().substring(0, 10) : undefined,
  }));

  const issues = issueRows.map((i) => ({
    id: i.id,
    code: i.code,
    unitName: unitName(i.unitId) || '',
    processName: processRows.find((p) => p.id === i.processId)?.name ?? '',
    title: i.title,
    description: i.description ?? '',
    severity: i.severity,
    owner: i.owner ?? '',
    targetDate: i.targetDate ? i.targetDate.toISOString().substring(0, 10) : '',
    status: i.status,
    actionPlan: i.actionPlan ?? '',
    consultantNotes: i.consultantNotes ?? '',
  })) as typeof INITIAL_ISSUES;

  const riskAssessments = riskRows.map((r) => ({
    id: r.id,
    code: r.code,
    category: r.category ?? '',
    riskName: r.riskName,
    affectedAsset: r.affectedAsset ?? '',
    likelihood: r.likelihood,
    impact: r.impact,
    existingControl: r.existingControl ?? '',
    mitigationPlan: r.mitigationPlan ?? '',
    pic: r.pic ?? '',
    targetDate: r.targetDate ? r.targetDate.toISOString().substring(0, 10) : '',
    status: r.status,
  }));

  const bcpActivations = bcpRows.map((b) => ({
    id: b.id,
    code: b.code,
    disasterType: b.disasterType,
    severityLevel: b.severityLevel,
    activatedChapter: b.activatedChapter ?? '',
    workingArrangement: b.workingArrangement ?? '',
    affectedLocation: b.affectedLocation ?? '',
    damageDescription: b.damageDescription ?? '',
    personnelSafety: b.personnelSafety ?? '',
    affectedSystems: b.affectedSystems ?? '',
    estRecoveryTime: b.estRecoveryTime ?? '',
    activationTime: b.activationTime ? b.activationTime.toISOString().substring(0, 16).replace('T', ' ') : '',
    authorizedBy: b.authorizedBy ?? '',
    status: b.status,
  }));

  return { client, project, units, stakeholders, processes, documents, issues, riskAssessments, bcpActivations };
}
