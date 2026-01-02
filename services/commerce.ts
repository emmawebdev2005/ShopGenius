import { GoogleGenAI as IntelligenceProvider, Type } from "@google/genai";
import { Product } from '../types';
import { SYSTEM_CONFIG } from '../constants';

// Service initialization
const provider = new IntelligenceProvider({ apiKey: process.env.API_KEY });

// Agent Persona Configuration
const AGENT_DIRECTIVES = `
You are ShopBot, a friendly and knowledgeable shopping assistant for "ShopGenius".
Your goal is to help customers find products from the available catalog.
Be concise, helpful, and enthusiastic.
If a user asks about products, recommend specific items from the provided catalog context.
Always be polite.
`;

/**
 * Transforms unstructured text input into structured product metadata.
 * 
 * @param description - Raw input description of the inventory item.
 * @returns Partial product entity with generated metadata.
 */
export const generateProductMetadata = async (description: string): Promise<Partial<Product>> => {
  try {
    const response = await provider.models.generateContent({
      model: SYSTEM_CONFIG.MODELS.GENERATION,
      contents: `Create a compelling e-commerce product listing based on this input: "${description}".
      Generate a catchy title, a persuasive marketing description (2-3 sentences), a realistic price (USD), a category, and 3 relevant tags.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            price: { type: Type.NUMBER },
            category: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "description", "price", "category", "tags"]
        }
      }
    });

    const output = response.text;
    if (!output) throw new Error("Provider returned empty response");
    
    return JSON.parse(output) as Partial<Product>;
  } catch (err) {
    console.error("Metadata generation error:", err);
    throw err;
  }
};

/**
 * Executes a conversational query against the inventory context.
 * 
 * @param history - Conversational context history.
 * @param message - Inbound user query.
 * @param inventory - Active product catalog for context grounding.
 * @returns Agent response string.
 */
export const queryAssistant = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  inventory: Product[]
): Promise<string> => {
  try {
    // Inventory Context Injection
    const contextData = inventory
      .map(item => `${item.title} ($${item.price}): ${item.description}`)
      .join('\n');
    
    const session = provider.chats.create({
      model: SYSTEM_CONFIG.MODELS.CHAT,
      config: {
        systemInstruction: `${AGENT_DIRECTIVES}\n\nCurrent Product Catalog:\n${contextData}`
      },
      history: history.map(entry => ({
        role: entry.role,
        parts: entry.parts
      }))
    });

    const result = await session.sendMessage({ message });
    return result.text || "Service response empty.";
  } catch (err) {
    console.error("Agent query error:", err);
    return "Service temporarily unavailable.";
  }
};