const subscriber = require('../subscriber/subscriber');
import { expect } from 'chai';

describe('Subscriber Server', function () {

  it('should return a list of subscriptions.', function () {

    const subscription = {
      id: 'ac7856cb-5695-4664-b52f-0dc908e3aa7a',
      hub_topic: 'https://twitch.com',
      lease_start: '2020-03-21 01:01:01'
    };

    const subscriptions = subscriber.getAllSubscriptions();
    expect(subscriptions).to.include.deep.members([subscription]);
  });

});