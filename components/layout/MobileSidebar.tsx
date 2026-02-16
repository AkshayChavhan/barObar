'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import type { NavSection } from '@/lib/constants/navigation';

interface MobileSidebarProps {
  navSections: NavSection[];
  isPremium?: boolean;
  title: string;
}

export function MobileSidebar({
  navSections,
  isPremium = false,
  title,
}: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="text-left text-lg">{title}</SheetTitle>
          </SheetHeader>
          <Sidebar navSections={navSections} isPremium={isPremium} />
        </SheetContent>
      </Sheet>
    </>
  );
}
