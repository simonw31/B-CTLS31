'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Creneau = { start: string; end: string; };

const JOURS_ENUM = [
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
  'dimanche',
];

const LABELS: Record<string, string> = {
  lundi: 'Lundi',
  mardi: 'Mardi',
  mercredi: 'Mercredi',
  jeudi: 'Jeudi',
  vendredi: 'Vendredi',
  samedi: 'Samedi',
  dimanche: 'Dimanche',
};

export default function Disponibilite({ contractId }: { contractId: string }) {
  const [dispos, setDispos] = useState<Record<string, Creneau[]>>({});
  const [loading, setLoading] = useState(false);

  // Récupère les dispos depuis l'API
  useEffect(() => {
    if (!contractId) return;
    fetch(`/api/contracts/${contractId}/availability`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const obj: Record<string, Creneau[]> = {};
        (data || []).forEach((d: any) => {
          obj[d.jour] = d.plages || [];
        });
        setDispos(obj);
      });
  }, [contractId]);

  // Transforme l'objet front en array pour l'API [{ jour, plages }]
  function toArray(obj: Record<string, Creneau[]>) {
    return JOURS_ENUM.map((jour) => ({
      jour,
      plages: obj[jour] || [],
    }));
  }

  // Sauvegarde vers l'API
  async function saveDispo() {
    setLoading(true);
    await fetch(`/api/contracts/${contractId}/availability`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toArray(dispos)),
    });
    setLoading(false);
  }

  // Ajoute un créneau
  function addCreneau(jour: string) {
    setDispos((old) => ({
      ...old,
      [jour]: [...(old[jour] || []), { start: '', end: '' }],
    }));
  }

  // Modifie un créneau
  function updateCreneau(jour: string, idx: number, key: 'start' | 'end', value: string) {
    setDispos((old) => ({
      ...old,
      [jour]: old[jour].map((c, i) => (i === idx ? { ...c, [key]: value } : c)),
    }));
  }

  // Supprime un créneau
  function removeCreneau(jour: string, idx: number) {
    setDispos((old) => ({
      ...old,
      [jour]: old[jour].filter((_, i) => i !== idx),
    }));
  }

  // Toute la journée
  function dispoAllDay(jour: string) {
    setDispos((old) => ({
      ...old,
      [jour]: [{ start: '00:00', end: '23:59' }],
    }));
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-bold mb-4">Disponibilités hebdomadaires</h3>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            saveDispo();
          }}
        >
          {JOURS_ENUM.map((jour) => (
            <div key={jour} className="mb-2">
              <div className="flex items-center gap-4 mb-2">
                <span className="w-32 font-semibold">{LABELS[jour]}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addCreneau(jour)}
                >
                  + créneau
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => dispoAllDay(jour)}
                >
                  Toute la journée
                </Button>
              </div>
              {(dispos[jour] || []).length === 0 && (
                <span className="text-neutral-400 ml-36">Non renseigné</span>
              )}
              {(dispos[jour] || []).map((cr, idx) => (
                <div key={idx} className="flex items-center gap-2 ml-36 mb-1">
                  <input
                    type="time"
                    className="border rounded px-2 py-1"
                    value={cr.start}
                    onChange={(e) => updateCreneau(jour, idx, 'start', e.target.value)}
                  />
                  <span>–</span>
                  <input
                    type="time"
                    className="border rounded px-2 py-1"
                    value={cr.end}
                    onChange={(e) => updateCreneau(jour, idx, 'end', e.target.value)}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="ml-1"
                    onClick={() => removeCreneau(jour, idx)}
                    aria-label="Supprimer ce créneau"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          ))}
          <Button type="submit" className="mt-4" disabled={loading}>
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
