export const PLAN_LIMITS = {
  BASIC: {
    maxTables: 5,
    maxMenus: 1,
    maxMenuItems: 50,
  },
  PREMIUM: {
    maxTables: 50,
    maxMenus: 10,
    maxMenuItems: 500,
  },
} as const;

export type PlanLimitKey = keyof (typeof PLAN_LIMITS)['BASIC'];

export function getPlanLimit(
  plan: 'BASIC' | 'PREMIUM',
  limit: PlanLimitKey
): number {
  return PLAN_LIMITS[plan][limit];
}
