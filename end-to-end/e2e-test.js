'use strict';
const path = require('path');
const compose = require('docker-compose');
import { expect } from 'chai';
const fakeTwitch = require('../fake-twitch-websub/fake-twitch-server');
const subscriber = require('../utils/subscriber-driver');
const twitchPort = 3001;
let twitchApp;

describe('Twitch Websub Subscriber', function (done) {
  this.timeout(20000);

  before(function (done) {

    twitchApp = fakeTwitch.app.listen(twitchPort);
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
      subscriber.getAllSubscriptions()
        .then((response) => {
          expect(response.data.list.length).to.equal(0);
          return subscriber.requestSubscription();
        })
        .then((response) => {
          expect(response.status).to.equal(200);
          return fakeTwitch.sendApprovalRequest();
        })
        .then(() => {
          return subscriber.getAllSubscriptions();
        })
        .then((response) => {
          const subscriptions = response.data;
          expect(subscriptions.list.length).to.equal(fakeTwitch.getFakeSubscriptions());
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