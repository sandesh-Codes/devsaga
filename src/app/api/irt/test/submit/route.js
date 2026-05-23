import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getAIResponse } from "@/lib/ai";
import { buildReviewPrompt } from "@/lib/prompts";
import { parseReviewResponse } from "@/utils/parser";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { testId, mcqAnswers, codeAnswer } = await req.json();

    if (!testId || !mcqAnswers || !codeAnswer) {
      return Response.json({ error: "testId, mcqAnswers and codeAnswer are required" }, { status: 400 });
    }

    const test = await prisma.test.findFirst({
  where: { id: testId },
  include: {
    weakSpot: true
  }
});

if (!test || test.weakSpot.userId !== session.user.id || !test.weakSpot) {
  return Response.json({ error: "Test not found" }, { status: 404 });
}

 
    const prompt = buildReviewPrompt(test, mcqAnswers, codeAnswer);
    const aiText = await getAIResponse(prompt);
    const review = parseReviewResponse(aiText);

    if (!review) {
      return Response.json({ error: "Review generation failed" }, { status: 500 });
    }

    const attempt = await prisma.testAttempt.create({
      data: {
        testId: test.id,
        mcqAnswers,
        codeAnswer,
        aiFeedback: review.feedback,
        score: review.score,
      }
    });

    return Response.json({ attempt, review });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Submission failed" }, { status: 500 });
  }
}