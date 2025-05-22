import BackgroundDots from "@/components/layout/background-dots";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col">
      <BackgroundDots />
      <div className="fixed -z-10 left-1/2 transform -translate-x-1/2 max-w-7xl 2xl:w-[calc(100%-16rem)] xl:w-full w-[calc(100%-3.5rem)] h-screen border-l border-r border-dashed border-slate-200/90 dark:border-input/50"></div>
      <Header />
      <main className="flex flex-1 flex-col mx-auto w-full px-8 py-4 justify-center max-w-7xl">
        {children}
      </main>
      <Footer />
    </div>
  );
}
