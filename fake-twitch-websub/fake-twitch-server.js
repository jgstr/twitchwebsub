'use strict';
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

let subscriptions = [];
let hubCallback;

app.post('/hub', (request, response) => {

  // TODO: Figure out why request.headers[...] is case sensitive.
  if (!request.headers['client-id']) {
    return response.status(400).json({
      status: 'error',
      error: 'Missing Client-ID'
    });
  }
  if (request.headers['content-type'] !== 'application/json') {
    return response.status(400).json({
      status: 'error',
      error: 'Incorrect Content-Type'
    });
  }
  if (!request.body['hub.callback']) {
    return response.status(400).json({
      status: 'error',
      error: 'Missing hub.callback'
    });
  }
  if (request.body['hub.mode'] !== 'subscribe') {
    return response.status(400).json({
      status: 'error',
      error: 'Incorred hub.mode'
    });
  }
  if (!request.body['hub.topic']) {
    return response.status(400).json({
      status: 'error',
      error: 'Missing hub.topic'
    });
  }
  if (!request.body['hub.lease_seconds']) {
    return response.status(400).json({
      status: 'error',
      error: 'Missing hub.lease_seconds'
    });
  }

  hubCallback = request.body['hub.callback'];
  response.status(200).send('Subscription Request Received.');

});

const sendApprovalRequest = (hubCallback) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: hubCallback + '/?hub.challenge=97jbdwcHVzb_rv7McRfpIHuMMY8UhvUXDYhA1Egd'
    })
      .then((response) => {
        if (response.status === 200
          && response.data === '97jbdwcHVzb_rv7McRfpIHuMMY8UhvUXDYhA1Egd') {
          subscriptions.push(hubCallback);
          resolve();
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const sendEvent = (hubCallback) => {
console.log('* Got to sendEvent in Fake.');
  const dataObject = {
    data: [{
      id: "28623425344",
    }],
    pagination: {
      cursor: "eyJiIjpudWxsLCJhIjp7Ik9mZnNldCI6MX19"
    }
  };

  const data = JSON.stringify(dataObject);

  return new Promise(
    axios({
      method: 'POST',
      url: hubCallback,
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
      .then((response) => {
        if (response.status === 200) {
          resolve();
        }
      })
      .catch(error => reject(error))
  );

}

module.exports = { app, sendApprovalRequest, sendEvent };

