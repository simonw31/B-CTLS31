'use client';

import { useParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import GeneralInfo from './GeneralInfo';
import Disponibilite from './Disponibilite';
import Contrats from './Contrats';
import Documents from './Documents';
import { useState, useEffect } from 'react';

export default function EmployeePage() {
  const { id } = useParams() as { id: string };
  const [tab, setTab] = useState('info');
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/employees/${id}`)
      .then(res => res.json())
      .then(data => setEmployee(data));
  }, [id]);

  // Trouve le contrat actif (statut "en_contrat") ou prends le plus récent
  const contratActif = employee?.contracts?.find((c: any) => c.statut === "en_contrat") || employee?.contracts?.[0];

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Fiche employé</h2>
      <Tabs value={tab} onValueChange={setTab} className="w-full" orientation="horizontal">
        <TabsList className="w-full grid grid-cols-4 gap-2 mb-8">
          <TabsTrigger value="info" className="focus:outline-none">Information générale</TabsTrigger>
          <TabsTrigger value="dispo" className="focus:outline-none">Disponibilité</TabsTrigger>
          <TabsTrigger value="contrats" className="focus:outline-none">Contrats</TabsTrigger>
          <TabsTrigger value="docs" className="focus:outline-none">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <GeneralInfo employeeId={id} />
        </TabsContent>
        <TabsContent value="dispo">
          {/* Passe le contractId (pas employeeId) */}
          {contratActif ? (
            <Disponibilite contractId={contratActif.id} />
          ) : (
            <div className="p-4 text-neutral-500">Aucun contrat trouvé pour afficher les disponibilités.</div>
          )}
        </TabsContent>
        <TabsContent value="contrats">
          <Contrats employeeId={id} />
        </TabsContent>
        <TabsContent value="docs">
          <Documents employeeId={id} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
