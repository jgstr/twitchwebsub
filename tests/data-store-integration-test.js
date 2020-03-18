import { expect } from 'chai';
import { createDataStore } from '../subscriber/data-store';
const testUtils = require('../utils/test-utils');
import { notificationsDatabaseLocalConfig } from '../subscriber/authentications';
const timestampFormatter = require('moment');


describe('Data Store', function () {
  this.timeout(13000);

  before(function (done) {
    testUtils.dockerComposeUpDatabase();
    testUtils.checkDatabaseIsRunning().then(done);
  });

  it('should return a list of subscriptions.', function (done) {

    const expectedValue = {
      hub_topic: 'https://twitch.com',
      lease_start: timestampFormatter.utc(new Date()).format("YYYY-MM-DD HH:mm:ss")
    };

    let dataStore;

    dataStore = createDataStore(notificationsDatabaseLocalConfig);
    dataStore.saveSubscription(expectedValue)
      .then(() => {
        return dataStore.getAllSubscriptions();
      })
      .then((subscriptions) => {
        expect(subscriptions[0].hub_topic).to.equal(expectedValue.hub_topic); // TODO: Just check objects with deep.equal. and/or .contain.
        done();
      });
  });

  it('should return a list of events.', function () {
    let dataStore;
    const event = { data: { id: 1234, user_id: 4321 } };

    dataStore = createDataStore(notificationsDatabaseLocalConfig);
    dataStore.saveEvent(event)
      .then(() => { return dataStore.getAllEvents(); })
      .then((events) => {
        expect(events.length).to.be.at.least(1); // TODO: use something like to.contain(object). But review docs to make sure.
      });
  });

  after(function (done) {
    testUtils.dockerComposeDown(done);
  });

});