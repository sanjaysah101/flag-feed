"use client";

import { useState } from "react";

import { useVariableValue } from "@devcycle/nextjs-sdk";
import type { QuizCompetition, QuizParticipant } from "@prisma/client";

import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
import { trackFeatureUsage } from "@/lib/devcycle/analytics";
import { FLAGS } from "@/lib/devcycle/flags";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

interface LiveQuizProps {
  articleId: string;
  userId: string;
}

export const LiveQuiz = ({ articleId, userId }: LiveQuizProps) => {
  const [competition, setCompetition] = useState<QuizCompetition | null>(null);
  const [participants, setParticipants] = useState<QuizParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isLiveQuizEnabled = useVariableValue(FLAGS.LEARNING.LIVE_QUIZZES, false);

  useSupabaseRealtime<QuizParticipant>(
    {
      event: "INSERT",
      table: "QuizParticipant",
      filter: competition ? `competitionId=eq.${competition.id}` : "",
    },
    (newParticipant) => {
      setParticipants((prev) => [...prev, newParticipant]);
      trackFeatureUsage({
        featureId: FLAGS.LEARNING.LIVE_QUIZZES,
        userId,
        value: true,
        metadata: {
          competitionId: competition?.id,
          participantCount: String(participants.length + 1),
        },
      });
    }
  );

  const handleCreateCompetition = async () => {
    setIsLoading(true);
    try {
      const newCompetition = await fetch("/api/quiz/competition", {
        method: "POST",
        body: JSON.stringify({ articleId }),
      });
      const data = await newCompetition.json();
      setCompetition(data.competition);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to create competition:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCompetition = async () => {
    if (!competition) return;
    setIsLoading(true);
    try {
      await fetch("/api/quiz/competition", {
        method: "PUT",
        body: JSON.stringify({ competitionId: competition.id }),
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to join competition:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLiveQuizEnabled) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Quiz Competition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!competition ? (
          <Button onClick={handleCreateCompetition} disabled={isLoading}>
            Create Competition
          </Button>
        ) : (
          <>
            <div className="flex justify-between">
              <span>Status: {competition.status}</span>
              <span>Participants: {participants.length}</span>
            </div>
            <Progress value={(participants.length / 4) * 100} className="h-2" />
            {!participants.find((p) => p.userId === userId) && (
              <Button onClick={handleJoinCompetition} disabled={isLoading}>
                Join Competition
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
