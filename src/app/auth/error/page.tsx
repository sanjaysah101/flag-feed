"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const getErrorMessage = (error: string | null) => {
  switch (error) {
    case "Configuration":
      return "There's an issue with the authentication configuration. Please contact support.";
    case "OAuthCreateAccount":
      return "There was a problem creating your account. Please try again.";
    case "OAuthSignin":
      return "Error signing in with your provider. Please try again.";
    case "OAuthCallback":
      return "Error receiving response from authentication provider.";
    case "AccessDenied":
      return "You don't have permission to access this resource.";
    case "Verification":
      return "The verification link may have expired or is invalid.";
    default:
      return "An unexpected authentication error occurred. Please try again.";
  }
};

const ErrorContent = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <Card className="w-full max-w-md duration-500 animate-in fade-in zoom-in">
      <CardHeader className="space-y-4">
        <div className="mx-auto rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Authentication Error</h1>
          <p className="text-sm text-muted-foreground">{getErrorMessage(error)}</p>
        </div>
      </CardHeader>

      <CardContent>
        {process.env.NODE_ENV === "development" && (
          <pre className="overflow-auto rounded-lg bg-muted p-4 text-sm">
            <code>{JSON.stringify({ error }, null, 2)}</code>
          </pre>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 sm:flex-row">
        <Button asChild variant="default" className="w-full" size="lg">
          <Link href="/auth/signin">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full" size="lg">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function AuthError() {
  return (
    <div className="container flex min-h-[100dvh] flex-col items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        }
      >
        <ErrorContent />
      </Suspense>
    </div>
  );
}
