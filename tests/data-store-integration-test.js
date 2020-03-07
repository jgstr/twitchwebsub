import { expect } from 'chai';
import { createDataStore } from '../subscriber/data-store';
const testUtils = require('../utils/test-utils');

describe('Data Store', function () {

  before(function (done) {
    testUtils.dockerComposeUpDatabase(done);
  });

  it('should return a list of subscriptions.', function () {
    const dataStore = createDataStore(pool);
    const expectedValue = {
      subscriptionId: 1
    };
    expect(subscriptions).to.deep.equal(expectedValue);
  });

  after(function(done){
    testUtils.dockerComposeDown(done);
  });

});