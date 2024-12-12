"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BarChart, BookOpen, LayoutDashboard, RssIcon, Settings, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
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

export const Sidebar = () => {
  const pathname = usePathname();

  const SidebarContent = (
    <div className="flex h-full flex-col gap-4">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <RssIcon className="h-6 w-6" />
          <span className="font-bold">RSS Reader</span>
        </Link>
      </div>
      <div className="flex-1 space-y-1 px-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn("w-full justify-start gap-2")}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );

  return <div className="flex h-screen w-[240px] flex-col border-r">{SidebarContent}</div>;
};
