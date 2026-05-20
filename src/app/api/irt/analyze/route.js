import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getAIResponse } from "@/lib/ai";

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
    const deduplicated = deduplicateWeakSpots(weakSpots);

    // upsert weak spots — update if exists, create if not
    for (const spot of deduplicated) {
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

function buildAnalysisPrompt(sessions) {
  const summary = sessions.map((s, i) => {
    const response = s.response;
    return `
Session ${i + 1}:
- Error: ${s.error}
- Category: ${s.category}
- Weak Area: ${s.weakArea || "Unknown"}
- Root Cause: ${response?.rootCause || ""}
- Mistakes: ${response?.mistakes?.join(", ") || ""}
    `.trim();
  }).join("\n\n");

  return `
You are a senior engineering mentor analyzing a developer's debugging history.

Here are their recent debug sessions:

${summary}

---

Identify their top weak spots as a developer. Cluster similar issues together — do not create duplicate topics.

Return STRICTLY this JSON format, nothing outside it:

{
  "weakSpots": [
    {
      "topic": "Specific concept name (3-6 words)",
      "description": "2-3 sentences explaining what they struggle with and why it matters",
      "confidence": <1-10, how confident you are this is a real pattern>,
      "sessionCount": <how many sessions show evidence of this weak spot>
    }
  ]
}

- Cluster aggressively — if two topics are about the same underlying concept, merge them into one
- Ask yourself: would a mentor teach these separately? If no, merge them
- Max 5 weak spots, but fewer is better if patterns overlap
- Never create two weak spots from the same root concept

Rules:
- Cluster aggressively — same root concept = one weak spot, not two
- Max 5 weak spots, fewer is better if patterns overlap  
- Only include patterns appearing in 2+ sessions, skip one-offs
- Topics must be specific: "useEffect dependency array" not "React"
- Order by confidence descending
- Do not return anything outside the JSON
  `;
}

function parseAnalysisResponse(text) {
  try {
    let cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);

    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed.weakSpots) ? parsed.weakSpots : [];
  } catch (error) {
    console.error("Analysis parsing failed:", error);
    return [];
  }

  function deduplicateWeakSpots(spots) {
  const seen = [];
  
  for (const spot of spots) {
    const isDuplicate = seen.some(s => {
      const a = s.topic.toLowerCase();
      const b = spot.topic.toLowerCase();
      const aWords = a.split(" ").filter(w => w.length > 3);
      const bWords = b.split(" ").filter(w => w.length > 3);
      const overlap = aWords.filter(w => bWords.includes(w));
      return overlap.length >= 2;
    });

    if (!isDuplicate) seen.push(spot);
  }

  return seen;
}
}