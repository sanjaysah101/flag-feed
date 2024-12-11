"use client";

import { useEffect, useState } from "react";

import { useVariableValue } from "@devcycle/nextjs-sdk";

import { useToast } from "@/hooks";
import { trackFeatureUsage } from "@/lib/devcycle/analytics";
import { FLAGS } from "@/lib/devcycle/flags";

// import { generateQuestions, saveQuizResult } from "@/lib/services/quiz.service";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
}

export const Quiz = ({ articleId, userId }: { articleId: string; userId: string }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdaptive = useVariableValue(FLAGS.LEARNING.ADAPTIVE_QUIZZES, false);
  const { toast } = useToast();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // const generatedQuestions = await generateQuestions(articleId);
        const generatedQuestions: Question[] = [
          {
            id: "1",
            text: "What is the main topic discussed in the article?",
            options: ["Technology Trends", "Programming Basics", "Web Development"],
            correctAnswer: "Technology Trends",
            difficulty: "easy",
          },
        ];
        setQuestions(generatedQuestions);
      } catch (error) {
        toast({
          title: "Error",
          description: (error as Error).message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [articleId, toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-[200px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const handleAnswer = async (answer: string) => {
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      await trackFeatureUsage({
        featureId: FLAGS.LEARNING.ADAPTIVE_QUIZZES,
        userId,
        value: true,
        metadata: {
          questionId: questions[currentQuestion].id,
          articleId,
          difficulty: questions[currentQuestion].difficulty,
        },
      });
    }
    setCurrentQuestion(currentQuestion + 1);

    // Adjust next question difficulty if adaptive mode is enabled
    if (isAdaptive && questions[currentQuestion + 1]) {
      const nextQuestion = questions[currentQuestion + 1];
      nextQuestion.difficulty = score > questions.length / 2 ? "hard" : "easy";
    }
  };

  if (currentQuestion >= questions.length) {
    // Save quiz result when completed
    // saveQuizResult(userId, articleId, score);

    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Your score: {score}/{questions.length}
          </p>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Check</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{question.text}</p>
        <div className="grid gap-2">
          {question.options.map((option) => (
            <Button key={option} variant="outline" onClick={() => handleAnswer(option)}>
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
