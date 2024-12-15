"use client";

import Link from "next/link";

import { Github } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button, Card, Logo } from "@/components/ui";

export default function SignIn() {
  const handleSignIn = async () => {
    await signIn("github", {
      callbackUrl: "/dashboard",
      redirect: true,
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo and Title */}
          <div className="flex flex-col items-center space-y-2">
            <Logo />
            <h1 className="text-3xl font-bold tracking-tight">Welcome to FlagFeed</h1>
            <p className="text-center text-muted-foreground">Your personalized tech learning journey starts here</p>
          </div>

          {/* Sign In Button */}
          <div className="w-full space-y-4">
            <Button
              onClick={handleSignIn}
              size="lg"
              className="relative w-full overflow-hidden bg-gradient-to-r from-primary to-blue-600 transition-transform hover:scale-[1.02]"
            >
              <Github className="mr-2 h-5 w-5" />
              Continue with GitHub
            </Button>

            {/* Features List */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-center text-sm text-muted-foreground">
              <div className="space-y-2 rounded-lg border p-4">
                <div className="text-xl">📚</div>
                <p>Curated Tech RSS Feeds</p>
              </div>
              <div className="space-y-2 rounded-lg border p-4">
                <div className="text-xl">🎮</div>
                <p>Learn & Earn Points</p>
              </div>
              <div className="space-y-2 rounded-lg border p-4">
                <div className="text-xl">🚀</div>
                <p>Progressive Features</p>
              </div>
              <div className="space-y-2 rounded-lg border p-4">
                <div className="text-xl">✨</div>
                <p>Real-time Updates</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Footer Links */}
      <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
        <Link href="/privacy" className="hover:text-primary">
          Privacy
        </Link>
        <span>•</span>
        <Link href="/terms" className="hover:text-primary">
          Terms
        </Link>
        <span>•</span>
        <Link href="https://github.com/sanjaysah101/flag-feed" target="_blank" className="hover:text-primary">
          GitHub
        </Link>
      </div>
    </div>
  );
}
