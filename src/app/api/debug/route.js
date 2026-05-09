import { buildDebugPrompt } from "@/lib/prompt";
import { getAIResponse } from "@/lib/ai";
import { parseAIResponse } from "@/utils/parser";
import { prisma } from "@/lib/prisma"

export async function POST(req){
    try {
        const body = await req.json()
        
        const prompt = buildDebugPrompt(body)

        const aiText = await getAIResponse(prompt)

        const parsed = parseAIResponse(aiText)

        await prisma.debugSession.create({
            data: {
                error: body.error,
                code: body.code,
                context: body.context,
                category: body.category,
                response: parsed
            }
        })

        return Response.json(parsed)

    } catch (error) {
        console.error(error);
        return Response.json(
            {error: "AI request failed"},
            {status: 500}
        )
    }
}