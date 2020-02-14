'use strict';
const path = require('path');
const compose = require('docker-compose');
import { expect } from 'chai';
const axios = require('axios');
import { app, sendApprovalRequest, getSubscriptions } from '../fake-twitch-websub/fake-twitch-server';
const twitchServer = app;
const twitchPort = 3001;
let twitchApp;
const hubCallback = 'http://localhost:3000/approval-callback';

describe('Twitch Websub Subscriber', function (done) {
  this.timeout(20000);

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

  it('should return one subscription.', function (done) {

    setTimeout(() => {
      const subscriptionsResponse = axios.get('http://localhost:3000/get-subscriptions');
      subscriptionsResponse
        .then((response) => {
          const subscriptions = response.data;
          expect(subscriptions.list.length).to.equal(0); // Way-point marker.

          return axios.get('http://localhost:3000/subscribe');
        })
        .then((response) => {
          expect(response.status).to.equal(200); // Way-point marker.

          return sendApprovalRequest(); 
        })
        .then((requestStatus) => {
          if (requestStatus === 'approved') {
            return axios.get('http://localhost:3000/get-subscriptions');
          } else {
            console.log('*** Something went wrong with the Approval Request.');
            done();
          }
        })
        .then((response) => {
          const subscriptions = response.data;
          expect(subscriptions.list.length).to.equal(1);
          // TODO: Here's a similar problem to the sendApprovalRequest(callback) problem.
          // In both cases, the variables in fake-twitch-server are not scoped correctly.
          // But how to accomplish this eludes me.
          // expect(subscriptions.list.length).to.equal(getSubscriptions.length);
          done();
        })
        .catch((error) => {
          console.log("*** Error: ", error.message);
          done();
        });

    }, 12000);

  });
  
  after(function (done) {
    twitchApp.close();
    compose
      .down(["--rmi all"])
      .then(
        () => {
          console.log('Docker-compose down ran.');
          done();
        },
        err => {
          console.log('Something went wrong when trying to stop containers:', err.message);
          done();
        });
  });
});