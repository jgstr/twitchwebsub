const subscriber = require('../subscriber/subscriber');
import { expect } from 'chai';
const dataStoreFake = require('../subscriber/data-store-fake');
import { subscription } from '../utils/test-utils';
import { clientID, hubCallback, hubUrl, hubTopic } from "../subscriber/authentications";

describe('Subscriber Server', function () {

  it('should return a list of subscriptions.', function () {
    const subscriptions = subscriber.getAllSubscriptions(dataStoreFake);
    expect(subscriptions).to.include.deep.members([subscription]);
  });

  it('should send a subscriptions request.', function () {

    const expectedRequest = {
      method: 'POST',
      url: hubUrl,
      headers: {
        'Content-Type': 'application/json',
        'Client-ID': clientID
      },
      data:
      {
        'hub.callback': hubCallback,
        'hub.mode': 'subscribe',
        'hub.topic': hubTopic,
        'hub.lease_seconds': 600
      }
    }

    subscriber.requestSubscription();

    const receivedRequest = {
      method: 'POST',
      url: hubUrl,
      headers: {
        'Content-Type': 'application/json',
        'Client-ID': clientID
      },
      data:
      {
        'hub.callback': hubCallback,
        'hub.mode': 'subscribe',
        'hub.topic': hubTopic,
        'hub.lease_seconds': 600
      }
    }
    expect(receivedRequest).to.deep.equal(receivedRequest);
  });

});