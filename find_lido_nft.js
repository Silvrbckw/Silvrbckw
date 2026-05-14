const { ethers } = require("ethers");
require('dotenv').config();

async function findLidoNFT() {
    // Connect to Ethereum Mainnet
    const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"); 
    // ^ Replace with a mainnet URL or your .env variable
    
    const lidoWithdrawalQueueAddress = "0x889edC2Bde12383B3121997afBa743933E2d0CE3";
    const myWallet = "0x426ca4a1D4b739D7825Adb9f8db67e37795d8BEa"; // Your address

    const abi = [
        "function getWithdrawalRequests(address owner) view returns (uint256[])",
        "function getWithdrawalStatus(uint256[] requestId) view returns (tuple(uint256 amountOfStETH, uint256 amountOfShare, address owner, uint256 timestamp, bool isFinished, bool isClaimed)[])"
    ];

    const contract = new ethers.Contract(lidoWithdrawalQueueAddress, abi, provider);

    try {
        console.log("Checking Lido Withdrawal Queue for:", myWallet);
        const requestIds = await contract.getWithdrawalRequests(myWallet);

        if (requestIds.length === 0) {
            console.log("No withdrawal requests found for this address on Ethereum Mainnet.");
        } else {
            console.log(`Found ${requestIds.length} request(s):`, requestIds.map(id => id.toString()));
            const statuses = await contract.getWithdrawalStatus(requestIds);
            
            statuses.forEach((status, index) => {
                console.log(`\n--- Request ID: ${requestIds[index]} ---`);
                console.log(`Amount: ${ethers.formatEther(status.amountOfStETH)} ETH`);
                console.log(`Finalized: ${status.isFinished}`);
                console.log(`Already Claimed: ${status.isClaimed}`);
            });
        }
    } catch (error) {
        console.error("Error connecting to Lido:", error);
    }
}

findLidoNFT();
