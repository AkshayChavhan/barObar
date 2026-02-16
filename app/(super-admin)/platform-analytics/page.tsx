'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, CreditCard, CheckCircle, Crown } from 'lucide-react';

interface PlatformStats {
  totalHotels: number;
  activeHotels: number;
  totalSubscriptions: number;
  premiumCount: number;
}

export default function PlatformAnalyticsPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const [hotelsRes, subsRes] = await Promise.all([
        fetch('/api/hotels'),
        fetch('/api/subscriptions'),
      ]);

      if (hotelsRes.ok && subsRes.ok) {
        const hotels = await hotelsRes.json();
        const subscriptions = await subsRes.json();

        setStats({
          totalHotels: hotels.length,
          activeHotels: hotels.filter(
            (h: { isActive: boolean }) => h.isActive
          ).length,
          totalSubscriptions: subscriptions.length,
          premiumCount: subscriptions.filter(
            (s: { plan: string }) => s.plan === 'PREMIUM'
          ).length,
        });
      }
    } catch (error) {
      console.error('Failed to fetch platform stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      title: 'Total Hotels',
      value: stats?.totalHotels ?? 0,
      description: 'Hotels on the platform',
      icon: Building2,
    },
    {
      title: 'Active Hotels',
      value: stats?.activeHotels ?? 0,
      description: 'Currently active',
      icon: CheckCircle,
    },
    {
      title: 'Subscriptions',
      value: stats?.totalSubscriptions ?? 0,
      description: 'Total subscriptions',
      icon: CreditCard,
    },
    {
      title: 'Premium Plans',
      value: stats?.premiumCount ?? 0,
      description: 'Hotels on Premium',
      icon: Crown,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Platform Analytics</h2>
        <p className="text-muted-foreground">
          Overview of the barObar platform
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>{stat.title}</CardDescription>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
