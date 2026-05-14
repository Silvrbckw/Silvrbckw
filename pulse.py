import os
import requests
import csv
from datetime import datetime

# 1. SECURE PATHING & IDENTITY
# Targets your Detroit node environment to protect NARA, Stripe, and Alchemy keys
ENV_PATH = os.path.expanduser("~/sovereign-workspace/sovereign-gateway/.env")

def get_env_secret(target_key):
    try:
        with open(ENV_PATH, "r") as f:
            for line in f:
                if "=" in line and not line.strip().startswith("#"):
                    k, v = line.split("=", 1)
                    if k.strip() == target_key:
                        return v.strip().strip('"').strip("'").strip()
    except Exception as e:
        return None

# Credentials for RCS DISTRIBUTION AND RETAIL, LLC
ENTITY = get_env_secret("LLC_NAME") or "RCS DISTRIBUTION AND RETAIL, LLC"
WALLET = get_env_secret("ETH_WALLET")
ETH_KEY = get_env_secret("ETHERSCAN_API_KEY") # Shared for Arbiscan
GOLD_KEY = get_env_secret("GOLD_API_KEY")

# ARBITRUM & GRAPH ASSET ADDRESSES
GRT_ARB_TOKEN = "0x9623063377AD1B27544C965cCd7342f7EA7e88C7"
WETH_ARB_TOKEN = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1"

# 2. ASSET RETRIEVAL FUNCTIONS
def get_gold_spot():
    """Fetches real-time Gold valuation for estate audits."""
    if not GOLD_KEY: return 0.0
    url = "https://www.goldapi.io/api/XAU/USD"
    headers = {"x-access-token": GOLD_KEY, "Content-Type": "application/json", "User-Agent": "curl/7.81.0"}
    try:
        r = requests.get(url, headers=headers, timeout=10)
        return r.json().get('price', 0.0) if r.status_code == 200 else 0.0
    except: return 0.0

def get_arb_token_balance(contract_address):
    """Queries Arbitrum for specific 'combos' like WETH or GRT."""
    if not WALLET or not ETH_KEY: return 0.0
    # Utilizing Arbitrum V2 Endpoint to avoid deprecation
    url = f"https://api.arbiscan.io/api?module=account&action=tokenbalance&contractaddress={contract_address}&address={WALLET}&tag=latest&apikey={ETH_KEY}"
    try:
        r = requests.get(url, timeout=10).json()
        return int(r.get('result', 0)) / 1e18 if r.get('status') == '1' else 0.0
    except: return 0.0

# 3. MAIN COMMAND CENTER
def main():
    print(f"\n--- {ENTITY} ---")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Execute Pulse Scans
    gold_price = get_gold_spot()
    liquid_grt = get_arb_token_balance(GRT_ARB_TOKEN)
    arb_weth = get_arb_token_balance(WETH_ARB_TOKEN)
    
    # Financial Display for Credit/Collateral Leverage
    print(f"{'Gold Spot (XAU):':<20} ${gold_price:,.2f}/oz")
    print(f"{'Liquid GRT:':<20} {liquid_grt:.2f} GRT")
    print(f"{'Arbitrum WETH:':<20} {arb_weth:.4f} ETH")
    print(f"{'Thawing Assets:':<20} ~109.00 GRT (Locked/Pending)") 
    
    # 4. SECURE WEALTH LOGGING
    # Anchors your audit trail for Detroit and Mississippi property searches
    try:
        log_path = os.path.expanduser("~/sovereign-workspace/sovereign-gateway/wealth_log.csv")
        with open(log_path, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([datetime.now().strftime("%Y-%m-%d %H:%M"), arb_weth, liquid_grt, gold_price])
    except: pass
    
    print("-" * 45)
    print("Node Status: Operational | Pectra-Sync Ready")

if __name__ == "__main__":
    main()
