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
  },
  {
    title: "Integrations",
    href: "/dashboard/integrations",
    icon: Zap,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      <div className="grid gap-1 pt-4">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "default" : "ghost"}
            className={cn(
              "justify-start gap-2 font-normal",
              pathname === item.href &&
                "bg-primary/10 border-primary/10 border text-primary font-medium"
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="w-4 h-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
}
