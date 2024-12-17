import { prisma } from "@/lib/db/prisma";
import { supabase } from "@/lib/supabase/client";

export const createQuizCompetition = async (articleId: string) => {
  const competition = await prisma.quizCompetition.create({
    data: {
      articleId,
      status: "waiting",
      startTime: new Date(),
    },
  });

  // Notify through Supabase realtime
  await supabase.from("QuizCompetition").insert([{ ...competition }]);

  return competition;
};

export const joinQuizCompetition = async (competitionId: string, userId: string) => {
  const participant = await prisma.quizParticipant.create({
    data: {
      competitionId,
      userId,
    },
  });

  return participant;
};

export const submitQuizAnswer = async (competitionId: string, userId: string, score: number) => {
  const participant = await prisma.quizParticipant.update({
    where: {
      id: `${competitionId}_${userId}`,
    },
    data: {
      score,
      completedAt: new Date(),
    },
  });

  return participant;
};

export const getQuizCompetition = async (competitionId: string) => {
  const competition = await prisma.quizCompetition.findUnique({
    where: { id: competitionId },
  });
  return competition;
};
