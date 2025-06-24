// src/app/api/employee/byMatricule/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const matricule = Number(url.searchParams.get('matricule'));

  if (!matricule) return NextResponse.json({ error: 'Matricule requis' }, { status: 400 });

  const employee = await prisma.employee.findUnique({
    where: { matricule },
    select: { id: true, nom: true, prenom: true },
  });

  if (!employee) return NextResponse.json({ error: 'Employé non trouvé' }, { status: 404 });

  return NextResponse.json(employee);
}
