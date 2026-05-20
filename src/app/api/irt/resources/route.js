import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getAIResponse } from "@/lib/ai";

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

function buildResourcesPrompt(weakSpot) {
  return `
You are a senior engineering mentor curating learning resources for a developer.

Their weak spot:
Topic: ${weakSpot.topic}
Description: ${weakSpot.description}

Your job is to give them the most useful free resources to master this specific topic.

Return STRICTLY this JSON format, nothing outside it:

{
  "resources": [
    {
      "title": "Resource title",
      "url": "https://...",
      "type": "article" | "video" | "documentation"
    }
  ]
}

Rules:
- Return 4-6 resources total
- Mix types: at least one video, one documentation.
- Only real, existing, free URLs — no paywalled content
- Prioritize: MDN, official docs, freeCodeCamp, JavaScript.info, The Odin Project, Kent C. Dodds blog, web.dev, Youtube tutorials
- Order from beginner-friendly to advanced
- Every resource must be directly relevant to "${weakSpot.topic}", not the general category
- Do not return anything outside the JSON
  `;
}

function parseResourcesResponse(text) {
  try {
    let cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);

    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed.resources) ? parsed.resources : [];
  } catch (error) {
    console.error("Resources parsing failed:", error);
    return [];
  }
}