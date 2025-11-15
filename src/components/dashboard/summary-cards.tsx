'use client';

import { Target, TrendingUp } from 'lucide-react';
import Card3D from '../shared/card-3d';

interface SummaryCardsProps {
  budgetsCount: number;
  goalsCount: number;
}

export default function SummaryCards({ budgetsCount, goalsCount }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card3D>
        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl transition hover:border-primary/50">
          <h3 className="mb-4 flex items-center gap-3 text-xl font-bold">
            <Target className="h-6 w-6 text-primary" />
            Active Budgets
          </h3>
          <p className="text-4xl font-bold text-primary">{budgetsCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">Monthly spending limits</p>
        </div>
      </Card3D>
      <Card3D>
        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl transition hover:border-green-500/50">
          <h3 className="mb-4 flex items-center gap-3 text-xl font-bold">
            <TrendingUp className="h-6 w-6 text-green-400" />
            Savings Goals
          </h3>
          <p className="text-4xl font-bold text-green-400">{goalsCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">Long-term financial objectives</p>
        </div>
      </Card3D>
    </div>
  );
}
