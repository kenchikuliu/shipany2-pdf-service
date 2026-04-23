import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';

export default async function NotFoundPage() {
  const t = await getTranslations('common.system');

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-normal">{t('page_not_found')}</h1>
      <Button asChild>
        <Link href="/" className="mt-4">
          <span aria-hidden="true">←</span>
          <span>{t('back_home')}</span>
        </Link>
      </Button>
    </div>
  );
}
