import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getAIResponse } from "@/lib/ai";
import { parseTestResponse } from "@/utils/parser";
import { buildTestPrompt } from "@/lib/prompts";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { weakSpotId } = await req.json();

    if (!weakSpotId) {
      return Response.json({ error: "weakSpotId is required" }, { status: 400 });
    }

    const weakSpot = await prisma.weakSpot.findFirst({
      where: {
        id: weakSpotId,
        userId: session.user.id,
      },
      include: { test: true },
    });

    if (!weakSpot) {
      return Response.json({ error: "Weak spot not found" }, { status: 404 });
    }

    // if test already generated, return it
    if (weakSpot.test) {
      return Response.json({ test: weakSpot.test });
    }

    // fetch their actual debug sessions for this weak area
    const debugSessions = await prisma.debugSession.findMany({
      where: {
        userId: session.user.id,
        weakArea: { contains: weakSpot.topic, mode: "insensitive" },
      },
      select: {
        error: true,
        response: true,
      },
      take: 10,
    });

    const prompt = buildTestPrompt(weakSpot, debugSessions);
    const aiText = await getAIResponse(prompt);
    const testData = parseTestResponse(aiText);

    if (!testData) {
      return Response.json({ error: "Test generation failed" }, { status: 500 });
    }

    const test = await prisma.test.create({
      data: {
        mcq: testData.mcq,
        codeProblem: testData.codeProblem,
        weakSpotId: weakSpot.id,
      },
    });

    return Response.json({ test });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Test generation failed" }, { status: 500 });
  }
}
