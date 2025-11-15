'use client';

import SpendingByCategory from '@/components/reports/spending-by-category';
import IncomeVsExpense from '@/components/reports/income-vs-expense';
import { BarChart, PieChart } from 'lucide-react';
import Card3D from '@/components/shared/card-3d';

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <Card3D>
        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl">
          <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
            <PieChart className="h-6 w-6 text-primary" />
            Spending by Category (This Month)
          </h3>
          <div className="h-80">
            <SpendingByCategory />
          </div>
        </div>
      </Card3D>
      <Card3D>
        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl">
          <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
            <BarChart className="h-6 w-6 text-accent" />
            Income vs. Expense (Last 6 Months)
          </h3>
          <div className="h-80">
            <IncomeVsExpense />
          </div>
        </div>
      </Card3D>
    </div>
  );
}
