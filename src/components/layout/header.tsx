'use client';

import { usePathname } from 'next/navigation';

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
  '/budgets': 'Budgets',
  '/goals': 'Savings Goals',
  '/assistant': 'AI Assistant',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export default function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'FinTrack Pro';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm md:px-8 md:justify-end">
        <div className="md:hidden">
            <h1 className="text-xl font-bold">{title}</h1>
        </div>
    </header>
  );
}
