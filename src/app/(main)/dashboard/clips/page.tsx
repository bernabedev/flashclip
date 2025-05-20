import { ClipsFilter } from "@/components/dashboard/clips-filter";
import { ClipsTable } from "@/components/dashboard/clips-table";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { getOrCreateDbUserFromClerk } from "@/lib/server-utils";
import { ClipService } from "@/services/db/clips";
import { currentUser } from "@clerk/nextjs/server";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ClipsPage() {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  const dbUser = await getOrCreateDbUserFromClerk();
  const clips = await ClipService.getClipsByUserId(dbUser.id);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="My Clips"
        text="Manage all your created clips in one place."
      >
        <Link href="/">
          <Button className="gap-1">
            <PlusCircle className="h-4 w-4" />
            New Clip
          </Button>
        </Link>
      </DashboardHeader>

      <ClipsFilter />
      <ClipsTable clips={clips.data} editable />
    </DashboardShell>
  );
}
