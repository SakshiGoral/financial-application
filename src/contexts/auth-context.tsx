'use client';

import { createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
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
  updateUser: (currentEmail: string, updates: Partial<User>) => void;
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
    const newUsers = { ...users, [email]: { name, email, password: pass, avatar: '' } };
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
  
  const updateUser = useCallback((currentEmail: string, updates: Partial<User>) => {
    setUsers(prevUsers => {
      const newUsers = { ...prevUsers };
      const userToUpdate = newUsers[currentEmail];

      if (userToUpdate) {
        // If email is being changed, we need to move the user record
        if (updates.email && updates.email !== currentEmail) {
          if (newUsers[updates.email]) {
            toast({ title: 'Error', description: 'This email is already taken.', variant: 'destructive'});
            return prevUsers; // Return original state if new email is taken
          }
          // Create new entry and delete old one
          newUsers[updates.email] = { ...userToUpdate, ...updates };
          delete newUsers[currentEmail];
          setCurrentUserEmail(updates.email); // Update current user session
        } else {
          // Just update the user in place
          newUsers[currentEmail] = { ...userToUpdate, ...updates };
        }
      }
      return newUsers;
    });
  }, [setUsers, setCurrentUserEmail, toast]);

  const value = { user, users, login, signup, logout, getPassword, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
