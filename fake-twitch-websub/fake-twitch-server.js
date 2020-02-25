'use strict';
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

let subscriptions = [];
let hubCallback;

// app.get('/', (req, res) => {
//   console.log("Fake headers: ", req.headers);
//   res.status(200).send('Fake up!');
// });

// app.post('/hub2', (request, response) => {
//   console.log("Hub2: ", request.headers);
//   response.status(200).send('Hub2 up!');
// });

app.post('/hub', (request, response) => {

  if (!request.headers['Client-ID']) {
    return response.status(400).json({
      status: 'error',
      error: 'Missing Client-ID'
    });
  }
  if (!request.body['hub.callback']) {
    return response.status(400).json({
      status: 'error',
      error: 'Missing hub.callback'
    });
  }
  if (request.body['Content-Type'] !== 'application/json') {
    return response.status(400).json({
      status: 'error',
      error: 'Incorrect Content-Type'
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
  console.log('* hubCall: ', hubCallback);
  response.status(200).send('Subscription Request Received.');

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

app.listen(3001, () => {
  console.log("Fake listening");
})

module.exports = { app, sendApprovalRequest, sendNotification };

