import { SignedIn, UserButton } from "@clerk/nextjs";

export default function UserNavHeader() {
  return (
    <div className="flex items-center gap-4">
      {/* <Button className="min-w-28">
        <ShareIcon className="size-4" />
        Export
      </Button> */}
      <SignedIn>
        <UserButton
          fallback={
            <div className="size-8 rounded-full bg-slate-200 animate-pulse"></div>
          }
          appearance={{
            elements: {
              userButtonAvatarBox: "!size-8",
            },
          }}
        />
      </SignedIn>
    </div>
  );
}
