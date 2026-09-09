import { NextResponse } from 'next/server';
import { persistCoreData } from '@/lib/persist';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await persistCoreData(body);
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('[persist] failed:', error);
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
