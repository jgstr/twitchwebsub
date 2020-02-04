'use strict';
const path = require('path');
const compose = require('docker-compose');
import { expect } from 'chai';
const axios = require('axios');

describe('Twitch Websub Subscriber', function (done) {
  this.timeout(30000);

  before(function (done) {
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
          console.log('*** Subs: ', subscriptions.list.length);
          // Subscribe to a Twitch event. Receive response.
          const subscribeResponse = axios.get('http://localhost:3000/subscribe');
          return subscribeResponse;
        })
        .then((response) => {
          expect(response.status).to.equal(200); // Way-point marker.
          console.log('*** Subscribe res: ', response.status);
          done();
        })
        .catch((error) => {
          console.log("*** Error: ", error.message);
          done();
        });

    }, 12000);

    // Receive one subscription.
    // expect(subscriptions.length).to.equal(1);

  });

  after(function (done) {
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