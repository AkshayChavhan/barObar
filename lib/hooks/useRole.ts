'use client';

import { useSession } from 'next-auth/react';
import { ROLE_HIERARCHY, UserRoleType } from '@/lib/constants/roles';

export function useRole() {
  const { data: session, status } = useSession();

  const role = session?.user?.role as UserRoleType | undefined;

  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isAdmin = role === 'ADMIN';
  const isManager = role === 'MANAGER';

  const hasMinRole = (minRole: UserRoleType): boolean => {
    if (!role) return false;
    return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minRole];
  };

  return {
    role,
    isSuperAdmin,
    isAdmin,
    isManager,
    hasMinRole,
    hotelId: session?.user?.hotelId ?? null,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
}
