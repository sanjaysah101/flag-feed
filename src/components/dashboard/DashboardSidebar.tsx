"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useVariableValue } from "@devcycle/nextjs-sdk";
import {
  BarChart,
  BookOpen,
  ChevronUp,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  RssIcon,
  Settings,
  Trophy,
  User2,
} from "lucide-react";
import { signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Logo,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui";
import { FLAGS } from "@/lib/devcycle/flags";

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

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const hasGamification = useVariableValue(FLAGS.GAMIFICATION.ENABLED, false);
  const hasAnalytics = useVariableValue(FLAGS.ANALYTICS.ENABLED, false);

  const filteredItems = sidebarItems.filter((item) => {
    if (item.featureFlag === FLAGS.GAMIFICATION.ENABLED && !hasGamification) return false;
    if (item.featureFlag === FLAGS.ANALYTICS.ENABLED && !hasAnalytics) return false;
    return true;
  });

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 className="h-4 w-4" />
                  <span>Profile</span>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Account Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                  className="text-red-600 focus:bg-red-50 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
