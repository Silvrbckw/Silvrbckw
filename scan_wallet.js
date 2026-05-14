const { Alchemy, Network } = require("alchemy-sdk");
require('dotenv').config();

const config = {
  apiKey: process.env.ALCHEMY_KEY, // Uses the key from your .env
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

async function deepDive() {
  const wallet = "0x426ca4a1d4b739d7825adb9f8db67e37795d8bea";

  console.log(`🚀 Deep Dive: Scanning Wallet ${wallet}...`);

  // 1. Get All Token Balances (Liquid Assets)
  const balances = await alchemy.core.getTokenBalances(wallet);
  console.log("\n💰 Liquid Token Assets:");
  for (let token of balances.tokenBalances) {
    if (token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
      console.log(`- Contract: ${token.contractAddress} | Balance: ${parseInt(token.tokenBalance)}`);
    }
  }

  // 2. Identify Protocol Interactions (Aave, Lido, etc.)
  const transfers = await alchemy.core.getAssetTransfers({
    fromAddress: wallet,
    category: ["external", "internal", "erc20", "erc721", "erc1155"],
    maxCount: 20
  });

  console.log("\n🔗 Recent Protocol Connections & Resource Links:");
  transfers.transfers.forEach(tx => {
    console.log(`- To: ${tx.to} | Asset: ${tx.asset} | Type: ${tx.category}`);
  });
}
deepDive();
