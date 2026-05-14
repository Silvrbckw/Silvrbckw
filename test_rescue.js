const { ethers } = require("ethers");
require("dotenv").config();

async function runRescue() {
    // 1. MUST USE ETH MAINNET FOR LIDO CLAIMS
    const rpcUrl = "https://eth-mainnet.g.alchemy.com/v2/k6eZjBjGeiRT5-LIuBUg7";
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // 2. PUT THE NUMBER FROM STEP 1 HERE
    const requestId = "PASTE_THE_NUMBER_HERE"; 
    
    const safeAddress = "0xC6B496f0fF1E44416C6CD793Ca6326B6589F346A";
    const lidoAddress = "0x889edC2Bde12142e9df00091d64Bb4d96271C3F7";

    // Clean Key Logic for your specific .env format
    let rawKey = (process.env.ETH_PRIVATE_KEY || "").split(" ")[0].trim();
    if (rawKey && !rawKey.startsWith("0x")) rawKey = "0x" + rawKey;

    try {
        const hotWallet = new ethers.Wallet(rawKey, provider);
        const lidoQueue = new ethers.Contract(
            lidoAddress,
            ["function claimWithdrawalTo(uint256 _requestId, uint256 _hint, address _recipient)"],
            hotWallet
        );

        console.log(`🚀 RESCUE START | ID: ${requestId}`);
        console.log(`👤 Signing with: ${hotWallet.address}`);

        // Claim to Keystone
        const tx = await lidoQueue.claimWithdrawalTo(requestId, 0, safeAddress);
        console.log(`✅ Sent! Hash: ${tx.hash}`);
        await tx.wait();
        console.log("🏆 SUCCESS: 32 ETH secured in Keystone.");
    } catch (err) {
        console.error("❌ Failed:", err.message);
    }
}
runRescue();
