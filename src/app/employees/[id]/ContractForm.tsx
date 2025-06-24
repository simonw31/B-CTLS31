'use client';

import { useState } from 'react';

type Props = {
  employeeId: string;
  onSaved: () => void;
  onCancel: () => void;
};

export default function ContractForm({ employeeId, onSaved, onCancel }: Props) {
  const [form, setForm] = useState({
    type: 'CDI',
    role: 'employe_polyvalent',
    heuresContrat: '',
    statut: 'en_contrat',
    dateDebut: '',
    dateFin: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch('/api/contracts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        employeeId,
        heuresContrat: Number(form.heuresContrat),
        dateDebut: form.dateDebut ? new Date(form.dateDebut).toISOString() : null,
        dateFin: form.dateFin ? new Date(form.dateFin).toISOString() : null,
      }),
    });
    if (res.ok) {
      onSaved();
    } else {
      const err = await res.json();
      setError(err.error || 'Erreur lors de l’ajout');
    }
    setLoading(false);
  }

  function input(name: keyof typeof form, label: string, type = 'text') {
    return (
      <div className="flex-1">
        <label className="block font-semibold mb-1">{label}</label>
        <input
          className="w-full border p-2 rounded"
          type={type}
          value={form[name]}
          required={name !== 'dateFin'}
          onChange={e => setForm({ ...form, [name]: e.target.value })}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 rounded-xl border mt-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-semibold mb-1">Type</label>
          <select
            className="w-full border p-2 rounded"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
          >
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1">Rôle</label>
          <select
            className="w-full border p-2 rounded"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="employe_polyvalent">Employé polyvalent</option>
            <option value="responsable">Responsable</option>
            <option value="assistant_manager">Assistant Manager</option>
            <option value="manager">Manager</option>
          </select>
        </div>
      </div>
      <div className="flex gap-4">
        {input('heuresContrat', 'Heures contrat', 'number')}
        <div className="flex-1">
          <label className="block font-semibold mb-1">Statut</label>
          <select
            className="w-full border p-2 rounded"
            value={form.statut}
            onChange={e => setForm({ ...form, statut: e.target.value })}
          >
            <option value="en_contrat">En contrat</option>
            <option value="demission">Démission</option>
          </select>
        </div>
      </div>
      <div className="flex gap-4">
        {input('dateDebut', 'Date début', 'date')}
        {input('dateFin', 'Date fin', 'date')}
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700"
        >
          {loading ? 'Ajout...' : 'Créer le contrat'}
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          onClick={onCancel}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
