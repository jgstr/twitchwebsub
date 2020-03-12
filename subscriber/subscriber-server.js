'use strict';
const express = require('express');
const axios = require('axios');
import { clientID, hubCallback, hubUrl, hubTopic, notificationsDatabaseDockerConfig } from "./authentications";
import { getPool } from './subscriber-utils';
import { createDataStore } from './data-store';

const port = 3000;
const app = express();

let pool = getPool(notificationsDatabaseDockerConfig);
const dataStore = createDataStore(pool);

app.get('/', (request, response) => {
  response.status(200).send('Welcome to a Twitch Websub Service.');
});

app.get('/get-subscriptions', (request, response) => {

  dataStore.getAllSubscriptions()
    .then((results) => {
      return response.status(200).json({ list: results });
    })
    .catch((error) => {
      return response.status(500).send(error);
    });

});

app.get('/get-events', (request, response) => {

  dataStore.getAllEvents()
    .then((results) => {
      return response.status(200).json({ list: results });
    })
    .catch((error) => {
      return response.status(500).send(error);
    });

});

app.get('/subscribe', (request, response) => {
  response.status(200).send('OK');

  axios({
    method: 'POST',
    url: hubUrl,
    headers: {
      'Content-Type': 'application/json',
      'Client-ID': clientID
    },
    data:
    {
      'hub.callback': hubCallback,
      'hub.mode': 'subscribe',
      'hub.topic': hubTopic,
      'hub.lease_seconds': 600
    }
  })
    .then(twitchResponse => {
      console.log('* Twitch Hub Approval response: ', twitchResponse.status);
    })
    .catch(error => console.log(error));
});

app.get('/approval-callback', (request, response) => {

  if (request.query['hub.challenge']) {
    response.set('Content-Type', 'text/html');
    response.status(200).send(request.query['hub.challenge']);
  }

  dataStore.saveSubscription({ data: { hubTopic: hubTopic }, hub_topic: hubTopic });

});

app.post('/approval-callback', (request, response) => {
  // TODO: Must use and check for a secret in next iteration to ensure this request is genuine!
  response.set('Content-Type', 'text/html');
  response.status(200).send('Ok');
  dataStore.saveEvent({ data: { id: 1234, user_id: 4321 } });

})

app.listen(port);
console.log(`Running on port: ${port}`);



