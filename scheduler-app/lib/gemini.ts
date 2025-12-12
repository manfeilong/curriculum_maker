import { GoogleGenAI } from "@google/genai";

export interface UserPreferences {
    sweet: number; // Grading Leniency
    ai: number;
    tech: number;  // Engineering
    art: number;   // Art/Literature
    money: number; // Economics
    diff: number;  // Difficulty/Challenge
}

export async function classifyStrategy(userPrompt: string): Promise<UserPreferences> {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Gemini API Key present:", !!apiKey);

    const defaultPrefs: UserPreferences = { sweet: 5, ai: 5, tech: 5, art: 5, money: 5, diff: 5 };

    if (!apiKey) {
        console.warn("No GEMINI_API_KEY found, defaulting to BALANCED (5/5/5/5/5/5)");
        return defaultPrefs;
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
    You are a detailed course scheduling assistant.
    Analyze the user's description of their desired semester vibe and assign a score from 0 to 10 for each of the following dimensions:

    1. sweet: Desire for high grades / lenient grading (High = wants easy A).
    2. ai: Interest in Artificial Intelligence.
    3. tech: Interest in Engineering/Hardware/Coding.
    4. art: Interest in Art, Literature, Humanities.
    5. money: Interest in Economics, Business, Finance.
    6. diff: Desire for Challenge/Difficulty (High = wants hard courses).

    User Input: "${userPrompt}"

    Respond ONLY with a valid JSON object. Do not include markdown code blocks.
    Example: { "sweet": 8, "ai": 2, "tech": 5, "art": 5, "money": 0, "diff": 3 }
  `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        // The response format for the new SDK: response.text is a property
        const text = response.text || "{}";
        // Remove markdown blocks if present (just in case model adds them despite config)
        const cleanText = text.replace(/```json|```/g, '').trim();
        const json = JSON.parse(cleanText);

        return {
            sweet: Number(json.sweet) || 5,
            ai: Number(json.ai) || 5,
            tech: Number(json.tech) || 5,
            art: Number(json.art) || 5,
            money: Number(json.money) || 5,
            diff: Number(json.diff) || 5
        };
    } catch (error) {
        console.error("Gemini API error:", error);
        return defaultPrefs;
    }
}
