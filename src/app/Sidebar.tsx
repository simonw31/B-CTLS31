'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  User,
  Calendar,
  Clock,
  BarChart3,
  Home,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    {
      label: 'Accueil',
      href: '/',
      icon: <Home size={22} />,
    },
    {
      label: 'Employés',
      href: '/employees',
      icon: <User size={22} />,
    },
    {
      label: 'Planning à venir',
      href: '/planning',
      icon: <Calendar size={22} />,
      disabled: true,
    },
    {
      label: 'Pointeuse',
      href: '/pointeuse',
      icon: <Clock size={22} />,
      // disabled: true,
    },
    {
      label: 'Reporting à venir',
      href: '/reporting',
      icon: <BarChart3 size={22} />,
      disabled: true,
    },
  ];

  return (
    <aside
      className={`h-screen fixed top-0 left-0 flex flex-col transition-all z-20 bg-white shadow-md 
        ${collapsed ? 'w-20' : 'w-60'} border-r`}
      tabIndex={0}
      aria-label="Sidebar navigation"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <span className="flex items-center gap-2 font-bold text-xl">
          <User size={24} />
          {!collapsed && 'B&C RH'}
        </span>
        <button
          className="ml-auto p-2 rounded hover:bg-gray-100 transition"
          aria-label={collapsed ? "Déplier la sidebar" : "Replier la sidebar"}
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 py-6 flex flex-col gap-1">
        {menu.map((item) => (
          <Link
            href={item.disabled ? "#" : item.href}
            key={item.label}
            tabIndex={item.disabled ? -1 : 0}
            aria-disabled={item.disabled}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-base font-medium
              hover:bg-blue-100 transition focus:outline-none focus:bg-blue-200
              ${collapsed ? 'justify-center px-0' : ''}
              ${item.disabled ? 'opacity-40 pointer-events-none' : ''}
            `}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* LOGOUT */}
      <div className="mt-auto p-4">
        <button
          className="flex items-center gap-3 w-full px-2 py-2 text-red-600 font-medium rounded-xl hover:bg-red-50 transition
            focus:outline-none focus:bg-red-100 justify-center"
          tabIndex={0}
          aria-label="Déconnexion"
          onClick={() => alert('Déconnexion à implémenter')}
        >
          <LogOut size={22} />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
