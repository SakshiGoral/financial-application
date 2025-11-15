'use client';

import { Transaction } from '@/lib/definitions';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, List, Wallet } from 'lucide-react';
import Card3D from '../shared/card-3d';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  const recent = transactions.slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

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
        <div className="space-y-3">
          {recent.length > 0 ? (
            recent.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl bg-secondary/50 p-4 transition hover:bg-secondary">
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
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <Wallet className="mx-auto mb-3 h-12 w-12 opacity-50" />
              <p>No transactions yet. Start tracking!</p>
            </div>
          )}
        </div>
      </div>
    </Card3D>
  );
}
