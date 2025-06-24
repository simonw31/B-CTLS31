import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { amendmentCreateSchema } from '../../schema'; // adapter le chemin selon l'arborescence
import { z } from 'zod';

// Liste tous les avenants du contrat
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const amendments = await prisma.amendment.findMany({
      where: { contractId: params.id },
      orderBy: { dateDebut: 'desc' }
    });
    return NextResponse.json(amendments);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur list avenants' }, { status: 500 });
  }
}

// Crée un nouvel avenant pour ce contrat (pas de contractId dans le body !)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const raw = await req.json();
    const parsed = amendmentCreateSchema.parse(raw); // PAS de contractId attendu côté front
    const amendment = await prisma.amendment.create({
      data: {
        ...parsed,
        contractId: params.id,
      },
    });
    return NextResponse.json(amendment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur create avenant' }, { status: 500 });
  }
}
