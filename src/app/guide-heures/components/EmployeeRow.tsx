import React from 'react';
import { parseHourMinute } from '../lib/timeHelpers';
import type { TimeEntry, Employee } from '@/lib/types';

type Props = {
  employee: Employee;
  timeEntries: TimeEntry[];
  onShiftClick: (shift: TimeEntry) => void;
};

export default function EmployeeRow({ employee, timeEntries, onShiftClick }: Props) {
  return (
    <>
      {/* Colonne nom, OCCUPE seulement la première colonne */}
      <div className="border border-gray-300 px-2 font-medium flex items-center bg-white">
        {employee.prenom} {employee.nom}
      </div>

      {/* Colonne shifts, OCCUPE les 24 colonnes restantes */}
      <div className="relative border border-gray-300 h-12 bg-white col-span-24">
        {timeEntries.map(entry => {
          const start = parseHourMinute(entry.heureEntree); // ex: 8.5
          const end = parseHourMinute(entry.heureSortie);   // ex: 17
          // left% et width% par rapport à 24h
          const leftPercent = (start / 24) * 100;
          const widthPercent = ((end - start) / 24) * 100;

          return (
            <div
              key={entry.id}
              onClick={() => onShiftClick(entry)}
              className="absolute top-1 h-10 bg-blue-600 rounded cursor-pointer text-white text-xs flex items-center justify-center select-none"
              style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
              title={`Entrée: ${entry.heureEntree} - Sortie: ${entry.heureSortie}`}
            >
              {employee.prenom}
            </div>
          );
        })}
      </div>
    </>
  );
}
