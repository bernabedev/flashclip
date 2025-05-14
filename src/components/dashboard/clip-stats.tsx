import { ArrowUpRight, Clock, Database, FileVideo, Upload } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Clips Generated",
    value: "124",
    change: "+18",
    icon: FileVideo,
  },
  {
    title: "Storage Used",
    value: "4.2 GB",
    change: "+512 MB",
    icon: Database,
  },
  {
    title: "Processing Time Saved",
    value: "32 hrs",
    change: "+5 hrs",
    icon: Clock,
  },
  {
    title: "Successful Exports",
    value: "98",
    change: "+12",
    icon: Upload,
  },
];

export function ClipStats() {
  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="w-3 h-3 mr-1 text-emerald-500" />
              <span className="text-emerald-500">{stat.change}</span>
              <span className="ml-1">this week</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
