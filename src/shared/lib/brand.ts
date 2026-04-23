import { envConfigs } from '@/config';
import { Brand } from '@/shared/types/blocks/common';

type Brandable = {
  brand?: Brand;
  copyright?: string;
};

function replaceBrandText(
  text: string | undefined,
  previousName: string | undefined,
  nextName: string
) {
  if (!text || !previousName || previousName === nextName) {
    return text;
  }

  return text.split(previousName).join(nextName);
}

export function resolveAppBrand(configs?: Record<string, string>) {
  return {
    appName: configs?.app_name || envConfigs.app_name,
    appLogo: configs?.app_logo || envConfigs.app_logo || '/logo.png',
    appDescription: configs?.app_description || envConfigs.app_description,
  };
}

export function applyBranding<T extends Brandable>(
  block: T,
  configs: Record<string, string>
): T {
  if (!block.brand) {
    return block;
  }

  const { appName, appLogo } = resolveAppBrand(configs);
  const previousName = block.brand.title;

  return {
    ...block,
    brand: {
      ...block.brand,
      title: appName,
      description: replaceBrandText(
        block.brand.description,
        previousName,
        appName
      ),
      logo: block.brand.logo
        ? {
            ...block.brand.logo,
            src: appLogo,
            alt: appName,
          }
        : block.brand.logo,
    },
    copyright: replaceBrandText(block.copyright, previousName, appName),
  };
}
