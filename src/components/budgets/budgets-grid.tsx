'use client';

import { Budget, Transaction } from '@/lib/definitions';
import { formatCurrency, cn } from '@/lib/utils';
import { Trash2, Target } from 'lucide-react';
import Card3D from '../shared/card-3d';
import { Button } from '@/components/ui/button';
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
import { Progress } from '../ui/progress';

interface BudgetsGridProps {
  budgets: Budget[];
  transactions: Transaction[];
  deleteBudget: (id: string) => void;
}

export default function BudgetsGrid({ budgets, transactions, deleteBudget }: BudgetsGridProps) {
  const getProgress = (budget: Budget) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
    
    const spent = Math.abs(
      transactions
        .filter(t => t.category === budget.category && t.amount < 0 && t.timestamp >= startOfMonth)
        .reduce((sum, t) => sum + t.amount, 0)
    );
    
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    return { spent, percentage };
  };

  if (budgets.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <Target className="mx-auto mb-4 h-16 w-16 opacity-50" />
        <p>No budgets set. Create one to control your spending!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map((b) => {
        const { spent, percentage } = getProgress(b);
        const overBudget = percentage > 100;
        const warning = percentage >= 80 && !overBudget;
        
        return (
          <Card3D key={b.id}>
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl transition hover:border-primary/50">
              <div className="mb-4 flex items-start justify-between">
                <h4 className="text-xl font-semibold">{b.category}</h4>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-red-400 hover:bg-red-500/20 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete budget for {b.category}?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteBudget(b.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spent:</span>
                  <span className="font-semibold">{formatCurrency(spent)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-semibold">{formatCurrency(b.amount)}</span>
                </div>
                <Progress value={Math.min(percentage, 100)} className={cn(overBudget && '[&>div]:bg-red-500', warning && '[&>div]:bg-yellow-500')} />
              </div>
              <div className="mt-3">
                <p className={cn(
                  'font-bold',
                  overBudget ? 'text-red-400' : warning ? 'text-yellow-400' : 'text-green-400'
                )}>
                  {percentage.toFixed(1)}% used {overBudget && ' (Over Budget!)'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(Math.max(0, b.amount - spent))} remaining
                </p>
              </div>
            </div>
          </Card3D>
        );
      })}
    </div>
  );
}
