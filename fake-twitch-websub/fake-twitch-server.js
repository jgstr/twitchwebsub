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
  if (request.headers['Client-ID']
    && request.body['hub.callback']
    && request.body['Content-Type'] === 'application/json'
    && request.body['hub.mode'] === 'subscribe'
    && request.body['hub.topic']
    && request.body['hub.lease_seconds']) {
    response.status(200).send('Subscription Request Received.');
    hubCallback = request.body['hub.callback'];
    console.log('* hubCall: ', hubCallback);
  } else {
    response.status(400).send('There was a problem with your subscribe request.');
  }

});

const sendApprovalRequest = () => {
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

const getFakeSubscriptions = () => {
  return subscriptions;
}

const sendNotification = () => {

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

module.exports = { app, sendApprovalRequest, getFakeSubscriptions, sendNotification };

