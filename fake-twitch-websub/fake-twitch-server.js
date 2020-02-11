'use strict';
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

let subscriptions = [];

app.post('/hub', (request, response) => {
  if (request.headers['Client-ID']
    && request.body['hub.callback']
    && request.body['Content-Type'] === 'application/json'
    && request.body['hub.mode'] === 'subscribe'
    && request.body['hub.topic']
    && request.body['hub.lease_seconds']) {
      hubCallbackTest = request.body['hub.callback'];
    response.status(200).send('Subscription Request Received.');
  } else {
    response.status(400).send('There was a problem with your subscribe request.');
  }

});

// TODO: See e2e. E2e calls this and gets 'undefined' when using body['hub.callback'].
// For now, I pass the URL from the e2e to get this to work.
const sendApprovalRequest = (hubCallback) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: hubCallback + '/?hub.challenge=97jbdwcHVzb_rv7McRfpIHuMMY8UhvUXDYhA1Egd'
    })
      .then((response) => {
        if (response.status === 200
          && response.data === '97jbdwcHVzb_rv7McRfpIHuMMY8UhvUXDYhA1Egd') {
          subscriptions.push(hubCallback + '/?hub.challenge=97jbdwcHVzb_rv7McRfpIHuMMY8UhvUXDYhA1Egd');
          resolve('approved');
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getSubscriptions = () => {
  return subscriptions;
}

module.exports = { app, sendApprovalRequest, getSubscriptions };

