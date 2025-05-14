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
      <div className="fixed -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      <div className="fixed -z-10 left-1/2 transform -translate-x-1/2 max-w-6xl w-full h-screen border border-dashed border-slate-200/90"></div>
      <Header classHeader="max-w-6xl" />
      <main className="flex flex-1 flex-col max-w-6xl mx-auto w-full px-8 py-4">
        <div>{children}</div>
      </main>
      <Footer classFooter="max-w-6xl" />
    </div>
  );
}
