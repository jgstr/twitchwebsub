'use strict';
const path = require('path');
const compose = require('docker-compose');
import { expect } from 'chai';
const axios = require('axios');
import { app, sendApprovalRequest } from '../fake-twitch-websub/fake-twitch-server';
const twitchServer = app;
const twitchPort = 3001;
let twitchApp;
const hubCallback = 'http://localhost:3000/approval-callback';

describe('Twitch Websub Subscriber', function (done) {
  this.timeout(30000);

  before(function (done) {
    twitchApp = twitchServer.listen(twitchPort);
    console.log(`*** Fake Twitch Listening on ${twitchPort}`);

    compose
      .upAll({ cwd: path.join(__dirname, '..'), log: true, })
      .then(() => {
        console.log('Docker-compose up ran.');
        done();
      },
        err => {
          console.log('Error running docker-compose up:', err.message);
          done();
        }
      );
  });

  // Get a subscription list.
  it('should return one subscription.', function (done) {

    setTimeout(() => {
      // Receive no subscriptions.
      const subscriptionsResponse = axios.get('http://localhost:3000/get-subscriptions');
      subscriptionsResponse
        .then((response) => {
          const subscriptions = response.data;
          expect(subscriptions.list.length).to.equal(0); // Way-point marker.
          console.log('*** Subscriptions: ', subscriptions.list.length);

          // Subscribe to a Twitch event. Receive response.
          return axios.get('http://localhost:3000/subscribe');
        })
        .then((response) => {
          expect(response.status).to.equal(200); // Way-point marker.
          console.log('*** /subscribe response: ', response.status);

          // Trigger Fake-Twitch Request.
          // Note: passing this callback is a temporary solution. Fake-twitch should
          // validate hub.callback, but passing hub.callback results in 'undefined.'
          return sendApprovalRequest(hubCallback); 
        })
        .then((response) => {
          // Check Subscriber-server Responded correctly.
          if (response.status === 200) {
            return axios.get('http://localhost:3000/get-subscriptions');
          } else {
            console.log('*** Subscriber did not respond to Twitch Approval properly.');
            done();
          }
        })
        .then((response) => {
          const subscriptions = response.data;
          expect(subscriptions.list.length).to.equal(1);
          console.log('*** Subscriptions: ', subscriptions.list.length);
          done();
        })
        .catch((error) => {
          console.log("*** Error: ", error.message);
          done();
        });

    }, 12000);

  });

  // after(function (done) {
  //   twitchApp.close();
  //   compose
  //     .down(["--rmi all"])
  //     .then(
  //       () => {
  //         console.log('Docker-compose down ran.');
  //         done();
  //       },
  //       err => {
  //         console.log('Something went wrong when trying to stop containers:', err.message);
  //         done();
  //       });
  // });
});