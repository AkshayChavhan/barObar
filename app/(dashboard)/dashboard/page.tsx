'use client';

import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ClipboardList,
  Grid3X3,
  UtensilsCrossed,
  Users,
} from 'lucide-react';

const stats = [
  {
    title: 'Orders Today',
    value: '0',
    description: 'Total orders placed today',
    icon: ClipboardList,
  },
  {
    title: 'Active Tables',
    value: '0',
    description: 'Tables with active sessions',
    icon: Grid3X3,
  },
  {
    title: 'Menu Items',
    value: '0',
    description: 'Published menu items',
    icon: UtensilsCrossed,
  },
  {
    title: 'Active Sessions',
    value: '0',
    description: 'Ongoing order sessions',
    icon: Users,
  },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name || 'Manager'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Set up your restaurant to start receiving orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-dashed p-4 text-center">
              <UtensilsCrossed className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Create Your Menu</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Add categories and menu items
              </p>
            </div>
            <div className="rounded-lg border border-dashed p-4 text-center">
              <Grid3X3 className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Set Up Tables</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Configure your table layout
              </p>
            </div>
            <div className="rounded-lg border border-dashed p-4 text-center">
              <Users className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Generate QR Codes</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Print QR codes for each table
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
