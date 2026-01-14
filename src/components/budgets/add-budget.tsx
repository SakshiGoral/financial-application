'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Target, Loader2 } from 'lucide-react';
import Card3D from '../shared/card-3d';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CATEGORIES } from '@/lib/constants';

const budgetSchema = z.object({
  amount: z.coerce.number().positive({ message: 'Budget must be a positive number.' }),
  category: z.string().min(1, { message: 'Please select a category.' }),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface AddBudgetProps {
    addBudget: (data: BudgetFormValues) => void;
    existingCategories: string[];
}

export default function AddBudget({ addBudget, existingCategories }: AddBudgetProps) {
  const [showForm, setShowForm] = useState(false);
  const availableCategories = CATEGORIES.filter(c => !existingCategories.includes(c));

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      amount: '' as any,
      category: '',
    },
  });

  function onSubmit(data: BudgetFormValues) {
    addBudget(data);
    form.reset();
    setShowForm(false);
  }

  return (
    <Card3D>
      <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-bold">
            <Target className="h-6 w-6 text-primary" />
            Monthly Budgets
          </h3>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Budget'}
          </Button>
        </div>
        {showForm && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category to budget" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableCategories.length > 0 ? (
                        availableCategories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))
                      ) : (
                        <div className="p-4 text-sm text-muted-foreground">All categories have budgets.</div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Limit</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 500.00" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full font-bold">
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Budget
              </Button>
            </form>
          </Form>
        )}
      </div>
    </Card3D>
  );
}
