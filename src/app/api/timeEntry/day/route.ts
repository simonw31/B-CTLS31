import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    if (!dateParam) {
      return NextResponse.json({ error: 'Paramètre date requis' }, { status: 400 });
    }

    const startDate = new Date(dateParam);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(dateParam);
    endDate.setHours(23, 59, 59, 999);

    const entries = await prisma.timeEntry.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        employeeId: true,
        heureEntree: true,
        heureSortie: true,
        date: true,
      },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error('API timeEntry/day error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
