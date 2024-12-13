"use client";

import Link from "next/link";

import { Bell, Plus, Search, Trophy } from "lucide-react";

import ThemeToggle from "@/components/theme/ThemeToggle";
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
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import { GamificationContent } from "./GamificationContent";

export const DashboardNavbar = () => {
  const { state: sidebarState } = useSidebar();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4 md:px-6">
        <SidebarTrigger />

        {/* Search and Actions Section */}
        <div className="flex flex-1 items-center justify-between gap-4 md:justify-start">
          {/* Search */}
          <form className="hidden flex-1 md:block">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className={cn(
                  "h-9 w-full pl-8",
                  sidebarState === "expanded" ? "md:w-[200px] xl:w-[260px]" : "md:w-[260px] xl:w-[300px]"
                )}
              />
            </div>
          </form>

          {/* Search - Mobile */}
          <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden">
            <Search className="h-4 w-4" />
          </Button>

          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="hidden h-8 w-8 md:flex">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/feeds/new">Add New Feed</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/feeds/discover">Discover Feeds</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Side Items */}
        <div className="flex items-center gap-2">
          {/* Gamification - Mobile/Tablet/Compact */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trophy className="h-4 w-4 text-yellow-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="font-semibold">Gamification</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2">
                <GamificationContent direction="vertical" showDetails className="px-2" />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/gamification" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  View All Achievements
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle className="h-8 w-8" />
        </div>
      </div>
    </header>
  );
};
