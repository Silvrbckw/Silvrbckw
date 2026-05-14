import os
from bs4 import BeautifulSoup

def audit_gateway_html(file_path):
    with open(file_path, 'r') as f:
        soup = BeautifulSoup(f, 'html.parser')
    
    print(f"--- Auditing: {file_path} ---")
    
    # 1. SEO Check
    title = soup.find('title')
    if title:
        print(f"[✓] Title Found: {title.text}")
    else:
        print("[!] MISSING: Title tag for SEO.")
        
    # 2. Performance Check (Internal CSS limit)
    skin = soup.find('b:skin')
    if skin and len(skin.text) > 5000:
        print("[!] WARNING: CSS is getting heavy. Consider minifying.")
    else:
        print("[✓] CSS Payload: Optimized.")

    # 3. Privacy Check
    if "0x42" in soup.get_text():
        print("[CRITICAL] WARNING: Private Wallet Address detected in HTML!")
    else:
        print("[✓] Privacy: No restricted addresses found.")

if __name__ == "__main__":
    # Point this to your Gateway HTML file
    audit_gateway_html('gateway.html')
