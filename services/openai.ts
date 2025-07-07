// OpenAI service for food nutrient analysis
import * as FileSystem from "expo-file-system";

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY; // You'll need to set this in your environment

export interface NutrientAnalysis {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitamins: string[];
  minerals: string[];
  servingSize: string;
  confidence: number;
}

export const analyzeFoodImage = async (
  imageUri: string
): Promise<NutrientAnalysis> => {
  try {
    console.log("Starting image analysis for:", imageUri);

    // For React Native, we'll use react-native-fs to handle file conversion
    let imageUrl = imageUri;

    // If it's a local file, convert it to base64
    if (imageUri.startsWith("file://")) {
      console.log("Processing local file...");
      try {
        // Remove the file:// prefix to get the actual file path
        const filePath = imageUri.replace("file://", "");
        console.log("File path:", filePath);

        // Read the file as base64 using Expo FileSystem
        const base64Data = await FileSystem.readAsStringAsync(filePath, {
          encoding: FileSystem.EncodingType.Base64,
        });
        imageUrl = `data:image/jpeg;base64,${base64Data}`;
        console.log("Successfully converted to base64");
      } catch (error) {
        console.error("Error reading file:", error);
        // Fallback to using the original URI
        imageUrl = imageUri;
      }
    }

    console.log("Sending request to OpenAI...");
    console.log("API Key available:", !!OPENAI_API_KEY);

    const requestBody = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this food image and provide detailed nutritional information. Return the response as a JSON object with the following structure:
              {
                "foodName": "name of the food",
                "calories": number,
                "protein": number (in grams),
                "carbs": number (in grams),
                "fats": number (in grams),
                "fiber": number (in grams),
                "sugar": number (in grams),
                "sodium": number (in mg),
                "vitamins": ["vitamin names"],
                "minerals": ["mineral names"],
                "servingSize": "estimated serving size",
                "confidence": number (0-1, how confident you are in the analysis)
              }
              
              Be as accurate as possible with the nutritional values. If you can't identify the food clearly, set confidence to a low value.`,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    };

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    console.log("OpenAI response status:", openaiResponse.status);

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI error response:", errorText);
      throw new Error(
        `OpenAI API error: ${openaiResponse.status} - ${errorText}`
      );
    }

    const data = await openaiResponse.json();
    console.log("OpenAI response data:", data);

    const content = data.choices[0].message.content;
    console.log("OpenAI content:", content);

    // Parse the JSON response
    try {
      const analysis = JSON.parse(content);
      console.log("Parsed analysis:", analysis);
      return analysis;
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      console.error("Raw content:", content);
      throw new Error("Failed to parse OpenAI response");
    }
  } catch (error) {
    console.error("Error analyzing food image:", error);
    throw new Error("Failed to analyze food image");
  }
};
