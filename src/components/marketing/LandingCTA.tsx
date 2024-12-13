import Link from "next/link";

import { Button } from "../ui/button";

export const LandingCTA = () => {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Transform Your Learning?</h2>
      <p className="mx-auto max-w-[600px] text-muted-foreground">
        Join FlagFeed today and experience a new way of staying updated with tech content.
      </p>
      <Link href="/auth/signin">
        <Button size="lg" className="mt-4">
          Get Started for Free
        </Button>
      </Link>
    </div>
  );
};
