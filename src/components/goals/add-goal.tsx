'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TrendingUp, Loader2 } from 'lucide-react';
import Card3D from '../shared/card-3d';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const goalSchema = z.object({
  name: z.string().min(3, { message: 'Goal name must be at least 3 characters.' }),
  targetAmount: z.coerce.number().positive({ message: 'Target amount must be positive.' }),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date.' }),
});

type GoalFormValues = z.infer<typeof goalSchema>;

export default function AddGoal({ addGoal }: { addGoal: (data: GoalFormValues) => void }) {
  const [showForm, setShowForm] = useState(false);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: '',
      targetAmount: undefined,
      deadline: '',
    },
  });

  function onSubmit(data: GoalFormValues) {
    addGoal(data);
    form.reset();
    setShowForm(false);
  }

  return (
    <Card3D>
      <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-bold">
            <TrendingUp className="h-6 w-6 text-green-400" />
            Savings Goals
          </h3>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Goal'}
          </Button>
        </div>
        {showForm && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Goal Name</FormLabel><FormControl><Input placeholder="e.g., New Laptop" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="targetAmount" render={({ field }) => (
                <FormItem><FormLabel>Target Amount</FormLabel><FormControl><Input type="number" placeholder="e.g., 1500.00" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="deadline" render={({ field }) => (
                <FormItem><FormLabel>Deadline</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full font-bold">
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Goal
              </Button>
            </form>
          </Form>
        )}
      </div>
    </Card3D>
  );
}
