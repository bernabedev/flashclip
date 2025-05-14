import { Upload, Video, Wand2, ZapIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Create and manage your clips</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full justify-start gap-2 h-auto py-3"
          )}
        >
          <ZapIcon className="h-5 w-5" />
          <div className="flex flex-col items-start">
            <span>Create New Clip</span>
            <span className="text-xs text-white/80">
              Cut clips from your streams
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full justify-start gap-2 h-auto py-3"
          )}
        >
          <Upload className="h-5 w-5" />
          <div className="flex flex-col items-start">
            <span>Upload Video</span>
            <span className="text-xs text-muted-foreground">
              Upload existing videos
            </span>
          </div>
        </Link>

        <Link
          href="#"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full justify-start gap-2 h-auto py-3"
          )}
        >
          <Video className="h-5 w-5" />
          <div className="flex flex-col items-start">
            <span>Connect Stream</span>
            <span className="text-xs text-muted-foreground">
              Link your streaming accounts
            </span>
          </div>
        </Link>

        <Link
          href="#"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full justify-start gap-2 h-auto py-3"
          )}
        >
          <Wand2 className="h-5 w-5" />
          <div className="flex flex-col items-start">
            <span>Auto-Generate Clips</span>
            <span className="text-xs text-muted-foreground">
              AI-powered clip generation
            </span>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
