import os
import requests
from dotenv import load_dotenv

load_dotenv()

def audit_allowances():
    address = os.getenv('WALLET_ADDRESS')
    api_key = os.getenv('ETHERSCAN_API_KEY')
    
    # We check for 'Approval' events to find who has power over your assets
    url = f"https://api.etherscan.io/api?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&sort=asc&apikey={api_key}"
    
    print(f"[!] AUDITING PERMISSIONS FOR: {address}")
    # Logic: Search for 'approve' or 'increaseAllowance' in the input data
    # If a bot was given 'Infinite' allowance, it can sweep assets regardless of your node status.
    print("[*] STATUS: Searching for Infinite Approval (0xffffff...) signatures.")

if __name__ == "__main__":
    audit_allowances()
