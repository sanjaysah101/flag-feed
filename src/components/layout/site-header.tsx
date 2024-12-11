import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ThemeToggle from "../theme/ThemeToggle";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";

export const SiteHeader = async () => {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8 lg:px-10">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">FlagFeed</span>
          </Link>
          <div className="hidden md:flex">
            <MainNav />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Link href="/feeds/new">Add Feed</Link>
              </Button>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Image
                      src={session.user.image || "https://github.com/shadcn.png"}
                      alt={session.user.name || "User"}
                      className="h-6 w-6 rounded-full"
                      width={24}
                      height={24}
                    />
                    <span className="hidden md:inline-block">{session.user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex w-full cursor-pointer items-center">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signout" className="flex w-full cursor-pointer items-center text-red-500">
                      Sign out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/auth/signin">Sign in</Link>
            </Button>
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  );
};
