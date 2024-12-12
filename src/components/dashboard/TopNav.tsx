"use client";

import Link from "next/link";

import { Bell, Menu, Plus, Search } from "lucide-react";
import { useSession } from "next-auth/react";

import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";

export const TopNav = () => {
  const { toggleSidebar } = useSidebar();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-8">
        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="mr-4 md:hidden" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>

        {/* Search */}
        <div className="flex flex-1 items-center">
          <div className="relative hidden w-full max-w-sm md:flex">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search feeds and articles..." className="w-full bg-muted/30 pl-8" />
          </div>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="hidden md:flex">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/feeds/new" className="cursor-pointer">
                  Add New Feed
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/feeds/discover" className="cursor-pointer">
                  Discover Feeds
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {/* Notification Badge - Show only if there are unread notifications */}
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  2
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                {/* Example notifications */}
                <DropdownMenuItem className="flex flex-col items-start gap-1">
                  <p className="text-sm font-medium">New articles available</p>
                  <p className="text-xs text-muted-foreground">5 new articles from your subscribed feeds</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1">
                  <p className="text-sm font-medium">Achievement Unlocked!</p>
                  <p className="text-xs text-muted-foreground">You&apos;ve read 100 articles</p>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-sm text-muted-foreground">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <UserNav user={session?.user} />
        </div>
      </div>
    </header>
  );
};
