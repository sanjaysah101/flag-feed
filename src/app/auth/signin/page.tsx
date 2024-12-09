"use client";

import { Github } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function SignIn() {
  const handleSignIn = async () => {
    await signIn("github", {
      callbackUrl: "/dashboard",
      redirect: true,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 rounded-lg p-6 shadow-lg">
        <h1 className="text-center text-2xl font-bold">Sign in to FlagFeed</h1>
        <Button onClick={handleSignIn} className="w-full" variant="outline">
          <Github className="mr-2 h-4 w-4" />
          Sign in with GitHub
        </Button>
      </div>
    </div>
  );
}
