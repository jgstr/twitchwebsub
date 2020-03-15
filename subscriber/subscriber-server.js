'use strict';
const express = require('express');
import { clientID, hubCallback, hubUrl, hubTopic, notificationsDatabaseDockerConfig } from "./authentications";
import { getPool, requestSubscription } from './subscriber-utils';
import { createDataStore } from './data-store';

const port = 3000;
const app = express();

let pool = getPool(notificationsDatabaseDockerConfig);
const dataStore = createDataStore(pool);

app.get('/', (request, response) => {
  response.status(200).send('Welcome to a Twitch Websub Service.');
});

app.get('/status', (request, response) => {

  pool.query('SELECT 1', function (error, results) {
    if (error) {
      return response.status(500).send('Not running.');
    } else {
      return response.status(200).send('Running.');
    }
  });

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
  requestSubscription(request, response, hubUrl, clientID, hubCallback, hubTopic);

});

// TODO: At some point, this endpoint will have to be created for each subscription.
// Otherwise I'll have no way to know which event goes to which subscription.
// Look into express adding variables to the path.
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

const start = () => { return app.listen(port, () => { console.log(`Running on port ${port}`); }); };

app.listen(port);
console.log(`Running on port: ${port}`);

module.exports = { start };

