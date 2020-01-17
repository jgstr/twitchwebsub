import { clientID } from "../references/authentications";

// 1/17/2020
// Next: use Axios (sending requests), Express for receiving. Also, stop server when test finishes.
// Next: Get to this point again (using new tools)
// Finally: return validation AND wait for actual event (aka an active streamer).
// Note: lease seconds are not the thing we required (see pinned project).
// Read about HTTP. Axios and Express documentation can be helpful. Chucked response/msg. Content encoding.

describe("Twitch WebSub", () => {
  it("should call a validation endpoint", (done) => {
    // NodeJS App to:
    // 1. Send HTTP Request to Twitch to register subscription
    // 2. Handle all Responses and Requests (notifications) from Twitch 
    // (ie. If Twitch sends a POST and expects a 200 response, I should fulfill that)

    const http = require("http");
    const https = require('https');

    const hostname = '127.0.0.1';
    const port = 9000;

    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write('Hello from NodeJS localhost:9000!');
      res.end();
      console.log(req);
      done();
    });
    // Note: ngrok must use the $./ngrok http 9000 syntax, NOT http http://localhost:9000

    server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });


    // 1. Send Subscribe HTTP Request to Twitch.
    const options = {
      hostname: 'api.twitch.tv',
      path: '/helix/webhooks/hub',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-ID': clientID
      }
    }

    const subscriptionRequest = https.request(options, res => {
      console.log(`*** Twitch Response statusCode (should be '202'): ${res.statusCode}\n`);
      console.log(`*** Twitch Response statusMessage: ${res.statusMessage}\n`);

      // 2. Process Twitch HTTP Response (should be '202').
      res.on('data', d => {
        process.stdout.write("*** Twitch Response Data: ", d);
      });
    });

    subscriptionRequest.write(JSON.stringify(
      {
        'hub.callback': 'http://d00e3baf.ngrok.io', // ngrok Basic plan URL changes with each run.
        'hub.mode': 'subscribe',
        'hub.topic': 'https://api.twitch.tv/helix/users/follows?first=1&to_id=26301881',
        'hub.lease_seconds': 864000
      }
    ));

    subscriptionRequest.on('error', error => {
      console.error("*** Error: ", error);
    });

    subscriptionRequest.end();

    // 3. Process incoming Twitch Subscription confirmation GET Request.

    // 4. Respond to confirmation with 2xx and hub.challenge (in query parameters), all text/plain.
    //    Eventually use 404 for errors as well.

    // 5. Handle incoming Twitch notification POST Requests. Respond with 2xx.

  });
});




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