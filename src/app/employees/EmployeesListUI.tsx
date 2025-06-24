'use client';

import Link from 'next/link';
import { useState } from 'react';
import { User2, Plus, ArrowRight, LayoutGrid, List, Circle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Employee = {
  id: string;
  matricule: number | null;
  nom: string;
  prenom: string;
  actif: boolean;
};

export default function EmployeesListUI({ employees }: { employees: Employee[] }) {
  const [view, setView] = useState<'cards' | 'list'>('cards');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Selection logic
  const toggleSelect = (id: string) =>
    setSelected((prev) =>
      prev.has(id)
        ? new Set([...prev].filter((x) => x !== id))
        : new Set([...prev, id])
    );
  const selectAll = () => setSelected(new Set(employees.map((e) => e.id)));
  const deselectAll = () => setSelected(new Set());
  const allSelected = selected.size === employees.length && employees.length > 0;

  // Framer variants
  // ...
const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, duration: 0.4 },
  },
  exit: {
    opacity: 0,
    y: -24,
    scale: 0.97,
    transition: { duration: 0.15 },
  },
};

const listRowVariants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, duration: 0.5 },
  },
  exit: {
    opacity: 0,
    x: 32,
    transition: { duration: 0.2 },
  },
};


  return (
    <main className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <User2 className="w-7 h-7 text-blue-600" />
            </motion.span>
            Employés
          </h1>
          <motion.button
            layout
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.08 }}
            className={`rounded-full p-2 ml-3 border transition ${
              allSelected
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-neutral-100 border-neutral-200 hover:bg-blue-50'
            }`}
            aria-label={allSelected ? "Désélectionner tous" : "Sélectionner tous"}
            onClick={allSelected ? deselectAll : selectAll}
            tabIndex={0}
            type="button"
          >
            <AnimatePresence mode="wait">
              {allSelected ? (
                <motion.span key="selected" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <CheckCircle className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span key="not-selected" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Circle className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <span className="text-sm text-neutral-500">
            {selected.size > 0 && `${selected.size} sélectionné${selected.size > 1 ? 's' : ''}`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-400">Vue :</span>
          <motion.button
            layout
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.13, backgroundColor: '#2563eb', color: '#fff' }}
            onClick={() => setView('cards')}
            aria-label="Vue cartes"
            tabIndex={0}
            type="button"
            className={`rounded-full p-2 border transition ${
              view === 'cards'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-neutral-100 border-neutral-200 hover:bg-blue-50'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </motion.button>
          <motion.button
            layout
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.13, backgroundColor: '#2563eb', color: '#fff' }}
            onClick={() => setView('list')}
            aria-label="Vue liste"
            tabIndex={0}
            type="button"
            className={`rounded-full p-2 border transition ${
              view === 'list'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-neutral-100 border-neutral-200 hover:bg-blue-50'
            }`}
          >
            <List className="w-5 h-5" />
          </motion.button>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <Link
              href="/employees/new"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl shadow bg-blue-600 text-white font-bold transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              tabIndex={0}
              aria-label="Ajouter un nouvel employé"
            >
              <Plus className="w-5 h-5" />
              Nouvel Employé
            </Link>
          </motion.div>
        </div>
      </div>

      {/* CARDS */}
      <AnimatePresence mode="wait">
        {view === 'cards' ? (
          <motion.section
            key="cards"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.07 } },
              exit: { opacity: 0, y: 30 },
            }}
            className="grid md:grid-cols-2 gap-6"
          >
            {employees.map((e) => (
              <motion.div
                tabIndex={0}
                key={e.id}
                className={`group flex items-center justify-between rounded-2xl p-6 bg-white shadow border transition hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-400`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                aria-label={`Détail employé ${e.nom} ${e.prenom}`}
              >
                <motion.button
                  className="mr-3 focus:outline-none"
                  aria-label={
                    selected.has(e.id) ? 'Désélectionner employé' : 'Sélectionner employé'
                  }
                  onClick={() => toggleSelect(e.id)}
                  tabIndex={0}
                  type="button"
                  whileTap={{ scale: 0.80 }}
                  whileHover={{ scale: 1.15 }}
                >
                  <AnimatePresence mode="wait">
                    {selected.has(e.id) ? (
                      <motion.span
                        key="checked"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', bounce: 0.6, duration: 0.18 }}
                      >
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="circle"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', bounce: 0.6, duration: 0.18 }}
                      >
                        <Circle className="w-6 h-6 text-neutral-300" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-xs text-neutral-400">Matricule</span>
                  <span className="font-mono text-sm text-neutral-700">{e.matricule ?? '—'}</span>
                  <span className="text-xl font-semibold">
                    {e.nom} <span className="font-normal text-neutral-500">{e.prenom}</span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      e.actif
                        ? 'text-green-700 bg-green-100 px-2 py-0.5 rounded'
                        : 'text-red-700 bg-red-100 px-2 py-0.5 rounded'
                    }`}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        e.actif ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    />
                    {e.actif ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <Link
                  href={`/employees/${e.id}`}
                  tabIndex={0}
                  className="ml-2 p-3 rounded-full bg-neutral-100 hover:bg-blue-50 border border-transparent transition group-hover:border-blue-400 focus:border-blue-400 focus:outline-none"
                  aria-label={`Voir fiche de ${e.nom} ${e.prenom}`}
                >
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </Link>
              </motion.div>
            ))}
          </motion.section>
        ) : (
          // TABLE LIST VIEW
          <motion.table
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full border mt-4 rounded-2xl overflow-hidden shadow"
          >
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-center">
                  <button
                    onClick={allSelected ? deselectAll : selectAll}
                    aria-label={allSelected ? "Désélectionner tous" : "Sélectionner tous"}
                    className="focus:outline-none"
                    type="button"
                  >
                    {allSelected ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5 text-neutral-300" />
                    )}
                  </button>
                </th>
                <th className="p-2">Matricule</th>
                <th className="p-2">Nom</th>
                <th className="p-2">Prénom</th>
                <th className="p-2">Statut</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {employees.map((e) => (
                  <motion.tr
                    key={e.id}
                    className="border-b hover:bg-neutral-50"
                    variants={listRowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <td className="p-2 text-center">
                      <button
                        onClick={() => toggleSelect(e.id)}
                        aria-label={
                          selected.has(e.id) ? 'Désélectionner employé' : 'Sélectionner employé'
                        }
                        className="focus:outline-none"
                        type="button"
                      >
                        {selected.has(e.id) ? (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-neutral-300" />
                        )}
                      </button>
                    </td>
                    <td className="p-2">{e.matricule ?? '—'}</td>
                    <td className="p-2">{e.nom}</td>
                    <td className="p-2">{e.prenom}</td>
                    <td className="p-2">
                      {e.actif ? (
                        <span className="text-green-700 font-semibold">Actif</span>
                      ) : (
                        <span className="text-red-700">Inactif</span>
                      )}
                    </td>
                    <td className="p-2">
                      <Link
                        href={`/employees/${e.id}`}
                        className="text-blue-600 hover:underline"
                        aria-label={`Voir fiche de ${e.nom} ${e.prenom}`}
                      >
                        <ArrowRight className="w-5 h-5 inline" />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </motion.table>
        )}
      </AnimatePresence>

      {employees.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center text-neutral-400"
        >
          Aucun employé pour l’instant.
        </motion.div>
      )}
    </main>
  );
}
