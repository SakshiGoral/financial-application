'use client';

import { useData } from '@/contexts/data-context';
import StatsCards from '@/components/dashboard/stats-cards';
import SummaryCards from '@/components/dashboard/summary-cards';
import RecentTransactions from '@/components/dashboard/recent-transactions';

export default function DashboardPage() {
  const { stats, transactions, budgets, goals } = useData();

  return (
    <div className="space-y-8">
      <StatsCards stats={stats} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-3">
            <SummaryCards budgetsCount={budgets.length} goalsCount={goals.length} />
            <RecentTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
