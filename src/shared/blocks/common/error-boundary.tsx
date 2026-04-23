'use client';

import { Component, ErrorInfo, ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Link } from '@/core/i18n/navigation';
import { resolveAppBrand } from '@/shared/lib/brand';
import { Button } from '@/shared/components/ui/button';
import { useAppContext } from '@/shared/contexts/app';

import { SmartIcon } from './smart-icon';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

function ErrorFallback() {
  const t = useTranslations('common.system');
  const { configs } = useAppContext();
  const [brand, setBrand] = useState(() => {
    const { appLogo, appName } = resolveAppBrand(configs);
    return {
      app_logo: appLogo,
      app_name: appName,
    };
  });

  useEffect(() => {
    if (configs.app_logo || configs.app_name) {
      const { appLogo, appName } = resolveAppBrand(configs);
      setBrand({
        app_logo: appLogo,
        app_name: appName,
      });
      return;
    }

    let cancelled = false;

    fetch('/api/config/get-configs', {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((res) => {
        if (cancelled || res?.code !== 0 || !res?.data) {
          return;
        }

        const { appLogo, appName } = resolveAppBrand(res.data);
        setBrand({
          app_logo: appLogo,
          app_name: appName,
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [configs.app_logo, configs.app_name]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Image
        src={brand.app_logo}
        alt={brand.app_name}
        width={80}
        height={80}
      />
      <h1 className="text-2xl font-normal">{t('something_went_wrong')}</h1>
      <p className="text-muted-foreground">
        {t('something_went_wrong_description')}
      </p>
      <Button asChild>
        <Link href="/" className="mt-4">
          <SmartIcon name="ArrowLeft" />
          <span>{t('back_home')}</span>
        </Link>
      </Button>
    </div>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: any): State {
    // Ignore NEXT_NOT_FOUND error to let Next.js handle 404
    if (error.digest === 'NEXT_NOT_FOUND') {
      return { hasError: false };
    }
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
