import { buildDebugPrompt } from "../../../lib/prompt";
import { getAIResponse } from "../../../lib/ai";
import { parseAIResponse } from "../../../utils/parser";

export async function POST(req){
    try {
        const body = await req.json()
        
        const prompt = buildDebugPrompt(body)

        const aiText = await getAIResponse(prompt)

        const parsed = parseAIResponse(aiText)

        return Response.json(parsed)

    } catch (error) {
        console.error(error);
        return Response.json(
            {error: "AI request failed"},
            {status: 500}
        )
    }
}