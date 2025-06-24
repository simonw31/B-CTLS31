'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function GeneralInfo({ employeeId }: { employeeId: string }) {
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/employees/${employeeId}`)
      .then((res) => res.json())
      .then((data) => setEmployee(data));
  }, [employeeId]);

  if (!employee) return <div>Chargement...</div>;

  return (
    <Card>
      <CardContent className="p-6 grid gap-8">
        {/* Coordonnées */}
        <section>
          <h3 className="text-lg font-bold mb-2">Coordonnées</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nom" value={employee.nom} />
            <Field label="Prénom" value={employee.prenom} />
            <Field label="Matricule" value={employee.matricule ?? '—'} />
            <Field label="Date de naissance" value={employee.dateNaissance?.slice(0,10) ?? ''} />
            <Field label="Sexe" value={employee.sexe} />
            <Field label="Nationalité" value={employee.nationalite} />
            <Field label="Adresse" value={employee.adresse} />
            <Field label="Complément d’adresse" value={employee.complementAdresse ?? '—'} />
            <Field label="Code postal" value={employee.codePostal} />
            <Field label="Ville" value={employee.ville} />
          </div>
        </section>

        {/* Information bancaire */}
        <section>
          <h3 className="text-lg font-bold mb-2">Information bancaire</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="IBAN" value={employee.iban} />
            <Field label="BIC" value={employee.bic} />
          </div>
        </section>

        {/* Santé & urgence */}
        <section>
          <h3 className="text-lg font-bold mb-2">Santé & urgence</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Numéro Sécurité sociale" value={employee.securiteSociale} />
            <Field label="Contact d'urgence" value={employee.urgenceNom + ' ' + employee.urgencePrenom} />
            <Field label="Téléphone urgence" value={employee.urgenceTel} />
          </div>
        </section>

        {/* Divers */}
        <section>
          <h3 className="text-lg font-bold mb-2">Divers</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Moyen de transport" value={employee.moyenTransport ?? '—'} />
            <Field label="Statut" value={employee.actif ? "Actif" : "Inactif"} />
          </div>
        </section>

        {/* Bouton Éditer */}
        <div>
          <Button variant="outline" className="w-max mt-4" disabled>
            Éditer (bientôt)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-neutral-700">{label}</Label>
      <Input value={value} disabled tabIndex={0} className="bg-neutral-100" />
    </div>
  );
}
