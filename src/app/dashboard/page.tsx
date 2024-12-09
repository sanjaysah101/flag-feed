import { protectPage } from "@/lib/auth/protect";

export default async function Dashboard() {
  const session = await protectPage();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome back, {session.user.name}</p>
    </div>
  );
}
