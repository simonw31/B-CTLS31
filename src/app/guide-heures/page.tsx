'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Timeline from './components/Timeline';
import EmployeeRow from './components/EmployeeRow';
import ShiftModal from './components/ShiftModal';
import { Employee, TimeEntry } from '@/lib/types';

export default function GuideHeuresPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'payPeriod'>('day');
  const [selectedShift, setSelectedShift] = useState<TimeEntry | null>(null);

  // Format YYYY-MM-DD
  const formatISODate = (date: Date) => date.toISOString().slice(0, 10);

  async function refetchEntries() {
    const dateStr = formatISODate(currentDate);
    const resTime = await fetch(`/api/timeEntry/day?date=${dateStr}`);
    setTimeEntries(await resTime.json());
  }

  useEffect(() => {
    async function fetchData() {
      const dateStr = formatISODate(currentDate);

      const resEmp = await fetch('/api/employees/active');
      const empData = await resEmp.json();
      setEmployees(empData);

      const resTime = await fetch(`/api/timeEntry/day?date=${dateStr}`);
      const timeData = await resTime.json();
      setTimeEntries(timeData);
    }
    fetchData();
  }, [currentDate]);

  const changeDate = (delta: number) => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() + delta);
    else if (view === 'week') newDate.setDate(newDate.getDate() + 7 * delta);
    else newDate.setDate(newDate.getDate() + 15 * delta);
    setCurrentDate(newDate);
  };

  const onShiftClick = (shift: TimeEntry) => setSelectedShift(shift);
  const closeModal = () => setSelectedShift(null);

  return (
    <div className="p-6 min-h-screen bg-gray-50 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Guide des heures</h1>
        <div className="flex gap-2 items-center">
          <Button onClick={() => setView('day')} variant={view === 'day' ? 'default' : 'outline'}>
            Vue jour
          </Button>
          <Button onClick={() => setView('week')} variant={view === 'week' ? 'default' : 'outline'}>
            Vue semaine
          </Button>
          <Button onClick={() => setView('payPeriod')} variant={view === 'payPeriod' ? 'default' : 'outline'}>
            Période de paie
          </Button>

          <Button onClick={() => changeDate(-1)} variant="outline" size="sm">
            <ChevronLeft size={18} />
          </Button>
          <div className="font-semibold">{currentDate.toLocaleDateString('fr-FR')}</div>
          <Button onClick={() => changeDate(1)} variant="outline" size="sm">
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <Timeline />

      {/* Employés + shifts */}
      <div className="overflow-x-hidden">
        <div className="grid grid-cols-[200px_repeat(24,1fr)] gap-0 border border-gray-300 rounded-b-lg">
        {employees
            .filter(emp => timeEntries.some(te => te.employeeId === emp.id))
            .map(emp => {
            const entries = timeEntries.filter(te => te.employeeId === emp.id);
            return (
                <EmployeeRow
                key={emp.id}
                employee={emp}
                timeEntries={entries}
                onShiftClick={onShiftClick}
                />
            );
            })}
        </div>
      </div>

      {/* Modal */}
      <ShiftModal shift={selectedShift} onClose={closeModal} onDeleteSuccess={refetchEntries} />
    </div>
  );
}
