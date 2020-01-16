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

// TODO: Must handle the hub.callback. But am not sure how. I assume I will handle 
// something like /subscription-callback with Node. I must respond with 2xx code.

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Subscription POST Request
const options = {
  hostname: 'api.twitch.tv',
  path: '/helix/streams?game_id=33214',
  method: 'POST',
  headers: {
      'hub.callback': 'https://localhost.com/9000/subscribe-response', // Unsure how to setup a test API endpoint
      'hub.mode': 'subscribe',
      'hub.topic': '?', // Unsure what Topic is.
      'hub.lease_seconds': 864000
  }
}

const subscriptionRequest = https.request(options, res => {
  console.log(`*** Twitch WebSub Response statusCode: ${res.statusCode}`);

  res.on('data', d => {
    process.stdout.write("*** Twitch WebSub Response Data: ", d);
  });
});

subscriptionRequest.on('error', error => {
  console.error("*** Error: ", error);
});

subscriptionRequest.end();

      // ### SNIPPETS AND REFERENCES ###

// This makes the same call to the dummy/sample stream shown on the Twitch Getting Started page.
// Next: Use this as a starting point to send a GET Request to a subscription Webhook.
/*

const options = {
  hostname: 'api.twitch.tv',
  path: '/helix/streams?game_id=33214',
  method: 'GET',
  headers: {
      'Client-ID': clientID
  }
}

const dummyRequest = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', d => {
    process.stdout.write(d);
  });
});

dummyRequest.on('error', error => {
  console.error(error);
});

dummyRequest.end();

*/