# OpenAI Setup for NutriSnap

## Setup Instructions

1. **Get an OpenAI API Key**:
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Copy the key

2. **Add the API Key to your environment**:
   Create a `.env` file in the root directory with:
   ```
   EXPO_PUBLIC_OPENAI_API_KEY=your_actual_api_key_here
   ```

3. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

## How it works

1. User takes a photo of their food
2. Photo is shown for confirmation
3. If confirmed, the image is sent to OpenAI's GPT-4 Vision model
4. OpenAI analyzes the food and returns nutritional information
5. Results are displayed in a beautiful modal

## Features

- **Photo confirmation**: Users can retake photos if needed
- **Loading state**: Shows progress while analyzing
- **Detailed nutrition**: Shows calories, macros, vitamins, minerals
- **Confidence score**: Shows how confident the AI is in its analysis
- **Error handling**: Graceful error messages if analysis fails

## API Usage

The app uses OpenAI's GPT-4 Vision model to analyze food images. Each analysis costs approximately $0.01-0.03 depending on image size and complexity.

## Troubleshooting

- Make sure your OpenAI API key is valid and has credits
- Check that the `.env` file is in the root directory
- Ensure you have an active internet connection
- The camera requires proper permissions on the device 