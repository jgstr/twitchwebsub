import { expect } from 'chai';
import { createDataStore } from '../subscriber/data-store';
const testUtils = require('../utils/test-utils');
import { getPool } from '../subscriber/subscriber-utils';
import { notificationsDatabaseLocalConfig } from '../subscriber/authentications';
const timestampFormatter = require('moment');


describe('Data Store', function () {
  this.timeout(13000);

  before(function (done) {
    testUtils.dockerComposeUpDatabase(done);
  });

  it('should return a list of subscriptions.', function (done) {

    let pool;
    const expectedValue = {
      hub_topic: 'https://twitch.com',
      lease_start: timestampFormatter.utc(new Date()).format("YYYY-MM-DD HH:mm:ss")
    };
    let dataStore;

    testUtils.checkDatabaseIsRunning()
      .then(() => {
        pool = getPool(notificationsDatabaseLocalConfig);
        dataStore = createDataStore(pool);
        return dataStore.saveSubscription(expectedValue);
      })
      .then(() => {
        return dataStore.getAllSubscriptions(pool);
      })
      .then((subscriptions) => {
        expect(subscriptions[0].hub_topic).to.equal(expectedValue.hub_topic);
        done();
      });
  });

  after(function (done) {
    testUtils.dockerComposeDown(done);
  });

});