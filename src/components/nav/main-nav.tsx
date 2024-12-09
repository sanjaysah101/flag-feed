"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { User } from "@prisma/client";

import { cn } from "@/lib/utils";

export const MainNav = ({ user }: { user: User | null }) => {
  const pathname = usePathname();

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
  ];

  const protectedLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/feeds", label: "Feeds" },
    { href: "/learn", label: "Learn" },
    { href: "/profile", label: "Profile" },
  ];

  const links = user ? [...publicLinks, ...protectedLinks] : publicLinks;

  return (
    <nav className="flex items-center space-x-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === link.href ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
