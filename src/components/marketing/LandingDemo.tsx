"use client";

import { useState } from "react";

import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export const LandingDemo = () => {
  const [activeTab, setActiveTab] = useState("feeds");

  return (
    <div className="space-y-12">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">See It in Action</h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground">
          Experience how FlagFeed makes tech learning more engaging and personalized.
        </p>
      </div>

      <Card className="overflow-hidden border-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start rounded-none border-b bg-muted/50 p-0">
            <TabsTrigger value="feeds" className="rounded-none px-6 py-3">
              RSS Feeds
            </TabsTrigger>
            <TabsTrigger value="gamification" className="rounded-none px-6 py-3">
              Gamification
            </TabsTrigger>
            <TabsTrigger value="features" className="rounded-none px-6 py-3">
              Feature Flags
            </TabsTrigger>
          </TabsList>
          <div className="p-6">
            <TabsContent value="feeds">
              {/* Add feed demo content */}
              <div className="h-[400px]">Feed demo content here</div>
            </TabsContent>
            <TabsContent value="gamification">
              {/* Add gamification demo content */}
              <div className="h-[400px]">Gamification demo content here</div>
            </TabsContent>
            <TabsContent value="features">
              {/* Add feature flags demo content */}
              <div className="h-[400px]">Feature flags demo content here</div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};
