// src/app/api/timeEntry/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RequestBody = {
  matricule: number;
  action: 'entrée' | 'sortie';
};

export async function POST(request: Request) {
  try {
    const { matricule, action }: RequestBody = await request.json();

    if (!matricule || !action) {
      return NextResponse.json({ error: 'Matricule et action requis' }, { status: 400 });
    }

    const employee = await prisma.employee.findUnique({
      where: { matricule },
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employé non trouvé' }, { status: 404 });
    }

    const now = new Date();

    // Créer des copies de la date pour bornes journée courante
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    if (action === 'entrée') {
      const openEntry = await prisma.timeEntry.findFirst({
        where: {
          employeeId: employee.id,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          heureSortie: '',
        },
      });

      if (openEntry) {
        return NextResponse.json(
          { error: 'Vous avez déjà une entrée sans sortie aujourd’hui' },
          { status: 400 }
        );
      }

      const newEntry = await prisma.timeEntry.create({
        data: {
          employeeId: employee.id,
          date: now,
          heureEntree: now.toTimeString().slice(0, 5), // hh:mm
          heureSortie: '',
          type: 'reel',
        },
      });

      return NextResponse.json({ message: `Entrée enregistrée à ${newEntry.heureEntree}` });
    }

    if (action === 'sortie') {
      const openEntry = await prisma.timeEntry.findFirst({
        where: {
          employeeId: employee.id,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          heureSortie: '',
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!openEntry) {
        return NextResponse.json(
          { error: 'Aucune entrée ouverte trouvée aujourd’hui' },
          { status: 400 }
        );
      }

      const updatedEntry = await prisma.timeEntry.update({
        where: { id: openEntry.id },
        data: { heureSortie: now.toTimeString().slice(0, 5) },
      });

      return NextResponse.json({ message: `Sortie enregistrée à ${updatedEntry.heureSortie}` });
    }

    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 });
  } catch (error) {
    console.error('API pointeuse error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
