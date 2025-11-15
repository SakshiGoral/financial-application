'use client';

import { useData } from '@/contexts/data-context';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { format, subMonths } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-bold mb-2">{label}</p>
        {payload.map((pld: any, index: number) => (
            <div key={index} style={{ color: pld.fill }}>
                {pld.name}: {formatCurrency(pld.value)}
            </div>
        ))}
      </div>
    );
  }

  return null;
};

export default function IncomeVsExpense() {
  const { transactions } = useData();
  const { theme } = useTheme();

  const data = useMemo(() => {
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};
    const sixMonthsAgo = subMonths(new Date(), 5);

    for (let i = 0; i < 6; i++) {
        const month = format(subMonths(new Date(), i), 'MMM yyyy');
        monthlyData[month] = { income: 0, expense: 0 };
    }
    
    transactions.forEach(t => {
      const transactionDate = new Date(t.timestamp);
      if (transactionDate >= sixMonthsAgo) {
          const month = format(transactionDate, 'MMM yyyy');
          if (t.amount > 0) {
            monthlyData[month].income += t.amount;
          } else {
            monthlyData[month].expense += Math.abs(t.amount);
          }
      }
    });

    return Object.entries(monthlyData)
      .map(([name, values]) => ({ name, ...values }))
      .reverse();

  }, [transactions]);
  
  if (transactions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <TrendingUp className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">Not enough transaction data.</p>
            <p className="text-sm">Add more transactions to see your income vs. expense trends.</p>
        </div>
    );
  }


  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${formatCurrency(value)}`} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === 'dark' ? 'hsl(var(--secondary))' : 'hsl(var(--muted))' }}/>
        <Legend iconType="circle" iconSize={10} formatter={(value) => <span className="text-foreground">{value}</span>} />
        <Bar dataKey="income" fill="hsl(var(--chart-2))" name="Income" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" fill="hsl(var(--chart-4))" name="Expense" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
