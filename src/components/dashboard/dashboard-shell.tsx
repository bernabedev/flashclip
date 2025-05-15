import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import type React from "react";
import { Card } from "../ui/card";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex flex-1 gap-6 w-full">
      <aside className="hidden w-64 lg:block">
        <Card className="px-4">
          <DashboardNav />
        </Card>
      </aside>
      <div className="flex-1 mx-auto space-y-6">{children}</div>
    </div>
  );
}
