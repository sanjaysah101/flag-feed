import { useEffect, useState } from "react";

import { FeedCategory } from "@prisma/client";
import { Plus, X } from "lucide-react";

import { useToast } from "@/hooks";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export const CategoryManagement = () => {
  const [categories, setCategories] = useState<FeedCategory[]>([]);
  const [subscribedCategories, setSubscribedCategories] = useState<FeedCategory[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/feeds/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const { categories, subscribedCategories } = await response.json();
        setCategories(categories);
        setSubscribedCategories(subscribedCategories);
      } catch (error) {
        toast({
          title: "Error",
          description: (error as Error).message || "Failed to load categories",
          variant: "destructive",
        });
      }
    };
    fetchCategories();
  }, [toast]);

  const handleSubscribe = async (category: FeedCategory) => {
    try {
      const response = await fetch("/api/feeds/categories/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });

      if (!response.ok) throw new Error("Failed to subscribe to category");

      setSubscribedCategories((prev) => [...prev, category]);
      toast({
        title: "Success",
        description: `Subscribed to ${category.replace(/_/g, " ")}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleUnsubscribe = async (category: FeedCategory) => {
    try {
      const response = await fetch("/api/feeds/categories/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });

      if (!response.ok) throw new Error("Failed to unsubscribe from category");

      setSubscribedCategories((prev) => prev.filter((c) => c !== category));
      toast({
        title: "Success",
        description: `Unsubscribed from ${category.replace(/_/g, " ")}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Manage Categories</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h4 className="mb-3 font-medium">Your Categories</h4>
          <div className="flex flex-wrap gap-2">
            {subscribedCategories.map((category) => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1">
                {category.replace(/_/g, " ")}
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => handleUnsubscribe(category)}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {subscribedCategories.length === 0 && (
              <p className="text-sm text-muted-foreground">No categories subscribed</p>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="mb-3 font-medium">Available Categories</h4>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((category) => !subscribedCategories.includes(category))
              .map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="flex cursor-pointer items-center gap-1 hover:bg-secondary"
                  onClick={() => handleSubscribe(category)}
                >
                  {category.replace(/_/g, " ")}
                  <Plus className="h-3 w-3" />
                </Badge>
              ))}
            {categories.length === subscribedCategories.length && (
              <p className="text-sm text-muted-foreground">No additional categories available</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
