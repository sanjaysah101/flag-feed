import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/utils";

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome back, {user.name}</p>
      {/* Dashboard content */}
    </div>
  );
}
