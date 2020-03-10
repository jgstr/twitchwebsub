'use strict';
const express = require('express');
const axios = require('axios');
import { clientID, hubCallback, hubUrl, hubTopic, notificationsDatabaseDockerConfig } from "./authentications";
import { getPool } from './subscriber-utils';
import { createDataStore } from './data-store';

const port = 3000;
const app = express();

let pool = getPool(notificationsDatabaseDockerConfig);

app.get('/', (request, response) => {
  response.status(200).send('Welcome to a Twitch Websub Service.');
});

app.get('/get-subscriptions', (request, response) => {

  const dataStore = createDataStore(pool);

  dataStore.getAllSubscriptions()
    .then((results) => {
      response.status(200).json({ list: results });
    });

});

app.get('/get-events', (request, response) => {
  pool.query('SELECT * FROM events', function (error, results) {
    response.status(200).json({ list: results });
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

  pool.query('INSERT INTO subscriptions SET ?', { data: 'test_subscription', hub_topic: 'twitch.com' }, function (error, results) {
    if (error) {
      console.log('* Error: ', error);
    } else {
      console.log('* Subscription ID: ', results.insertId);
    }
  });
});

app.post('/approval-callback', (request, response) => {
  // TODO: Must use and check for a secret in next iteration to ensure this request is genuine!
  response.set('Content-Type', 'text/html');
  response.status(200).send('Ok');

  pool.query('INSERT INTO events SET ?', { data: 'test_event' }, function (error, results) {
    if (error) {
      console.log('* Error: ', error);
    } else {
      console.log('* Event ID: ', results.insertId);
    }
  });

})

app.listen(port);
console.log(`Running on port: ${port}`);



