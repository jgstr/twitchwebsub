const subscriber = require('../subscriber/subscriber');
import { expect } from 'chai';
const dataStoreFake = require('../subscriber/data-store-fake');
import { subscription, event } from '../utils/test-utils';
const twitchFake = require('../subscriber/twitch-fake');

describe('Subscriber Server', function () {

  it('should return a list of subscriptions.', function () {
    const subscriptions = subscriber.getAllSubscriptions(dataStoreFake);
    expect(subscriptions).to.include.deep.members([subscription]);
  });

  it('should send a subscription request.', function () {
    subscriber.requestSubscription(twitchFake)
      .then(response => {
        expect(response.status).to.equal(200);
      });
  });

  it('should save a subscription', function () {
    subscriber.saveSubscription(dataStoreFake, subscription);
    expect(dataStoreFake.database.length).to.equal(1);
  });

  it('should return a list of events.', function () {
    const events = subscriber.getAllEvents(dataStoreFake, subscription.id);
    expect(events).to.include.deep.members([event]);
  });

});