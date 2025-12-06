// Gemini AI service for food nutrient analysis
import * as FileSystem from "expo-file-system/legacy";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY; // You'll need to set this in your environment

export interface NutrientAnalysis {
  foodName: string;
  foodCategory?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitamins: string[];
  minerals: string[];
  servingSize: string;
  healthRating?: number;
  healthNotes?: string;
  confidence: number;
}

export const analyzeFoodImage = async (
  imageUri: string
): Promise<NutrientAnalysis> => {
  try {
    console.log("Starting image analysis with Gemini for:", imageUri);

    // Read the file as base64
    let base64Data = "";
    if (imageUri.startsWith("file://")) {
      console.log("Processing local file...");
      try {
        // Remove the file:// prefix to get the actual file path
        const filePath = imageUri.replace("file://", "");
        console.log("File path:", filePath);

        // Read the file as base64 using Expo FileSystem
        base64Data = await FileSystem.readAsStringAsync(filePath, {
          encoding: 'base64',
        });
        console.log("Successfully converted to base64");
      } catch (error) {
        console.error("Error reading file:", error);
        throw new Error("Failed to read image file");
      }
    } else {
      throw new Error("Only local file URIs are supported");
    }

    console.log("Sending request to Gemini...");
    console.log("API Key available:", !!GEMINI_API_KEY);

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Analyze this food image and provide detailed nutritional information. Return ONLY a valid JSON object (no markdown, no code blocks) with the following structure:
{
  "foodName": "name of the food",
  "foodCategory": "category (e.g., Dessert, Fast Food, Vegetable, Protein, Grain, Dairy, Fruit, Snack, Beverage)",
  "calories": number,
  "protein": number (in grams),
  "carbs": number (in grams),
  "fat": number (in grams),
  "fiber": number (in grams),
  "sugar": number (in grams),
  "sodium": number (in mg),
  "vitamins": ["vitamin names"],
  "minerals": ["mineral names"],
  "servingSize": "estimated serving size",
  "healthRating": number (1-5, where 1=unhealthy, 5=very healthy),
  "healthNotes": "brief note about nutritional benefits or concerns (max 100 words)",
  "confidence": number (0-1, how confident you are in the analysis)
}

Be as accurate as possible with the nutritional values. Consider overall nutritional value, processing level, sugar/sodium content when rating health. If you can't identify the food clearly, set confidence to a low value.`,
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Data,
              },
            },
          ],
        },
      ],
    };

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY || "",
        },
        body: JSON.stringify(requestBody),
      }
    );

    console.log("Gemini response status:", geminiResponse.status);

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini error response:", errorText);
      throw new Error(
        `Gemini API error: ${geminiResponse.status} - ${errorText}`
      );
    }

    const data = await geminiResponse.json();
    console.log("Gemini response data:", JSON.stringify(data, null, 2));

    // Extract the text content from Gemini's response
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      console.error("No content in Gemini response:", data);
      throw new Error("No content returned from Gemini");
    }

    console.log("Gemini content:", content);

    // Parse the JSON response - handle markdown code blocks if present
    try {
      // Remove markdown code blocks if present
      let jsonText = content.trim();
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/```\n?/g, "");
      }
      
      const analysis = JSON.parse(jsonText.trim());
      console.log("Parsed analysis:", analysis);
      return analysis;
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.error("Raw content:", content);
      throw new Error("Failed to parse Gemini response");
    }
  } catch (error) {
    console.error("Error analyzing food image:", error);
    throw new Error("Failed to analyze food image");
  }
};
