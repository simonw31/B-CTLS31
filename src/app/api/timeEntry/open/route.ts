import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');

  if (!employeeId) {
    return NextResponse.json({ error: 'employeeId requis' }, { status: 400 });
  }

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23,59,59,999);

  const openEntry = await prisma.timeEntry.findFirst({
    where: {
      employeeId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      heureSortie: '',
    },
  });

  if (!openEntry) return NextResponse.json(null, { status: 404 });

  return NextResponse.json(openEntry);
}
