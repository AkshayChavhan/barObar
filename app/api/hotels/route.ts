import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createHotelSchema } from '@/lib/validators/hotel';
import { generateSlug, ensureUniqueSlug } from '@/lib/utils/slug';
import bcrypt from 'bcryptjs';

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const hotels = await prisma.hotel.findMany({
    include: {
      subscription: true,
      _count: { select: { users: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(hotels);
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = createHotelSchema.parse(body);

    const baseSlug = parsed.slug || generateSlug(parsed.name);
    const slug = await ensureUniqueSlug(prisma, baseSlug);

    const hotel = await prisma.hotel.create({
      data: {
        name: parsed.name,
        slug,
        description: parsed.description,
        address: parsed.address,
        phone: parsed.phone,
        email: parsed.email || null,
        website: parsed.website || null,
        currency: parsed.currency,
        timezone: parsed.timezone,
      },
    });

    // Auto-create BASIC subscription
    await prisma.subscription.create({
      data: {
        hotelId: hotel.id,
        plan: 'BASIC',
        status: 'ACTIVE',
      },
    });

    // Create initial ADMIN user if provided
    if (parsed.adminEmail && parsed.adminPassword && parsed.adminName) {
      const hashedPassword = await bcrypt.hash(parsed.adminPassword, 12);
      await prisma.user.create({
        data: {
          name: parsed.adminName,
          email: parsed.adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
          hotelId: hotel.id,
        },
      });
    }

    const hotelWithRelations = await prisma.hotel.findUnique({
      where: { id: hotel.id },
      include: {
        subscription: true,
        _count: { select: { users: true } },
      },
    });

    return NextResponse.json(hotelWithRelations, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'A hotel with this slug already exists' },
        { status: 409 }
      );
    }
    console.error('Create hotel error:', error);
    return NextResponse.json(
      { error: 'Failed to create hotel' },
      { status: 500 }
    );
  }
}
