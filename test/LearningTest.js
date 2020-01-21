/**
 * A learning test for Twitch WebSub.
 */

const express = require('express');
const requester = require('axios');
import { clientID } from "../references/authentications";
import { hubCallback } from "../references/authentications";

// TODO 1: Get mocha to start/stop server with each test.

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
                'hub.callback': hubCallback,
                'hub.mode': 'subscribe',
                'hub.topic': 'https://api.twitch.tv/helix/users/follows?first=1&to_id=159498717',
                'hub.lease_seconds': 600
            }

        })
            .then(response => console.log("*** Twitch responded to subscribe request with code: ", response.status))
            .catch(error => console.log("*** Error: ", error.response.status, "\n*** Status text: ", error.response.statusText));
    });

    // Note: not a good test. But this is the feature I ultimately want to create.
    // TODO 2: Must learn how to provide authorization. Link:
    // https://github.com/TwitchDev/authentication-samples/tree/master/node
    it("should return an 'expires_at' response key", (done) => {
        requester({
            method: 'GET',
            url: 'https://api.twitch.tv/helix/webhooks/subscriptions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer APP-ACCESS-TOKEN`
            }
        })
            .then(response => { 
                console.log("*** Response Status: ", response.status);
                console.log("*** Response Data: ", response.data);
                // Note: I need to read the response.data keys first to know what the
                // 'expires_at' key looks like.
                return expect(response.data['expires_at']);
            })
            .catch(error => console.log("*** Error: ", error.response.status, "\n*** Status text: ", error.response.statusText));
    });
});