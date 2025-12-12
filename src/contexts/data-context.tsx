'use client';

import { createContext, useContext, useMemo, ReactNode, useState, useEffect, useCallback } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { Transaction, Budget, Goal } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { CATEGORIES } from '@/lib/constants';

interface FinancialInsights {
  weeklySpendingSummary: string;
  moneyLeaks: string;
  unusualSpending: string;
  predictedExpenses: string;
  moneyHealthScore: number;
}

interface DataContextType {
  // State
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  financialInsights: FinancialInsights | null;
  loadingInsights: boolean;
  
  // Stats
  stats: {
    balance: number;
    income: number;
    expense: number;
  };

  // Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  deleteBudget: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
  deleteGoal: (id: string) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  clearAllData: (dataType: 'transactions' | 'budgets' | 'goals') => void;
  suggestCategory: (description: string) => Promise<string | undefined>;
  loadingSuggestion: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgets', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const { toast } = useToast();

  const [financialInsights, setFinancialInsights] = useState<FinancialInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions
      .filter((t) => t.amount < 0)
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      income,
      expense,
      balance: income + expense,
    };
  }, [transactions]);
  
  const addTransaction = (tx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...tx,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setTransactions((prev) => [...prev, newTransaction]);
    toast({ title: "Transaction added successfully!" });
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast({ title: "Transaction deleted.", variant: 'destructive' });
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    if (budgets.some(b => b.category === budget.category)) {
      toast({ title: "Error", description: `A budget for ${budget.category} already exists.`, variant: 'destructive' });
      return;
    }
    const newBudget: Budget = { ...budget, id: crypto.randomUUID() };
    setBudgets((prev) => [...prev, newBudget]);
    toast({ title: "Budget created!" });
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    toast({ title: "Budget deleted.", variant: 'destructive' });
  };
  
  const addGoal = (goal: Omit<Goal, 'id' | 'currentAmount'>) => {
    const newGoal: Goal = { ...goal, id: crypto.randomUUID(), currentAmount: 0 };
    setGoals((prev) => [...prev, newGoal]);
    toast({ title: "New goal set!" });
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    toast({ title: "Goal deleted.", variant: 'destructive' });
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
    if(updates.currentAmount) toast({ title: "Goal progress updated!" });
  };

  const clearAllData = (dataType: 'transactions' | 'budgets' | 'goals') => {
    switch (dataType) {
      case 'transactions':
        setTransactions([]);
        break;
      case 'budgets':
        setBudgets([]);
        break;
      case 'goals':
        setGoals([]);
        break;
      default:
        break;
    }
  };

  const suggestCategory = async (description: string): Promise<string | undefined> => {
    // This functionality is temporarily disabled.
    return undefined;
  };
  
  const value = {
    transactions,
    budgets,
    goals,
    stats,
    financialInsights,
    loadingInsights,
    addTransaction,
    deleteTransaction,
    addBudget,
    deleteBudget,
    addGoal,
    deleteGoal,
    updateGoal,
    clearAllData,
    suggestCategory,
    loadingSuggestion,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
