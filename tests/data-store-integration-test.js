import { expect } from 'chai';
import { createDataStore } from '../subscriber/data-store';
const testUtils = require('../utils/test-utils');
import { getPool } from '../utils/subscriber-utils';

describe('Data Store', function () {

  before(function (done) {
    testUtils.dockerComposeUpDatabase(done);
  });

  it('should return a list of subscriptions.', function () {
    let pool = getPool();
    const dataStore = createDataStore(pool);
    const expectedValue = { subscriptionId: 1 };
    const subscriptions = dataStore.getAllSubscriptions();
    expect(subscriptions).to.deep.equal(expectedValue);
  });

  after(function (done) {
    testUtils.dockerComposeDown(done);
  });

});