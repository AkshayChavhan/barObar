'use client';

import { DashboardShell } from '@/components/layout';
import { HOTEL_NAV } from '@/lib/constants/navigation';
import { useSubscription } from '@/lib/hooks/useSubscription';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isPremium } = useSubscription();

  return (
    <DashboardShell
      navSections={HOTEL_NAV}
      title="barObar"
      isPremium={isPremium}
    >
      {children}
    </DashboardShell>
  );
}
