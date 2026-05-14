import os
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

# Network selection - change to your Alchemy Arbitrum URL for ARB/GRT
RPC_URL = f"https://eth-mainnet.g.alchemy.com/v2/{os.getenv('ALCHEMY_KEY')}"
w3 = Web3(Web3.HTTPProvider(RPC_URL))

def revoke_allowance(token_address, spender_address):
    # Standard ERC20 ABI for Approval
    abi = '[{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"type":"function"}]'
    
    account = os.getenv('WALLET_ADDRESS')
    # Private key is required to sign the transaction - ensure it's in .env SECURELY
    private_key = os.getenv('PRIVATE_KEY') 
    
    token_contract = w3.eth.contract(address=token_address, abi=abi)
    
    print(f"[!] REVOKING ALLOWANCE for Spender: {spender_address}")
    
    # Building the transaction to set allowance to 0
    tx = token_contract.functions.approve(spender_address, 0).build_transaction({
        'from': account,
        'nonce': w3.eth.get_transaction_count(account),
        'gas': 50000,
        'gasPrice': w3.eth.gas_price
    })
    
    signed_tx = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    
    print(f"[*] REVOKE SENT. Hash: {tx_hash.hex()}")
    print("[!] STATUS: SHIELD ACTIVE. SWEEPER BOT BLOCKED.")

if __name__ == "__main__":
    # Example: revoke_allowance("TOKEN_CONTRACT_ADDRESS", "SPENDER_TO_BLOCK")
    print("Update the script with the specific addresses found in your audit.")
