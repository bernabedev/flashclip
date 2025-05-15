"use client";

import type React from "react";

import {
  BarChart3,
  Clapperboard,
  Scissors,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "My Clips",
    href: "/dashboard/clips",
    icon: Clapperboard,
  },
  {
    title: "Create Clip",
    href: "/",
    icon: Scissors,
  },
  {
    title: "Audience",
    href: "/dashboard/audience",
    icon: Users,
    disabled: true,
  },
  {
    title: "Integrations",
    href: "/dashboard/integrations",
    icon: Zap,
    disabled: true,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    disabled: true,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      <div className="grid gap-1">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "default" : "ghost"}
            className={cn(
              "justify-start gap-2 font-normal",
              pathname === item.href &&
                "bg-primary/10 border-primary/10 border text-primary font-medium pointer-events-none",
              item.disabled && "opacity-50 pointer-events-none"
            )}
            asChild
            disabled={item.disabled}
          >
            <Link href={item.href}>
              <item.icon className="w-4 h-4" />
              {item.title}
              {item.disabled && (
                <span className="text-xs text-primary/80 border border-primary/10 px-2 py-0.5 rounded-full border-dashed">
                  Coming soon
                </span>
              )}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
}
