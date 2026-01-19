import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, DailyPlan, DayOfWeek, ShoppingSuggestion } from "../types";

// Helper to remove base64 header if present
const cleanBase64 = (base64: string) => {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
};

export const generateWeeklyPlan = async (prefs: UserPreferences): Promise<DailyPlan[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const promptText = `
    Act as a professional stylist for a college student.
    Generate a 7-day outfit plan (Monday to Sunday).
    
    Student Profile:
    - Gender: ${prefs.gender}
    - College Days: ${prefs.collegeDays.join(", ")}
    - College Hours: ${prefs.startTime} to ${prefs.endTime}
    - Season: ${prefs.season}
    - Style Preference: ${prefs.style}
    - Additional Notes: ${prefs.additionalInstructions}
    
    Guidance:
    - For college days, ensure the outfit is comfortable for the duration and appropriate for a campus setting.
    - For non-college days, suggest outfits suitable for studying at home, running errands, or relaxing, or going out if it's the weekend.
    - Consider the season for fabric choices and layering.
    - Suggest accessories (bags, jewelry, hats, tech).
    
    Output JSON Schema requirements:
    - Return an array of objects for each day of the week.
    - Items should be descriptive (e.g., "Oversized Beige Hoodie", "Navy Pleated Skirt").
  `;

  const parts: any[] = [{ text: promptText }];

  if (prefs.userPhotoBase64) {
    parts.push({
      inlineData: {
        data: cleanBase64(prefs.userPhotoBase64),
        mimeType: "image/jpeg", // Assuming jpeg/png for simplicity, SDK handles most
      },
    });
    parts.push({ text: "Also analyze the uploaded photo of the student to infer their body type, skin tone, and current vibe to tailor the color palette and fit recommendations accordingly." });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: parts,
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING, enum: Object.values(DayOfWeek) },
            hasCollege: { type: Type.BOOLEAN },
            outfitItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['top', 'bottom', 'outerwear', 'shoes', 'accessory', 'other'] },
                  color: { type: Type.STRING },
                },
                required: ['id', 'name', 'type']
              }
            },
            reasoning: { type: Type.STRING },
            weatherTip: { type: Type.STRING },
          },
          required: ['day', 'hasCollege', 'outfitItems', 'reasoning', 'weatherTip']
        }
      }
    }
  });

  if (response.text) {
    try {
      return JSON.parse(response.text) as DailyPlan[];
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      throw new Error("Failed to generate plan. Please try again.");
    }
  }
  throw new Error("No response from AI.");
};

export const getShoppingSuggestions = async (query: string): Promise<ShoppingSuggestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Using Gemini to search for products
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find 3 distinct, purchasable fashion items matching this description: "${query}". Return the product name, an approximate price, and the merchant name. If specific links aren't found, find the best search queries.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const suggestions: ShoppingSuggestion[] = [];

  // Parse grounding chunks to find potential product links
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

  if (groundingChunks) {
    groundingChunks.forEach((chunk) => {
      if (chunk.web) {
        suggestions.push({
            title: chunk.web.title || "Product Result",
            link: chunk.web.uri || "#",
            source: "Google Search",
            price: "Check Link"
        });
      }
    });
  }
  
  // If we didn't get structured grounding chunks, fallback to parsing the text (simulated for reliability if tools fail)
  if (suggestions.length === 0) {
      // Basic fallback to just search Google Shopping
      const searchUrl = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`;
      suggestions.push({
          title: `Search for "${query}"`,
          link: searchUrl,
          source: "Google Shopping",
          price: "View Prices"
      });
  }

  // Deduplicate by link
  const uniqueSuggestions = suggestions.filter((item, index, self) =>
    index === self.findIndex((t) => (
      t.link === item.link
    ))
  );

  return uniqueSuggestions.slice(0, 4);
};