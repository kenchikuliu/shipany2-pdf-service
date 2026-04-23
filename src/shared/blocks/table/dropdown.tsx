'use client';

import { useState, useTransition } from 'react';

import { Loader2, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

import { Link, useRouter } from '@/core/i18n/navigation';
import { SmartIcon } from '@/shared/blocks/common/smart-icon';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { NavItem } from '@/shared/types/blocks/common';

export function Dropdown({
  value,
  placeholder,
  metadata,
  className,
}: {
  value: NavItem[];
  placeholder?: string;
  metadata: Record<string, any>;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmItem, setConfirmItem] = useState<NavItem | null>(null);
  const isDestructiveAction =
    confirmItem?.action === 'delete' ||
    confirmItem?.action === 'reject' ||
    confirmItem?.actionMethod === 'DELETE';

  if (!value || value.length === 0) {
    return null;
  }

  const handleAction = (item: NavItem) => {
    if (!item.actionUrl) return;

    startTransition(async () => {
      try {
        const response = await fetch(item.actionUrl!, {
          method: item.actionMethod || 'POST',
        });
        const result = await response.json();

        if (!response.ok || result?.status !== 'success') {
          throw new Error(result?.message || 'request failed');
        }

        toast.success(result?.message || item.title || 'success');
        setConfirmItem(null);
        router.refresh();
      } catch (error: any) {
        toast.error(error?.message || 'request failed');
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {value?.map((item) => {
            if (item.actionUrl) {
              return (
                <DropdownMenuItem
                  key={item.title}
                  onClick={() => setConfirmItem(item)}
                  className="cursor-pointer"
                >
                  {item.icon && (
                    <SmartIcon name={item.icon as string} className="h-4 w-4" />
                  )}
                  {item.title}
                </DropdownMenuItem>
              );
            }

            return (
              <DropdownMenuItem key={item.title}>
                <Link
                  href={item.url || ''}
                  target={item.target || '_self'}
                  className="flex w-full items-center gap-2"
                >
                  {item.icon && (
                    <SmartIcon name={item.icon as string} className="h-4 w-4" />
                  )}
                  {item.title}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={!!confirmItem} onOpenChange={(open) => !open && !pending && setConfirmItem(null)}>
        <DialogContent
          className="sm:max-w-md"
          onEscapeKeyDown={(event) => pending && event.preventDefault()}
          onPointerDownOutside={(event) => pending && event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {confirmItem?.confirmTitle || confirmItem?.title || 'Confirm'}
            </DialogTitle>
            {confirmItem?.confirmMessage ? (
              <DialogDescription>{confirmItem.confirmMessage}</DialogDescription>
            ) : null}
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmItem(null)}
              disabled={pending}
            >
              {confirmItem?.cancelTitle || 'Cancel'}
            </Button>
            <Button
              variant={isDestructiveAction ? 'destructive' : 'default'}
              onClick={() => confirmItem && handleAction(confirmItem)}
              disabled={pending}
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {confirmItem?.title || 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
