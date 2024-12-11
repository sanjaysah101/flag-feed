import { Sidebar } from "@/components/layout/Sidebar";
import { protectPage } from "@/lib/auth/protect";

import { AuthProvider } from "../../components/providers/auth-provider";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await protectPage();

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
          <aside className="hidden w-[200px] flex-col md:flex">
            <Sidebar />
          </aside>
          <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
