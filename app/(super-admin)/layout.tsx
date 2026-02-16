'use client';

import { DashboardShell } from '@/components/layout';
import { SUPER_ADMIN_NAV } from '@/lib/constants/navigation';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      navSections={SUPER_ADMIN_NAV}
      title="barObar Admin"
      isPremium
    >
      {children}
    </DashboardShell>
  );
}
