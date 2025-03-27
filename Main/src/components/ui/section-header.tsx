
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
}

export function SectionHeader({ 
  title, 
  description, 
  className,
  actions
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between mb-6", className)}>
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="mt-4 md:mt-0 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
