// NodeJS App to:
// 1. Send HTTP Request to Twitch to register subscription
// 2. Handle all Responses and Requests (notifications) from Twitch 
// (ie. If Twitch sends a POST and expects a 200 response, I should fulfill that)

import {clientID} from "../references/authentications";
const http = require("http");
const https = require('https');

const hostname = '127.0.0.1';
const port = 9000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// This makes the same call to the dummy/sample stream shown on the Twitch Getting Started page.
// Next: Use this as a starting point to send a GET Request to a subscription Webhook.
// Note: This ID has been deleted. Create new Client-ID and move to external/ignored file.
const options = {
  hostname: 'api.twitch.tv',
  path: '/helix/streams?game_id=33214',
  method: 'GET',
  headers: {
      'Client-ID': clientID
  }
}

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.end();
