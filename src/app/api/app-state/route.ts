import { NextResponse } from 'next/server';
import { getAppState, saveAppState, AppStateKey } from '@/lib/app-state';
import { getAuditLogs, saveAuditLogs } from '@/lib/audit-log';
import { AuditLogData } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [appState, auditLogs] = await Promise.all([getAppState(), getAuditLogs()]);
    return NextResponse.json({ status: 'success', data: { ...appState, auditLogs } });
  } catch (error) {
    console.error('[app-state] GET failed:', error);
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const { auditLogs, ...slices } = body;
    await Promise.all([
      saveAppState(slices as Partial<Record<AppStateKey, unknown>>),
      Array.isArray(auditLogs) ? saveAuditLogs(auditLogs as AuditLogData[]) : Promise.resolve(),
    ]);
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('[app-state] PUT failed:', error);
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
