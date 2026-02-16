'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  CreditCard,
  BarChart3,
  LayoutDashboard,
  ClipboardList,
  ScanLine,
  UtensilsCrossed,
  Grid3X3,
  QrCode,
  ChefHat,
  Settings,
  Package,
  CalendarCheck,
  Users,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { NavSection } from '@/lib/constants/navigation';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  CreditCard,
  BarChart3,
  LayoutDashboard,
  ClipboardList,
  ScanLine,
  UtensilsCrossed,
  Grid3X3,
  QrCode,
  ChefHat,
  Settings,
  Package,
  CalendarCheck,
  Users,
};

interface SidebarProps {
  navSections: NavSection[];
  isPremium?: boolean;
}

export function Sidebar({ navSections, isPremium = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
      {navSections.map((section, sectionIndex) => (
        <div key={section.title}>
          {sectionIndex > 0 && <Separator className="my-2" />}
          <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {section.title}
          </p>
          {section.items.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const isLocked = item.feature && !isPremium;

            return (
              <Link
                key={item.href}
                href={isLocked ? '#' : item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  isLocked && 'cursor-not-allowed opacity-60'
                )}
                onClick={(e) => {
                  if (isLocked) e.preventDefault();
                }}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                <span className="flex-1 truncate">{item.label}</span>
                {isLocked && (
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    <Badge
                      variant="outline"
                      className="h-5 border-amber-300 px-1 text-[10px] text-amber-600"
                    >
                      Pro
                    </Badge>
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
