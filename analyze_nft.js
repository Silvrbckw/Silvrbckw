const { ethers } = require("ethers");

async function getNftData() {
    const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
    const contractAddress = "0x7f9f222D2c492Bf3c876Ecb03A148884b90020f8"; // From your screenshot
    const tokenId = 8406;

    // Minimum ABI to talk to an NFT contract
    const abi = ["function tokenURI(uint256 _tokenId) view returns (string)"];
    const contract = new ethers.Contract(contractAddress, abi, provider);

    try {
        const metadataUrl = await contract.tokenURI(tokenId);
        console.log("NFT Metadata URL:", metadataUrl);
        
        if (metadataUrl.startsWith("ipfs://")) {
            const cid = metadataUrl.split("ipfs://")[1];
            console.log("\nACTION: Use your new IPFS node to see the content!");
            console.log(`Command: ipfs cat /ipfs/${cid}`);
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
    }
}

getNftData();
