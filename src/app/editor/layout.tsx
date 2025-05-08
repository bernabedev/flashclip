import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flashclip - Editor",
  description: "Flashclip - The best way to create clips",
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col">
      <div className="fixed h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      <div className="fixed left-1/2 transform -translate-x-1/2 max-w-7xl w-full h-screen border border-dashed"></div>
      <div className="min-h-14 border border-dashed">
        <header className="max-w-7xl mx-auto h-14 flex items-center px-8 py-4">
          <div className="flex items-center gap-2">
            <img
              src="/logo.webp"
              alt="Flashclip"
              className="size-8 object-contain"
            />
            <h1 className="text-2xl font-bold">Flashclip</h1>
          </div>
        </header>
      </div>
      <main className="flex flex-1 flex-col max-w-7xl mx-auto w-full px-8 py-4">
        <div>{children}</div>
      </main>
      <div className="min-h-14 border border-dashed">
        <footer className="max-w-7xl mx-auto"></footer>
      </div>
    </div>
  );
}
