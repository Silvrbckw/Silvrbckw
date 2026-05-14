import os
import asyncio
import httpx
import stripe
import json
from web3 import Web3
from dotenv import load_dotenv

# Load workspace environment
load_dotenv('/home/rcsonework/sovereign-workspace/sovereign-gateway/.env')

# --- Mappings ---
ETH_WALLET = os.getenv("ETH_WALLET")
RPC_URL = os.getenv("ETH_MAINNET_RPC")
STRIPE_KEY = os.getenv("STRIPE_RESTRICTED_KEY")
MERCURY_TOKEN = os.getenv("MERCURY_API_KEY")
MERCURY_OP_ID = os.getenv("MERCURY_OP_ACCOUNT_ID")

class SovereignNode:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(RPC_URL))
        stripe.api_key = STRIPE_KEY
        self.mercury_headers = {
            "Authorization": f"Bearer {MERCURY_TOKEN}", 
            "Content-Type": "application/json"
        }
        self.ipfs_rpc = "http://127.0.0.1:5001/api/v0"

    async def log_to_local_ipfs(self, data_dict):
        """Audit logging to local Kubo daemon."""
        async with httpx.AsyncClient() as client:
            files = {'file': json.dumps(data_dict)}
            try:
                resp = await client.post(f"{self.ipfs_rpc}/add", files=files, timeout=10.0)
                return resp.json().get('Hash')
            except Exception:
                return "NODE_OFFLINE"

    async def run_protocol(self):
        print(f"\n--- Sovereign Protocol Heartbeat: {os.getenv('PRIMARY_OWNER')} ---")
        
        # 1. Check Stripe Balance
        try:
            stripe_bal = stripe.Balance.retrieve()['available'][0]['amount'] / 100
        except Exception as e:
            stripe_bal = 0.0
            print(f"Stripe Error: {e}")

        # 2. Check Lido Withdrawal NFTs
        try:
            abi = '[{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"type":"function"}]'
            contract = self.w3.eth.contract(address=Web3.to_checksum_address("0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"), abi=abi)
            nfts = contract.functions.balanceOf(Web3.to_checksum_address(ETH_WALLET)).call()
        except Exception:
            nfts = 0

        # 3. Log Status
        print(f"Stripe: ${stripe_bal:.2f} | Lido NFTs: {nfts}")
        audit_hash = await self.log_to_local_ipfs({
            "entity": "RCS DISTRIBUTION AND RETAIL",
            "stripe_available": stripe_bal,
            "lido_nfts": nfts,
            "target_account": MERCURY_OP_ID
        })
        print(f"Audit Trail Hash: {audit_hash}")

async def main_loop():
    node = SovereignNode()
    while True:
        await node.run_protocol()
        print("--- Cycle Complete. Sleeping for 24 hours ---")
        await asyncio.sleep(86400) 

if __name__ == "__main__":
    asyncio.run(main_loop())
