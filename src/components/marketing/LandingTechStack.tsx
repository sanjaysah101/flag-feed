import Image from "next/image";

import { Card } from "../ui/card";

const technologies = [
  {
    name: "DevCycle",
    logo: "/logos/devcycle.svg",
    description: "Feature Flag Management",
  },
  {
    name: "Supabase",
    logo: "/logos/supabase.svg",
    description: "Database & Authentication",
  },
  {
    name: "Next.js",
    logo: "/logos/nextjs.svg",
    description: "React Framework",
  },
  // Add more tech stack items
];

export const LandingTechStack = () => {
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
            <Image src={tech.logo} alt={tech.name} width={48} height={48} />
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
