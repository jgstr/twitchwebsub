# A Twitch WebSub Client That Subscribes to Twitch Events

This application uses the Twtich WebSub (webhook) protocol to subscribe to events on Twitch.

## What it does (and why I did it)

I received this project as an instructive assignment. The intentions were:

1. To use test-driven development (as described in GOOS)
2. To use practice patterns like Ports & Adapters and Clean Code
3. To rely on an external API
4. To make it as scalable and resilient as possible (thus the somewhat overly engineered design)

Let's say you have a Twitch account and like certain streams and stream. You can use this Desktop/Curl app to receive certain follow and stream updates from users and store that information in a database.

So if user CapnHowdy (with ID 90210) has a new follower, you will receive an update from Twitch with the information.

This is an on-going project that I will use to demonstrate the web programming ideas I learn. I consider this project about 75% complete as of this writing. It's missing a few key features and requires some refactoring.

I am forever grateful for my coach and mentor who guided me through this project even when I thought I couldn't do it.

## What you'll need to run this locally

1. A Twitch Developer account, specifically a **Client ID** and **Client Secret**.
2. An OAuth Token (see [these instrunctions](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth#oauth-client-credentials-flow))
3. [Ngrok](https://ngrok.com/) installed
4. [node](https://nodejs.org/en/) and npm
5. [Docker](https://www.docker.com/) and [Compose](https://docs.docker.com/compose/)

## How to run

_Coming Soon..._
