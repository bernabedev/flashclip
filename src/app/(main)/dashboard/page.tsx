import { ClipStats } from "@/components/dashboard/clip-stats";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentClips } from "@/components/dashboard/recent-clips";
import { currentUser } from "@clerk/nextjs/server";

export const metadata = {
  title: "Dashboard",
  description:
    "Welcome to your FlashClip dashboard. Create, manage and analyze your stream clips.",
};

export default async function Dashboard() {
  const user = await currentUser();

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Hola ${user?.fullName || "Creator"}`}
        text="Welcome to your FlashClip dashboard. Create, manage and analyze your stream clips."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ClipStats />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="col-span-4">
          <RecentClips />
        </div>
        <div className="col-span-3">
          <QuickActions />
        </div>
      </div>
    </DashboardShell>
  );
}
