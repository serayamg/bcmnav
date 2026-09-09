import { prisma } from '@/lib/db';
import {
  INITIAL_TEMPLATES,
  INITIAL_WORKING_PAPERS,
  INITIAL_INTERVIEWS,
  INITIAL_DETAILED_BIA,
  INITIAL_SYSTEM_CONFIG,
} from '@/lib/mock-templates-data';
import { INITIAL_SYSTEM_USERS, INITIAL_SECURITY_LOGS } from '@/lib/mock-data';

/**
 * Slices persisted as JSON documents in the AppState table. These are rich,
 * deeply-nested client aggregates that do not map cleanly onto the normalized
 * relational schema, so they are stored (and versioned) as serialized JSON.
 */
export const APP_STATE_KEYS = [
  'templates',
  'workingPapers',
  'interviews',
  'detailedBia',
  'systemConfig',
  'users',
  'securityLogs',
] as const;

export type AppStateKey = (typeof APP_STATE_KEYS)[number];

const SLICE_DEFAULTS: Record<AppStateKey, unknown> = {
  templates: INITIAL_TEMPLATES,
  workingPapers: [],
  interviews: [],
  detailedBia: [],
  systemConfig: INITIAL_SYSTEM_CONFIG,
  users: INITIAL_SYSTEM_USERS,
  securityLogs: INITIAL_SECURITY_LOGS,
};

/**
 * Seed each AppState slice from the reference dataset the first time it is
 * requested. Idempotent per key.
 */
export async function ensureAppStateSeeded(): Promise<void> {
  const existing = await prisma.appState.findMany({ select: { key: true } });
  const present = new Set(existing.map((e) => e.key));
  const missing = APP_STATE_KEYS.filter((k) => !present.has(k));
  if (missing.length === 0) return;
  await prisma.$transaction(
    missing.map((key) =>
      prisma.appState.create({ data: { key, data: JSON.stringify(SLICE_DEFAULTS[key]) } })
    )
  );
}

export type AppStatePayload = Record<AppStateKey, unknown>;

export async function getAppState(): Promise<AppStatePayload> {
  await ensureAppStateSeeded();
  const rows = await prisma.appState.findMany();
  const byKey = new Map(rows.map((r) => [r.key, r.data]));
  const result = {} as AppStatePayload;
  for (const key of APP_STATE_KEYS) {
    const raw = byKey.get(key);
    try {
      result[key] = raw ? JSON.parse(raw) : SLICE_DEFAULTS[key];
    } catch {
      result[key] = SLICE_DEFAULTS[key];
    }
  }
  return result;
}

export async function saveAppState(slices: Partial<Record<AppStateKey, unknown>>): Promise<void> {
  const entries = Object.entries(slices).filter(([key]) =>
    (APP_STATE_KEYS as readonly string[]).includes(key)
  ) as [AppStateKey, unknown][];
  if (entries.length === 0) return;
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.appState.upsert({
        where: { key },
        create: { key, data: JSON.stringify(value ?? SLICE_DEFAULTS[key]) },
        update: { data: JSON.stringify(value ?? SLICE_DEFAULTS[key]) },
      })
    )
  );
}
