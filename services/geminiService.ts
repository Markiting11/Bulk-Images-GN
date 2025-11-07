import { GoogleGenAI } from "@google/genai";
import type { GenerateImageRequest } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const base64ToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

// Helper function to get a detailed description from a reference image
const getDescriptionFromImage = async (referenceImage: { base64: string, mimeType: string }): Promise<string> => {
    const imagePart = base64ToGenerativePart(referenceImage.base64, referenceImage.mimeType);
    const textPart = { text: "Describe this image in vivid detail for an AI image generator. Focus on the style, mood, colors, composition, and key subjects." };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] }
    });
    return response.text;
}


export const generateImagesFromApi = async (request: GenerateImageRequest): Promise<string[]> => {
  const { prompt, numberOfImages, referenceImage } = request;

  let finalPrompt = prompt;

  if (referenceImage) {
      try {
          const imageDescription = await getDescriptionFromImage(referenceImage);
          // Combine the user's prompt with the generated description for a more guided generation
          finalPrompt = `${prompt}. Visually inspired by the following: ${imageDescription}`;
      } catch (error) {
          console.error("Failed to process reference image:", error);
          if (error instanceof Error) {
            throw new Error(`Could not analyze the reference image: ${error.message}`);
          }
          throw new Error("Could not analyze the reference image. Please try another image or proceed without one.");
      }
  }
  
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: finalPrompt,
      config: {
        numberOfImages: numberOfImages,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("The API did not return any images.");
    }
    
    return response.generatedImages.map(img => {
      if (!img.image || !img.image.imageBytes) {
        throw new Error("API response contained an image with no data.");
      }
      return img.image.imageBytes;
    });

  } catch (error) {
    console.error("Error calling Gemini API for image generation:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while generating images.");
  }
};