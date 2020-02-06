'use strict';
const path = require('path');
const compose = require('docker-compose');
import { expect } from 'chai';
const axios = require('axios');
// const twitchServer = require('../fake-twitch-websub/fake-twitch-server');
import {app, sendApprovalRequest} from '../fake-twitch-websub/fake-twitch-server';
const twitchServer = app;
const twitchPort = 3001;
let twitchApp;

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
          console.log('*** subscriber/subscribe response: ', response.status);

          // Trigger Fake-Twitch Request.
          return sendApprovalRequest();
        })
        .then(() => {
          // Check Subscriber-server Responded correctly.
          const fakeTwitchSubscribers = axios.get('http://localhost:3001/get-subscribers');
          expect(fakeTwitchSubscribers).to.equal(1);
          done();
        })
        .catch((error) => {
          console.log("*** Error: ", error.message);
          done();
        });

    }, 12000);

    // Receive 1 subscription.
    // expect(subscriptions.list.length).to.equal(1);

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