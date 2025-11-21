'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/contexts/data-context';
import { Button } from '@/components/ui/button';
import { Loader2, Lightbulb, Sparkles } from 'lucide-react';
import Card3D from '../shared/card-3d';
import { ScrollArea } from '../ui/scroll-area';

export default function AutomatedInsights() {
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getAutomatedBudgetAdvice, transactions } = useData();

  const fetchAdvice = async () => {
    setIsLoading(true);
    setAdvice(null);
    const newAdvice = await getAutomatedBudgetAdvice();
    setAdvice(newAdvice);
    setIsLoading(false);
  };

  useEffect(() => {
    if (transactions.length > 0) {
      fetchAdvice();
    } else {
        setIsLoading(false);
        setAdvice("Not enough transaction data to generate insights. Add some transactions to get started!")
    }
  }, []); // Run once on mount

  return (
    <Card3D>
      <div className="flex h-full flex-col rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl">
        <h3 className="mb-4 flex items-center justify-between text-xl font-bold">
            <span className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                AI Insights
            </span>
            <Button variant="ghost" size="sm" onClick={fetchAdvice} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
            </Button>
        </h3>
        <ScrollArea className="flex-1">
          <div className="prose prose-sm dark:prose-invert">
            {isLoading && !advice ? (
              <div className="flex flex-col items-center justify-center space-y-2 py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Analyzing your spending...</p>
              </div>
            ) : advice ? (
              <p>{advice}</p>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 py-8 text-center">
                 <Lightbulb className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">Click Refresh to get personalized financial advice.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card3D>
  );
}
