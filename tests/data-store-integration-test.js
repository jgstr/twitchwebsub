import { expect } from 'chai';
import { createDataStore } from '../subscriber/data-store';
const testUtils = require('../utils/test-utils');
import { notificationsDatabaseLocalConfig } from '../subscriber/authentications';
const timestampFormatter = require('moment');
import { uuid } from 'uuidv4';


describe('Data Store', function () {
  this.timeout(13000);

  before(function (done) {
    testUtils.dockerComposeUpDatabase();
    testUtils.checkDatabaseIsRunning().then(done);
  });

  it('should return a list of subscriptions.', function (done) {
    let dataStore;
    const expectedValue = {
      id: uuid(),
      hub_topic: 'https://twitch.com',
      lease_start: timestampFormatter.utc(new Date()).format("YYYY-MM-DD HH:mm:ss")
    };

    dataStore = createDataStore(notificationsDatabaseLocalConfig);
    dataStore.saveSubscription(expectedValue)
      .then(() => { return dataStore.getAllSubscriptions(); })
      .then((subscriptions) => {
        console.log('Sub results: ', subscriptions);
        console.log('ExpectedValue: ', expectedValue);
        expect(subscriptions).to.include.deep.members([expectedValue]);
        done();
      });
  });

  it('should return a list of events.', function (done) {
    let dataStore;
    const event = { data: { id: 1234, user_id: 4321 } };

    dataStore = createDataStore(notificationsDatabaseLocalConfig);
    dataStore.saveEvent(event)
      .then(() => { return dataStore.getAllEvents(); })
      .then((events) => {
        expect(events).to.include.deep.members([event]);
        done();
      });
  });

  after(function (done) {
    testUtils.dockerComposeDown(done);
  });

});