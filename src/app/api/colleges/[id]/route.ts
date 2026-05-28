export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid college ID' }, { status: 400 });
    }

    const college = await prisma.college.findUnique({ where: { id } });
    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error(`GET /api/colleges/${params.id} error:`, error);
    return NextResponse.json({ error: 'Failed to fetch college' }, { status: 500 });
  }
}
