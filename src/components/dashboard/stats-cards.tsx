'use client';

import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card3D from '../shared/card-3d';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  stats: {
    balance: number;
    income: number;
    expense: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cardData = [
    { title: 'Balance', value: stats.balance, icon: Wallet, color: stats.balance >= 0 ? 'green' : 'red' },
    { title: 'Income', value: stats.income, icon: ArrowUpRight, color: 'green' },
    { title: 'Expenses', value: Math.abs(stats.expense), icon: ArrowDownRight, color: 'red' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {cardData.map(({ title, value, icon: Icon, color }) => (
        <Card3D key={title}>
          <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl transition hover:border-primary/50">
            <p className="mb-2 font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center justify-between">
              <p className={cn(
                'text-4xl font-extrabold',
                color === 'green' ? 'text-green-400' : 'text-red-400'
              )}>
                {formatCurrency(value)}
              </p>
              <div className={cn(
                'rounded-full p-3',
                color === 'green' ? 'bg-green-500/10' : 'bg-red-500/10'
              )}>
                <Icon className={cn('h-7 w-7', color === 'green' ? 'text-green-400' : 'text-red-400')} />
              </div>
            </div>
          </div>
        </Card3D>
      ))}
    </div>
  );
}
