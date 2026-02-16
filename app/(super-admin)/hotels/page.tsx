'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { HotelCard } from '@/components/super-admin/HotelCard';

interface Hotel {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  subscription: { plan: string } | null;
  _count: { users: number };
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchHotels = useCallback(async () => {
    try {
      const res = await fetch('/api/hotels');
      if (res.ok) {
        const data = await res.json();
        setHotels(data);
      }
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleToggleActive = async (hotelId: string) => {
    setTogglingId(hotelId);
    try {
      const res = await fetch(`/api/hotels/${hotelId}`, { method: 'PATCH' });
      if (res.ok) {
        const updated = await res.json();
        setHotels((prev) =>
          prev.map((h) =>
            h.id === hotelId ? { ...h, isActive: updated.isActive } : h
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle hotel:', error);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hotels</h2>
          <p className="text-muted-foreground">
            Manage all hotels on the platform
          </p>
        </div>
        <Link href="/hotels/create">
          <Button>Add Hotel</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : hotels.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No hotels yet.</p>
          <Link href="/hotels/create">
            <Button variant="outline" className="mt-4">
              Create your first hotel
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {hotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onToggleActive={handleToggleActive}
              isToggling={togglingId === hotel.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
