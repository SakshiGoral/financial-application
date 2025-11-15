'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { User } from '@/lib/definitions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  users: Record<string, User>;
  login: (email: string, pass: string) => boolean;
  signup: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  getPassword: (email: string) => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useLocalStorage<Record<string, User>>('users', {});
  const [currentUserEmail, setCurrentUserEmail] = useLocalStorage<string | null>('currentUser', null);
  const router = useRouter();
  const { toast } = useToast();

  const user = useMemo(() => {
    if (currentUserEmail && users[currentUserEmail]) {
      const { password, ...userWithoutPassword } = users[currentUserEmail];
      return userWithoutPassword;
    }
    return null;
  }, [currentUserEmail, users]);

  const login = (email: string, pass: string): boolean => {
    const u = users[email];
    if (u && u.password === pass) {
      setCurrentUserEmail(email);
      toast({ title: `Welcome back, ${u.name}!` });
      router.push('/dashboard');
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, pass: string): boolean => {
    if (users[email]) {
      return false;
    }
    const newUsers = { ...users, [email]: { name, email, password: pass } };
    setUsers(newUsers);
    setCurrentUserEmail(email);
    toast({ title: "Account created successfully!" });
    router.push('/dashboard');
    return true;
  };

  const getPassword = (email: string): string | null => {
    const u = users[email];
    return u ? u.password || null : null;
  }

  const logout = () => {
    setCurrentUserEmail(null);
    router.push('/login');
    toast({ title: "You have been logged out." });
  };

  const value = { user, users, login, signup, logout, getPassword };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
