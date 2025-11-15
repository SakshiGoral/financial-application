'use client';

import { useData } from '@/contexts/data-context';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Wallet } from 'lucide-react';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.7rem] uppercase text-muted-foreground">
              Category
            </span>
            <span className="font-bold">{data.name}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[0.7rem] uppercase text-muted-foreground">
              Amount
            </span>
            <span className="font-bold text-right">{formatCurrency(data.value)}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default function SpendingByCategory() {
  const { transactions } = useData();

  const data = useMemo(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
    
    const spending = transactions
      .filter(t => t.amount < 0 && t.timestamp >= startOfMonth)
      .reduce((acc, t) => {
        const category = t.category;
        acc[category] = (acc[category] || 0) + Math.abs(t.amount);
        return acc;
      }, {} as { [key: string]: number });

    return Object.entries(spending)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Wallet className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No spending data for this month.</p>
            <p className="text-sm">Add some expense transactions to see your spending breakdown.</p>
        </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Tooltip content={<CustomTooltip />} />
        <Legend
            iconType="circle"
            layout="vertical"
            verticalAlign="middle"
            align="right"
            iconSize={10}
            formatter={(value) => <span className="text-foreground">{value}</span>}
        />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius="80%"
          fill="#8884d8"
          dataKey="value"
          stroke="hsl(var(--background))"
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
