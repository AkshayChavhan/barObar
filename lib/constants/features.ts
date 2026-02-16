export const PLAN_FEATURES = {
  BASIC: [
    'menu',
    'qr_ordering',
    'waiter_dashboard',
    'order_management',
    'kds',
    'realtime',
    'feedback',
    'analytics',
    'multi_language',
    'push_notifications',
    'pwa',
    'modifiers',
  ],
  PREMIUM: [
    'billing',
    'stripe_payments',
    'inventory',
    'staff_management',
    'reservations',
    'loyalty',
    'dynamic_pricing',
    'wait_time',
    'delivery_takeout',
    'receipts',
    'order_history',
  ],
} as const;

export type PlanFeature =
  | (typeof PLAN_FEATURES.BASIC)[number]
  | (typeof PLAN_FEATURES.PREMIUM)[number];

export function isPremiumFeature(feature: string): boolean {
  return (PLAN_FEATURES.PREMIUM as readonly string[]).includes(feature);
}
