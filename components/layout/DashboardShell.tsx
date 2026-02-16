'use client';

import { useSession } from 'next-auth/react';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { UserMenu } from './UserMenu';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import type { NavSection } from '@/lib/constants/navigation';

interface DashboardShellProps {
  children: React.ReactNode;
  navSections: NavSection[];
  title: string;
  isPremium?: boolean;
}

export function DashboardShell({
  children,
  navSections,
  title,
  isPremium = false,
}: DashboardShellProps) {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-background md:flex md:flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <h1 className="text-lg font-bold">{title}</h1>
        </div>
        <Sidebar navSections={navSections} isPremium={isPremium} />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 items-center justify-between border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <MobileSidebar
              navSections={navSections}
              isPremium={isPremium}
              title={title}
            />
            <Separator orientation="vertical" className="mr-2 h-4 md:hidden" />
            <span className="text-sm font-medium md:hidden">{title}</span>
          </div>
          <UserMenu />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
