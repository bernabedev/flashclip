"use client";
import { cn } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";

export default function UserNavHeader() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  return (
    <div className="flex items-center gap-4">
      <SignedIn>
        <UserButton
          fallback={
            <div className="size-8 rounded-full bg-slate-200 animate-pulse"></div>
          }
          appearance={{
            elements: {
              userButtonAvatarBox: "!size-8",
            },
          }}
        />
        {!isDashboard && (
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "default" }), "min-w-28")}
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
        )}
      </SignedIn>
    </div>
  );
}
