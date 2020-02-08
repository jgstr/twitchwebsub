'use strict';
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.post('/hub', (request, response) => {
  if (request.headers['Client-ID']
    && request.body['hub.callback']
    && request.body['Content-Type'] === 'application/json'
    && request.body['hub.mode'] === 'subscribe'
    && request.body['hub.topic']
    && request.body['hub.lease_seconds']) {
    response.status(200).send('Subscription Request Received.');
  } else {
    response.status(400).send('There was a problem with your subscribe request.');
  }

});

// Note: See e2e. E2e calls this and gets 'undefined' when using body['hub.callback'].
// For now, I pass the URL from the e2e to get this to work.
const sendApprovalRequest = (hubCallback) => {
  return axios.get(hubCallback);
};

module.exports = { app, sendApprovalRequest };

