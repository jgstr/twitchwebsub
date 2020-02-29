'use strict';
const express = require('express');
import mysql from 'mysql';
const axios = require('axios');
import { clientID, hubCallback, hubUrl, hubTopic } from "./authentications";

const port = 3000;
const app = express();

let pool = mysql.createPool({
  host: 'database',
  port: 3306,
  user: 'user',
  password: 'password',
  database: 'notifications'
});

app.get('/', (request, response) => {
  response.status(200).send('Up!');
});

app.get('/get-subscriptions', (request, response) => {

  pool.query('SELECT * FROM subscriptions', function (error, results) {
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
    console.log(`* Hub Challenge: ${request.query['hub.challenge']}`);

  }

  pool.query('INSERT INTO subscriptions SET ?', { data: 'test_subscription' }, function (error, results) {
    if (error) {
      console.log('* Error: ', error);
    } else {
      console.log('* Subscription ID: ', results.insertId);
    }
  });
});

app.listen(port);
console.log(`Running on port: ${port}`);



