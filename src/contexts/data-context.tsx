'use client';

import { createContext, useContext, useMemo, ReactNode, useCallback } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { Transaction, Budget, Goal } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import {
  suggestTransactionCategories,
  provideAutomatedBudgetAdvice,
  answerFinancialQuestions,
} from '@/app/actions';

interface DataContextType {
  // State
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  
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
  
  // AI Actions
  getCategorySuggestions: (description: string) => Promise<string[]>;
  getAutomatedBudgetAdvice: () => Promise<string>;
  askFinancialQuestion: (question: string) => Promise<string>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgets', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const { toast } = useToast();

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

  const getCategorySuggestions = useCallback(async (description: string): Promise<string[]> => {
    if (!description.trim() || description.trim().length < 5) return [];
    try {
      const { categories } = await suggestTransactionCategories({ description });
      return categories;
    } catch (error) {
      console.error(error);
      return [];
    }
  }, []);

  const getAutomatedBudgetAdvice = useCallback(async (): Promise<string> => {
    try {
        const recentTransactions = transactions.slice(-20);
        const { advice } = await provideAutomatedBudgetAdvice({ transactions: recentTransactions, budgets });
        return advice;
    } catch (error) {
        console.error("Failed to get budget advice:", error);
        return "I'm sorry, I couldn't generate any advice at the moment. Please try again later.";
    }
  }, [transactions, budgets]);

  const askFinancialQuestion = useCallback(async (question: string): Promise<string> => {
    try {
        const { answer } = await answerFinancialQuestions({ question, transactions, budgets, goals });
        return answer;
    } catch (error) {
        console.error("Failed to get answer for financial question:", error);
        return "I'm sorry, I couldn't process your question at the moment. Please try again later.";
    }
  }, [transactions, budgets, goals]);
  
  const value = {
    transactions,
    budgets,
    goals,
    stats,
    addTransaction,
    deleteTransaction,
    addBudget,
    deleteBudget,
    addGoal,
    deleteGoal,
    updateGoal,
    clearAllData,
    getCategorySuggestions,
    getAutomatedBudgetAdvice,
    askFinancialQuestion,
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
