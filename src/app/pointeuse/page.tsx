'use client';

import React, { useState, useEffect } from 'react';

type Employee = {
  id: string;
  nom: string;
  prenom: string;
};

const digits = ['1','2','3','4','5','6','7','8','9','0'];

export default function PointeusePage() {
  const [matricule, setMatricule] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [step, setStep] = useState<'input' | 'selectAction' | 'confirmation'>('input');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEntryOpen, setIsEntryOpen] = useState<boolean | null>(null);
  const [toast, setToast] = useState<{ text: string; visible: boolean }>({ text: '', visible: false });

  // Horloge live
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = now.toLocaleTimeString('fr-FR', { hour12: false, hour: '2-digit', minute: '2-digit' });
  const formattedDate = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  function appendDigit(d: string) {
    if (matricule.length < 6) setMatricule(matricule + d);
  }
  function backspace() {
    setMatricule(matricule.slice(0, -1));
  }

  // Chercher employé et check entrée ouverte
  async function fetchEmployee() {
    if (!matricule) {
      setMessage('Veuillez saisir votre matricule');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const resEmp = await fetch(`/api/employees/byMatricule?matricule=${matricule}`);
      if (!resEmp.ok) throw new Error('Employé non trouvé');
      const emp = await resEmp.json();
      setEmployee(emp);

      // Check s'il existe une entrée ouverte (heureSortie = '')
      const resOpenEntry = await fetch(`/api/timeEntry/open?employeeId=${emp.id}`);
      if (!resOpenEntry.ok) {
        // Pas d'entrée ouverte
        setIsEntryOpen(false);
      } else {
        const openEntry = await resOpenEntry.json();
        setIsEntryOpen(openEntry ? true : false);
      }

      setStep('selectAction');
    } catch (e: any) {
      setMessage(e.message || 'Erreur');
      setEmployee(null);
      setIsEntryOpen(null);
    } finally {
      setLoading(false);
    }
  }

  async function handlePointage(action: 'entrée' | 'sortie') {
    if (!employee) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/timeEntry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricule: Number(matricule), action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur serveur');
      
      // Affiche toast avec prénom nom + heure entrée/sortie
      setToast({ text: `${employee.prenom} ${employee.nom} ${action} à ${formattedTime}`, visible: true });

      setStep('confirmation');

      // Après 3s, reset et masque toast
      setTimeout(() => {
        reset();
        setToast({ text: '', visible: false });
      }, 3000);
    } catch (e: any) {
      setMessage(e.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMatricule('');
    setEmployee(null);
    setStep('input');
    setMessage('');
    setIsEntryOpen(null);
  }

  return (
    <>
      <div className="flex min-h-screen">
        {/* Left panel */}
        <div className="flex-1 bg-blue-600 flex flex-col justify-center items-center relative text-white select-none">
          <img src="/logo.png" alt="Logo" className="mb-8 w-20 h-20" />
          <div className="text-[7rem] font-mono">{formattedTime}</div>
          <div className="absolute bottom-4 text-sm capitalize">
            Journée calendrier : {formattedDate}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 bg-white flex flex-col justify-center items-center px-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-sm w-full text-center">
            {step === 'input' && (
              <>
                <label htmlFor="matricule" className="block mb-4 font-semibold text-gray-900 text-lg">
                  Tapez votre code
                </label>
                <input
                  id="matricule"
                  type="text"
                  value={matricule}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg text-center text-2xl py-3 mb-6"
                  autoFocus
                />
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {digits.slice(0, 9).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => appendDigit(d)}
                      disabled={loading}
                      className="py-4 bg-gray-200 hover:bg-gray-300 rounded text-2xl font-bold select-none"
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={backspace}
                    disabled={loading}
                    className="py-4 bg-orange-500 hover:bg-orange-600 rounded text-white text-2xl font-bold select-none"
                    aria-label="Effacer"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => appendDigit('0')}
                    disabled={loading}
                    className="py-4 bg-gray-200 hover:bg-gray-300 rounded text-2xl font-bold select-none"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={fetchEmployee}
                    disabled={loading || matricule.length === 0}
                    className="py-4 bg-orange-500 hover:bg-orange-600 rounded text-white text-xl font-bold select-none"
                  >
                    Valider
                  </button>
                </div>
                {message && <p className="text-red-600">{message}</p>}
              </>
            )}

            {step === 'selectAction' && employee && isEntryOpen !== null && (
              <>
                <h2 className="text-2xl font-semibold mb-4">
                  Bonjour {employee.prenom} {employee.nom}
                </h2>
                <p className="mb-6">Que souhaitez-vous faire ?</p>
                <div className="flex gap-4 justify-center">
                  {!isEntryOpen ? (
                    <button
                      onClick={() => handlePointage('entrée')}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded text-xl"
                    >
                      Entrée
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePointage('sortie')}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded text-xl"
                    >
                      Sortie
                    </button>
                  )}
                </div>
                <button
                  onClick={reset}
                  disabled={loading}
                  className="mt-6 underline text-sm text-gray-500 hover:text-gray-700"
                >
                  Changer de matricule
                </button>
                {message && <p className="mt-4 text-red-600">{message}</p>}
              </>
            )}

            {step === 'confirmation' && (
              <>
                {toast.visible && (
                  <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50">
                    {toast.text}
                  </div>
                )}
                <button
                  onClick={reset}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded text-xl"
                >
                  Nouveau pointage
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
