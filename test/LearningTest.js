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

        // Handle Twitch subscription validation.
        server.get('/', (request, response) => {
            if (request.query['hub.challenge']) {
                response.set('Content-Type', 'text/html')
                response.status(200).send(request.query['hub.challenge']);
            }
            done();
        });

        // Handle Twitch notifications (after subscription successful).
        server.post('/', (request, response) => {
            console.log('*** Twitch notification body: ', request.statusCode);
        });

        server.listen(port, () => {
            console.log(`*** Listening on port ${port}`);
        });

        // Request subscription for Twitch topic.
        requester({
            method: 'POST',
            url: 'https://api.twitch.tv/helix/webhooks/hub',
            headers: {
                'Content-Type': 'application/json',
                'Client-ID': clientID
            },
            data:
            {
                'hub.callback': 'https://a0239221.ngrok.io', // ngrok Basic plan URL changes with each run.
                'hub.mode': 'subscribe',
                'hub.topic': 'https://api.twitch.tv/helix/users/follows?first=1&to_id=159498717',
                'hub.lease_seconds': 600
            }

        })
            .then(response => console.log("*** Twitch responded to subscribe request with code: ", response.status))
            .catch(error => console.log("*** Error: ", error.response.status, "\n*** Status text: ", error.response.statusText));
    });
});