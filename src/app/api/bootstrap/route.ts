import { NextResponse } from 'next/server';
import { ensureSeeded, getBootstrapData } from '@/lib/bootstrap';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureSeeded();
    const data = await getBootstrapData();
    return NextResponse.json({ status: 'success', data });
  } catch (error) {
    console.error('[bootstrap] failed:', error);
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
