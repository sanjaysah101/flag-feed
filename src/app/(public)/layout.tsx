import Link from "next/link";

import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";

import { auth } from "../../auth";
import ThemeToggle from "../../components/theme/ThemeToggle";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* Enhanced header for public pages */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 md:px-8 lg:px-10">
          <div className="flex items-center gap-6">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="font-mono text-lg font-bold text-primary-foreground">F</span>
              </div>
              <span className="hidden font-bold sm:inline-block">FlagFeed</span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden gap-6 md:flex">
              <Link
                href="https://github.com/sanjaysah101/flag-feed"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                GitHub
              </Link>
              <Link
                href="https://dev.to/challenges/devcycle"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                DevCycle Challenge
              </Link>
              <Link
                href="https://supabase.com/launch-week"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Supabase Launch Week
              </Link>
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="https://github.com/sanjaysah101/flag-feed" target="_blank">
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
            </Link>
            {session?.user ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <Link href="/auth/signin">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      {children}

      {/* Footer */}
      <footer className="mt-auto border-t">
        <div className="flex flex-col items-center justify-between gap-4 px-4 py-6 md:h-16 md:flex-row md:py-0">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            Built for{" "}
            <a
              href="https://dev.to/challenges/devcycle"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              DevCycle
            </a>{" "}
            and{" "}
            <a
              href="https://supabase.com/launch-week"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              Supabase
            </a>{" "}
            Hackathons
          </p>
          <div className="flex items-center gap-4">
            <Link href="/#" className="text-sm text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link href="/#" className="text-sm text-muted-foreground hover:text-primary">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
