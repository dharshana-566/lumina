
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (name: string, category: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a compelling 2-sentence marketing description for a product named "${name}" in the category "${category}". Focus on its premium quality and usefulness.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text || "Premium quality item perfect for your daily needs.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Premium quality item perfect for your daily needs.";
  }
};

export const generateProductImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};

export const analyzeStorePerformance = async (orderData: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these recent orders and provide a single short sentence of business insight: ${orderData}`,
    });
    return response.text || "Keep up the good work! Sales are steady.";
  } catch (error) {
    return "Keep up the good work! Sales are steady.";
  }
};
