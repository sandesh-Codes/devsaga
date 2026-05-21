import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getAIResponse } from "@/lib/ai";
import { buildAnalysisPrompt } from "@/lib/prompts";
import { parseAnalysisResponse } from "@/utils/parser";

const MINIMUM_SESSIONS = 5;

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.debugSession.findMany({
      where: { userId: session.user.id },
      select: {
        error: true,
        category: true,
        weakArea: true,
        response: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (sessions.length < MINIMUM_SESSIONS) {
      return Response.json(
        {
          error: "NOT_ENOUGH_SESSIONS",
          message: `Debug at least ${MINIMUM_SESSIONS} times to unlock insights. You have ${sessions.length} so far.`,
          count: sessions.length,
          required: MINIMUM_SESSIONS,
        },
        { status: 400 }
      );
    }

    const prompt = buildAnalysisPrompt(sessions);
    const aiText = await getAIResponse(prompt);
    const weakSpots = parseAnalysisResponse(aiText);

    // upsert weak spots — update if exists, create if not
    for (const spot of weakSpots) {
      const existing = await prisma.weakSpot.findFirst({
        where: {
          userId: session.user.id,
          topic: spot.topic,
        },
      });

      if (existing) {
        await prisma.weakSpot.update({
          where: { id: existing.id },
          data: {
            description: spot.description,
            confidence: spot.confidence,
            sessionCount: spot.sessionCount,
            updatedAt: new Date(),
          },
        });
      } else {
        await prisma.weakSpot.create({
          data: {
            topic: spot.topic,
            description: spot.description,
            confidence: spot.confidence,
            sessionCount: spot.sessionCount,
            userId: session.user.id,
          },
        });
      }
    }

    const allWeakSpots = await prisma.weakSpot.findMany({
      where: { userId: session.user.id },
      include: { resources: true, testAttempts: true },
      orderBy: { confidence: "desc" },
    });

    return Response.json({ weakSpots: allWeakSpots });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}