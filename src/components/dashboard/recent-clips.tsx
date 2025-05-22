import { ImageMinusIcon, MoreHorizontal, Play } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clip } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";

export function RecentClips({ clips }: { clips: Clip[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle>Recent Clips</CardTitle>
          <CardDescription>Your latest created clips</CardDescription>
        </div>
        <Link
          href="/dashboard/clips"
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "sm",
              className: "ml-auto",
            })
          )}
        >
          View All
        </Link>
      </CardHeader>
      <CardContent>
        {clips.length > 0 ? (
          <ScrollArea className="space-y-4 h-[300px] pe-4">
            {clips.map((clip, index) => (
              <div
                key={clip.id}
                className={cn("flex items-center gap-4", index > 0 && "pt-2")}
              >
                <Card
                  className={cn(
                    "relative rounded-md overflow-hidden w-[120px] h-[68px] border p-0",
                    !clip.thumbnailUrl && "py-4"
                  )}
                >
                  <img
                    src={clip.thumbnailUrl || "/logo.webp"}
                    alt={clip.title}
                    className={cn(
                      "object-cover w-full h-full",
                      !clip.thumbnailUrl && "opacity-20 object-contain"
                    )}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
                    <Button size="icon" variant="ghost" className="text-white">
                      <Play className="h-8 w-8 fill-white" />
                    </Button>
                  </div>
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                    {clip.duration ? (clip.duration / 1000).toFixed(2) : "0"}s
                  </div>
                </Card>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{clip.title}</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>0 views</span>
                    <span className="mx-1">•</span>``
                    <span>{clip.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center min-h-[300px] pb-4">
            <div className="flex flex-col items-center gap-2">
              <ImageMinusIcon className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">
                Upps, No clips found! Create one now!
              </p>
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "link" }))}
              >
                Create Clip
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
