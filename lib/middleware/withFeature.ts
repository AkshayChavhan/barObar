import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { isPremiumFeature } from '@/lib/constants/features';
import type { PlanFeature } from '@/lib/constants/features';

type FeatureRequest = NextRequest & {
  userId: string;
  userRole: string;
  hotelId: string;
  plan: 'BASIC' | 'PREMIUM';
};

type RouteHandler = (
  request: FeatureRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>;

export function withFeature(requiredFeature: PlanFeature) {
  return (handler: RouteHandler) => {
    return async (
      request: NextRequest,
      context?: { params: Promise<Record<string, string>> }
    ) => {
      const session = await auth();

      if (!session?.user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const { role, id, hotelId } = session.user;

      // SUPER_ADMIN bypasses feature gating
      if (role === 'SUPER_ADMIN') {
        const featureRequest = request as FeatureRequest;
        featureRequest.userId = id;
        featureRequest.userRole = role;
        featureRequest.hotelId =
          new URL(request.url).searchParams.get('hotelId') || '';
        featureRequest.plan = 'PREMIUM';
        return handler(featureRequest, context);
      }

      if (!hotelId) {
        return NextResponse.json(
          { error: 'No hotel associated with this account' },
          { status: 403 }
        );
      }

      // Only check subscription if the feature is premium
      if (isPremiumFeature(requiredFeature)) {
        const subscription = await prisma.subscription.findUnique({
          where: { hotelId },
          select: { plan: true, status: true },
        });

        if (!subscription || subscription.status !== 'ACTIVE') {
          return NextResponse.json(
            { error: 'Active subscription required' },
            { status: 403 }
          );
        }

        if (subscription.plan === 'BASIC') {
          return NextResponse.json(
            {
              error: 'This feature requires a Premium plan',
              feature: requiredFeature,
              requiredPlan: 'PREMIUM',
            },
            { status: 403 }
          );
        }
      }

      const featureRequest = request as FeatureRequest;
      featureRequest.userId = id;
      featureRequest.userRole = role;
      featureRequest.hotelId = hotelId;
      featureRequest.plan = 'PREMIUM';
      return handler(featureRequest, context);
    };
  };
}
