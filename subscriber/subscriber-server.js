'use strict';
const express = require('express');
import { hubCallback, notificationsDatabaseDockerConfig } from "./authentications";
const subscriber = require('./subscriber');
import { createDataStore } from './adapters/data-store';
import { createTwitchAdapter } from './adapters/twitch';
import { subscriptionRecordStub, subscriptionRequestStub } from './doubles/subscriptions';
import { hubUrl as twitchHub } from './authentications';
import bodyParser from "body-parser";
import { uuid } from 'uuidv4';

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
  response.status(200).send('Received.');

  const subId = uuid();

  const subscription = {
    id: subId,
    hubUrl: twitchHub,
    clientID: request.headers['client-id'],
    hubCallback: hubCallback + `-${subId}`,
    hubTopic: request.body['hub.topic']
  };

  subscriber.requestSubscription(twitchAdapter, subscription); 

});

// TODO: Add express variables parameters using subscription id.
app.get('/approval*', (request, response) => {

  if (request.query['hub.challenge']) {
    response.set('Content-Type', 'text/html');
    response.status(200).send(request.query['hub.challenge']);
  }

  dataStore.saveSubscription(subscriptionRecordStub);

});

app.post('/approval*', (request, response) => {
  // TODO: Must use and check for a secret in next iteration to ensure this request is genuine!
  response.set('Content-Type', 'text/html');
  response.status(200).send('Ok');

  dataStore.saveEvent({ data: { id: 1234, user_id: 4321 } });

})

const start = () => { return app.listen(port, () => { console.log(`Running on port ${port}`); }); };

app.listen(port);
console.log(`Running on port: ${port}`);

module.exports = { start };

