import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { amendmentSchema } from '../../contracts/schema';
import { z } from 'zod';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const amendment = await prisma.amendment.findUnique({ where: { id: params.id } });
    if (!amendment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(amendment);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur get avenant' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const raw = await req.json();
    const parsed = amendmentSchema.parse(raw);
    const amendment = await prisma.amendment.update({
      where: { id: params.id },
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

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.amendment.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur delete avenant' }, { status: 500 });
  }
}
