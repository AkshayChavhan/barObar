import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { updateSubscriptionSchema } from '@/lib/validators/subscription';

type Params = { params: Promise<{ subscriptionId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { subscriptionId } = await params;

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: {
      hotel: {
        select: { id: true, name: true, slug: true, isActive: true },
      },
    },
  });

  if (!subscription) {
    return NextResponse.json(
      { error: 'Subscription not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(subscription);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { subscriptionId } = await params;

  try {
    const body = await request.json();
    const parsed = updateSubscriptionSchema.parse(body);

    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        ...(parsed.plan && { plan: parsed.plan }),
        ...(parsed.status && { status: parsed.status }),
      },
      include: {
        hotel: {
          select: { id: true, name: true, slug: true, isActive: true },
        },
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Update subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
