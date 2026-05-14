const { ethers } = require('ethers');

// Using Ankr's public endpoint - usually better for storage queries
const provider = new ethers.JsonRpcProvider('https://rpc.ankr.com/eth');

const proxyAddress = '0x3Ae1F70CF6dA80955936f5599D103fCF62162D10';

async function bypassProxy() {
    try {
        console.log("--- Storage Inspection (Ankr) ---");

        // EIP-1967 implementation slot
        const implSlot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
        
        const rawImpl = await provider.getStorage(proxyAddress, implSlot);
        
        if (rawImpl === '0x' + '0'.repeat(64)) {
            console.log("Storage slot is empty.");
            return;
        }

        const logicAddress = ethers.getAddress("0x" + rawImpl.substring(26));
        console.log(`Logic Contract (Implementation): ${logicAddress}`);
        
        // We'll also check the admin while we're at it
        const adminSlot = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";
        const rawAdmin = await provider.getStorage(proxyAddress, adminSlot);
        const adminAddress = ethers.getAddress("0x" + rawAdmin.substring(26));
        console.log(`Proxy Admin: ${adminAddress}`);

        console.log("\n>>> Connection verified.");
    } catch (error) {
        console.error("RPC Error:", error.message);
        console.log("\nAlternative: Try running this command in your terminal:");
        console.log(`curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getStorageAt","params":["0x3Ae1F70CF6dA80955936f5599D103fCF62162D10", "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc", "latest"],"id":1}' https://rpc.ankr.com/eth`);
    }
}

bypassProxy();
