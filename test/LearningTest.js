/**
 * A learning test for Twitch WebSub.
 */

// Note: ngrok must use the $./ngrok http 3000 syntax, NOT http http://localhost:3000
const express = require('express');
const requester = require('axios');
import { clientID } from "../references/authentications";

describe("Twitch WebSub", () => {
    it("should call a validation endpoint", (done) => {

        const port = 3000;
        const server = express();

        // *2
        server.get('/', (request, response) => {
            // Check the request.
            console.log("*** Twitch request queries: ", request.query);
            // Respond as needed.
            done();
        });

        server.listen(port, () => {
            console.log(`*** Listening on port ${port}`);
        });

        // 1. Send Subscribe HTTP Request to Twitch. (Axios)
        requester({
            method: 'POST',
            url: 'http://api.twitch.tv/helix/webhooks/hub',
            headers: {
                'Content-Type': 'application/json',
                'Client-ID': clientID
            },
            data: 
                {
                  'hub.callback': 'http://f2fdbd2c.ngrok.io', // ngrok Basic plan URL changes with each run.
                  'hub.mode': 'subscribe',
                  'hub.topic': 'https://api.twitch.tv/helix/users/follows?first=1&to_id=26301881',
                  'hub.lease_seconds': 600
                }
            
        })
        .then(response => console.log("*** Twitch responded to subscribe request with code: ", response.status))
        .catch(error => console.log("*** Error: ", error.response.status, "\n*** Status text: ", error.response.statusText));

        // 2. Process Twitch HTTP Response (should be '202'). (Express)

        // 3. Process incoming Twitch Subscription confirmation GET Request. (Express)

        // 4. Respond to confirmation with 2xx and hub.challenge (in query parameters), all text/plain.
        //    Eventually use 404 for errors as well. (Express)

        // 5. Handle incoming Twitch notification POST Requests. Respond with 2xx. (Express)

    });
});