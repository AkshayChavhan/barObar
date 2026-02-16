'use client';

import { useSubscription } from '@/lib/hooks/useSubscription';
import type { PlanFeature } from '@/lib/constants/features';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface PremiumGateProps {
  feature: PlanFeature;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PremiumGate({ feature, children, fallback }: PremiumGateProps) {
  const { hasFeature, isLoading, isActive } = useSubscription();

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  if (!isActive) {
    return (
      fallback ?? (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              Subscription Inactive
              <Badge variant="destructive">Inactive</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your subscription is not active. Please contact your
              administrator.
            </p>
          </CardContent>
        </Card>
      )
    );
  }

  if (!hasFeature(feature)) {
    return (
      fallback ?? (
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              Premium Feature
              <Badge className="bg-amber-500 text-white">Premium</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This feature requires a Premium plan. Contact your platform
              administrator to upgrade.
            </p>
          </CardContent>
        </Card>
      )
    );
  }

  return <>{children}</>;
}
