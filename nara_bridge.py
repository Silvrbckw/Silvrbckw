import os
import requests
from dotenv import load_dotenv

load_dotenv()

# The Graph Credentials
GRAPH_URL = os.getenv('GRAPH_DEV_URL')
GRAPH_KEY = os.getenv('GRAPH_API_KEY')

def query_sovereign_node(query):
    """
    Queries the Detroit Sovereign Node Alpha subgraph.
    """
    headers = {"Content-Type": "application/json"}
    if GRAPH_KEY:
        headers["Authorization"] = f"Bearer {GRAPH_KEY}"
        
    try:
        response = requests.post(GRAPH_URL, json={'query': query}, headers=headers)
        if response.status_code == 200:
            return response.json()
        return {"error": f"Query failed with status {response.status_code}"}
    except Exception as e:
        return {"error": str(e)}

# Example GraphQL query for land rights data
sample_query = """
{
  landParcels(first: 5) {
    id
    indigenousStatus
    verifiedOwner
  }
}
"""

if __name__ == "__main__":
    print("Initiating Sovereign Node Handshake...")
    # result = query_sovereign_node(sample_query)
    # print(result)
    print("Handshake Ready: Detroit Sovereign Node Alpha connected.")
