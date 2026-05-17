require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    try {
        console.log("Fetching available models for your API key...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // This is a special method to see what your key can access
        const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await result.json();
        
        if (data.models) {
            console.log("=== AVAILABLE MODELS ===");
            data.models.forEach(m => {
                console.log(`- ${m.name.replace('models/', '')} (${m.supportedGenerationMethods.join(', ')})`);
            });
            console.log("========================");
        } else {
            console.log("No models found. Your API key might be invalid or restricted.");
            console.log("Error details:", data);
        }
    } catch (error) {
        console.error("Failed to list models:", error.message);
    }
}

listModels();
