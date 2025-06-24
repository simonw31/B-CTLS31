import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }
    await prisma.timeEntry.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Pointage supprimé' });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      // @ts-ignore
      if ((error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Pointage introuvable' }, { status: 404 });
      }
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// AJOUT PATCH POUR MODIFIER UN SHIFT
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }
    const body = await request.json();
    const { heureEntree, heureSortie } = body;
    const updated = await prisma.timeEntry.update({
      where: { id: params.id },
      data: {
        heureEntree,
        heureSortie,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      // @ts-ignore
      if ((error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Pointage introuvable' }, { status: 404 });
      }
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
