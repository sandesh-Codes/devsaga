export function buildDebugPrompt({ error, code, context, category, simpler }) {
  return `
You are a senior software engineer and mentor analyzing a developer's bug.

Your job is two things:
1. Help them fix the bug
2. Identify what engineering concept they're struggling with

---

Error:
${error}

Code:
${code}

Context:
${context || "Not provided"}

Category:
${category}

Explain simply:
${simpler ? "Yes - explain for an absolute beginner." : "No - assume intermediate developer."}

---

Respond STRICTLY in this JSON format, nothing outside it:

{
  "rootCause": "One clear sentence explaining why this error happened",
  "explanation": "Plain explanation of what went wrong and why",
  "steps": ["Concrete step to fix", "..."],
  "fixedCode": "Complete corrected code snippet",
  "mistakes": ["Specific mistake the developer made", "..."],
  "weakArea": "The single most specific engineering concept this developer needs to learn"
}

For weakArea:
- Be specific, not generic. Not "JavaScript" but "Promise chaining and error propagation"
- Not "React" but "useEffect dependency array"
- Not "CSS" but "CSS flexbox alignment"
- It should reflect exactly what concept gap caused this bug
- 3-6 words max
  `;
}

export function buildAnalysisPrompt(sessions) {
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


export function buildResourcesPrompt(weakSpot) {
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



export function buildTestPrompt(weakSpot, debugSessions) {
  const sessionContext = debugSessions.map((s, i) => `
Session ${i + 1}:
- Error: ${s.error}
- Mistakes: ${s.response?.mistakes?.join(", ") || ""}
- Root Cause: ${s.response?.rootCause || ""}
  `.trim()).join("\n\n");

  return `
You are a senior engineering mentor generating a real-world assessment for a developer.

Their weak spot:
Topic: ${weakSpot.topic}
Description: ${weakSpot.description}

Their actual mistakes from debugging history:
${sessionContext || "No specific sessions found — generate based on the weak spot topic."}

---

Your job is to generate a test that makes them THINK, not recall.
This is not a quiz. This is a real-world assessment that reveals whether they truly understand the concept or just memorized syntax.

Generate exactly this JSON structure, nothing outside it:

{
  "mcq": [
    {
      "question": "string",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correct": "A" | "B" | "C" | "D",
      "explanation": "string"
    }
  ],
  "codeProblem": {
    "title": "string",
    "scenario": "string",
    "brokenCode": "string",
    "task": "string",
    "hint": "string"
  }
}

MCQ Rules (3 questions):
- Every question must present a REAL SCENARIO, not a syntax check
- Question style must be one of:
  * "You have X real-world situation — which approach is correct and why"
  * "This code works locally but fails in production under X condition — what's wrong"
  * "Your teammate wrote this — what's the hidden problem and what would you change"
- Wrong options must be plausible — represent common real misconceptions, not obviously wrong answers
- The explanation must teach, not just confirm — explain WHY correct is right AND WHY others are wrong
- Never test syntax memorization, always test understanding and judgment

Code Problem Rules:
- scenario: Real-world context — a feature in a real app, a bug reported by a user, a production issue
- brokenCode: Actual broken code — realistic, the kind a junior dev would write, not toy examples
- task: Ask them to find the bug, fix it, AND explain why it was wrong
- hint: One subtle nudge toward the concept — not the answer
- The problem must be directly caused by the same root concept as their weak spot
- It should feel like something from a real job, not a textbook

Tone:
- Write like a senior engineer who genuinely wants this developer to grow
- No patronizing language
- No generic filler questions

Do not return anything outside the JSON.
  `;
}
