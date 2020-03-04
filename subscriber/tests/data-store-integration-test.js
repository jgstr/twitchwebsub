import { expect } from 'chai';
import { createDataStore } from '../data-store';

describe('Data Store', function() {

  it('should return a list of subscriptions.', function() {
    const dataStore = createDataStore(pool);
    const expectedValue = {
      subscriptionId: 1
    };
    expect(subscriptions).to.deep.equal(expectedValue);
  });

});