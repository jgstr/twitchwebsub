# A Twitch WebSub Client That Subscribes to Twitch Events

This application uses the Twitch WebSub (webhook) protocol to subscribe to events on Twitch. I'm still adding features, so expect this guide to change.

## What it does (and why I did it)

I received this project as an instructive assignment. The intentions were:

1. To use test-driven development (as described in [GOOS](http://www.growing-object-oriented-software.com/))
2. To identify and use patterns like [Ports & Adapters](http://wiki.c2.com/?PortsAndAdaptersArchitecture) and [Clean Code](https://www.oreilly.com/library/view/clean-code/9780136083238/)
3. To handle an uncontrolled, external API
4. To make it as scalable and resilient as possible (thus the somewhat overly-engineered design)

Let's say you have a Twitch account and like certain streams and users. You can use this Desktop/Curl app to receive certain follow and stream updates from users and store that information in a database.

So if user CapnHowdy (with ID 90210) has a new follower, you will receive an update from Twitch with the information.

This is an on-going project demonstrating the web programming ideas I learn. I consider this project about 75% complete as of this writing. It's missing a few key features and requires some refactoring.

I am forever grateful for my coach and mentor who guided me through this project even when I thought I couldn't do it.

## What you'll need to run this locally

1. A [Twitch Developer account](https://dev.twitch.tv/), specifically a _Client ID_ and _Client Secret_.
2. An OAuth Token (see [these instructions](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth#oauth-client-credentials-flow))
3. [Ngrok](https://ngrok.com/) installed
4. [node](https://nodejs.org/en/) and npm
5. [Docker](https://www.docker.com/) and [Compose](https://docs.docker.com/compose/)
6. [curl](https://curl.haxx.se/download.html)

## How to run

For the best introduction, check out _[this video](https://vimeo.com/422954757/95166b91f5)_ I made for it. It's up to date as of May 26, 2020. I'll try to update it as I progress.

### Run for testing and development

1. Install everything listed above and get your Twitch developer credentials.
2. Navigate to your folder of choice and `git clone` this repository.
3. Run `npm install` in the terminal.
4. Make sure you have Docker desktop running.
5. Look inside `package.json` under `scripts` for all of the scripts you can run.
6. The most important script is `npm run e2e`. This runs the end-to-end test. Other tests include `subscriber-tests` (the unit tests), `twitch-int-tests`, `data-store-int-tests`.

### Run Against The Real Twitch (aka, Live or Production mode)

1. To run the app _without the tests_, first run `npm run write-env-local`, then `docker-compose up`, both from the root folder. You will then have to run the `fake-twitch` server in another terminal window on port `3001`. But this is the _least reliable environment_ for the app. The most useful modes are in test mode or live/production mode.
2. To run in _live/production_ mode: First, use `npm run start-ngrok`. You will have to change the `start-ngrok` script to run ngrok wherever you installed it. I have ngrok in my user directory. Second, use `npm run start-locally`.
3. You can now use curl and/or the browser to send information to the app. See the _Currently Working App API Endpoints_ section.

### Currently Working App API Endpoints

Check out the `end-to-end/subscriber-driver.js` file. It acts as a "user" of app and is the best referral for working features. For api.twitch.tv/helix endpoints, consult [this documentation](https://dev.twitch.tv/docs/api/webhooks-reference) for more details.

1. Send a subscription request to receive events for new followers of a user: use curl to send a POST request with the following:

```
curl -H "Content-Type: application/json" \
-H "client-id: YOUR_CLIENT_ID" \
-H "Authorization: Bearer YOUR_OAUTH_TOKEN" \
-X POST "http://localhost:3000/subscribe?to_id=USER_ID&topic=follows"
```

2. Get all saved subscriptions: Using a browser (or curl), enter `http://localhost:3000/get-subscriptions`.
3. Get details of a specific subscription: `http://localhost:3000/get-subscription/SUBSCRIPTION_ID`
4. Get all events of a subscription: `http://localhost:3000/get-events/SUBSCRIPTION_ID`.
5. This section will change I as add new features.

### Other Important Scripts and Commands

1. Validate your OAuth Token: `curl -H "Authorization: OAuth YOUR_OAUTH_TOKEN" "https://id.twitch.tv/oauth2/validate"`
2. Receive your OAuth Token: `curl -X POST "https://id.twitch.tv/oauth2/token?client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&grant_type=client_credentials"` (Client Credentials is the only authentication type necessary for this app). You should expect a response from Twitch similar to: `{"access_token":"YOUR_NEW_ACCESS_TOKEN","expires_in":1234567,"token_type":"bearer"}`
3. Get currently streaming Twitch users and IDs: `npm run get-twitch-user-id`.

## MORE COMING SOON...
