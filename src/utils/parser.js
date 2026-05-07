export function parseAIResponse(text) {
  try {
    let cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No JSON found");
    }

    cleaned = cleaned.slice(firstBrace, lastBrace + 1);

    const parsed = JSON.parse(cleaned);

    return {
      rootCause: parsed.rootCause || "",
      explanation: parsed.explanation || "",
      steps: Array.isArray(parsed.steps) ? parsed.steps : [],
      fixedCode: parsed.fixedCode || "",
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
    };
  } catch (error) {
    console.log("Parsing failed: ", error);

    return {
      rootCause: "Parsing error",
      explanation: text,
      steps: [],
      fixedCode: "",
      mistakes: [],
    };
  }
}
