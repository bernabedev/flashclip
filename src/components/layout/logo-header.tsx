import Link from "next/link";

export default function LogoHeader() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/" className="flex items-center gap-2">
        <img
          src="/logo.webp"
          alt="Flashclip"
          className="size-8 object-contain"
        />
        <h1 className="text-2xl font-bold">Flashclip</h1>
      </Link>
      <div className="text-xs border min-w-12 py-0.5 px-2 text-center rounded-full border-primary/50 text-primary">
        Beta
      </div>
    </div>
  );
}
