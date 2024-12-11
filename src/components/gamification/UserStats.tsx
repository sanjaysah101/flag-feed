import { getUserStats } from "@/lib/services/gamification.service";

import { Card, CardContent, CardHeader, CardTitle } from "../ui";
import { Points } from "./Points";

export const UserStats = async ({ userId }: { userId: string }) => {
  const stats = await getUserStats(userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <Points userId={userId} initialPoints={stats.points} />
      </CardContent>
    </Card>
  );
};
