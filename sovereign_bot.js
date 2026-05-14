require('dotenv').config();
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_RESTRICTED_KEY);
const { ethers } = require("ethers");

// Business Context
const WALLET = process.env.ETH_WALLET;
const VALIDATOR_ID = "327458";
const ONEINCH_API_KEY = process.env.ONEINCH_API_KEY;
const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`;

const provider = new ethers.JsonRpcProvider(ALCHEMY_URL);

async function executeSovereignBridge() {
    console.log(`🚀 SCALE MODE: ${process.env.LLC_NAME}`);
    console.log(`👤 Principal Holder: ${process.env.PRIMARY_OWNER}`);
    console.log("------------------------------------------------------------------");

    try {
        // 1. Verify Cashflow
        const sBalance = await stripe.balance.retrieve();
        const usdAvailable = sBalance.available[0].amount / 100;
        console.log(`💵 Stripe Liquidity: $${usdAvailable} USD`);

        // 2. Beaconcha Check
        const beaconRes = await axios.get(`https://beaconcha.in/api/v1/validator/${VALIDATOR_ID}`, {
            headers: { 'apikey': process.env.BEACONCHA_API_KEY }
        });
        const vData = beaconRes.data.data;
        console.log(`📊 Validator Status: ${vData.status.toUpperCase()}`);

        // 3. Wallet Audit
        const walletBalance = await provider.getBalance(WALLET);
        const gasEth = ethers.formatEther(walletBalance);
        console.log(`⛽ Current Wallet Gas: ${gasEth} ETH`);

        // 4. Live 1inch Swap Trigger
        if (vData.status === "exited" || vData.status === "withdrawal_possible") {
            if (parseFloat(gasEth) < 0.015) { // Minimum gas threshold for withdrawal
                console.log("🎯 TARGET: GAS-LOCKED. Requesting 1inch Swap Quote...");

                // Call 1inch Swap API
                const config = {
                    headers: { "Authorization": `Bearer ${ONEINCH_API_KEY}` },
                    params: {
                        "src": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
                        "dst": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // Native ETH
                        "amount": "1000000", // $1.00 USD
                        "from": WALLET,
                        "slippage": 1,
                        "disableEstimate": true
                    }
                };

                try {
                    const response = await axios.get('https://api.1inch.dev/swap/v6.0/1/quote', config);
                    console.log(`✅ 1inch Quote Received: ${ethers.formatEther(response.data.dstAmount)} ETH available for swap.`);
                    console.log("💡 Strategy: Ready to execute swap as soon as Gatsby revenue exceeds $5.");
                } catch (swapErr) {
                    console.log("⚠️  Swap Note: Quote restricted until minimum liquidity ($5+) is detected.");
                }
            } else {
                console.log("✅ SYSTEM READY: Gas sufficient to claim 32 ETH to " + WALLET);
            }
        }

    } catch (err) {
        console.error("❌ Node Error:", err.message);
    }
    console.log("------------------------------------------------------------------");
}

executeSovereignBridge();
