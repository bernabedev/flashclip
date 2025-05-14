import { ClipsFilter } from "@/components/dashboard/clips-filter";
import { ClipsTable } from "@/components/dashboard/clips-table";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default async function ClipsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="My Clips"
        text="Manage all your created clips in one place."
      >
        <Button className="gap-1">
          <PlusCircle className="h-4 w-4" />
          New Clip
        </Button>
      </DashboardHeader>

      <ClipsFilter />
      <ClipsTable />
    </DashboardShell>
  );
}
