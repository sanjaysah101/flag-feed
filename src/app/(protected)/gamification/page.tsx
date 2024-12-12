import { auth } from "@/auth";
import { Achievements } from "@/components/gamification/AchievementsServer";
import { DailyChallenges } from "@/components/gamification/DailyChallenges";
import { GamificationOverview } from "@/components/gamification/GamificationOverview";
import { Leaderboard } from "@/components/gamification/Leaderboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";

export default async function GamificationPage() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <div className="container space-y-8 py-8">
      <GamificationOverview />

      <Tabs defaultValue="challenges" className="space-y-4">
        <TabsList>
          <TabsTrigger value="challenges">Daily Challenges</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        <TabsContent value="challenges">
          <DailyChallenges />
        </TabsContent>
        <TabsContent value="achievements">
          <Achievements userId={session.user.id} />
        </TabsContent>
        <TabsContent value="leaderboard">
          <Leaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
