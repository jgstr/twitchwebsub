'use strict';
const express = require('express');
import mysql from 'mysql';

const port = 3000;

const app = express();

app.get('/', (request, response) => {
  response.status(200).send('Up!');
});

app.get('/get-subscriptions', (request, response) => {

  let pool = mysql.createPool({
    host: 'localhost',
    port: 3307,
    // user: 'user',
    // password: 'password',
    database: 'notifications'
  });

  pool.query('SELECT * FROM subscriptions', function (error, results) {
    if (error) {
      response.status(500).send('Database Error.');
    } else {
      response.status(200).send(results);
    }
  });

});

app.listen(port);
console.log(`Running on port: ${port}`);



