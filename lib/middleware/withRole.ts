import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { UserRoleType } from '@/lib/constants/roles';

type AuthenticatedRequest = NextRequest & {
  userId: string;
  userRole: UserRoleType;
  hotelId: string | null;
};

type RouteHandler = (
  request: AuthenticatedRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>;

export function withRole(...allowedRoles: UserRoleType[]) {
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

      if (!allowedRoles.includes(role as UserRoleType)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.userId = id;
      authenticatedRequest.userRole = role as UserRoleType;
      authenticatedRequest.hotelId = hotelId;

      return handler(authenticatedRequest, context);
    };
  };
}
