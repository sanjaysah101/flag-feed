"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigationItems } from "@/config/nav";
import { cn } from "@/lib/utils";

export const MainNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-6 lg:space-x-8">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};
