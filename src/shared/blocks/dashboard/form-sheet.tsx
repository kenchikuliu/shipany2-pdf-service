'use client';

import { ReactNode } from 'react';

import { useRouter } from '@/core/i18n/navigation';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

export function FormSheet({
  open,
  closeUrl,
  title,
  description,
  widthClassName,
  children,
}: {
  open: boolean;
  closeUrl: string;
  title: string;
  description?: string;
  widthClassName?: string;
  children: ReactNode;
}) {
  const router = useRouter();

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => !nextOpen && router.push(closeUrl as any)}>
      <SheetContent
        side="right"
        className={widthClassName || 'w-full sm:max-w-xl'}
      >
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle>{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>
        <div className="flex-1 min-h-0 overflow-y-auto p-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
