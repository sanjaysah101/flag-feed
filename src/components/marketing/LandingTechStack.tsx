"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { useTheme } from "next-themes";

import { Card } from "../ui/card";

const technologies = [
  {
    name: "DevCycle",
    logo: "/logos/devcycle.svg",
    description: "Feature Flag Management",
  },
  {
    name: "Supabase",
    logo: "/logos/supabase.png",
    description: "Database & Authentication",
  },
  {
    name: "Next.js",
    logoLight: "/logos/nextjs-black.svg",
    logoDark: "/logos/nextjs-white.svg",
    description: "React Framework",
  },
];

export const LandingTechStack = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-12">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Powered By Modern Tech</h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground">
          Built with cutting-edge technologies for reliability, scalability, and developer experience.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {technologies.map((tech) => (
          <Card key={tech.name} className="flex items-center gap-4 p-6">
            {tech.name === "Next.js" ? (
              mounted ? (
                <Image
                  src={(theme === "dark" ? tech.logoDark : tech.logoLight) || ""}
                  alt={tech.name}
                  width={48}
                  height={48}
                  className="dark:invert-0"
                />
              ) : null
            ) : (
              <Image src={tech.logo!} alt={tech.name} width={48} height={48} />
            )}
            <div>
              <h3 className="font-semibold">{tech.name}</h3>
              <p className="text-sm text-muted-foreground">{tech.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
