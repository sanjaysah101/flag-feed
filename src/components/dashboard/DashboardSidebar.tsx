"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BarChart, BookOpen, LayoutDashboard, RssIcon, Settings, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Feeds",
    icon: RssIcon,
    href: "/feeds",
  },
  {
    title: "Reading List",
    icon: BookOpen,
    href: "/reading-list",
  },
  {
    title: "Achievements",
    icon: Trophy,
    href: "/achievements",
  },
  {
    title: "Analytics",
    icon: BarChart,
    href: "/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="h-full border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <RssIcon className="h-6 w-6" />
          <span className="font-bold">RSS Reader</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <nav className="grid gap-1 p-4">
          {sidebarItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn("w-full justify-start gap-2 px-4", pathname === item.href && "bg-muted font-medium")}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>
      </SidebarContent>
    </Sidebar>
  );
};
