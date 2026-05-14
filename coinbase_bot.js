const { Coinbase, Wallet } = require("@coinbase/coinbase-sdk");

async function runBot() {
    console.log("🤖 Antigravity Bot: Running Hardcoded Handshake Test...");
    
    // PASTE YOUR VALUES DIRECTLY HERE FOR THIS ONE TEST
    const apiKeyName = "organizations/bb4fa64b-9b4f-4ffd-8e93-7dec09eeee83/apiKeys/f1047581-6e-c3236d002433";
    const privateKey = `-----BEGIN EC PRIVATE KEY-----
MHcCAQEEM49
AwEHoUQDQgAEeh1Q1/Qg/6EeqOq3Fka1JB0rgGeQ6+RCxfzt7C7jIoHPOpy1/o3M
lNQhVyvg9JMtUj4fqhdNtmZN5iVnWPsPrg==
-----END EC PRIVATE KEY-----`;

    try {
        Coinbase.configure({ apiKeyName, privateKey });
        
        console.log("📡 Testing Wallet list...");
        const response = await Wallet.listWallets();
        
        if (response.data && response.data.length > 0) {
            console.log(`✅ SUCCESS! Connected to Wallet: ${response.data[0].getId()}`);
        } else {
            console.log("⚠️ Handshake worked, but no wallets found. Create one with Wallet.create()");
        }
    } catch (error) {
        console.error("❌ Final Handshake Failure:", error.message || error);
    }
}
runBot();
