"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Feeds",
    href: "/feeds",
  },
  {
    title: "Articles",
    href: "/articles",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant="ghost"
            className={cn("w-full justify-start", pathname === item.href && "bg-muted hover:bg-muted")}
          >
            {item.title}
          </Button>
        </Link>
      ))}
    </nav>
  );
};
