import Link from "next/link";

import { RssIcon } from "lucide-react";

export const Logo = () => {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3">
      <RssIcon className="h-6 w-6" />
      <span className="text-xl font-bold">FlagFeed</span>
    </Link>
  );
};
