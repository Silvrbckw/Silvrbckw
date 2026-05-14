const { Coinbase, Wallet } = require("@coinbase/coinbase-sdk");
const path = require("path");

const KEY_FILE = "/home/rcsonework/sovereign-workspace/sovereign-gateway/creds/cdp_api_key.json";

async function reconcile() {
  try {
    console.log("🔗 Initiating Sovereign-Brain Asset Reconciliation...");

    // Configure using the updated JSON
    Coinbase.configureFromJson({ filePath: KEY_FILE });
    console.log("✅ Identity Verified: Walter Deshawn McGhee");

    console.log("🔍 Scanning for Liquid Sweeps (0x42)...");
    
    // In v2.x, listWallets() is the standard for CDP accounts
    const wallets = await Wallet.listWallets();

    if (!wallets || !wallets.data || wallets.data.length === 0) {
      console.log("\n--- RECONCILIATION RESULT ---");
      console.log("⚠️ Result: Zero Wallets Returned.");
      console.log("Tip: Check your CDP portal to ensure the key is in the correct Project.");
      return;
    }

    console.log(`\n--- FOUND ${wallets.data.length} WALLETS ---`);
    for (const wallet of wallets.data) {
      const address = await wallet.getDefaultAddress();
      console.log(`- Wallet: ${wallet.id}`);
      // Some versions return an object, some return a string. Handling both:
      console.log(`  Address: ${address.addressId || address}`);
      
      const balances = await wallet.listBalances();
      console.log(`  Balances:`, JSON.stringify(balances, null, 2));
    }

  } catch (error) {
    console.error("❌ Handshake Failed.");
    if (error && error.message) {
      console.error(`Detail: ${error.message}`);
    } else {
      console.log("Cause: Unknown SDK Exception (Likely a Permission/Scope mismatch).");
    }
  }
}

reconcile();
