import { NextResponse } from 'next/server';
import { ensureSeeded, getBootstrapData } from '@/lib/bootstrap';
import { persistCoreData } from '@/lib/persist';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureSeeded();
    const { documents } = await getBootstrapData();
    return NextResponse.json({ status: 'success', data: documents });
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
    await persistCoreData({ documents: body.documents ?? body });
    const { documents } = await getBootstrapData();
    return NextResponse.json({ status: 'success', message: 'Document request saved', data: documents });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
