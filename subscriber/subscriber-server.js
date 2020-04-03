'use strict';
const express = require('express');
import { clientID, hubCallback, hubUrl, hubTopic, notificationsDatabaseDockerConfig } from "./authentications";
// import { requestSubscription } from './subscriber-utils';
const subscriber = require('./subscriber');
import { createDataStore } from './adapters/data-store';
import { createTwitchAdapter } from './adapters/twitch';
import { subscriptionRecordStub, subscriptionRequestStub } from './doubles/subscriptions';
import bodyParser from "body-parser";


const port = 3000;
const app = express();
app.use(bodyParser.json());

const dataStore = createDataStore(notificationsDatabaseDockerConfig);
const twitchAdapter = createTwitchAdapter();

app.get('/', (request, response) => {
  response.status(200).send('Welcome to a Twitch Websub Service.');
});

app.get('/status', (request, response) => {

  dataStore.checkStatus()
    .then(() => { return response.status(200).send('Running.'); })
    .catch(() => { return response.status(500).send('Not running.'); });

});

app.get('/get-subscriptions', (request, response) => {

  subscriber.getAllSubscriptions(dataStore)
    .then((results) => {
      return response.status(200).json({ list: results });
    })
    .catch((error) => {
      return response.status(500).send(error);
    });

});

app.get('/get-events', (request, response) => {

  // TODO: Create subscriber unit test.
  dataStore.getAllEvents()
    .then((results) => {
      return response.status(200).json({ list: results });
    })
    .catch((error) => {
      return response.status(500).send(error);
    });

});

app.post('/subscribe', (request, response) => {
  response.status(200).send('OK');
  subscriber.requestSubscription(twitchAdapter, subscriptionRequestStub); // TODO: Replace stub with formatted subscription object from request.body

});

app.get('/approval-callback', (request, response) => {

  if (request.query['hub.challenge']) {
    response.set('Content-Type', 'text/html');
    response.status(200).send(request.query['hub.challenge']);
  }

  dataStore.saveSubscription(subscriptionRecordStub);

});

app.post('/approval-callback', (request, response) => {
  // TODO: Must use and check for a secret in next iteration to ensure this request is genuine!
  response.set('Content-Type', 'text/html');
  response.status(200).send('Ok');

  dataStore.saveEvent({ data: { id: 1234, user_id: 4321 } });

})

const start = () => { return app.listen(port, () => { console.log(`Running on port ${port}`); }); };

app.listen(port);
console.log(`Running on port: ${port}`);

module.exports = { start };

