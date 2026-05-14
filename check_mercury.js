const axios = require('axios');
require('dotenv').config();

async function checkCash() {
    const apiKey = process.env.MERCURY_API_KEY;
    const url = 'https://api.mercury.com/api/v1/accounts';

    console.log("📡 Pinging Mercury Bank API...");

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'accept': 'application/json'
            }
        });

        const accounts = response.data.accounts;
        if (accounts.length === 0) {
            console.log("❌ No accounts found. Handshake successful, but balance is $0.");
            return;
        }

        accounts.forEach(acc => {
            console.log(`💰 Account: ${acc.name} | Available: $${acc.availableBalance}`);
        });

    } catch (error) {
        console.error("❌ Mercury Connection Failed:", error.response ? error.response.data : error.message);
    }
}
checkCash();
