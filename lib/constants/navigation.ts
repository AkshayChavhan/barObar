import type { PlanFeature } from './features';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  feature?: PlanFeature;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const SUPER_ADMIN_NAV: NavSection[] = [
  {
    title: 'Platform',
    items: [
      { label: 'Hotels', href: '/hotels', icon: 'Building2' },
      { label: 'Subscriptions', href: '/subscriptions', icon: 'CreditCard' },
      {
        label: 'Platform Analytics',
        href: '/platform-analytics',
        icon: 'BarChart3',
      },
    ],
  },
];

export const HOTEL_NAV: NavSection[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
      { label: 'Orders', href: '/orders', icon: 'ClipboardList' },
      { label: 'Scan & Order', href: '/scan-order', icon: 'ScanLine' },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Menu Management', href: '/menu-management', icon: 'UtensilsCrossed' },
      { label: 'Tables', href: '/tables', icon: 'Grid3X3' },
      { label: 'QR Codes', href: '/qr-codes', icon: 'QrCode' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Kitchen Display', href: '/kitchen', icon: 'ChefHat' },
      { label: 'Analytics', href: '/analytics', icon: 'BarChart3' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Settings', href: '/settings', icon: 'Settings' },
      { label: 'Subscription', href: '/subscription', icon: 'CreditCard' },
    ],
  },
  {
    title: 'Premium',
    items: [
      {
        label: 'Inventory',
        href: '/inventory',
        icon: 'Package',
        feature: 'inventory',
      },
      {
        label: 'Reservations',
        href: '/reservations',
        icon: 'CalendarCheck',
        feature: 'reservations',
      },
      {
        label: 'Staff Management',
        href: '/staff',
        icon: 'Users',
        feature: 'staff_management',
      },
    ],
  },
];
