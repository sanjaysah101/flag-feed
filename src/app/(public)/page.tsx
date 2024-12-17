import { LandingHero } from "@/components/marketing/LandingHero";

import { LandingCTA } from "../../components/marketing/LandingCTA";
import { LandingDemo } from "../../components/marketing/LandingDemo";
import { LandingFeatures } from "../../components/marketing/LandingFeatures";
import { LandingTechStack } from "../../components/marketing/LandingTechStack";

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto space-y-8 py-24 md:py-32">
          <LandingHero />
        </section>

        {/* Features Grid */}
        <section className="border-t bg-muted/50">
          <div className="container mx-auto py-20">
            <LandingFeatures />
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="container mx-auto py-20">
          <LandingDemo />
        </section>

        {/* Tech Stack */}
        <section className="border-t bg-muted/50">
          <div className="container mx-auto py-20">
            <LandingTechStack />
          </div>
        </section>

        {/* Call to Action */}
        <section className="border-t">
          <div className="container mx-auto py-20">
            <LandingCTA />
          </div>
        </section>
      </main>
    </div>
  );
}
