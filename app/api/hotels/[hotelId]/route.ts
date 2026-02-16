import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { updateHotelSchema } from '@/lib/validators/hotel';

type Params = { params: Promise<{ hotelId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { hotelId } = await params;

  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    include: {
      subscription: true,
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { orders: true, menus: true, tables: true },
      },
    },
  });

  if (!hotel) {
    return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
  }

  return NextResponse.json(hotel);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { hotelId } = await params;

  try {
    const body = await request.json();
    const parsed = updateHotelSchema.parse(body);

    const hotel = await prisma.hotel.update({
      where: { id: hotelId },
      data: {
        ...parsed,
        email: parsed.email || null,
        website: parsed.website || null,
      },
      include: { subscription: true },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.error('Update hotel error:', error);
    return NextResponse.json(
      { error: 'Failed to update hotel' },
      { status: 500 }
    );
  }
}

export async function PATCH(_request: NextRequest, { params }: Params) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { hotelId } = await params;

  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
  });

  if (!hotel) {
    return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
  }

  const updated = await prisma.hotel.update({
    where: { id: hotelId },
    data: { isActive: !hotel.isActive },
    include: { subscription: true },
  });

  return NextResponse.json(updated);
}
