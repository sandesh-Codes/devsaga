export function buildDebugPrompt({ error, code, context, category }) {
  return `
    You are a senior software engineer helping debug issues.

    Analyze the following:

    Error: 
    ${error}

    Code:
    ${code}

    Context:
    ${context || "Not provided"}

    Category:
    ${category}

    ---

    Return your response STRICTLY in JSON format with the following structure:

    {
     "rootCause": "string",
     "explanation": "string (simple explanation)",
     "steps": ["step 1", "step 2"],
     "fixedCode": "string",
     "mistakes": ["mistake 1", "mistake 2"]
    }

    Rules:
    - First identify the root cause clearly
    - Then explain simply
    - Then give step-by-step fix
    - Provide corrected code
    - Mention common mistakes
    - Do not return anything outside JSON
    `
}
