import { buildDebugPrompt } from "@/lib/prompt";
import { getAIResponse } from "@/lib/ai";
import { parseAIResponse } from "@/utils/parser";
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req){
    try {
        const session = await getServerSession(authOptions)

        const body = await req.json()
        
        const prompt = buildDebugPrompt(body)

        const aiText = await getAIResponse(prompt)

        const parsed = parseAIResponse(aiText)

        if (session?.user?.id) {            
            await prisma.DebugSession.create({
                data: {
                    error: body.error,
                    code: body.code,
                    context: body.context,
                    category: body.category,
                    response: parsed,
                    userId: session.user.id
                }
            })
        }

        return Response.json(parsed)

    } catch (error) {
        console.error(error);
        return Response.json(
            {error: "AI request failed"},
            {status: 500}
        )
    }
}