'use client';

import { Goal } from '@/lib/definitions';
import { formatCurrency, cn } from '@/lib/utils';
import { Trash2, TrendingUp } from 'lucide-react';
import Card3D from '../shared/card-3d';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface GoalsGridProps {
  goals: Goal[];
  deleteGoal: (id: string) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
}

export default function GoalsGrid({ goals, deleteGoal, updateGoal }: GoalsGridProps) {

  const handleAddSavings = (e: React.KeyboardEvent<HTMLInputElement>, goal: Goal) => {
    if (e.key === 'Enter') {
      const inputElement = e.target as HTMLInputElement;
      const amountToAdd = parseFloat(inputElement.value);
      if (!isNaN(amountToAdd) && amountToAdd > 0) {
        updateGoal(goal.id, { currentAmount: goal.currentAmount + amountToAdd });
        inputElement.value = '';
      }
    }
  };

  if (goals.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <TrendingUp className="mx-auto mb-4 h-16 w-16 opacity-50" />
        <p>No goals set. Start planning your future!</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((g) => {
        const percentage = g.targetAmount > 0 ? Math.min((g.currentAmount / g.targetAmount) * 100, 100) : 0;
        const daysLeft = Math.ceil((new Date(g.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        const isComplete = g.currentAmount >= g.targetAmount;

        return (
          <Card3D key={g.id}>
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl transition hover:border-green-500/50">
              <div className="mb-4 flex items-start justify-between">
                <h4 className="text-xl font-semibold">{g.name}</h4>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-red-400 hover:bg-red-500/20 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Delete goal: {g.name}?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteGoal(g.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Saved:</span><span className="font-semibold">{formatCurrency(g.currentAmount)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Target:</span><span className="font-semibold">{formatCurrency(g.targetAmount)}</span></div>
                <Progress value={percentage} className="[&>div]:bg-green-500" />
              </div>
              <div className="mt-3">
                <p className="font-bold text-green-400">{isComplete ? 'Goal Achieved!' : `${percentage.toFixed(1)}% complete`}</p>
                <p className="text-xs text-muted-foreground">{isComplete ? 'Great job!' : daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}</p>
              </div>
              {!isComplete && (
                <div className="mt-4 border-t border-border pt-4">
                  <Input type="number" step="0.01" placeholder="Add to savings..." onKeyDown={(e) => handleAddSavings(e, g)} className="text-sm" />
                </div>
              )}
            </div>
          </Card3D>
        );
      })}
    </div>
  );
}
