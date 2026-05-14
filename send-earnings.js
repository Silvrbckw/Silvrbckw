const ethers = require("ethers");
require("dotenv").config();

async function sendEarnings() {
    // Using your local-first environment for security
    const provider = new ethers.JsonRpcProvider("https://ethereum-rpc.publicnode.com");
    
    // This uses the private key from your .env file
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const tx = {
        to: "0x8c919A1898ea5c42C9967aBEBc42451d5a2f2233",
        value: ethers.parseEther("0.15"), 
        gasLimit: 21000,
    };

    console.log("Initiating transfer to gas wallet...");
    const transaction = await wallet.sendTransaction(tx);
    await transaction.wait();
    console.log(`Success! Hash: ${transaction.hash}`);
}

sendEarnings();
