const { GoogleGenerativeAI } = require("@google/generative-ai");

// Chat with Gemini (supports Multimodal Image Input)
const chatWithGemini = async (prompt, imageData = null, mimeType = "image/jpeg") => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        let result;
        if (imageData) {
            result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: imageData,
                        mimeType: mimeType
                    }
                }
            ]);
        } else {
            result = await model.generateContent(prompt);
        }

        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini AI Error:", error.message);
        throw new Error("AI Chat failed: " + error.message);
    }
};

// Generate Image with NVIDIA NIM (Fast SDXL)
const generateImageHF = async (prompt) => {
    try {
        console.log("Generating enhanced image via NVIDIA NIM for prompt:", prompt.substring(0, 50) + "...");
        
        const response = await fetch("https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-xl", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "text_prompts": [
                    {
                        "text": prompt,
                        "weight": 1
                    }
                ],
                "cfg_scale": 7,
                "height": 1024,
                "width": 1024,
                "samples": 1,
                "steps": 30,
                "sampler": "K_EULER_ANCESTRAL"
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`NVIDIA API Error: ${errorText}`);
        }

        const data = await response.json();

        // Stability AI endpoints return base64 images in an 'artifacts' array
        if (data.artifacts && data.artifacts[0] && data.artifacts[0].base64) {
            console.log("Success! Image generated via NVIDIA NIM.");
            return `data:image/png;base64,${data.artifacts[0].base64}`;
        }

        throw new Error("No image data found in NVIDIA response.");
        
    } catch (error) {
        console.error("NVIDIA Image Error:", error.message);
        console.log("Falling back to Pollinations AI...");
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
        const res = await fetch(fallbackUrl);
        const buffer = await res.arrayBuffer();
        return `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
    }
};

module.exports = {
    chatWithGemini,
    generateImageHF
};
