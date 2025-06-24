import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contractSchema } from './schema'; // Mets à jour ce chemin selon où est ton schema
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = contractSchema.parse(raw);
    const contract = await prisma.contract.create({ data: parsed });
    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur création contrat' }, { status: 500 });
  }
}

