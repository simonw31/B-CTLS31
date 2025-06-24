'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const defaultForm = {
  nom: '',
  prenom: '',
  matricule: '',
  dateNaissance: '',
  sexe: 'homme',
  nationalite: '',
  adresse: '',
  complementAdresse: '',
  codePostal: '',
  ville: '',
  iban: '',
  bic: '',
  securiteSociale: '',
  urgenceNom: '',
  urgencePrenom: '',
  urgenceTel: '',
  moyenTransport: '',
};

export default function EmployeeCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(defaultForm);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = {
      ...form,
      matricule: form.matricule ? Number(form.matricule) : null,
      dateNaissance: form.dateNaissance ? new Date(form.dateNaissance).toISOString() : null,
      complementAdresse: form.complementAdresse || null,
      moyenTransport: form.moyenTransport || null,
    };

    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) router.push('/employees');
    setLoading(false);
  }

  function input(name: keyof typeof defaultForm, label: string, type = 'text', required = true) {
    return (
      <div className="flex-1">
        <label className="block font-semibold mb-1">{label}</label>
        <input
          className="w-full border p-2 rounded"
          type={type}
          value={form[name]}
          required={required}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        />
      </div>
    );
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Ajouter un employé</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          {input('nom', 'Nom')}
          {input('prenom', 'Prénom')}
        </div>
        <div className="flex gap-4">
          {input('matricule', 'Matricule', 'number', false)}
          <div className="flex-1">
            <label className="block font-semibold mb-1">Date de naissance</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={form.dateNaissance}
              required
              onChange={(e) => setForm({ ...form, dateNaissance: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Sexe</label>
            <select
              className="w-full border p-2 rounded"
              value={form.sexe}
              required
              onChange={(e) => setForm({ ...form, sexe: e.target.value })}
            >
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="autre">Autre</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4">
          {input('nationalite', 'Nationalité')}
          {input('adresse', 'Adresse')}
        </div>
        <div className="flex gap-4">
          {input('complementAdresse', 'Complément d\'adresse', 'text', false)}
          {input('codePostal', 'Code Postal')}
          {input('ville', 'Ville')}
        </div>
        <div className="flex gap-4">
          {input('iban', 'IBAN')}
          {input('bic', 'BIC')}
        </div>
        <div className="flex gap-4">
          {input('securiteSociale', 'Numéro Sécurité Sociale')}
        </div>
        <div className="flex gap-4">
          {input('urgenceNom', 'Nom personne à contacter en urgence')}
          {input('urgencePrenom', 'Prénom personne à contacter en urgence')}
          {input('urgenceTel', 'Numéro en cas d\'urgence')}
        </div>
        <div className="flex gap-4">
          {input('moyenTransport', 'Moyen de transport', 'text', false)}
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700"
          >
            {loading ? 'Ajout...' : 'Ajouter'}
          </button>
        </div>
      </form>
    </main>
  );
}
