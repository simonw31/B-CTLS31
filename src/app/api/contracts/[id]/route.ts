import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contractSchema } from '../schema';
import { z } from 'zod';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: params.id },
      include: { amendments: true },
    });
    if (!contract) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(contract);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur get contrat' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const raw = await req.json();
    const parsed = contractSchema.parse(raw);
    const contract = await prisma.contract.update({
      where: { id: params.id },
      data: parsed,
    });
    return NextResponse.json(contract);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur update contrat' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.contract.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur delete contrat' }, { status: 500 });
  }
}
