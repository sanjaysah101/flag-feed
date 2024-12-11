import Link from "next/link";

import { Button } from "../ui/button";

export const LandingHero = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">Welcome to FlagFeed</h1>
      <p className="mt-4 text-xl text-muted-foreground">Your personalized learning platform with gamification</p>
      <div className="mt-8">
        <Link href="/auth/signin">
          <Button size="lg">Get Started</Button>
        </Link>
      </div>
    </div>
  );
};
