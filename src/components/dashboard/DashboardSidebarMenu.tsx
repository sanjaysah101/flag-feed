"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BarChart, BookOpen, LayoutDashboard, LucideIcon, RssIcon, Settings, Trophy } from "lucide-react";

import { FLAGS } from "../../lib/devcycle/flags";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui";

type SidebarItem = {
  title: string;
  icon: LucideIcon;
  href: string;
  featureFlag?: string;
};

const sidebarItems: SidebarItem[] = [
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
    featureFlag: FLAGS.GAMIFICATION.ENABLED,
  },
  {
    title: "Analytics",
    icon: BarChart,
    href: "/analytics",
    featureFlag: FLAGS.ANALYTICS.ENABLED,
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
] as const;

export const DashboardSidebarMenu = ({
  hasGamification,
  hasAnalytics,
}: {
  hasGamification: boolean;
  hasAnalytics: boolean;
}) => {
  const pathname = usePathname();

  const filteredItems = sidebarItems.filter((item) => {
    if (item.featureFlag === FLAGS.GAMIFICATION.ENABLED && !hasGamification) return false;
    if (item.featureFlag === FLAGS.ANALYTICS.ENABLED && !hasAnalytics) return false;
    return true;
  });

  return (
    <SidebarMenu>
      {filteredItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
            <Link href={item.href}>
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};
