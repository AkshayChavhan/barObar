'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateHotelSchema, UpdateHotelFormData } from '@/lib/validators/hotel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import { CreateUserDialog } from '@/components/super-admin/CreateUserDialog';
import { format } from 'date-fns';

interface HotelUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface HotelDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  currency: string;
  timezone: string;
  isActive: boolean;
  createdAt: string;
  subscription: { plan: string; status: string } | null;
  users: HotelUser[];
  _count: { orders: number; menus: number; tables: number };
}

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.hotelId as string;

  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateHotelFormData>({
    resolver: zodResolver(updateHotelSchema),
  });

  const fetchHotel = useCallback(async () => {
    try {
      const res = await fetch(`/api/hotels/${hotelId}`);
      if (!res.ok) {
        router.push('/hotels');
        return;
      }
      const data = await res.json();
      setHotel(data);
      reset({
        name: data.name,
        description: data.description || '',
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
        website: data.website || '',
        currency: data.currency,
        timezone: data.timezone,
      });
    } catch {
      router.push('/hotels');
    } finally {
      setIsLoading(false);
    }
  }, [hotelId, reset, router]);

  useEffect(() => {
    fetchHotel();
  }, [fetchHotel]);

  const onSubmit = async (data: UpdateHotelFormData) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/hotels/${hotelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updated = await res.json();
        setHotel((prev) => (prev ? { ...prev, ...updated } : prev));
        setMessage('Hotel updated successfully');
      }
    } catch {
      setMessage('Failed to update hotel');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async () => {
    setIsToggling(true);
    try {
      const res = await fetch(`/api/hotels/${hotelId}`, { method: 'PATCH' });
      if (res.ok) {
        const updated = await res.json();
        setHotel((prev) =>
          prev ? { ...prev, isActive: updated.isActive } : prev
        );
      }
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!hotel) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{hotel.name}</h2>
          <p className="text-muted-foreground">/{hotel.slug}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={hotel.isActive ? 'default' : 'secondary'}>
            {hotel.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Switch
            checked={hotel.isActive}
            onCheckedChange={handleToggleActive}
            disabled={isToggling}
          />
          <Button variant="outline" onClick={() => router.push('/hotels')}>
            Back
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Plan</CardDescription>
            <CardTitle>{hotel.subscription?.plan || 'BASIC'}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Orders</CardDescription>
            <CardTitle>{hotel._count.orders}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tables</CardDescription>
            <CardTitle>{hotel._count.tables}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hotel Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {message && (
              <div className="rounded-md bg-muted p-3 text-sm">{message}</div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register('phone')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register('description')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register('address')} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" {...register('website')} />
              </div>
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Staff members for this hotel
            </CardDescription>
          </div>
          <CreateUserDialog hotelId={hotelId} onUserCreated={fetchHotel}>
            <Button size="sm">Add User</Button>
          </CreateUserDialog>
        </CardHeader>
        <CardContent>
          {hotel.users.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No users assigned to this hotel yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotel.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isActive ? 'default' : 'secondary'}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
