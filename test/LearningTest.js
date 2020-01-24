/**
 * A learning test for Twitch WebSub.
 */

const express = require('express');
const requester = require('axios');
import { clientID, hubCallback, liveChannelID } from "../references/authentications";

let server;
const port = 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

describe("Twitch WebSub", function() {

    this.timeout(60000);

    beforeEach(function() {
        server = app.listen(port, () => {
            console.log(`*** Server running on port ${port}.`);
        });
    });

    // Useful for 1.a: Add/Renew Subscription
    // and for 1.b: Remove Subscription
    it("should call a validation endpoint", function(done) {
        // Handle Twitch subscription validation.
        app.get('/', (request, response) => {
            if (request.query['hub.challenge']) {
                response.set('Content-Type', 'text/html');
                response.status(200).send(request.query['hub.challenge']);
                console.log(`*** Hub Challenge: ${request.query['hub.challenge']}`);
            }
        });

        app.post('/', (request, response) => {
            response.set('Content-Type', 'text/html');
            response.status(200);
            console.log('*** Notification request: ', request.body);
            done();
        });

        // Request subscription for Twitch topic. Note: Subscriber ID might have to change frequently to receive a Twitch GET validation
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
                'hub.topic': `https://api.twitch.tv/helix/users/follows?first=1&to_id=${liveChannelID}`,
                'hub.lease_seconds': 600
            }

        })
            .then(response => console.log("*** Twitch responded to subscribe request with code: ", response.status))
            .catch(error => console.log("*** Error: ", error.response.status, "\n*** Status text: ", error.response.statusText));
    });

    afterEach(function() {
        server.close();
        console.log("*** Server stopped.");
    });
});