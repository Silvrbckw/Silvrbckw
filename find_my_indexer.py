import os
import requests
from dotenv import load_dotenv

load_dotenv()

def find_indexer():
    address = os.getenv('WALLET_ADDRESS').lower()
    api_key = os.getenv('ETHERSCAN_API_KEY')
    base_url = "https://api.etherscan.io/v2/api"
    
    print(f"[!] SCANNING HISTORICAL LEDGER FOR INDEXER FINGERPRINTS...")
    
    # We are scanning Arbitrum (42161)
    params = {
        "chainid": 42161,
        "module": "account",
        "action": "txlist",
        "address": address,
        "startblock": 0,
        "endblock": 99999999,
        "sort": "desc",
        "apikey": api_key
    }

    try:
        res = requests.get(base_url, params=params).json()
        if res.get('status') == '1':
            transactions = res.get('result', [])
            print(f"[*] Analyzing {len(transactions)} historical transactions...")
            
            for tx in transactions:
                # The 'methodId' for Delegation/Undelegation in The Graph
                # delegate: 0x026e402b | undelegate: 0x47e12738
                input_data = tx.get('input', '')
                
                if input_data.startswith('0x026e402b') or input_data.startswith('0x47e12738'):
                    action = "DELEGATE" if input_data.startswith('0x026e402b') else "UNDELEGATE"
                    print(f"\n[+] FOUND {action} EVENT")
                    print(f"    - Hash: {tx['hash']}")
                    print(f"    - Block: {tx['blockNumber']}")
                    
                    # The Indexer address is usually encoded in the input data
                    # We will extract it here
                    if len(input_data) >= 74:
                        indexer_addr = "0x" + input_data[34:74]
                        print(f"    - INDEXER ADDRESS: {indexer_addr}")
                        return indexer_addr
        else:
            print("[!] Could not retrieve transaction history.")
            
    except Exception as e:
        print(f"[!] Error: {e}")

if __name__ == "__main__":
    find_indexer()
