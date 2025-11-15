'use client';

import Card3D from '@/components/shared/card-3d';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card3D>
        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xl font-bold">
              <Settings className="h-6 w-6 text-primary" />
              Settings
            </h3>
          </div>
          <div className="py-12 text-center text-muted-foreground">
            <Settings className="mx-auto mb-4 h-16 w-16 opacity-50" />
            <p className="text-lg">Settings page is under construction.</p>
            <p className="text-sm mt-2">Future options for customizing your experience will be available here.</p>
          </div>
        </div>
      </Card3D>
    </div>
  );
}
