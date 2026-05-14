const { SchemaRegistry } = require("@ethereum-attestation-service/eas-sdk");
const { ethers } = require("ethers");

async function registerSchema() {
  // Base Mainnet Schema Registry Address
  const schemaRegistryAddress = "0x4200000000000000000000000000000000000020";
  const schemaRegistry = new SchemaRegistry(schemaRegistryAddress);
  
  // Use your Enterprise API key for the provider
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org"); 
  // Note: For the actual transaction, you'll sign via MetaMask/Keystone
  
  const schema = "string Full_Name, string Entity_ID, string Professional_Role, string Hashed_Docs";
  const resolverAddress = "0x0000000000000000000000000000000000000000"; 
  const revocable = true;

  console.log("Registering Schema for: WALTER DESHAWN MCGHEE...");
  // This logic prepares the transaction for your Keystone to sign
  console.log("Schema String:", schema);
}

registerSchema();
