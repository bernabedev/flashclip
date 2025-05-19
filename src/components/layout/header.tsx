import { cn } from "@/lib/utils";
import { BugIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import LogoHeader from "./logo-header";
import UserNavHeader from "./user-nav-header";

interface HeaderProps {
  classHeader?: string;
}

export default function Header({ classHeader }: HeaderProps) {
  return (
    <div className="min-h-14 border border-dashed border-slate-200/90">
      <header
        className={cn(
          "max-w-7xl mx-auto h-14 flex items-center px-8 py-4 justify-between",
          classHeader
        )}
      >
        <LogoHeader />
        <div className="flex items-center gap-4">
          <Link
            href="/report-a-bug"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "link" })}
          >
            <BugIcon className="size-4" />
            Report a bug
          </Link>
          <UserNavHeader />
        </div>
      </header>
    </div>
  );
}
