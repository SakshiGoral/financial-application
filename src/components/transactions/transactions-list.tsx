'use client';

import { Transaction } from '@/lib/definitions';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, Trash2, List } from 'lucide-react';
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

interface TransactionsListProps {
  transactions: Transaction[];
  deleteTransaction: (id: string) => void;
}

export default function TransactionsList({ transactions, deleteTransaction }: TransactionsListProps) {
  const sortedTransactions = [...transactions].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Card3D>
      <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl">
        <h3 className="mb-6 text-xl font-bold">All Transactions ({transactions.length})</h3>
        <div className="space-y-3">
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl bg-secondary/50 p-4 transition hover:bg-secondary">
                <div className="flex flex-1 items-center gap-4 overflow-hidden">
                  <div className={cn('flex-shrink-0 rounded-full p-3', t.amount > 0 ? 'bg-green-500/10' : 'bg-red-500/10')}>
                    {t.amount > 0 ? <ArrowUpRight className="h-5 w-5 text-green-400" /> : <ArrowDownRight className="h-5 w-5 text-red-400" />}
                  </div>
                  <div className="truncate">
                    <p className="truncate font-semibold">{t.description}</p>
                    <p className="text-sm text-muted-foreground">{t.category} • {formatDate(t.timestamp)}</p>
                  </div>
                </div>
                <div className="ml-4 flex flex-shrink-0 items-center gap-4">
                  <p className={cn('font-bold', t.amount > 0 ? 'text-green-400' : 'text-red-400')}>
                    {t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:bg-red-500/20 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this transaction.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteTransaction(t.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <List className="mx-auto mb-4 h-16 w-16 opacity-50" />
              <p>No transactions recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </Card3D>
  );
}
