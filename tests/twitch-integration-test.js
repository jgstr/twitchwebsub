import { expect } from 'chai';
const twitch = require('../subscriber/adapters/twitch');
const subscriber = require('../subscriber/subscriber');
import { subscriptionHardCoded } from '../subscriber/subscriber-utils'; // TODO: Not a good solution. Fix soon as possible.

describe('Twitch', function () {
  const twitchAdapter = twitch.createTwitchAdapter();

  it('should send a subscription request.', function () {
    const subscription = subscriptionHardCoded;

    subscriber.requestSubscription(twitchAdapter, subscription)
      .then(response => {
        expect(response).to.equal('Received');
      });
  });
});