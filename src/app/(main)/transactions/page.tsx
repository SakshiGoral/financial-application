'use client';

import AddTransaction from '@/components/transactions/add-transaction';
import TransactionsList from '@/components/transactions/transactions-list';
import { useData } from '@/contexts/data-context';

export default function TransactionsPage() {
  const { transactions, addTransaction, deleteTransaction } = useData();

  return (
    <div className="space-y-6">
      <AddTransaction addTransaction={addTransaction} />
      <TransactionsList transactions={transactions} deleteTransaction={deleteTransaction} />
    </div>
  );
}
