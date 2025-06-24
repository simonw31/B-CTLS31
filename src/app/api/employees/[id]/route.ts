import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { employeeSchema } from '../schema'; // chemin relatif vers schema.ts
import { z } from 'zod';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
      include: {
        contracts: {
          include: { amendments: true },
          orderBy: { dateDebut: 'desc' },
        },
      },
    });
    if (!employee)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const raw = await req.json();
    const parsed = employeeSchema.parse(raw); // Valide comme en POST
    const employee = await prisma.employee.update({
      where: { id: params.id },
      data: parsed,
    });
    return NextResponse.json(employee);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur update' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.employee.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur delete' }, { status: 500 });
  }
}
