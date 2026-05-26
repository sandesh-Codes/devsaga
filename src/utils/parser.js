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
      category: parsed.category || "Bug",
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
      weakArea: parsed.weakArea || "General Programming",
    };
  } catch (error) {
    console.log("Parsing failed: ", error);
    return {
      rootCause: "Parsing error",
      explanation: text,
      steps: [],
      fixedCode: "",
      mistakes: [],
      weakArea: "General Programming",
    };
  }
}


export function parseAnalysisResponse(text) {
  try {
    let cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);

    const parsed = JSON.parse(cleaned);
    const spots = Array.isArray(parsed.weakSpots) ? parsed.weakSpots : [];
    return deduplicateWeakSpots(spots);
  } catch (error) {
    console.error("Analysis parsing failed:", error);
    return [];
  }
}

export function deduplicateWeakSpots(spots) {
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

export function parseResourcesResponse(text) {
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


export function parseTestResponse(text) {
  try {
    let cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);

    const parsed = JSON.parse(cleaned);

    if (!parsed.mcq || !parsed.codeProblem) return null;

    return {
      mcq: parsed.mcq,
      codeProblem: parsed.codeProblem,
    };
  } catch (error) {
    console.error("Test parsing failed:", error);
    return null;
  }
}

export function parseReviewResponse(text) {
  try {
    let cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);

    const parsed = JSON.parse(cleaned);

    if (!parsed.feedback || parsed.score === undefined) return null;

    return {
      feedback: parsed.feedback,
      score: parsed.score,
    };
  } catch (error) {
    console.error("Review parsing failed:", error);
    return null;
  }
}