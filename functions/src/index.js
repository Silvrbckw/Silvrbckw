const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");

// Lazy load heavy modules to speed up container boot
let ai, googleAI, gemini15Flash, ethers;

exports.sovereignGateway = onRequest(
  { 
    secrets: ["GEMINI_API_KEY"], 
    region: "us-central1",
    cpu: 1, // Ensures enough power for Genkit initialization
    memory: "512MiB" 
  },
  async (req, res) => {
    try {
      // Initialize modules if not already loaded
      if (!ai) {
        const { genkit } = require("genkit");
        const genai = require("@genkit-ai/google-genai");
        googleAI = genai.googleAI;
        gemini15Flash = genai.gemini15Flash;
        ethers = require("ethers");

        ai = genkit({
          plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
        });
      }

      const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
      const block = await provider.getBlockNumber();

      const aiResponse = await ai.generate({
        model: gemini15Flash,
        prompt: `Handshake for Walter Deshawn McGhee. Block: ${block}`,
      });

      res.status(200).send({
        status: "Active",
        validator: "Walter Deshawn McGhee",
        block: block,
        insight: aiResponse.text
      });

    } catch (error) {
      logger.error("Startup/Execution Failure:", error);
      res.status(500).send({ error: "Initialization Timeout", detail: error.message });
    }
  }
);
