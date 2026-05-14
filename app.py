import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import requests

# 1. Load the Sovereign Vault keys
load_dotenv()

app = Flask(__name__)

# Credentials from .env
NARA_API_KEY = os.getenv("NARA_API_KEY")
ONEINCH_API_KEY = os.getenv("ONEINCH_API_KEY")

@app.route('/')
def home():
    return "Sovereign Gateway Active. RCS DISTRIBUTION AND RETAIL, LLC."

@app.route('/search_lineage', methods=['GET'])
def search_lineage():
    """
    Queries the National Archives (NARA) v2 API for textual records.
    Case-sensitive parameters applied for heritage research.
    """
    name = request.args.get('name')
    if not name:
        return jsonify({"error": "No name provided"}), 400

    url = "https://catalog.archives.gov/api/v2/records/search"
    
    # NARA v2 strict requirements: 'Textual Records' must be capitalized
    params = {
        "q": name,
        "limit": 10,
        "typeOfMaterials": "Textual Records"
    }
    
    headers = {
        "Content-Type": "application/json",
        "x-api-key": NARA_API_KEY
    }

    print(f"[*] Gateway: Initiating Heritage Search for '{name}'...")
    
    try:
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code == 200:
            print(f"[+] Success: Records retrieved for {name}.")
            return jsonify(response.json())
        else:
            print(f"[!] NARA API Error: {response.status_code}")
            return jsonify({
                "error": "Archives Connection Failed",
                "status": response.status_code,
                "details": response.json() if response.status_code == 422 else response.text
            }), response.status_code

    except Exception as e:
        print(f"[!] System Error: {str(e)}")
        return jsonify({"error": "Gateway Internal Error", "message": str(e)}), 500

@app.route('/check_liquidity', methods=['GET'])
def check_liquidity():
    """
    Checks the Arbitrum balance for RCS DISTRIBUTION AND RETAIL, LLC 
    using the 1inch Business API.
    """
    # Arbitrum Chain ID: 42161
    wallet_address = "0x426ca4a1D4b739D7825Adb9f8db67e37795d8BEa"
    url = f"https://api.1inch.dev/balance/v1.2/42161/balances/{wallet_address}"
    
    headers = {"Authorization": f"Bearer {ONEINCH_API_KEY}"}
    
    try:
        response = requests.get(url, headers=headers)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": "1inch Liquidity Check Failed", "message": str(e)}), 500

if __name__ == '__main__':
    # Initializing on Localhost Port 5000
    print("--- SOVEREIGN GATEWAY INITIALIZED ---")
    print("Owner: RCS DISTRIBUTION AND RETAIL, LLC")
    app.run(host='0.0.0.0', port=5000)
