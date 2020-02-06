'use strict';
const express = require('express');
import mysql from 'mysql';
const axios = require('axios');


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
    if (error) {
      console.log('*** Error: ', error);
      response.status(500).send(error);
    } else {
      response.status(200).json({ list: results });
    }
  });

});

app.get('/subscribe', (request, response) => {
  response.status(200).send('OK');

  axios.post('http://host.docker.internal:3001/hub')
    .then(response => {
      console.log('*** Hub Approval response: ', response.status);
    })
    .catch(error => console.log(error));
});

app.get('/approval-callback', (request, response) => {

  response.set('Content-Type', 'text/html');
  response.status(200).send('hub.challenge Will Go Here');

  pool.query('INSERT INTO subscriptions SET ?', { data: 'test_subscription' }, function (error, results) {
    if (error) {
      console.log('*** Error: ', error);
    } else {
      console.log('*** Subscription ID: ', results.insertId);
    }
  });
});

app.listen(port);
console.log(`Running on port: ${port}`);



