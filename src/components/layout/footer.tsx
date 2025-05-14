import { cn } from "@/lib/utils";
import { HeartIcon } from "lucide-react";

interface FooterProps {
  classFooter?: string;
}

export default function Footer({ classFooter }: FooterProps) {
  return (
    <div className="min-h-14 border border-dashed border-slate-200/90">
      <footer
        className={cn(
          "max-w-7xl mx-auto h-14 flex justify-between items-center px-8 py-4",
          classFooter
        )}
      >
        <p className="text-center text-muted-foreground text-xs">
          © {new Date().getFullYear()} Flashclip. All rights reserved.
        </p>
        <p className="flex items-center gap-2 text-center text-muted-foreground text-xs">
          <span className="flex items-center gap-1">
            Make with <HeartIcon className="size-2.5 text-primary" />
          </span>
          <span>by</span>
          <a
            href="https://github.com/bernabedev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            @bernabedev
          </a>
        </p>
      </footer>
    </div>
  );
}
