import Link from "next/link";

import { RssIcon } from "lucide-react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Simple header for public pages */}
      <header className="border-b bg-background">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2">
            <RssIcon className="h-6 w-6" />
            <span className="font-bold">RSS Reader</span>
          </Link>
        </div>
      </header>

      {/* Center content for auth pages */}
      <main className="flex flex-1 items-center justify-center">
        <div className="container max-w-md p-8">{children}</div>
      </main>
    </div>
  );
};

export default PublicLayout;
