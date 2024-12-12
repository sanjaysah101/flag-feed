"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { FeedCategory } from "@prisma/client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { useToast } from "@/hooks";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export const CategorySelection = () => {
  const [selectedCategories, setSelectedCategories] = useState<FeedCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleComplete = async () => {
    if (selectedCategories.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one category",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscribedCategories: selectedCategories,
          onboardingCompleted: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      toast({
        title: "Success",
        description: "Preferences saved successfully",
      });

      router.push("/feeds");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save preferences",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Welcome to RSS Reader!</h2>
        <p className="text-muted-foreground">Select categories that interest you</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Object.values(FeedCategory).map((category) => (
          <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className="w-full cursor-pointer p-4 text-center"
              onClick={() => {
                setSelectedCategories((prev) =>
                  prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
                );
              }}
            >
              {category.replace(/_/g, " ")}
            </Badge>
          </motion.div>
        ))}
      </div>

      <Button className="w-full" disabled={selectedCategories.length === 0 || isSubmitting} onClick={handleComplete}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Continue to Feeds"
        )}
      </Button>
    </div>
  );
};
