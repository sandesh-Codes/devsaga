import { buildDebugPrompt } from "@/lib/prompts";
import { getAIResponse } from "@/lib/ai";
import { parseAIResponse } from "@/utils/parser";
import { prisma } from "@/lib/db"

export async function POST(req) {
    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];

        const user = await prisma.user.findUnique({
            where: { apiToken: token},
            select: { id: true }
        });

        if ( !user ) {
             return Response.json({ error: "Invalid token" }, { status: 401 });
        }

        const body = await req.json();

        const prompt = buildDebugPrompt(body);
        const aiText = await getAIResponse(prompt);
        const parsed = parseAIResponse(aiText);

        await prisma.DebugSession.create({
            data: {
        error: body.error,
        code: body.code || "",
        category: parsed.category,
        response: parsed,
        weakArea: parsed.weakArea,
        userId: user.id
      }
    });
       
    return Response.json(parsed);

    } catch (error) {
         console.error(error);
    return Response.json({ error: "AI request failed" }, { status: 500 });
    }
}