import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv('NARA_API_KEY')

if key:
    print("Handshake Ready: NARA_API_KEY detected in sovereign workspace.")
else:
    print("Handshake Failed: Check your .env file in ~/sovereign-workspace/sovereign-gateway")
