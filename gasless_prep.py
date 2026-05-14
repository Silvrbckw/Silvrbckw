import os
import requests
from dotenv import load_dotenv

load_dotenv()

def prepare_gasless_swap():
    api_key = os.getenv('ONEINCH_API_KEY')
    wallet = os.getenv('WALLET_ADDRESS')
    
    print(f"[!] PREPARING GASLESS SETTLEMENT FOR: {wallet}")
    
    # 1inch Fusion API endpoint for Arbitrum
    url = f"https://api.1inch.dev/fusion/v1.0/42161/quote"
    
    # We swap $10 of USDC for ETH to fund the undelegation
    params = {
        "fromTokenAddress": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", # USDC
        "toTokenAddress": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", # ETH
        "amount": "10000000" # 10 USDC
    }
    
    headers = {"Authorization": f"Bearer {api_key}"}

    try:
        # This will give us a "signed order" that requires NO GAS to submit
        response = requests.get(url, params=params, headers=headers)
        print("[*] 1INCH FUSION QUOTE RECEIVED.")
        print("[!] ACTION: Use Rabby to sign the Fusion Swap. It will NOT cost ETH.")
    except Exception as e:
        print(f"[!] Swap Prep Error: {e}")

if __name__ == "__main__":
    prepare_gasless_swap()
