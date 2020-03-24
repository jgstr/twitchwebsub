const subscriber = require('../subscriber/subscriber');
import { expect } from 'chai';
const dataStoreFake = require('../subscriber/data-store-fake');
import { subscription } from '../utils/test-utils';
const nock = require('nock');

describe('Subscriber Server', function () {

  it('should return a list of subscriptions.', function () {
    const subscriptions = subscriber.getAllSubscriptions(dataStoreFake);
    expect(subscriptions).to.include.deep.members([subscription]);
  });

  // I'm unsure of the quality of this test and subscriber implementation.
  it('should send a subscription request.', function () {

    // Note: GOOS says don't mock what you don't own. But I'm not sure how else to test.
    const twitchApiMock = nock('http://localhost:3001')
      .post('/hub')
      .reply(200);

    subscriber.requestSubscription('http://localhost:3001', '12345678', 'http://localhost:3000/approval-callback', 'https://api.twitch.tv/helix')
      .then(response => {
        expect(response.status).to.equal(200);
      });
  });

  it('should save a subscription', function () {

    // TODO: create fake database in same folder as data-store fake.
    let databaseFake = [];

    subscriber.saveSubscription(datastore, subscription);

    expect(dataStoreFake.length).to.equal(1);

  });

});