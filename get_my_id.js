const https = require('https');

const wallet = "0x426ca4a1D4b739D7825Adb9f8db67e37795d8BEa";
// The 'getWithdrawalRequests' function signature for Lido
const data = JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "eth_call",
  params: [{
    to: "0x7d6560d6f677cd1847ad61be57309907f1816e82", // Holesky Lido Address
    data: "0x8849b292000000000000000000000000" + wallet.slice(2).toLowerCase()
  }, "latest"]
});

const options = {
  hostname: 'ethereum-holesky-rpc.publicnode.com',
  port: 443,
  path: '/',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
};

const req = https.request(options, (res) => {
  let output = '';
  res.on('data', (d) => output += d);
  res.on('end', () => {
    const response = JSON.parse(output);
    console.log("RAW RESPONSE:", response.result);
    if (response.result === "0x") {
        console.log("Result: No requests found on this network for this wallet.");
    } else {
        console.log("Success! Found data. Let's decode this hex.");
    }
  });
});

req.on('error', (e) => console.error("Network Error:", e));
req.write(data);
req.end();
