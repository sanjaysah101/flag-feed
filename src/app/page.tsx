import { getCurrentUser } from "@/lib/auth/utils";

export default async function Home() {
  const user = await getCurrentUser();

  return <div>{JSON.stringify(user)}</div>;
}
