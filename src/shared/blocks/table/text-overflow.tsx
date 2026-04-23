'use client';

import * as React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';

export function TextOverflow({
  value,
  className,
  maxWidth = 200,
}: {
  value: string;
  className?: string;
  metadata?: any;
  maxWidth?: number;
}) {
  if (!value) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn('truncate cursor-help', className)}
          style={{ maxWidth: maxWidth ? `${maxWidth}px` : '200px' }}
        >
          {value}
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-md break-words">
        {value}
      </TooltipContent>
    </Tooltip>
  );
}
