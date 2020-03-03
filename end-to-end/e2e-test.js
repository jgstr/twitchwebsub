'use strict';
const testUtils = require('../utils/test-utils');
import { expect } from 'chai';
const fakeTwitch = require('../fake-twitch-websub/fake-twitch-server');
const subscriber = require('../utils/subscriber-driver');
const hubCallback = 'http://localhost:3000/approval-callback';

const twitchPort = 3001;
let twitchApp;

describe('Twitch Websub Subscriber', function (done) {
  this.timeout(17000);

  before(function (done) {
    twitchApp = fakeTwitch.app.listen(twitchPort, () => { console.log(`* Fake Twitch Listening on ${twitchPort}`); });
    testUtils.dockerComposeUp(done);
  });

  it('should return one subscription.', function (done) {

    testUtils.checkDatabaseIsRunning()
      .then(() => { return subscriber.getAllSubscriptions(); })
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

  });

  it('should receive return at least one event.', function (done) {

    subscriber.requestSubscription()
      .then(() => { return fakeTwitch.sendApprovalRequest(hubCallback); })
      .then(() => { return subscriber.getAllEvents(); })
      .then((events) => { expect(events.data.list.length).to.equal(0); })
      .then(() => { return fakeTwitch.sendEvent(hubCallback); })
      .then(() => { return subscriber.getAllEvents(); })
      .then((events) => {
        expect(events.data.list.length).to.equal(1);
        done();
      })

  });

  after(function (done) {
    twitchApp.close();
    testUtils.dockerComposeDown(done);
  });
});