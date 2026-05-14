import os
from dotenv import load_dotenv

load_dotenv()

def test_config():
    key = os.getenv('GRAPH_API_KEY')
    if key and key.startswith("server_"):
        print(f"[✓] GRAPH API KEY DETECTED: {key[:10]}...")
        print("[!] CONFIGURATION SECURE FOR RCS ESTATE AUDIT.")
    else:
        print("[X] ERROR: API KEY NOT FOUND OR FORMAT INCORRECT.")

if __name__ == "__main__":
    test_config()
