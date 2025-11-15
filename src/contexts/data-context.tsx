'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { Transaction, Budget, Goal, ChatMessage, User } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import {
  answerFinancialQuestions,
  provideAutomatedBudgetAdvice,
  suggestTransactionCategories,
} from '@/app/actions';

interface DataContextType {
  // State
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  chatHistory: ChatMessage[];
  
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
  
  // AI Actions
  askAiAssistant: (question: string) => Promise<void>;
  getBudgetAdvice: () => Promise<string | null>;
  getCategorySuggestions: (description: string) => Promise<string[]>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgets', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [chatHistory, setChatHistory] = useLocalStorage<ChatMessage[]>('chatHistory', []);
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
  
  const askAiAssistant = async (question: string) => {
    setChatHistory(prev => [...prev, { role: 'user', content: question }]);
    try {
      const { answer } = await answerFinancialQuestions({
        question,
        balance: stats.balance,
        income: stats.income,
        expenses: Math.abs(stats.expense),
        budgets: budgets.map(b => ({category: b.category, amount: b.amount})),
        goals: goals.map(g => ({name: g.name, targetAmount: g.targetAmount, currentAmount: g.currentAmount})),
      });
      setChatHistory(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (error) {
      console.error(error);
      const errorMessage = "Sorry, I couldn't process that request. Please try again.";
      setChatHistory(prev => [...prev, { role: 'assistant', content: errorMessage }]);
      toast({ title: "AI Error", description: "Could not get response from assistant.", variant: 'destructive' });
    }
  };

  const getBudgetAdvice = async (): Promise<string | null> => {
    try {
      const { advice } = await provideAutomatedBudgetAdvice({
        transactions: transactions.slice(-50).map(t => ({ category: t.category, amount: t.amount, description: t.description })),
        budgets: budgets.map(b => ({ category: b.category, amount: b.amount })),
        income: stats.income,
        balance: stats.balance,
      });
      return advice;
    } catch (error) {
      console.error(error);
      toast({ title: "AI Error", description: "Could not generate budget advice.", variant: 'destructive' });
      return null;
    }
  };

  const getCategorySuggestions = async (description: string): Promise<string[]> => {
    if (!description.trim() || description.trim().length < 5) return [];
    try {
      const { categories } = await suggestTransactionCategories({ description });
      return categories;
    } catch (error) {
      console.error(error);
      // Don't show a toast for this, as it's a background helper
      return [];
    }
  };


  const value = {
    transactions,
    budgets,
    goals,
    chatHistory,
    stats,
    addTransaction,
    deleteTransaction,
    addBudget,
    deleteBudget,
    addGoal,
    deleteGoal,
    updateGoal,
    askAiAssistant,
    getBudgetAdvice,
    getCategorySuggestions
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
