const { ethers } = require("ethers");
const axios = require("axios");
const { Connection, PublicKey } = require("@solana/web3.js"); // npm install @solana/web3.js
require('dotenv').config();

async function checkSovereignAssets() {
    // --- ETHEREUM LAYER ---
    const ethProvider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`);
    const keystoneBal = await ethProvider.getBalance(process.env.SAFE_DESTINATION_ADDRESS);
    
    // --- SOLANA LAYER ---
    const solConnection = new Connection(process.env.SOLANA_RPC_URL, "confirmed");
    const solPubKey = new PublicKey(process.env.SOLANA_WALLET_ADDRESS);
    const solBalance = await solConnection.getBalance(solPubKey);

    console.log("--- RCS ASSET SNAPSHOT ---");
    console.log(`[ETH] Keystone Gas: ${ethers.formatEther(keystoneBal)} ETH`);
    console.log(`[SOL] Balance: ${solBalance / 1e9} SOL`);
    
    // --- INFRASTRUCTURE STATUS ---
    const cbStatus = await axios.get("https://status.coinbase.com/api/v2/summary.json");
    console.log(`[INFRA] Coinbase Status: ${cbStatus.data.status.description}`);

    if (parseFloat(ethers.formatEther(keystoneBal)) < 0.01) {
        console.log(">>> STATUS: Waiting for AWS/Coinbase to clear Gas Funding.");
    } else {
        console.log(">>> STATUS: GAS DETECTED. Ready for Handshake.");
    }
}

checkSovereignAssets();
