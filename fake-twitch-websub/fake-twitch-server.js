'use strict';
const axios = require('axios');
const express = require('express');

const app = express();

app.post('/hub', (request, response) => {
  response.status(200).send('Subscription Request Received.');
});

const sendApprovalRequest = () => {
  return axios.get('http://localhost:3000/approval-callback');
 };

module.exports = { app, sendApprovalRequest };

