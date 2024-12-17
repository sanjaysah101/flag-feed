import { NextResponse } from "next/server";

import { protectApiRoute } from "@/lib/auth/protect-api";
import {
  createQuizCompetition,
  getQuizCompetition,
  joinQuizCompetition,
} from "@/lib/services/quiz-competition.service";

export const POST = async (request: Request) => {
  const session = await protectApiRoute();
  if (session instanceof NextResponse) return session;

  try {
    const { articleId } = await request.json();
    const competition = await createQuizCompetition(articleId);
    return NextResponse.json({ competition });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create competition" },
      { status: 500 }
    );
  }
};

export const PUT = async (request: Request) => {
  const session = await protectApiRoute();
  if (session instanceof NextResponse) return session;

  try {
    const { competitionId } = await request.json();
    const participant = await joinQuizCompetition(competitionId, session.user.id);
    return NextResponse.json({ participant });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to join competition" },
      { status: 500 }
    );
  }
};

export const GET = async (request: Request) => {
  const session = await protectApiRoute();
  if (session instanceof NextResponse) return session;

  const { competitionId } = await request.json();
  const competition = await getQuizCompetition(competitionId);
  return NextResponse.json({ competition });
};
