"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

interface QuizProps {
  articleId: string;
  userId: string;
}

export const Quiz = ({ articleId }: QuizProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement quiz loading logic
    setIsLoading(false);
  }, [articleId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Check</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Progress value={0} className="w-full" />
        ) : (
          <p className="text-muted-foreground">Quiz coming soon...</p>
        )}
      </CardContent>
    </Card>
  );
};
