const subscriber = require('../subscriber/subscriber');
import { expect } from 'chai';
const dataStoreFake = require('../subscriber/data-store-fake');
import { subscription } from '../utils/test-utils';

describe('Subscriber Server', function () {

  it('should return a list of subscriptions.', function () {
    const subscriptions = subscriber.getAllSubscriptions(dataStoreFake);
    expect(subscriptions).to.include.deep.members([subscription]);
  });

});