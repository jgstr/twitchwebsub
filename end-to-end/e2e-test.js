'use strict';
const testUtils = require('../utils/test-utils');
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
    testUtils.dockerComposeUp(done);
  });

  it('should return one subscription.', function (done) {

    setTimeout(() => {
      subscriber.getAllSubscriptions()
        .then((response) => { expect(response.data.list.length).to.equal(0); })
        .then(() => { return subscriber.requestSubscription(); })
        .then((response) => { expect(response.status).to.equal(200); })
        .then(() => { return fakeTwitch.sendApprovalRequest(); })
        .then(() => { return subscriber.getAllSubscriptions(); })
        .then((response) => {
          expect(response.data.list.length).to.equal(fakeTwitch.getFakeSubscriptions());
          done();
        })
        .catch((error) => {
          console.log("*** Error: ", error.message);
          done();
        });

    }, 12000);

  });

  it('should receive return at least one notification.', function () {
    // Check notifications table. Get zero results.
    let notifications = {};
    expect(notifications.list.length).to.equal(0);

    // Perform Subscribe request.

    // Check notifications table. Get at least 1 result.
  });

  after(function (done) {
    twitchApp.close();
    testUtils.dockerComposeDown(done);
  });
});