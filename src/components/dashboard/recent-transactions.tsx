'use client';

import { Transaction } from '@/lib/definitions';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, List, Wallet, X } from 'lucide-react';
import Card3D from '../shared/card-3d';
import Link from 'next/link';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { useState } from 'react';

export default function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  const recent = transactions.slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  return (
    <Card3D>
      <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-bold">
            <List className="h-6 w-6 text-primary" />
            Recent Transactions
          </h3>
          <Button asChild variant="link" className="text-primary">
            <Link href="/transactions">View All</Link>
          </Button>
        </div>
        <Dialog>
          <div className="space-y-3">
            {recent.length > 0 ? (
              recent.map((t) => (
                <DialogTrigger asChild key={t.id} onClick={() => setSelectedTransaction(t)}>
                  <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4 transition hover:bg-secondary cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'rounded-full p-3',
                          t.amount > 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                        )}
                      >
                        {t.amount > 0 ? (
                          <ArrowUpRight className="h-5 w-5 text-green-400" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{t.description}</p>
                        <p className="text-sm text-muted-foreground">{t.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          'font-bold',
                          t.amount > 0 ? 'text-green-400' : 'text-red-400'
                        )}
                      >
                        {t.amount > 0 ? '+' : ''}
                        {formatCurrency(t.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(t.timestamp)}</p>
                    </div>
                  </div>
                </DialogTrigger>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Wallet className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p>No transactions yet. Start tracking!</p>
              </div>
            )}
          </div>
          {selectedTransaction && (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Transaction Details</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-semibold">{selectedTransaction.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className={cn('font-bold text-lg', selectedTransaction.amount > 0 ? 'text-green-400' : 'text-red-400')}>
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p>{selectedTransaction.category}</p>
                </div>
                {selectedTransaction.paymentMethod && (
                    <div>
                        <p className="text-sm text-muted-foreground">Payment Method</p>
                        <p>{selectedTransaction.paymentMethod}</p>
                    </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p>{formatDate(selectedTransaction.timestamp)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="text-xs text-muted-foreground">{selectedTransaction.id}</p>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </Card3D>
  );
}
