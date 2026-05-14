const { ethers } = require("ethers");
require('dotenv').config();

// Official Lido Withdrawal Queue Proxy
const LIDO_QUEUE = "0x889edC2Bde12142e9df00091d64Bb4d96271C3F7";

async function request32Eth() {
    const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`);
    const wallet0x42 = new ethers.Wallet(process.env.ETH_PRIVATE_KEY, provider);

    // This contract will mint the NFT to your 0x42 wallet
    const queue = new ethers.Contract(LIDO_QUEUE, [
        "function requestWithdrawals(uint256[] _amounts, address _owner) external returns (uint256[])"
    ], wallet0x42);

    // 32 ETH in Wei
    const amount = ethers.parseUnits("32", 18);

    // Note: We will wrap this in a Flashbots bundle so Keystone pays the gas
    console.log("Preparing 32 ETH Withdrawal Request...");
    // [Logic held in memory for bundle execution]
}
