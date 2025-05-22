"use client";
import { cn } from "@/lib/utils";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { LayoutDashboard, UserIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";

export default function UserNavHeader() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  return (
    <div className="flex items-center gap-4">
      <SignedOut>
        <SignInButton>
          <Button variant="outline" className="min-w-32">
            <UserIcon className="size-4" />
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button className="min-w-32">
            <ZapIcon className="size-4" />
            Get Started
          </Button>
        </SignUpButton>
      </SignedOut>
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
            className={cn(
              buttonVariants({ variant: "default" }),
              "md:min-w-28"
            )}
          >
            <LayoutDashboard className="size-4" />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
        )}
      </SignedIn>
    </div>
  );
}
