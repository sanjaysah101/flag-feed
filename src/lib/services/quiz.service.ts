import { prisma } from "@/lib/db/prisma";

import { getVariableValue } from "../devcycle/config";
import { FLAGS } from "../devcycle/flags";

interface GeneratedQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
}

export const generateQuestions = async (articleId: string): Promise<GeneratedQuestion[]> => {
  const article = await prisma.feedItem.findUnique({
    where: { id: articleId },
    select: { title: true, content: true, description: true },
  });

  if (!article) {
    throw new Error("Article not found");
  }

  const isAdaptive = await getVariableValue(FLAGS.LEARNING.ADAPTIVE_QUIZZES, false);

  // Basic questions for now - in a real app, you'd use NLP/AI here
  const questions: GeneratedQuestion[] = [
    {
      id: "1",
      text: `What is the main topic discussed in "${article.title}"?`,
      options: [article.title, "Technology Trends", "Programming Basics", "Web Development"],
      correctAnswer: article.title,
      difficulty: "easy",
    },
    {
      id: "2",
      text: "Based on the article, which statement is true?",
      options: [article.description || "Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswer: article.description || "Option 1",
      difficulty: isAdaptive ? "medium" : "easy",
    },
  ];

  return questions;
};

export const saveQuizResult = async (userId: string, articleId: string, score: number) => {
  await prisma.quizResult.create({
    data: {
      userId,
      articleId,
      score,
      completedAt: new Date(),
    },
  });
};
