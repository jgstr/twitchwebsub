import path from 'path';
import { expect } from 'chai';
import { createDataStore } from '../data-store';
import compose from 'docker-compose';

describe('Data Store', function () {

  before(function () {
    return compose.upAll({cwd: path.join(__dirname, '..'), log: true})
    .then(() => {
      console.log('* docker ran.');
    });
  });

  it('should return a list of subscriptions.', function () {
    const dataStore = createDataStore(pool);
    const expectedValue = {
      subscriptionId: 1
    };
    expect(subscriptions).to.deep.equal(expectedValue);
  });

});