import GetClip from "@/components/get_clip";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { HeartIcon, UserIcon, ZapIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-svh flex-col">
      <div className="fixed -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      <div className="fixed -z-10 left-1/2 transform -translate-x-1/2 max-w-7xl 2xl:w-[calc(100%-16rem)] xl:w-full w-[calc(100%-3.5rem)] h-screen border border-dashed border-slate-200/90"></div>
      <div className="min-h-14 border border-dashed border-slate-200/90">
        <header className="max-w-7xl mx-auto h-14 flex items-center px-8 py-4 justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo.webp"
              alt="Flashclip"
              className="size-8 object-contain"
            />
            <h1 className="text-2xl font-bold">Flashclip</h1>
          </div>
          <div className="flex items-center gap-2">
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
                appearance={{
                  elements: {
                    userButtonAvatarBox: "!size-8",
                  },
                }}
              />
            </SignedIn>
          </div>
        </header>
      </div>
      <main className="flex flex-1 flex-col max-w-xl mx-auto w-full px-8 py-4 justify-center items-center">
        <GetClip />
      </main>
      <div className="min-h-14 border border-dashed border-slate-200/90">
        <footer className="max-w-7xl mx-auto h-14 flex justify-between items-center px-8 py-4">
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
    </div>
  );
}
