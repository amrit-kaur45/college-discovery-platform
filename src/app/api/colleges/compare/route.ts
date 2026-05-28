import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      return NextResponse.json({ error: 'ids parameter is required' }, { status: 400 });
    }

    const ids = idsParam.split(',').map(Number).filter((n) => !isNaN(n));
    if (ids.length < 2 || ids.length > 3) {
      return NextResponse.json({ error: 'Provide 2-3 college IDs to compare' }, { status: 400 });
    }

    const colleges = await prisma.college.findMany({ where: { id: { in: ids } } });

    if (colleges.length !== ids.length) {
      return NextResponse.json({ error: 'One or more colleges not found' }, { status: 404 });
    }

    return NextResponse.json({ colleges });
  } catch (error) {
    console.error('GET /api/colleges/compare error:', error);
    return NextResponse.json({ error: 'Failed to compare colleges' }, { status: 500 });
  }
}
