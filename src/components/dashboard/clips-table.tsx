"use client";

import {
  Clock,
  Download,
  Edit,
  Eye,
  Link,
  MoreHorizontal,
  Play,
  Share2,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Clip } from "@/generated/prisma";
import { cn } from "@/lib/utils";

// Helper function to format date
function formatDate(dateString: string | Date) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "outline" | "destructive";
    }
  > = {
    published: { label: "Published", variant: "default" },
    draft: { label: "Draft", variant: "secondary" },
    processing: { label: "Processing", variant: "outline" },
    archived: { label: "Archived", variant: "destructive" },
    private: { label: "Private", variant: "destructive" },
  };

  const { label, variant } = statusMap[status] || {
    label: status,
    variant: "outline",
  };

  return <Badge variant={variant}>{label}</Badge>;
}

export function ClipsTable({ clips }: { clips: Clip[] }) {
  const [selectedClips, setSelectedClips] = useState<string[]>([]);

  const toggleClip = (clipId: string) => {
    setSelectedClips((prev) =>
      prev.includes(clipId)
        ? prev.filter((id) => id !== clipId)
        : [...prev, clipId]
    );
  };

  // const toggleAll = () => {
  //   setSelectedClips((prev) =>
  //     prev.length === clips.length ? [] : clips.map((clip) => clip.id)
  //   );
  // };

  return (
    <div className="space-y-4">
      {/* Bulk actions */}
      {selectedClips.length > 0 && (
        <div className="bg-muted/50 p-2 rounded-md flex items-center justify-between mb-4">
          <span className="text-sm font-medium ml-2">
            {selectedClips.length} clip{selectedClips.length > 1 ? "s" : ""}{" "}
            selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Clips grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clips.map((clip) => (
          <Card key={clip.id} className="overflow-hidden pt-0">
            <div className="relative">
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={selectedClips.includes(clip.id)}
                  onCheckedChange={() => toggleClip(clip.id)}
                  className="h-5 w-5 bg-background/80 backdrop-blur-sm"
                />
              </div>
              <div className="absolute top-2 right-2 z-10">
                <StatusBadge status={clip.isPublic ? "published" : "private"} />
              </div>
              <div className="relative aspect-video bg-muted">
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
                    <Play className="h-12 w-12 fill-white" />
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-md flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {clip.duration ? (clip.duration / 1000).toFixed(2) : "0"}s
                </div>
                {/* <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-md">
                  {clip.source}
                </div> */}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1 truncate">
                  <h3 className="font-medium line-clamp-1">{clip.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    Created {formatDate(clip.createdAt)}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-mr-2">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link className="h-4 w-4 mr-2" />
                      Copy link
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {clip.isPublic ? (
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3 mr-1" />
                  {0} views
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">Private</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
