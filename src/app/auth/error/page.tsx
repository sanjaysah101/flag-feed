"use client";

import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-4 rounded-lg p-6 shadow-lg">
        <h1 className="text-center text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="text-center text-gray-600">
          {error === "OAuthCreateAccount"
            ? "There was a problem creating your account. Please try again."
            : "An error occurred during authentication."}
        </p>
        {process.env.NODE_ENV === "development" && (
          <pre className="mt-4 rounded bg-gray-100 p-4">
            <code>{JSON.stringify({ error }, null, 2)}</code>
          </pre>
        )}
        <Button onClick={() => (window.location.href = "/auth/signin")} className="w-full">
          Try Again
        </Button>
      </div>
    </div>
  );
}
