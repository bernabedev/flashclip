import BackgroundDots from "@/components/layout/background-dots";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editor",
  description: "Flashclip - The best way to create clips",
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col">
      <BackgroundDots />
      <div className="fixed -z-10 left-1/2 transform -translate-x-1/2 max-w-[1500px] w-full h-screen border-l border-r border-dashed border-slate-200/90 dark:border-input/50"></div>
      <Header classHeader="max-w-[1500px]" />
      <main className="flex flex-1 flex-col max-w-[1500px] mx-auto w-full px-6">
        {children}
      </main>
      <Footer classFooter="max-w-[1500px]" />
    </div>
  );
}
