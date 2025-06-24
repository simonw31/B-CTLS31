'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { TimeEntry } from '@/lib/types';

type Props = {
  shift: TimeEntry | null;
  onClose: () => void;
  onDeleteSuccess?: () => void;
};

export default function ShiftModal({ shift, onClose, onDeleteSuccess }: Props) {
  // Early return : shift peut être null ici, donc on sort tout de suite !
  if (!shift) return null;

  // En-dessous, shift est forcément non-null pour TypeScript

  const [heureEntree, setHeureEntree] = useState(shift.heureEntree);
  const [heureSortie, setHeureSortie] = useState(shift.heureSortie);
  const [loading, setLoading] = useState(false);

  // Si on change de shift sans fermer la modale, on ré-initialise les valeurs
  useEffect(() => {
    setHeureEntree(shift.heureEntree);
    setHeureSortie(shift.heureSortie);
  }, [shift]);

  async function onDelete() {
    try {
      setLoading(true);
      const res = await fetch(`/api/timeEntry/${shift.id}`, { method: 'DELETE' });
      if (res.ok) {
        onClose();
        onDeleteSuccess && onDeleteSuccess();
        return;
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.error || 'Erreur suppression');
      }
    } catch (err) {
      alert('Erreur réseau');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function onUpdate() {
    try {
      setLoading(true);
      const res = await fetch(`/api/timeEntry/${shift.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heureEntree, heureSortie }),
      });
      if (res.ok) {
        onClose();
        onDeleteSuccess && onDeleteSuccess();
        return;
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.error || 'Erreur modification');
      }
    } catch (err) {
      alert('Erreur réseau');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier ou supprimer le pointage</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
            onUpdate();
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex gap-4">
            <div>
              <label className="block text-sm text-gray-600">Entrée</label>
              <input
                type="time"
                value={heureEntree}
                onChange={e => setHeureEntree(e.target.value)}
                className="border rounded px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Sortie</label>
              <input
                type="time"
                value={heureSortie}
                onChange={e => setHeureSortie(e.target.value)}
                className="border rounded px-2 py-1"
                required
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              type="submit"
              variant="outline"
              disabled={loading}
            >
              Modifier
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={loading}
              type="button"
            >
              Supprimer
            </Button>
            <Button onClick={onClose} type="button" disabled={loading}>
              Annuler
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
