import { redirect } from "next/navigation";

import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { SidebarProvider } from "@/components/ui/sidebar";

import { GamificationProvider } from "../../providers/GamificationProvider";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <SessionProvider session={session}>
      <GamificationProvider>
        <SidebarProvider>
          <div className="flex h-screen w-full overflow-hidden bg-background">
            <DashboardSidebar />
            <div className="relative flex flex-1 flex-col">
              <DashboardNavbar />
              <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-3 md:p-4">{children}</div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </GamificationProvider>
    </SessionProvider>
  );
}
