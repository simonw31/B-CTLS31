import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      where: { actif: true },
      select: {
        id: true,
        prenom: true,
        nom: true,
      },
      orderBy: { nom: 'asc' },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error('API employees/active error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
