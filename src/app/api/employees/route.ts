import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { employeeSchema } from './schema';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { nom: 'asc' },
      include: {
        contracts: {
          where: { statut: 'en_contrat' },
          orderBy: { dateDebut: 'desc' },
        },
      },
    });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = employeeSchema.parse(raw); // Ici la validation Zod
    const employee = await prisma.employee.create({ data: parsed });
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}
