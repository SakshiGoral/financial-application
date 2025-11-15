'use client';

import { useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const Card3D = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  );
};

export default Card3D;
