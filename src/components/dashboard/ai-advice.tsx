'use client';

import { useState } from 'react';
import { useData } from '@/contexts/data-context';
import { Button } from '../ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import Card3D from '../shared/card-3d';

export default function AIAdvice() {
  const { getBudgetAdvice } = useData();
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    setLoading(true);
    setAdvice('');
    const newAdvice = await getBudgetAdvice();
    if (newAdvice) {
      setAdvice(newAdvice);
    }
    setLoading(false);
  };

  return (
    <Card3D>
      <div className="h-full rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <Sparkles className="h-6 w-6 text-accent" />
          Automated Insights
        </h3>
        <p className="mb-6 text-muted-foreground">
          Get personalized advice from our AI on how to improve your budget and spending habits.
        </p>
        
        <Button onClick={handleGetAdvice} disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Advice
        </Button>

        {loading && (
           <div className="mt-6 space-y-2">
             <div className="h-4 w-full animate-pulse rounded bg-secondary"></div>
             <div className="h-4 w-5/6 animate-pulse rounded bg-secondary"></div>
             <div className="h-4 w-3/4 animate-pulse rounded bg-secondary"></div>
           </div>
        )}

        {advice && (
          <div className="mt-6 rounded-lg border border-border bg-secondary/30 p-4">
            <p className="text-sm leading-relaxed text-foreground">{advice}</p>
          </div>
        )}
      </div>
    </Card3D>
  );
}
