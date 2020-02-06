'use strict';
const axios = require('axios');
const express = require('express');

const app = express();

app.get('/hub', (request, response) => {
  console.log('*** fake-twitch/hub hit.')
  response.status(200).send('Subscription Request Received.');
});

const sendApprovalRequest = () => {
  return axios.get('http://localhost:3000/approval-callback');
 };

// TODO: Implement function to send approval request to subscriber-server 
// callback.

// TODO: Implement function to check if subscriber-server responded correctly
// to approval request.

module.exports = { app, sendApprovalRequest };

