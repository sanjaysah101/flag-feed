import Link from "next/link";

import { MainNav } from "@/components";

import { getCurrentUser } from "../../lib/auth/utils";
import ThemeToggle from "../theme/ThemeToggle";
import { Button } from "../ui";

export const SiteHeader = async () => {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">FlagFeed</span>
        </Link>
        <MainNav user={user} />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {!user ? (
            <Button asChild variant="secondary" size="sm">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
};
