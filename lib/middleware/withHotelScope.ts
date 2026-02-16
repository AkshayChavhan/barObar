import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

type ScopedRequest = NextRequest & {
  userId: string;
  userRole: string;
  hotelId: string;
};

type RouteHandler = (
  request: ScopedRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>;

export function withHotelScope(handler: RouteHandler) {
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

    let effectiveHotelId: string | null = hotelId;

    // SUPER_ADMIN can optionally scope to a specific hotel via query param
    if (role === 'SUPER_ADMIN') {
      const url = new URL(request.url);
      const queryHotelId = url.searchParams.get('hotelId');
      if (queryHotelId) {
        effectiveHotelId = queryHotelId;
      } else {
        return NextResponse.json(
          { error: 'hotelId query parameter required for SUPER_ADMIN' },
          { status: 400 }
        );
      }
    }

    if (!effectiveHotelId) {
      return NextResponse.json(
        { error: 'No hotel associated with this account' },
        { status: 403 }
      );
    }

    const scopedRequest = request as ScopedRequest;
    scopedRequest.userId = id;
    scopedRequest.userRole = role;
    scopedRequest.hotelId = effectiveHotelId;

    return handler(scopedRequest, context);
  };
}
