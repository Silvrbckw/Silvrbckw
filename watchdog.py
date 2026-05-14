import requests
import time
import os

# Configuration from your .env or manual entry
API_KEY = "DQuikg2pbW7oogiSBaPaRN8zS3gYICiWOkQi9FYkNTo"
WALLET_ADDR = "0x426ca4a1D4b739D7825Adb9f8db67e37795d8BEa"
INDICES = ["1", "1788", "1789", "1790", "327458"]

def check_validator_withdrawals():
    for index in INDICES:
        url = f"https://beaconcha.in/api/v1/validator/{index}/withdrawals"
        headers = {"accept": "application/json", "apikey": API_KEY}
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if data['data']:
                # If a withdrawal just happened, alert immediately
                latest = data['data'][0]
                print(f"ALERT: Withdrawal of {latest['amount']/1e9} ETH detected for Validator {index}!")
            else:
                print(f"Validator {index}: No recent withdrawals.")

if __name__ == "__main__":
    print(f"RCS Watchdog active for Walter DeShawn McGhee...")
    while True:
        check_validator_withdrawals()
        # Checks every 12 minutes (roughly one Ethereum epoch)
        time.sleep(720)
