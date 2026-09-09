import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import type { BootstrapPayload } from '@/lib/bootstrap';

function toDate(value?: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

type CorePayload = Partial<BootstrapPayload>;

/**
 * Replace the core dataset in the database with the state coming from the
 * client store. Everything runs in one transaction and follows referential
 * order (units -> stakeholders -> processes -> documents -> issues) so foreign
 * keys stay valid. Rows missing from the payload are pruned.
 */
export async function persistCoreData(payload: CorePayload): Promise<void> {
  const projectId = payload.project?.id ?? 'prj-01';
  const ops: Prisma.PrismaPromise<unknown>[] = [];

  if (payload.project) {
    const p = payload.project;
    ops.push(
      prisma.project.update({
        where: { id: p.id },
        data: {
          code: p.code,
          name: p.name,
          framework: p.framework,
          sponsorName: p.sponsorName,
          bcmCoordinatorName: p.bcmCoordinatorName,
          consultingPmName: p.consultingPmName,
          startDate: toDate(p.startDate) ?? new Date(),
          targetDate: toDate(p.targetDate),
          status: p.status,
          scopeDescription: p.scopeDescription,
          location: p.location,
        },
      })
    );
  }

  if (payload.units) {
    // Parents (lower level) before children so self-referential FKs hold.
    const units = [...payload.units].sort((a, b) => a.level - b.level);
    const unitIds = new Set(units.map((u) => u.id));
    for (const u of units) {
      const data = {
        code: u.code,
        name: u.name,
        level: u.level,
        // Only keep parentId if it references a unit that is part of this payload,
        // otherwise null — prevents foreign-key violations from stale/default refs.
        parentId: u.parentId && unitIds.has(u.parentId) ? u.parentId : null,
        unitHeadName: u.unitHeadName,
        bcmCoordName: u.bcmCoordName,
        location: u.location,
      };
      ops.push(
        prisma.organizationUnit.upsert({
          where: { id: u.id },
          create: { id: u.id, projectId, ...data },
          update: data,
        })
      );
    }
  }

  if (payload.stakeholders) {
    const validUnitIds = new Set((payload.units ?? []).map((u) => u.id));
    for (const s of payload.stakeholders) {
      const data = {
        code: s.code,
        unitId: validUnitIds.has(s.unitId) ? s.unitId : null,
        name: s.name,
        position: s.position,
        email: s.email,
        phone: s.phone,
        isInternal: s.isInternal,
        bcmRole: s.bcmRole,
        influenceLevel: s.influenceLevel,
        interestLevel: s.interestLevel,
        criticality: s.criticality,
        decisionAuthority: s.decisionAuthority,
        recommendedBiaRole: s.recommendedBiaRole,
        notes: s.notes,
      };
      ops.push(
        prisma.stakeholder.upsert({
          where: { id: s.id },
          create: { id: s.id, projectId, ...data },
          update: data,
        })
      );
    }
  }

  if (payload.processes) {
    const stakeholderIds = new Set((payload.stakeholders ?? []).map((s) => s.id));
    const validUnitIds = new Set((payload.units ?? []).map((u) => u.id));
    for (const p of payload.processes) {
      if (!validUnitIds.has(p.unitId)) continue;
      // Only keep processOwnerId if it references a stakeholder in this payload.
      const ownerId = p.processOwnerId && stakeholderIds.has(p.processOwnerId)
        ? p.processOwnerId
        : null;
      const data = {
        code: p.code,
        unitId: p.unitId,
        name: p.name,
        level: p.level,
        processOwnerId: ownerId,
        description: p.description,
        objective: p.objective,
        productService: p.productService,
        customers: p.customers,
        inputs: p.inputs,
        keyActivities: p.keyActivities,
        outputs: p.outputs,
        frequency: p.frequency,
        operatingHours: p.operatingHours,
        peakPeriod: p.peakPeriod,
        transactionVolume: p.transactionVolume,
        financialValue: p.financialValue,
        slaRequirement: p.slaRequirement,
        regulatoryReq: p.regulatoryReq,
        manualWorkaround: p.manualWorkaround,
        existingBcp: p.existingBcp,
        status: p.status,
        isCriticalFlag: p.isCriticalFlag,
        rto: p.rto ?? null,
        rpo: p.rpo ?? null,
        mtpd: p.mtpd ?? null,
        criticalityTier: p.criticalityTier ?? null,
        spofFlag: p.spofFlag ?? false,
      };
      ops.push(
        prisma.businessProcess.upsert({
          where: { id: p.id },
          create: { id: p.id, projectId, ...data },
          update: data,
        })
      );
    }
  }

  if (payload.documents) {
    const validUnitIds = new Set((payload.units ?? []).map((u) => u.id));
    for (const d of payload.documents) {
      const data = {
        code: d.code,
        unitId: validUnitIds.has(d.unitId) ? d.unitId : null,
        category: d.category,
        name: d.name,
        description: d.description,
        mandatory: d.mandatory,
        confidentiality: d.confidentiality,
        priority: d.priority,
        status: d.status,
        targetDate: toDate(d.targetDate),
        uploadedFileName: d.uploadedFileName ?? null,
        uploadedFileSize: d.uploadedFileSize ?? null,
        uploadedAt: toDate(d.uploadedAt),
        version: d.version,
        reviewStatus: d.reviewStatus ?? null,
        completeness: d.completeness ?? null,
        relevance: d.relevance ?? null,
        keyFindings: d.keyFindings ?? null,
        gapIdentified: d.gapIdentified ?? null,
        followUpRequired: d.followUpRequired ?? null,
        reviewerName: d.reviewerName ?? null,
        reviewedAt: toDate(d.reviewedAt),
      };
      ops.push(
        prisma.documentRequest.upsert({
          where: { id: d.id },
          create: { id: d.id, projectId, ...data },
          update: data,
        })
      );
    }
  }

  if (payload.issues) {
    const unitByName = new Map((payload.units ?? []).map((u) => [u.name, u.id]));
    const processByName = new Map((payload.processes ?? []).map((p) => [p.name, p.id]));
    for (const i of payload.issues) {
      const data = {
        code: i.code,
        unitId: unitByName.get(i.unitName) ?? null,
        processId: processByName.get(i.processName) ?? null,
        title: i.title,
        description: i.description,
        severity: i.severity,
        owner: i.owner,
        targetDate: toDate(i.targetDate),
        status: i.status,
        actionPlan: i.actionPlan,
        consultantNotes: i.consultantNotes,
      };
      ops.push(
        prisma.issue.upsert({
          where: { id: i.id },
          create: { id: i.id, projectId, ...data },
          update: data,
        })
      );
    }
  }

  if (payload.riskAssessments) {
    for (const r of payload.riskAssessments) {
      const data = {
        code: r.code,
        category: r.category || null,
        riskName: r.riskName,
        affectedAsset: r.affectedAsset || null,
        likelihood: r.likelihood,
        impact: r.impact,
        existingControl: r.existingControl || null,
        mitigationPlan: r.mitigationPlan || null,
        pic: r.pic || null,
        targetDate: toDate(r.targetDate),
        status: r.status,
      };
      ops.push(
        prisma.riskAssessment.upsert({
          where: { id: r.id },
          create: { id: r.id, projectId, ...data },
          update: data,
        })
      );
    }
  }

  if (payload.bcpActivations) {
    for (const b of payload.bcpActivations) {
      const data = {
        code: b.code,
        disasterType: b.disasterType,
        severityLevel: b.severityLevel,
        activatedChapter: b.activatedChapter || null,
        workingArrangement: b.workingArrangement || null,
        affectedLocation: b.affectedLocation || null,
        damageDescription: b.damageDescription || null,
        personnelSafety: b.personnelSafety || null,
        affectedSystems: b.affectedSystems || null,
        estRecoveryTime: b.estRecoveryTime || null,
        activationTime: toDate(b.activationTime),
        authorizedBy: b.authorizedBy || null,
        status: b.status,
      };
      ops.push(
        prisma.bcpActivation.upsert({
          where: { id: b.id },
          create: { id: b.id, projectId, ...data },
          update: data,
        })
      );
    }
  }

  await prisma.$transaction(ops);

  // Prune rows that no longer exist in the client state (children first).
  if (payload.bcpActivations) {
    await prisma.bcpActivation.deleteMany({ where: { projectId, id: { notIn: payload.bcpActivations.map((b) => b.id) } } });
  }
  if (payload.riskAssessments) {
    await prisma.riskAssessment.deleteMany({ where: { projectId, id: { notIn: payload.riskAssessments.map((r) => r.id) } } });
  }
  if (payload.issues) {
    await prisma.issue.deleteMany({ where: { projectId, id: { notIn: payload.issues.map((i) => i.id) } } });
  }
  if (payload.documents) {
    await prisma.documentRequest.deleteMany({ where: { projectId, id: { notIn: payload.documents.map((d) => d.id) } } });
  }
  if (payload.processes) {
    await prisma.businessProcess.deleteMany({ where: { projectId, id: { notIn: payload.processes.map((p) => p.id) } } });
  }
  if (payload.stakeholders) {
    await prisma.stakeholder.deleteMany({ where: { projectId, id: { notIn: payload.stakeholders.map((s) => s.id) } } });
  }
  if (payload.units) {
    await prisma.organizationUnit.deleteMany({ where: { projectId, id: { notIn: payload.units.map((u) => u.id) } } });
  }
}
