import Link from "next/link";
import { User, CalendarDays, Clock, BarChart2, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 h-full min-h-screen px-4 py-8 md:p-10 bg-gray-50">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            Bienvenue <span className="text-2xl">👋</span>
          </h1>
          <p className="text-lg text-gray-600">
            Dashboard de gestion du personnel et des plannings
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          {/* Place ici un bouton action principal si besoin */}
        </div>
      </div>

      {/* TOP KPIs / Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Placeholders pour les stats principales */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 items-start min-h-[110px]">
          <span className="text-sm text-gray-500">Employés actifs</span>
          <span className="text-3xl font-bold">32</span>
          {/* TODO: rendre dynamique */}
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 items-start min-h-[110px]">
          <span className="text-sm text-gray-500">Heures pointées ce mois</span>
          <span className="text-3xl font-bold">1 275</span>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 items-start min-h-[110px]">
          <span className="text-sm text-gray-500">Prochaines absences</span>
          <span className="text-3xl font-bold">4</span>
        </div>
      </div>

      {/* NAVIGATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <Link
          href="/employees"
          tabIndex={0}
          className="group block p-7 bg-white rounded-2xl shadow hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
        >
          <div className="flex items-center gap-2 text-xl font-semibold mb-1">
            <User size={22} className="text-blue-500" /> Gestion des employés
            <ArrowRight size={20} className="ml-auto opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition" />
          </div>
          <div className="text-gray-600 text-sm mb-2">
            Ajouter, modifier ou consulter les fiches employé
          </div>
          <div className="h-1 rounded bg-blue-100 group-hover:bg-blue-200 w-16 transition-all" />
        </Link>
        <div className="block p-7 bg-gray-100 rounded-2xl border border-dashed border-gray-300 text-gray-400 opacity-70 cursor-not-allowed">
          <div className="flex items-center gap-2 text-xl font-semibold mb-1">
            <CalendarDays size={22} /> Planning
            <span className="ml-1 text-xs bg-gray-200 rounded-full px-2">à venir</span>
          </div>
          <div className="text-sm">
            Créer et gérer les plannings d’équipe
          </div>
        </div>
        <div className="block p-7 bg-gray-100 rounded-2xl border border-dashed border-gray-300 text-gray-400 opacity-70 cursor-not-allowed">
          <div className="flex items-center gap-2 text-xl font-semibold mb-1">
            <Clock size={22} /> Pointeuse
            <span className="ml-1 text-xs bg-gray-200 rounded-full px-2">à venir</span>
          </div>
          <div className="text-sm">
            Enregistrer les heures d’entrée et de sortie
          </div>
        </div>
        <div className="block p-7 bg-gray-100 rounded-2xl border border-dashed border-gray-300 text-gray-400 opacity-70 cursor-not-allowed">
          <div className="flex items-center gap-2 text-xl font-semibold mb-1">
            <BarChart2 size={22} /> Reporting
            <span className="ml-1 text-xs bg-gray-200 rounded-full px-2">à venir</span>
          </div>
          <div className="text-sm">
            Suivre l’activité et les variables de paie
          </div>
        </div>
      </div>

      {/* GRAPHIQUE PLACEHOLDER */}
      <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 min-h-[220px] flex flex-col items-center justify-center">
          <span className="text-gray-400">[Ici, un graphique “présences/absences”]</span>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 min-h-[220px] flex flex-col items-center justify-center">
          <span className="text-gray-400">[Ici, un graphique “répartition des rôles”]</span>
        </div>
      </div>
    </div>
  );
}
