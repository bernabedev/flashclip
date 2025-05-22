import GetClip from "@/components/get_clip";
import BackgroundDots from "@/components/layout/background-dots";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SignedOut } from "@clerk/nextjs";
import { HandMetalIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-svh flex-col">
      <BackgroundDots />
      <div className="fixed -z-10 left-1/2 transform -translate-x-1/2 max-w-7xl 2xl:w-[calc(100%-16rem)] xl:w-full w-[calc(100%-1rem)] md:w-[calc(100%-3.5rem)] h-screen border-l border-r border-dashed border-slate-200/90 dark:border-input/50"></div>
      <Header />
      <main className="flex flex-1 flex-col max-w-xl mx-auto w-full px-8 py-4 justify-center items-center">
        <SignedOut>
          <Alert className="mb-10">
            <HandMetalIcon className="h-4 w-4 !text-primary" />
            <AlertTitle>You&apos;re in ninja mode!</AlertTitle>
            <AlertDescription className="text-black/50 dark:text-white/50 text-xs">
              No login, no trace. Log in to save clips and access your dashboard
              powers.
            </AlertDescription>
          </Alert>
        </SignedOut>
        <GetClip />
      </main>
      <Footer />
    </div>
  );
}
