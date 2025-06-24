import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { amendmentUpdateSchema } from '../../../schema'; // adapter le chemin
import { z } from 'zod';

export async function GET(_req: NextRequest, { params }: { params: { amendmentId: string } }) {
  try {
    const amendment = await prisma.amendment.findUnique({ where: { id: params.amendmentId } });
    if (!amendment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(amendment);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur get avenant' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { amendmentId: string } }) {
  try {
    const raw = await req.json();
    const parsed = amendmentUpdateSchema.parse(raw); // ICI contractId attendu dans le body
    const amendment = await prisma.amendment.update({
      where: { id: params.amendmentId },
      data: parsed,
    });
    return NextResponse.json(amendment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur update avenant' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { amendmentId: string } }) {
  try {
    await prisma.amendment.delete({ where: { id: params.amendmentId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur delete avenant' }, { status: 500 });
  }
}
