'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';

interface HotelCardProps {
  hotel: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    createdAt: string;
    subscription: { plan: string } | null;
    _count: { users: number };
  };
  onToggleActive: (hotelId: string) => void;
  isToggling?: boolean;
}

export function HotelCard({ hotel, onToggleActive, isToggling }: HotelCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Link href={`/hotels/${hotel.id}`}>
          <CardTitle className="text-lg hover:underline">{hotel.name}</CardTitle>
        </Link>
        <div className="flex items-center gap-3">
          <Badge variant={hotel.isActive ? 'default' : 'secondary'}>
            {hotel.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Switch
            checked={hotel.isActive}
            onCheckedChange={() => onToggleActive(hotel.id)}
            disabled={isToggling}
            size="sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>/{hotel.slug}</span>
          <span>
            {hotel.subscription?.plan || 'BASIC'} plan
          </span>
          <span>{hotel._count.users} users</span>
          <span>Created {format(new Date(hotel.createdAt), 'MMM d, yyyy')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
