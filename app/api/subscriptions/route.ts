import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const subscriptions = await prisma.subscription.findMany({
    include: {
      hotel: {
        select: { id: true, name: true, slug: true, isActive: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(subscriptions);
}
