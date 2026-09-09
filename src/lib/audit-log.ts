import { prisma } from '@/lib/db';
import { INITIAL_AUDIT_LOGS, AuditLogData, INITIAL_PROJECT } from '@/lib/mock-data';

function formatTimestamp(d: Date): string {
  return d.toISOString().replace('T', ' ').substring(0, 16);
}

function parseTimestamp(value?: string | null): Date {
  if (!value) return new Date();
  const d = new Date(value.replace(' ', 'T'));
  return isNaN(d.getTime()) ? new Date() : d;
}

/** Seed the AuditLog table with the reference trail the first time it is empty. */
export async function ensureAuditSeeded(): Promise<void> {
  const count = await prisma.auditLog.count();
  if (count > 0) return;
  await prisma.$transaction(
    INITIAL_AUDIT_LOGS.map((log) =>
      prisma.auditLog.create({
        data: {
          id: log.id,
          projectId: INITIAL_PROJECT.id,
          userName: log.userName,
          userRole: log.userRole,
          action: log.action,
          module: log.module,
          recordName: log.recordName,
          details: log.details,
          timestamp: parseTimestamp(log.timestamp),
        },
      })
    )
  );
}

export async function getAuditLogs(): Promise<AuditLogData[]> {
  await ensureAuditSeeded();
  const rows = await prisma.auditLog.findMany({ orderBy: { timestamp: 'desc' } });
  return rows.map((r) => ({
    id: r.id,
    userName: r.userName,
    userRole: r.userRole,
    action: r.action,
    module: r.module,
    recordName: r.recordName ?? '',
    details: r.details ?? '',
    timestamp: formatTimestamp(r.timestamp),
  }));
}

/**
 * Append/upsert audit records. The audit trail is immutable by design, so this
 * never deletes existing rows — it only inserts new entries (idempotent by id).
 */
export async function saveAuditLogs(logs: AuditLogData[]): Promise<void> {
  if (!Array.isArray(logs) || logs.length === 0) return;
  await prisma.$transaction(
    logs.map((log) =>
      prisma.auditLog.upsert({
        where: { id: log.id },
        create: {
          id: log.id,
          projectId: INITIAL_PROJECT.id,
          userName: log.userName,
          userRole: log.userRole,
          action: log.action,
          module: log.module,
          recordName: log.recordName,
          details: log.details,
          timestamp: parseTimestamp(log.timestamp),
        },
        update: {
          userName: log.userName,
          userRole: log.userRole,
          action: log.action,
          module: log.module,
          recordName: log.recordName,
          details: log.details,
        },
      })
    )
  );
}
