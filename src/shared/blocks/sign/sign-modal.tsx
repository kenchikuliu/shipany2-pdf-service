'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { usePathname } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/components/ui/drawer';
import { useAppContext } from '@/shared/contexts/app';
import { useMediaQuery } from '@/shared/hooks/use-media-query';

import { SignInForm } from './sign-in-form';
import { SignUpForm } from './sign-up-form';

export function SignModal({ callbackUrl = '/' }: { callbackUrl?: string }) {
  const [mode, setMode] = useState('sign-in');  const t = useTranslations('common.sign');
  const { isShowSignModal, setIsShowSignModal } = useAppContext();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentUrl = useMemo(() => {
    const query = searchParams?.toString?.() ?? '';
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  const finalCallbackUrl = callbackUrl || currentUrl || '/';

  const handleOpenChange = (open: boolean) => {
    setIsShowSignModal(open);
    if (!open) {
      setMode('sign-in');
    }
  };

  const title =
    mode === 'sign-in' ? t('sign_in_title') : t('sign_up_title');
  const description =
    mode === 'sign-in' ? t('sign_in_description') : t('sign_up_description');

  const formContent =
    mode === 'sign-in' ? (
      <SignInForm
        callbackUrl={callbackUrl}
        onSwitchToSignUp={() => setMode('sign-up')}
      />
    ) : (
      <SignUpForm
        callbackUrl={callbackUrl}
        onSwitchToSignIn={() => setMode('sign-in')}
      />
    );

  if (isDesktop) {
    return (
      <Dialog open={isShowSignModal} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <SignInForm callbackUrl={finalCallbackUrl} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isShowSignModal} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <SignInForm callbackUrl={finalCallbackUrl} className="mt-8 px-4" />
        <DrawerFooter className="pt-4">
          <DrawerClose asChild>
            <Button variant="outline">{t('cancel_title')}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
