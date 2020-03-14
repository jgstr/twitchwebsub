const subscriber = require('../utils/subscriber-driver');

describe('Subscriber Server', function () {

  let subscriberApp;

  before(function (done) {
    subscriberApp = subscriber.startServer(done);
  });

  // Note: 2nd end-to-end tests should have gone here, but I accidentally skipped that step.

  it('should remove one subscription.', function () {
    subscriber.removeSubscription(subscription);
  });

  after(function (done) {
    subscriber.stopServer(subscriberApp, done);
  });
});