import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getAIResponse } from "@/lib/ai";
import { buildResourcesPrompt } from "@/lib/prompts";
import { parseResourcesResponse } from "@/utils/parser";

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
      include: { resources: true },
    });

    if (!weakSpot) {
      return Response.json({ error: "Weak spot not found" }, { status: 404 });
    }

    // if resources already generated, return them
    if (weakSpot.resources.length > 0) {
      return Response.json({ resources: weakSpot.resources });
    }

    const prompt = buildResourcesPrompt(weakSpot);
    const aiText = await getAIResponse(prompt);
    const resources = parseResourcesResponse(aiText);

    // save resources to DB
    await prisma.resource.createMany({
      data: resources.map((r) => ({
        title: r.title,
        url: r.url,
        type: r.type,
        weakSpotId: weakSpot.id,
      })),
    });

    const saved = await prisma.resource.findMany({
      where: { weakSpotId: weakSpot.id },
    });

    return Response.json({ resources: saved });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Resources generation failed" }, { status: 500 });
  }
}
