// app/employees/page.tsx (Server Component)
import { prisma } from '@/lib/prisma';
import EmployeesListUI from './EmployeesListUI'; // Crée ce fichier dans le même dossier

export default async function EmployeesPage() {
  const employees = await prisma.employee.findMany({
    orderBy: { nom: 'asc' },
    select: {
      id: true,
      matricule: true,
      nom: true,
      prenom: true,
      actif: true,
    },
  });

  return <EmployeesListUI employees={employees} />;
}
