'use strict';
const express = require('express');
import mysql from 'mysql';

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
      // const subscriptionList = ;
      response.status(200).json({list:results});
    }
  });

});

app.listen(port);
console.log(`Running on port: ${port}`);



