'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPointeuse = pathname?.startsWith('/pointeuse');

  return (
    <div className="flex">
      {!isPointeuse && <Sidebar />}
      <main className={`flex-1 transition-all min-h-screen ${!isPointeuse ? 'ml-20 md:ml-60' : ''}`}>
        {children}
      </main>
    </div>
  );
}
