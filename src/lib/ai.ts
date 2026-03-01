
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini AI client
// The API Key is sourced exclusively from the execution environment
export const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const MODELS = {
  text: 'gemini-3-flash-preview',
  complex: 'gemini-3-pro-preview',
  image: 'gemini-2.5-flash-image'
};
