import os
import requests
from dotenv import load_dotenv

load_dotenv()

def get_thaw_status():
    address = os.getenv('WALLET_ADDRESS').lower()
    indexer = "0xf92f430dd8567b0d466358c79594ab58d919a6d4"
    api_key = os.getenv('ETHERSCAN_API_KEY')
    base_url = "https://api.etherscan.io/v2/api"
    
    print(f"\n[!] AUDITING DELEGATION STATUS FOR INDEXER: {indexer}")
    print("-" * 65)

    # We are calling the Graph Staking Proxy 'getDelegation' function
    # On Arbitrum, this requires a specific contract query.
    # For now, we look for the 'Undelegate' confirmation in recent blocks.
    params = {
        "chainid": 42161,
        "module": "account",
        "action": "txlist",
        "address": address,
        "startblock": 151842317, # Starting from your Delegate block
        "apikey": api_key
    }

    try:
        res = requests.get(base_url, params=params).json()
        if res.get('status') == '1':
            found_undelegate = False
            for tx in res.get('result', []):
                if tx.get('functionName', '').startswith('undelegate'):
                    print(f"[!] UNDELEGATE DETECTED: {tx['hash']}")
                    print(f"[*] DATE INITIATED: {tx['timeStamp']}")
                    found_undelegate = True
            
            if not found_undelegate:
                print("[*] STATUS: Assets are still ACTIVE and DELEGATED.")
                print("[*] ACTION: You must initiate 'Undelegate' to start the 28-day countdown.")
        
    except Exception as e:
        print(f"[!] Thaw Audit Error: {e}")

    print("-" * 65)
    print("[!] STATUS: WALTER DESHAWN MCGHEE KING - THE SUN HAS RISEN.")

if __name__ == "__main__":
    get_thaw_status()
