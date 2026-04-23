'use client';

import { usePathname as useNextPathname, useSearchParams } from 'next/navigation';
import {
  BookOpenCheck,
  Bot,
  ChartSpline,
  Chrome,
  Cog,
  Earth,
  ExternalLink,
  FerrisWheel,
  Film,
  Gamepad2,
  Github,
  Globe,
  GraduationCap,
  Handshake,
  Headphones,
  HeartPulse,
  House,
  Image as ImageIcon,
  LaptopMinimalCheck,
  LayoutPanelTop,
  Megaphone,
  Paintbrush,
  PencilLine,
  Plus,
  RadioTower,
  Search,
  Sparkles,
  SquareDashedBottomCode,
  Store,
  Tag,
  Target,
  Workflow,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/core/i18n/navigation';
import { LocaleSelector } from '@/shared/blocks/common';
import { ThemeToggler } from '@/shared/blocks/common/theme-toggler';
import { SignUser } from '@/shared/blocks/sign/sign-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/components/ui/sidebar';
import { getNavCategoryLabel } from '@/shared/lib/nav-category-i18n';
import { cn } from '@/shared/lib/utils';
import { NavCategory } from '@/shared/models/nav_category';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  tag: Tag,
  house: House,
  globe: Globe,
  external: ExternalLink,
  sparkles: Sparkles,
  image: ImageIcon,
  film: Film,
  bot: Bot,
  'pencil-line': PencilLine,
  headphones: Headphones,
  'layout-panel-top': LayoutPanelTop,
  paintbrush: Paintbrush,
  'book-open-check': BookOpenCheck,
  cog: Cog,
  handshake: Handshake,
  'graduation-cap': GraduationCap,
  workflow: Workflow,
  'heart-pulse': HeartPulse,
  target: Target,
  earth: Earth,
  gamepad2: Gamepad2,
  chrome: Chrome,
  'radio-tower': RadioTower,
  'ferris-wheel': FerrisWheel,
  megaphone: Megaphone,
  'laptop-minimal-check': LaptopMinimalCheck,
  store: Store,
  'square-dashed-bottom-code': SquareDashedBottomCode,
  'chart-spline': ChartSpline,
};

interface NavCategoriesSidebarProps {
  categories: NavCategory[];
  locale: string;
  app_logo?: string;
  app_name?: string;
}

const BrandLogo = ({
  className,
  logo,
  name,
}: {
  className?: string;
  logo?: string;
  name?: string;
}) => (
  <div
    className={cn(
      'relative flex items-center justify-center rounded-xl',
      logo
        ? 'bg-transparent shadow-none'
        : 'bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 shadow-lg shadow-indigo-500/20',
      className
    )}
  >
    {logo ? (
      <img
        src={logo}
        alt={name || ''}
        className="h-full w-full rounded-xl object-contain"
      />
    ) : (
      <>
        <Sparkles className="h-4 w-4 fill-current text-white" />
        <div className="absolute -top-0.5 -right-0.5 h-2 w-2 animate-pulse rounded-full border-2 border-white bg-rose-500 dark:border-zinc-950" />
      </>
    )}
  </div>
);

export function NavCategoriesSidebar({
  categories,
  locale,
  app_logo,
  app_name,
}: NavCategoriesSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar();
  const pathname = useNextPathname();
  const searchParams = useSearchParams();
  const t = useTranslations('directory.layout.sidebar');
  const tCategory = useTranslations('directory.categories');
  const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/';
  const rawPath = normalizePath(pathname);
  // strip locale prefix so "/en/search" → "/search"
  const currentPath = rawPath.replace(new RegExp(`^\/${locale}`), '') || '/';

  const activeCategoryFromSearch = searchParams.get('category');
  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const buildHref = (path: string) => `${path ? `/${path}` : '/'}`;
  const quickLinks = [
    {
      key: 'search',
      title: t('quick_links.search'),
      href: buildHref('search'),
      icon: Search,
    },
    {
      key: 'explore',
      title: t('quick_links.explore'),
      href: buildHref('explore'),
      icon: Sparkles,
    },
    {
      key: 'submit',
      title: t('quick_links.submit'),
      href: buildHref('submit'),
      icon: Plus,
    },
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="flex h-16 shrink-0 flex-col justify-center border-b px-3.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              tooltip={t('special_links.all')}
              className="group/logo px-0 hover:bg-transparent"
            >
              <Link
                href={buildHref('')}
                title={t('special_links.all')}
                className="flex w-full items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                onClick={closeMobileSidebar}
              >
                <BrandLogo
                  logo={app_logo}
                  name={app_name}
                  className="h-10 w-10 shrink-0 shadow-indigo-500/30 transition-all duration-300 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
                />
                <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
                  <span className="flex items-center text-xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
                    {app_name || ''}
                  </span>
                  {/* <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1 pl-0.5 text-indigo-600/60 dark:text-indigo-400/60">{t('special_links.all')}</span> */}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="border-b px-2 py-3 md:hidden">
          <SidebarGroupContent>
            <SidebarMenu>
              {quickLinks.map((item) => {
                const isActive = currentPath === normalizePath(item.href);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        'h-12 text-base font-medium',
                        isActive &&
                          'bg-primary/12 text-primary dark:bg-primary/18 dark:text-primary-foreground'
                      )}
                    >
                      <Link
                        href={item.href}
                        title={item.title}
                        onClick={closeMobileSidebar}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="pt-0">
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            {t('categories_title')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => {
                const href = buildHref(`categories/${category.slug}`);
                const targetPath = normalizePath(href);
                const categoryLabel = getNavCategoryLabel(tCategory, category);
                const isActive =
                  currentPath === targetPath ||
                  currentPath.startsWith(`${targetPath}/`) ||
                  activeCategoryFromSearch === category.slug;

                const IconComp = category.icon
                  ? ICON_MAP[category.icon.toLowerCase()] || Globe
                  : Globe;
                return (
                  <SidebarMenuItem key={category.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={categoryLabel}
                      className={cn(
                        'transition-all duration-200 hover:bg-primary/6 hover:text-foreground',
                        isActive &&
                          'bg-primary/12 text-primary ring-primary/20 hover:bg-primary/14 dark:bg-primary/18 dark:text-primary-foreground dark:ring-primary/30 font-semibold shadow-sm ring-1'
                      )}
                    >
                      <Link
                        href={href}
                        title={categoryLabel}
                        onClick={closeMobileSidebar}
                      >
                        <IconComp className="h-4 w-4" />
                        <span>{categoryLabel}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t px-3 py-4 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ThemeToggler type="icon" />
            <LocaleSelector type="icon" />
          </div>
          <SignUser
            signButtonSize="lg"
            onNavigate={closeMobileSidebar}
            userNav={{
              show_name: true,
              show_sign_out: true,
              items: [],
            }}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
