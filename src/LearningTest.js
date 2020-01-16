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
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World!');
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// 1. Send Subscribe HTTP Request to Twitch.
const options = {
  hostname: 'api.twitch.tv',
  path: '/helix/streams?game_id=33214',
  method: 'POST',
  headers: {
      'hub.callback': 'https://dacf3b59.ngrok.io ', // ngrok Basic plan URL changes with each run.
      'hub.mode': 'subscribe',
      'hub.topic': 'https://api.twitch.tv/helix/streams?user_id=5678', // Note: these are dummy IDs. Might need real IDs.
      'hub.lease_seconds': 864000
  }
}

const subscriptionRequest = https.request(options, res => {
  console.log(`*** Twitch WebSub Response statusCode (should be '202'): ${res.statusCode}`);

// 2. Process Twitch HTTP Response (should be '202').
  res.on('data', d => {
    process.stdout.write("*** Twitch WebSub Response Data: ", d);
  });
});

subscriptionRequest.on('error', error => {
  console.error("*** Error: ", error);
});

subscriptionRequest.end();

// 3. Process incoming Twitch Subscription confirmation GET Request.

// 4. Respond to confirmation with 2xx and hub.challenge (in query parameters), all text/plain.
//    Eventually use 404 for errors as well.

// 5. Handle incoming Twitch notification POST Requests. Respond with 2xx.



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