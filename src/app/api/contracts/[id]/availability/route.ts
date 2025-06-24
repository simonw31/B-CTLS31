import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const JOURS_ENUM = [
  "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"
];

function mapJourToEnum(jour: string): string {
  const cleaned = (jour || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  return JOURS_ENUM.find(j => j === cleaned) || JOURS_ENUM[0];
}

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const contractId = context.params.id;
    const list = await prisma.availability.findMany({
      where: { contractId },
      orderBy: { jour: 'asc' }
    });
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la lecture' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const contractId = context.params.id;
    const dispoArray = await req.json();
    await prisma.availability.deleteMany({ where: { contractId } });

    const validDispos = dispoArray
      .filter((d: any) => d.plages && d.plages.length > 0)
      .map((d: any) => ({
        contractId,
        jour: mapJourToEnum(d.jour), // <-- ICI
        plages: d.plages
      }))
      .filter((d: any) => JOURS_ENUM.includes(d.jour));

    if (validDispos.length) {
      await prisma.availability.createMany({
        data: validDispos
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 });
  }
}
