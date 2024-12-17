import Link from "next/link";

import { ChevronUp, LogOut, User2 } from "lucide-react";

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
import { getVariableValue } from "@/lib/devcycle/config";
import { FLAGS } from "@/lib/devcycle/flags";

import { DashboardSidebarMenu } from "./DashboardSidebarMenu";

export const DashboardSidebar = async () => {
  const hasGamification = await getVariableValue(FLAGS.GAMIFICATION.ENABLED, false);
  const hasAnalytics = await getVariableValue(FLAGS.ANALYTICS.ENABLED, false);

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <DashboardSidebarMenu hasGamification={hasGamification} hasAnalytics={hasAnalytics} />
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
                <Link href="/auth/signout">
                  <DropdownMenuItem className="flex text-red-600 focus:bg-red-50 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
