'use strict';
const testUtils = require('../utils/test-utils');
import { expect } from 'chai';
const fakeTwitch = require('../fake-twitch-websub/fake-twitch-server');
const subscriber = require('../utils/subscriber-driver');
const hubCallback = 'http://localhost:3000/approval-callback';

let twitchApp;

describe('Twitch Websub Subscriber', function () {
  this.timeout(17000);

  before(function (done) {
    twitchApp = fakeTwitch.start();
    testUtils.dockerComposeUp(done);
  });

  it('should return one subscription.', function (done) {

    testUtils.checkDatabaseIsRunning()
      .then(subscriber.getAllSubscriptions)
      .then((response) => { expect(response.data.list.length).to.equal(0); })
      .then(subscriber.requestSubscription)
      .then((response) => { expect(response.status).to.equal(200); })
      .then(() => { return fakeTwitch.sendApprovalRequest(hubCallback); })
      .then(subscriber.getAllSubscriptions)
      .then((response) => {
        expect(response.data.list.length).to.equal(1);
        done();
      })

  });

  it('should receive return at least one event.', function (done) {

    subscriber.requestSubscription()
      .then(() => { return fakeTwitch.sendApprovalRequest(hubCallback); })
      .then(subscriber.getAllEvents)
      .then((events) => { expect(events.data.list.length).to.equal(0); })
      .then(() => { return fakeTwitch.sendEvent(hubCallback); })
      .then(subscriber.getAllEvents)
      .then((events) => {
        expect(events.data.list.length).to.at.least(1);
        done();
      })

  });

  it('should remove one subscription from the database.', function (done) {
    const subscription = "12345";
    
    subscriber.requestSubscription()
      .then((response) => { expect(response.status).to.equal(200); })
      .then(() => { return fakeTwitch.sendApprovalRequest(hubCallback); })
      .then(subscriber.getAllSubscriptions)
      .then((response) => { expect(response.data.list.length).to.equal(1); })
      .then(subscriber.removeSubscription(subscription))
      .then(subscriber.getAllSubscriptions)
      .then((subscriptions) => { 
        expect(subscriptions.data.list.length).to.equal(0); 
        done();
      })

  });

  after(function (done) {
    fakeTwitch.stop(twitchApp);
    testUtils.dockerComposeDown(done);
  });
});