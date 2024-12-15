"use client";

import { useRouter } from "next/navigation";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button, Card, Logo } from "@/components/ui";

export default function SignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center space-y-6">
          <Logo />

          {/* Content */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Sign out of FlagFeed?</h1>
            <p className="mt-2 text-muted-foreground">
              You can always sign back in anytime to continue your learning journey
            </p>
          </div>

          {/* Buttons */}
          <div className="flex w-full flex-col gap-3">
            <Button
              onClick={handleSignOut}
              size="lg"
              variant="destructive"
              className="relative overflow-hidden transition-transform hover:scale-[1.02]"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sign Out
            </Button>
            <Button
              onClick={handleCancel}
              size="lg"
              variant="outline"
              className="transition-transform hover:scale-[1.02]"
            >
              Return to FlagFeed
            </Button>
          </div>

          {/* Stats Summary */}
          <div className="mt-4 grid w-full grid-cols-2 gap-4 rounded-lg border p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">124</p>
              <p className="text-sm text-muted-foreground">Articles Read</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">1,450</p>
              <p className="text-sm text-muted-foreground">Points Earned</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
