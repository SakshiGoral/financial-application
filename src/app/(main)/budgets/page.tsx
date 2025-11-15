'use client';

import AddBudget from '@/components/budgets/add-budget';
import BudgetsGrid from '@/components/budgets/budgets-grid';
import { useData } from '@/contexts/data-context';

export default function BudgetsPage() {
  const { budgets, transactions, addBudget, deleteBudget } = useData();
  
  return (
    <div className="space-y-6">
      <AddBudget addBudget={addBudget} existingCategories={budgets.map(b => b.category)} />
      <BudgetsGrid budgets={budgets} transactions={transactions} deleteBudget={deleteBudget} />
    </div>
  );
}
