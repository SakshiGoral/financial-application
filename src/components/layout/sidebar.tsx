'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, Target, TrendingUp, MessageCircle, LogOut, Menu, X, BarChart, Settings, UserCircle } from 'lucide-react';
import { TrendingUp as Logo } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '../ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';


const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/transactions', icon: Wallet, label: 'Transactions' },
  { href: '/budgets', icon: Target, label: 'Budgets' },
  { href: '/goals', icon: TrendingUp, label: 'Goals' },
  { href: '/assistant', icon: MessageCircle, label: 'AI Assistant' },
  { href: '/reports', icon: BarChart, label: 'Reports' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold">FinTrack Pro</h1>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-secondary',
              pathname === item.href && 'bg-secondary font-semibold text-primary'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t border-border p-4">
        <div className="mb-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">
                {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user?.email}</p>
            </div>
        </div>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                <AlertDialogDescription>You will be returned to the login page.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={logout}>Logout</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card md:block">
        {navContent}
      </aside>

      {/* Mobile Menu Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 flex-shrink-0 border-r border-border bg-card">
            {navContent}
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setIsMobileMenuOpen(false)}>
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 text-white"
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
