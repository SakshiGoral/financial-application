'use client';

import { useData } from '@/contexts/data-context';
import StatsCards from '@/components/dashboard/stats-cards';
import SummaryCards from '@/components/dashboard/summary-cards';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import AIAdvice from '@/components/dashboard/ai-advice';

export default function DashboardPage() {
  const { stats, transactions, budgets, goals } = useData();

  return (
    <div className="space-y-8">
      <StatsCards stats={stats} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
            <SummaryCards budgetsCount={budgets.length} goalsCount={goals.length} />
            <RecentTransactions transactions={transactions} />
        </div>
        <div className="lg:col-span-1">
            <AIAdvice />
        </div>
      </div>
    </div>
  );
}
