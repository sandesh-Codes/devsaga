import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export async function getAIResponse(prompt) {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })

    const result = await model.generateContent(prompt)

    const response = await result.response

    const text = response.text()

    return text
}