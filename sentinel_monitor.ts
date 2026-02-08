import dotenv from 'dotenv';
import path from 'path';

// Force load from the local Detroit Node Vault
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function initiateSentinel() {
    const apiKey = process.env.OPENROUTER_SENTINEL_KEY;
    
    console.log("🔱 [DETROIT-ALPHA] : Initializing Sentinel Monitor...");

    if (!apiKey) {
        console.error("❌ [ERROR] : Vault Key 'OPENROUTER_SENTINEL_KEY' missing from .env.local");
        process.exit(1);
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-001",
                messages: [{ role: "user", content: "System check: Detroit Node Alpha is online. Respond with 'SYNCHRONIZED'." }]
            })
        });

        const data = await response.json();
        const status = data.choices?.[0]?.message?.content || "No response from Gateway.";
        
        console.log(`✅ [STATUS] : Gateway Response -> ${status}`);
        console.log(`🔱 [HEARTBEAT] : System stable at ${new Date().toLocaleString()}`);

    } catch (error) {
        console.error("❌ [CRITICAL] : Sentinel Handshake Failed.", error);
    }
}

initiateSentinel();
