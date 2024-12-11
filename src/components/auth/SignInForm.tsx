"use client";

import { Github } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const SignInForm = () => {
  const handleSignIn = async () => {
    await signIn("github", {
      callbackUrl: "/dashboard",
      redirect: true,
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">Sign in to FlagFeed</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSignIn} className="w-full" variant="outline">
          <Github className="mr-2 h-4 w-4" />
          Sign in with GitHub
        </Button>
      </CardContent>
    </Card>
  );
};
