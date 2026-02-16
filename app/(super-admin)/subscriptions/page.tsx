'use client';

import { useEffect, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

interface SubscriptionWithHotel {
  id: string;
  hotelId: string;
  plan: 'BASIC' | 'PREMIUM';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
  hotel: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
}

function statusBadgeVariant(
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'ACTIVE':
      return 'default';
    case 'PAST_DUE':
      return 'outline';
    case 'CANCELLED':
      return 'secondary';
    case 'EXPIRED':
      return 'destructive';
    default:
      return 'outline';
  }
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithHotel[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      const res = await fetch('/api/subscriptions');
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data);
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleUpdate = async (
    subscriptionId: string,
    data: { plan?: string; status?: string }
  ) => {
    setUpdatingId(subscriptionId);
    setMessage(null);

    try {
      const res = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updated = await res.json();
        setSubscriptions((prev) =>
          prev.map((s) => (s.id === subscriptionId ? updated : s))
        );
        setMessage('Subscription updated successfully');
      } else {
        setMessage('Failed to update subscription');
      }
    } catch {
      setMessage('Failed to update subscription');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Subscriptions</h2>
        <p className="text-muted-foreground">
          Manage subscription plans for all hotels
        </p>
      </div>

      {message && (
        <div className="rounded-md bg-muted p-3 text-sm">{message}</div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            No subscriptions yet. Subscriptions are created automatically when
            hotels are added.
          </p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Subscriptions</CardTitle>
            <CardDescription>
              {subscriptions.length} hotel{subscriptions.length !== 1 && 's'}{' '}
              with subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">
                      {sub.hotel.name}
                      {!sub.hotel.isActive && (
                        <Badge variant="secondary" className="ml-2">
                          Hotel Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      /{sub.hotel.slug}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={sub.plan}
                        onValueChange={(value) =>
                          handleUpdate(sub.id, { plan: value })
                        }
                        disabled={updatingId === sub.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BASIC">Basic</SelectItem>
                          <SelectItem value="PREMIUM">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={sub.status}
                        onValueChange={(value) =>
                          handleUpdate(sub.id, { status: value })
                        }
                        disabled={updatingId === sub.id}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue>
                            <Badge variant={statusBadgeVariant(sub.status)}>
                              {sub.status.replace('_', ' ')}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="PAST_DUE">Past Due</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          <SelectItem value="EXPIRED">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {format(new Date(sub.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
