const subscriber = require('../subscriber/subscriber');
import { expect } from 'chai';
const dataStoreFake = require('../subscriber/data-store-fake');
import { subscription } from '../utils/test-utils';

describe('Subscriber Server', function () {

  it('should return a list of subscriptions.', function () {
    const subscriptions = subscriber.getAllSubscriptions(dataStoreFake);
    expect(subscriptions).to.include.deep.members([subscription]);
  });

  it('should send a subscription request.', function () {
    // Can't figure out this test.
    const subscriptionRequestData = {
      'hub.callback': 'http://localhost:3000/approval-callback',
      'hub.mode': 'subscribe',
      'hub.topic': 'https://api.twitch.tv/helix/users/follows?first=1&to_id=17337557',
      'hub.lease_seconds': 600
    };

    subscriber.requestSubscription()
      .then(response => {
        expect(response.data).to.deep.equal(subscriptionRequestData);
      });
  });

});