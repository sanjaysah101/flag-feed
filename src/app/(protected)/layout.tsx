import { redirect } from "next/navigation";

import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { TopNav } from "@/components/dashboard/TopNav";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <div className="relative flex min-h-screen">
          {/* Fixed Sidebar */}
          <div className="fixed inset-y-0 z-20 hidden w-64 bg-background md:block">
            <DashboardSidebar />
          </div>

          {/* Main Content */}
          <div className="flex w-full flex-1 flex-col md:pl-64">
            <TopNav />
            <main className="flex-1">
              <div className="container max-w-screen-2xl px-4 py-6 md:px-8 md:py-8">{children}</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
