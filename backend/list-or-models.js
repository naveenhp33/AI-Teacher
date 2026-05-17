async function listOpenRouterModels() {
    try {
        console.log("Fetching OpenRouter models...");
        const response = await fetch("https://openrouter.ai/api/v1/models");
        const data = await response.json();
        
        console.log("=== OPENROUTER IMAGE MODELS ===");
        const imageModels = data.data.filter(m => 
            m.name.toLowerCase().includes("diffusion") || 
            m.name.toLowerCase().includes("image") ||
            m.name.toLowerCase().includes("sdxl") ||
            m.name.toLowerCase().includes("dall-e")
        );
        
        imageModels.forEach(m => {
            console.log(`- ${m.id} (${m.name})`);
        });
        console.log("===============================");
    } catch (error) {
        console.error("Failed to list models:", error.message);
    }
}
listOpenRouterModels();
