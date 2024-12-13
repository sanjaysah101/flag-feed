import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Button } from "../ui/button";

export const LandingHero = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Level Up Your Tech Learning with{" "}
          <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Feature Flags</span>
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
          FlagFeed combines personalized RSS feeds with gamification, powered by DevCycle feature flags and Supabase, to
          make staying updated with tech content engaging and fun.
        </p>
      </div>

      <div className="mt-8 flex gap-4">
        <Link href="/auth/signin">
          <Button size="lg">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="https://github.com/sanjaysah101/flag-feed" target="_blank">
          <Button size="lg" variant="outline">
            View on GitHub
          </Button>
        </Link>
      </div>
    </div>
  );
};
