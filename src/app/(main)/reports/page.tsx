'use client';

import Card3D from '@/components/shared/card-3d';
import { BarChart } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
       <Card3D>
        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xl font-bold">
              <BarChart className="h-6 w-6 text-primary" />
              Reports
            </h3>
          </div>
          <div className="py-12 text-center text-muted-foreground">
            <BarChart className="mx-auto mb-4 h-16 w-16 opacity-50" />
            <p className="text-lg">Reporting features are coming soon!</p>
            <p className="text-sm mt-2">Check back later for detailed financial insights and downloadable reports.</p>
          </div>
        </div>
      </Card3D>
    </div>
  );
}
