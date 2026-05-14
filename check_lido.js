const { ethers } = require("ethers");
require('dotenv').config();

async function checkLido() {
    const apiKey = process.env.ALCHEMY_KEY;
    const rpcUrl = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Lido Withdrawal Queue (Mainnet)
    const lidoQueueAddress = "0x889edc2bde12383b3121997afba743933e2d0ce3";
    const myWallet = "0x426ca4a1d4b739d7825adb9f8db67e37795d8bea";

    console.log(`🔍 Diagnostic: Checking code at ${lidoQueueAddress} on Mainnet...`);

    try {
        // 1. Verify there is actual code at this address
        const code = await provider.getCode(lidoQueueAddress);
        if (code === "0x") {
            console.error("❌ FAILURE: No contract code found at this address on this RPC.");
            return;
        }
        console.log("✅ Contract code detected.");

        // 2. Manual Call (Bypassing Ethers decoding for a second)
        const iface = new ethers.Interface(["function getWithdrawalRequests(address owner) view returns (uint256[])"]);
        const data = iface.encodeFunctionData("getWithdrawalRequests", [myWallet]);
        
        const rawResult = await provider.call({
            to: lidoQueueAddress,
            data: data
        });

        console.log(`📡 Raw Result from RPC: ${rawResult}`);

        if (rawResult === "0x") {
            console.log("❌ The contract returned an empty response. This wallet likely has no requests.");
        } else {
            const decoded = iface.decodeFunctionResult("getWithdrawalRequests", rawResult);
            console.log(`✅ Success! Request IDs: ${decoded[0].join(", ")}`);
        }
    } catch (e) {
        console.error("❌ Diagnostic Error:", e.message);
    }
}
checkLido();
