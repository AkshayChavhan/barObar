import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

type Params = { params: Promise<{ hotelId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const { hotelId } = await params;
  const { role, hotelId: userHotelId } = session.user;

  // SUPER_ADMIN can view any hotel's subscription
  // ADMIN/MANAGER can only view their own hotel's subscription
  if (role !== 'SUPER_ADMIN' && userHotelId !== hotelId) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  const subscription = await prisma.subscription.findUnique({
    where: { hotelId },
  });

  if (!subscription) {
    return NextResponse.json(
      { error: 'Subscription not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(subscription);
}
