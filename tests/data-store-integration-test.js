import { expect } from 'chai';
import { createDataStore } from '../subscriber/data-store';
const testUtils = require('../utils/test-utils');
import { getPool } from '../utils/subscriber-utils';

describe('Data Store', function () {
  this.timeout(13000);

  before(function (done) {
    testUtils.dockerComposeUpDatabase(done);
  });

  it('should return a list of subscriptions.', function (done) {

    let pool;
    const expectedValue = { id: 1, data: { hubTopic: 'https://twitch.com'} };
    let dataStore;

    testUtils.checkDatabaseIsRunning()
      .then(() => {
        pool = getPool();
        dataStore = createDataStore(pool);
        return dataStore.saveSubscription(expectedValue);
      })
      .then(() => {
        return dataStore.getAllSubscriptions(pool);
      })
      .then((subscriptions) => {
        expect(JSON.parse(subscriptions[0].data)).to.deep.equal(expectedValue.data);
        done();
      });
  });

  after(function (done) {
    testUtils.dockerComposeDown(done);
  });

});