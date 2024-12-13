import { BookOpen, Flag, Gamepad, Rss } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const features = [
  {
    title: "Curated Tech RSS Feeds",
    description: "Stay updated with personalized content from top tech sources, filtered to match your interests.",
    icon: Rss,
  },
  {
    title: "Progressive Feature Rollouts",
    description: "Experience new features gradually with DevCycle's feature flag system.",
    icon: Flag,
  },
  {
    title: "Gamified Learning",
    description: "Earn points, unlock achievements, and compete with others while learning.",
    icon: Gamepad,
  },
  {
    title: "Interactive Knowledge Checks",
    description: "Reinforce your learning with quizzes and real-time competitions.",
    icon: BookOpen,
  },
];

export const LandingFeatures = () => {
  return (
    <div className="space-y-12">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Everything You Need to Learn Better
        </h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground">
          Combine the power of RSS feeds with gamification and feature flags for an enhanced learning experience.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="relative overflow-hidden">
            <CardHeader>
              <div className="mb-2">
                <feature.icon className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
