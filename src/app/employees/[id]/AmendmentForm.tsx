'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const initialState = {
  type: 'avenant',
  dateDebut: '',
  dateFin: '',
  role: '',
  heuresContrat: ''
};

export default function AmendmentForm({
  contractId,
  onSaved,
}: {
  contractId: string;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    await fetch(`/api/contracts/${contractId}/amendments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        heuresContrat: form.heuresContrat ? Number(form.heuresContrat) : undefined,
        dateDebut: form.dateDebut ? new Date(form.dateDebut).toISOString() : undefined,
        dateFin: form.dateFin ? new Date(form.dateFin).toISOString() : undefined,
        role: form.role || undefined,
      })
    });
    setLoading(false);
    setForm(initialState);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap gap-2 items-end">
      <select
        className="border p-2 rounded"
        value={form.type}
        onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
      >
        <option value="avenant">Avenant</option>
        <option value="modif_permanente">Modification permanente</option>
      </select>
      <input
        type="date"
        className="border p-2 rounded"
        value={form.dateDebut}
        onChange={e => setForm(f => ({ ...f, dateDebut: e.target.value }))}
        required
      />
      <input
        type="date"
        className="border p-2 rounded"
        value={form.dateFin}
        onChange={e => setForm(f => ({ ...f, dateFin: e.target.value }))}
        placeholder="Date de fin"
      />
      <input
        className="border p-2 rounded"
        type="text"
        placeholder="Rôle (optionnel)"
        value={form.role}
        onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
      />
      <input
        className="border p-2 rounded"
        type="number"
        min="1"
        placeholder="Heures (optionnel)"
        value={form.heuresContrat}
        onChange={e => setForm(f => ({ ...f, heuresContrat: e.target.value }))}
      />
      <Button type="submit" disabled={loading}>{loading ? 'Ajout...' : 'Valider'}</Button>
    </form>
  );
}
