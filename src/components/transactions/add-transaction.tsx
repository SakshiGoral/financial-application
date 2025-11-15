'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Loader2 } from 'lucide-react';
import Card3D from '../shared/card-3d';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CATEGORIES } from '@/lib/constants';
import { useData } from '@/contexts/data-context';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }),
  description: z.string().min(3, { message: 'Description must be at least 3 characters.' }),
  category: z.string().min(1, { message: 'Please select a category.' }),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export default function AddTransaction({ addTransaction }: { addTransaction: (data: any) => void }) {
  const [showForm, setShowForm] = useState(false);
  const { getCategorySuggestions } = useData();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount: undefined,
      description: '',
      category: '',
    },
  });

  const descriptionValue = form.watch('description');

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (descriptionValue && descriptionValue.length > 5) {
        const result = await getCategorySuggestions(descriptionValue);
        setSuggestions(result);
      } else {
        setSuggestions([]);
      }
    };

    const handler = setTimeout(() => {
        fetchSuggestions();
    }, 500);

    return () => {
        clearTimeout(handler);
    }
  }, [descriptionValue, getCategorySuggestions]);


  function onSubmit(data: TransactionFormValues) {
    const finalAmount = data.type === 'income' ? data.amount : -data.amount;
    addTransaction({ ...data, amount: finalAmount });
    form.reset();
    setShowForm(false);
    setSuggestions([]);
  }

  return (
    <Card3D>
      <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-bold">
            <Plus className="h-6 w-6 text-primary" />
            Add Transaction
          </h3>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Transaction'}
          </Button>
        </div>
        {showForm && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        onClick={() => field.onChange('income')}
                        className={cn('font-semibold', field.value === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-secondary hover:bg-secondary/80')}
                      >
                        Income
                      </Button>
                      <Button
                        type="button"
                        onClick={() => field.onChange('expense')}
                        className={cn('font-semibold', field.value === 'expense' ? 'bg-red-600 hover:bg-red-700' : 'bg-secondary hover:bg-secondary/80')}
                      >
                        Expense
                      </Button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50.00" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dinner with friends" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {suggestions.length > 0 && (
                <div>
                    <FormLabel className="text-sm">Suggestions</FormLabel>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {suggestions.map(s => (
                            <Button key={s} type="button" variant="outline" size="sm" onClick={() => form.setValue('category', s)}>
                                {s}
                            </Button>
                        ))}
                    </div>
                </div>
              )}

              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full font-bold">
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Transaction
              </Button>
            </form>
          </Form>
        )}
      </div>
    </Card3D>
  );
}
