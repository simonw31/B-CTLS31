'use client';

import { Card, CardContent } from '@/components/ui/card';

export default function Documents({ employeeId }: { employeeId: string }) {
  // Placeholder : gestion des documents RH/contrats/PIECE-ID à implémenter plus tard
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-bold mb-2">Documents (bientôt)</h3>
        <p className="text-neutral-600">
          Cette section te permettra d’ajouter ou de visualiser les documents liés à l’employé (contrat, pièce d’identité, etc.). 
        </p>
      </CardContent>
    </Card>
  );
}
