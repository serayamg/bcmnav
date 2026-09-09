import { NextResponse } from 'next/server';
import { ensureSeeded, getBootstrapData } from '@/lib/bootstrap';
import { persistCoreData } from '@/lib/persist';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureSeeded();
    const { project } = await getBootstrapData();
    return NextResponse.json({ status: 'success', data: project });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await persistCoreData({ project: body });
    const { project } = await getBootstrapData();
    return NextResponse.json({ status: 'success', message: 'Project saved', data: project });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
