import os

# Define the restricted patterns based on your 2026 infrastructure
RESTRICTED_SENSITIVE_DATA = [
    "97f73216-e53e-11ee-bc08-7f627256a39a", # Mercury ID
    "QmWFrrUNMGJ28GXuy3ohbQDNBVJ1nuGqU6D88o4ffJbZ8z", # Graph Deployment ID
    "86063", # Graph User ID
    "0x42", # Placeholder for your private wallet prefix
    "NARA_API_KEY",
    "CDP_API_KEY",
    "PINATA_JWT",
    "GEMINI_DAPP_COMPANION_KEY"
]

def run_enterprise_audit(file_path):
    print(f"--- High-Security Audit: {file_path} ---")
    if not os.path.exists(file_path):
        print(f"[!] File {file_path} not found.")
        return

    with open(file_path, 'r') as f:
        content = f.read()

    leaks_found = 0
    for secret in RESTRICTED_SENSITIVE_DATA:
        if secret in content:
            print(f"[X] CRITICAL LEAK DETECTED: {secret}")
            leaks_found += 1
    
    if leaks_found == 0:
        print("[✓] Clean: No restricted addresses or enterprise keys found.")
    else:
        print(f"[!] Audit Failed: {leaks_found} potential leaks identified.")

if __name__ == "__main__":
    # Audit your public-facing files
    run_enterprise_audit("gateway.html")
    # run_enterprise_audit("nara_bridge.py")
