export async function generateImageWithAI(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_STABILITY_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Don't have token. Please purchase from its site"
    );
  }

  try {
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1,
            },
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1,
        }),
      }
    );

    if (!response.ok) {
      // Try to parse error message
      let errorMessage = "Failed to generate image";
      
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.name === "insufficient_balance") {
          errorMessage = "Insufficient credits. Please add credits to your Stability AI account.";
        }
      } catch (e) {
        errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      }
      
      console.log("[Stability AI] API Error:", errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (!result.artifacts || !result.artifacts[0] || !result.artifacts[0].base64) {
      throw new Error("Invalid response from Stability AI API");
    }

    // Convert base64 to data URL
    const base64Image = result.artifacts[0].base64;
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific Stability AI errors
      if (error.message.includes("insufficient_balance")) {
        throw new Error(
          "Insufficient Stability AI credits. Please add credits at: https://dreamstudio.ai/account/credits"
        );
      }
      if (error.message.includes("rate_limit")) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      }
      if (error.message.includes("invalid_api_key")) {
        throw new Error("Invalid API key. Please check your VITE_STABILITY_API_KEY.");
      }
      throw error;
    }
    throw new Error("Network error or invalid API key");
  }
}
