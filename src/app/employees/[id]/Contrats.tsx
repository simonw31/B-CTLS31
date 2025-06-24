'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

const ContractForm = dynamic(() => import('./ContractForm'), { ssr: false });
const AmendmentForm = dynamic(() => import('./AmendmentForm'), { ssr: false });

function AmendmentsList({ contractId }: { contractId: string }) {
  const [amendments, setAmendments] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch(`/api/contracts/${contractId}/amendments`)
      .then(res => res.json())
      .then(data => setAmendments(data || []));
  }, [contractId, refresh]);

  async function handleDelete(id: string) {
    if (!window.confirm('Supprimer cet avenant ?')) return;
    await fetch(`/api/contracts/${contractId}/amendments/${id}`, { method: 'DELETE' });
    setRefresh(r => r + 1);
  }

  return (
    <div className="ml-4 mt-2 mb-2 p-2 rounded bg-neutral-50 border">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-sm">Avenants</span>
        <Button size="sm" onClick={() => setShowForm(s => !s)}>
          {showForm ? "Annuler" : "+ Avenant"}
        </Button>
      </div>
      {showForm && (
        <AmendmentForm
          contractId={contractId}
          onSaved={() => { setShowForm(false); setRefresh(r => r + 1); }}
        />
      )}
      {amendments.length === 0 && <div className="text-neutral-400 text-sm">Aucun avenant</div>}
      <ul className="mt-2 space-y-2">
        {amendments.map(a => (
          <li key={a.id} className="border rounded px-2 py-1 flex items-center justify-between">
            <span>
              <span className="font-bold">{a.type}</span> — du {a.dateDebut?.slice(0,10)}
              {a.dateFin && ` au ${a.dateFin.slice(0,10)}`}
              {a.role && `, rôle: ${a.role}`}
              {a.heuresContrat && `, heures: ${a.heuresContrat}h`}
            </span>
            <Button size="icon" variant="destructive" onClick={() => handleDelete(a.id)}>×</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Contrats({ employeeId }: { employeeId: string }) {
  const [employee, setEmployee] = useState<any>(null);
  const [contractsRefresh, setContractsRefresh] = useState(0);
  const [showContractForm, setShowContractForm] = useState(false);

  useEffect(() => {
    fetch(`/api/employees/${employeeId}`)
      .then((res) => res.json())
      .then((data) => setEmployee(data));
  }, [employeeId, contractsRefresh]);

  if (!employee) return <div>Chargement...</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-bold mb-3">Contrats</h3>
        <ul className="space-y-4">
          {employee.contracts?.length ? employee.contracts.map((contract: any) => (
            <li key={contract.id} className="border p-4 rounded-xl bg-white">
              <div className="flex flex-wrap gap-4 items-center mb-2">
                <span className="font-semibold">Type:</span>
                <span>{contract.type}</span>
                <span className="font-semibold">Rôle:</span>
                <span>{contract.role}</span>
                <span className="font-semibold">Heures:</span>
                <span>{contract.heuresContrat}h</span>
                <span className="font-semibold">Statut:</span>
                <span>{contract.statut === "en_contrat" ? "En contrat" : "Démission"}</span>
                <span className="font-semibold">Début:</span>
                <span>{contract.dateDebut?.slice(0, 10)}</span>
                <span className="font-semibold">Fin:</span>
                <span>{contract.dateFin?.slice(0, 10) ?? "—"}</span>
              </div>
              {/* Gestion avenants */}
              <AmendmentsList contractId={contract.id} />
            </li>
          )) : (
            <li className="text-neutral-500">Aucun contrat pour cet employé.</li>
          )}
        </ul>
        <Button className="mt-4" onClick={() => setShowContractForm(true)}>
          + Ajouter un contrat
        </Button>
        {showContractForm && (
          <ContractForm
            employeeId={employee.id}
            onSaved={() => {
              setShowContractForm(false);
              setContractsRefresh(r => r + 1);
            }}
            onCancel={() => setShowContractForm(false)}
          />
        )}
      </CardContent>
    </Card>
  );
}
