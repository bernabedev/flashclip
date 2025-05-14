import { cn } from "@/lib/utils";
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
        <UserNavHeader />
      </header>
    </div>
  );
}
