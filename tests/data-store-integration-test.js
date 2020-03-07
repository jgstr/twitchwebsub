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
    const expectedValue = 0;

    testUtils.checkDatabaseIsRunning()
      .then(() => {
        pool = getPool();
        const dataStore = createDataStore(pool);
        return dataStore.getAllSubscriptions()
      })
      .then((subscriptions) => {
        expect(subscriptions.length).to.equal(expectedValue);
        done();
      });
  });

  after(function (done) {
    testUtils.dockerComposeDown(done);
  });

});