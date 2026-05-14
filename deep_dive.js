const wallet = "0x426ca4a1d4b739d7825adb9f8db67e37795d8bea";
const apiKey = "k6eZjBjGeiRT5-LIuBUg7"; // Extracted from your .env
const url = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;

async function scan() {
    console.log(`🔍 Deep Dive Analysis: ${wallet}\n`);

    const requests = [
        { method: "alchemy_getTokenBalances", params: [wallet], id: 1 },
        { method: "alchemy_getAssetTransfers", params: [{ 
            fromAddress: wallet, 
            category: ["external", "internal", "erc20", "erc721", "erc1155"],
            maxCount: "0x5" 
        }], id: 2 }
    ];

    for (let req of requests) {
        try {
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify({ jsonrpc: "2.0", ...req }),
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            
            if (req.id === 1) {
                console.log("💰 [Liquid Assets & Rewards]");
                data.result.tokenBalances.filter(t => t.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000")
                    .forEach(t => console.log(`- Asset at ${t.contractAddress}`));
            } else {
                console.log("\n🔗 [Protocol Interactions (Aave, Metamask, Apps)]");
                data.result.transfers.forEach(tx => console.log(`- Interacted with: ${tx.to} (${tx.asset || 'Contract Call'})`));
            }
        } catch (e) { console.error(`❌ Request ${req.id} failed:`, e.message); }
    }
}
scan();
