'use strict';
const testUtils = require('../utils/test-utils');
import { expect } from 'chai';
const fakeTwitch = require('../fake-twitch-websub/fake-twitch-server');
const subscriber = require('../utils/subscriber-driver');
const hubCallback = 'http://localhost:3000/approval-callback';

const twitchPort = 3001;
let twitchApp;

describe('Twitch Websub Subscriber', function (done) {
  this.timeout(30000);

  before(function (done) {
    twitchApp = fakeTwitch.app.listen(twitchPort, () => { console.log(`* Fake Twitch Listening on ${twitchPort}`); });
    testUtils.dockerComposeUp(done);
  });

  it('should return one subscription.', function (done) {

    setTimeout(() => {
      subscriber.getAllSubscriptions()
        .then((response) => { expect(response.data.list.length).to.equal(0); })
        .then(() => { return subscriber.requestSubscription(); })
        .then((response) => { expect(response.status).to.equal(200); })
        // TODO: hubCallback is 'undefined' unless I include it here. Same goes for other similar functions below.
        .then(() => { return fakeTwitch.sendApprovalRequest(hubCallback); }) 
        .then(() => { return subscriber.getAllSubscriptions(); })
        .then((response) => {
          expect(response.data.list.length).to.equal(1);
          done();
        })
    }, 12000);

  });
 
  it('should receive return at least one notification.', function (done) {

    setTimeout(() => {
      subscriber.requestSubscription()
        .then(() => { return fakeTwitch.sendApprovalRequest(hubCallback); })
        .then(() => { return subscriber.getAllNotifications(); })
        .then((notifications) => { expect(notifications.list.length).to.equal(0); })
        .then(() => { return fakeTwitch.sendNotification(hubCallback); })
        .then(() => { return subscriber.getAllNotifications(); })
        .then((notifications) => {
          expect(notifications.list.length).to.not.equal(0);
          done();
        })
    }, 12000);

  });

  after(function (done) {
    twitchApp.close();
    testUtils.dockerComposeDown(done);
  });
});