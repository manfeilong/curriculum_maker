import { GoogleGenerativeAI } from "@google/generative-ai";

export type Strategy = 'CHALLENGING' | 'DIVERSE' | 'BALANCED';

export async function classifyStrategy(userPrompt: string): Promise<Strategy> {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Gemini API Key present:", !!apiKey);

    if (!apiKey) {
        console.warn("No GEMINI_API_KEY found, defaulting to BALANCED");
        return 'BALANCED';
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `
    You are a course scheduling assistant.
    Analyze the user's description of their desired semester vibe and classify it into one of three strategies:
    1. CHALLENGING: User wants to work hard, take many required courses, or focus deeply on their major. Keywords: hard, push, core, rigorous.
    2. DIVERSE: User wants to explore, take general education courses, or learn new things outside their major. Keywords: explore, fun, variety, broad.
    3. BALANCED: User wants a mix, or doesn't specify a strong preference.

    User Input: "${userPrompt}"

    Respond ONLY with one of the following words: CHALLENGING, DIVERSE, BALANCED.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text().trim().toUpperCase();

        if (text.includes('CHALLENGING')) return 'CHALLENGING';
        if (text.includes('DIVERSE')) return 'DIVERSE';
        return 'BALANCED';
    } catch (error) {
        console.error("Gemini API error:", error);
        return 'BALANCED';
    }
}
